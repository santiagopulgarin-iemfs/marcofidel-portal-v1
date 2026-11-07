"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getLang, translate, type Lang } from "./i18n";

export type ContrastMode = "normal" | "high" | "dark" | "gray";

export const SCALE_MIN = 90;
export const SCALE_MAX = 130;
export const RATES = [0.75, 1, 1.25, 1.5] as const;

const MODE_CLASSES: Record<Exclude<ContrastMode, "normal">, string> = {
  high: "a11y-high",
  dark: "a11y-dark",
  gray: "a11y-gray",
};

// ---------------------------------------------------------------------------
// Preferencias: almacén externo con persistencia en localStorage
// ---------------------------------------------------------------------------
type Prefs = { scale: number; mode: ContrastMode; rate: number; hoverRead: boolean };

const DEFAULTS: Prefs = { scale: 100, mode: "normal", rate: 1, hoverRead: false };
// v2: descarta preferencias de versiones anteriores (p. ej. "leer al pasar el mouse" quedó activado por error)
const KEY = "a11y-prefs-v2";

let prefs: Prefs = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<Prefs> | null;
    if (!raw) return;
    prefs = {
      scale: typeof raw.scale === "number" && raw.scale >= SCALE_MIN && raw.scale <= SCALE_MAX ? raw.scale : DEFAULTS.scale,
      mode: raw.mode === "high" || raw.mode === "dark" || raw.mode === "gray" ? raw.mode : DEFAULTS.mode,
      rate: (RATES as readonly number[]).includes(raw.rate ?? 0) ? (raw.rate as number) : DEFAULTS.rate,
      hoverRead: raw.hoverRead === true,
    };
  } catch {
    /* sin almacenamiento o datos inválidos: se usan los valores por defecto */
  }
}

function setPrefs(patch: Partial<Prefs>) {
  load();
  prefs = { ...prefs, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* las preferencias solo duran la sesión */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  load();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => {
  load();
  return prefs;
};
const getServerSnapshot = () => DEFAULTS;

const noopSubscribe = () => () => {};
const getSupported = () => "speechSynthesis" in window;
const getSupportedServer = () => false;

// ---------------------------------------------------------------------------
// Voz
// ---------------------------------------------------------------------------

/** Parte el texto en frases cortas: Chrome corta las locuciones largas a los ~15 s. */
function chunk(text: string, max = 180): string[] {
  const sentences = text.replace(/\s+/g, " ").trim().match(/[^.!?:;\n]+[.!?:;]?/g) ?? [];
  const out: string[] = [];
  for (const s of sentences) {
    let rest = s.trim();
    while (rest.length > max) {
      const cut = rest.lastIndexOf(" ", max);
      const at = cut > 40 ? cut : max;
      out.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) out.push(rest);
  }
  return out;
}

/** Elige una voz del idioma del sitio (español preferentemente colombiano/latino; inglés de EE. UU.). */
function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang));
  if (lang === "en") return voices.find((v) => /en[-_]us/i.test(v.lang)) ?? voices.find((v) => /en[-_]gb/i.test(v.lang)) ?? voices[0];
  return (
    voices.find((v) => /es[-_]co/i.test(v.lang)) ??
    voices.find((v) => /es[-_](mx|us|419)/i.test(v.lang)) ??
    voices[0]
  );
}

/** Texto accesible de un elemento (para "leer al pasar el mouse o enfocar"). */
function accessibleText(el: Element): string {
  const label = el.getAttribute("aria-label");
  if (label) return label;
  const alt = el.getAttribute("alt");
  if (alt) return alt;
  const text = (el as HTMLElement).innerText ?? el.textContent ?? "";
  return text.replace(/\s+/g, " ").trim().slice(0, 250);
}

const READABLE = "a,button,h1,h2,h3,h4,p,li,label,input,select,img,[role=img],[role=button]";

export function useAccessibility() {
  const p = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const supported = useSyncExternalStore(noopSubscribe, getSupported, getSupportedServer);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const runId = useRef(0);
  // Chrome puede descartar (GC) una locución antes de que dispare `onend`: se guardan referencias vivas.
  const liveUtterances = useRef<SpeechSynthesisUtterance[]>([]);
  // Qué se está leyendo: la página completa no debe ser interrumpida por la lectura de elementos sueltos.
  const sourceRef = useRef<"page" | "item">("item");
  const speakingRef = useRef(false);
  const rateRef = useRef(p.rate);
  useEffect(() => {
    rateRef.current = p.rate;
  }, [p.rate]);

  // Aplicar tamaño y contraste a toda la página
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = p.scale === 100 ? "" : `${p.scale}%`;
    Object.values(MODE_CLASSES).forEach((c) => root.classList.remove(c));
    if (p.mode !== "normal") root.classList.add(MODE_CLASSES[p.mode]);
  }, [p.scale, p.mode]);

  const markIdle = useCallback(() => {
    speakingRef.current = false;
    liveUtterances.current = [];
    setSpeaking(false);
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    if ("speechSynthesis" in window) {
      // `resume` antes de `cancel`: en Chrome, cancelar estando en pausa puede dejar la cola trabada
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    }
    markIdle();
  }, [markIdle]);

  const speak = useCallback(
    (text: string, source: "page" | "item" = "item") => {
      if (!("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const id = ++runId.current;
      const parts = chunk(text);
      if (parts.length === 0) {
        markIdle();
        return;
      }
      const lang = getLang();
      const voice = pickVoice(lang);
      sourceRef.current = source;
      speakingRef.current = true;
      setSpeaking(true);
      setPaused(false);
      const finish = () => {
        if (id === runId.current) markIdle();
      };
      const utterances = parts.map((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = voice?.lang ?? (lang === "en" ? "en-US" : "es-ES");
        if (voice) u.voice = voice;
        u.rate = rateRef.current;
        u.onend = () => {
          if (i === parts.length - 1) finish();
        };
        u.onerror = finish;
        return u;
      });
      liveUtterances.current = utterances;
      utterances.forEach((u) => synth.speak(u));
    },
    [markIdle],
  );

  /** Lee el contenido visible de la página (principal + pie). */
  const readPage = useCallback(() => {
    const parts = [document.title, document.querySelector("main")?.innerText, document.querySelector("footer")?.innerText];
    speak(parts.filter(Boolean).join(". "), "page");
  }, [speak]);

  // Red de seguridad: si el navegador no avisa que terminó de hablar, se detecta consultando su estado
  useEffect(() => {
    if (!speaking || !supported) return;
    const synth = window.speechSynthesis;
    const timer = setInterval(() => {
      if (!synth.speaking && !synth.pending && !synth.paused) markIdle();
    }, 500);
    return () => clearInterval(timer);
  }, [speaking, supported, markIdle]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setPaused(true);
  }, []);
  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setPaused(false);
  }, []);

  // Leer al pasar el mouse o enfocar (con teclado)
  const { hoverRead } = p;
  useEffect(() => {
    if (!hoverRead || !supported) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let last: Element | null = null;
    const say = (target: EventTarget | null, delay: number, force = false) => {
      // No interrumpir la lectura de la página completa con lecturas sueltas
      if (speakingRef.current && sourceRef.current === "page") return;
      const el = (target as Element | null)?.closest?.(READABLE);
      if (!el) return;
      // Con el mouse no se repite el mismo elemento; con el dedo, cada toque se lee de nuevo
      if (!force && el === last) return;
      const text = accessibleText(el);
      if (!text) return;
      last = el;
      clearTimeout(timer);
      timer = setTimeout(() => speak(text), delay);
    };
    const onOver = (e: MouseEvent) => say(e.target, 350);
    const onFocus = (e: FocusEvent) => say(e.target, 0);
    // Pantallas táctiles: leer al tocar (el mouse ya se cubre con `mouseover`)
    const onTouch = (e: PointerEvent) => {
      if (e.pointerType === "touch") say(e.target, 0, true);
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("pointerdown", onTouch);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointerdown", onTouch);
    };
  }, [hoverRead, supported, speak]);

  // Detener la voz al salir de la página
  useEffect(() => {
    const onHide = () => stop();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      stop();
    };
  }, [stop]);

  const setScale = useCallback(
    (v: number | ((s: number) => number)) => setPrefs({ scale: typeof v === "function" ? v(prefs.scale) : v }),
    [],
  );
  const setMode = useCallback((mode: ContrastMode) => setPrefs({ mode }), []);
  const setRate = useCallback((rate: number) => setPrefs({ rate }), []);
  // Modo "leer al señalar o tocar": al cambiarlo se avisa con la voz, para quien no ve la pantalla
  const setHoverRead = useCallback(
    (on: boolean) => {
      setPrefs({ hoverRead: on });
      if (on) speak(translate(getLang(), "Lector activado. Pasa el mouse o toca un elemento para escucharlo."));
      else {
        stop();
        speak(translate(getLang(), "Lector desactivado."));
      }
    },
    [speak, stop],
  );

  /** Alterna entre modo normal y un modo de contraste (alto contraste / oscuro). */
  const toggleMode = useCallback((target: Exclude<ContrastMode, "normal">) => {
    setPrefs({ mode: prefs.mode === target ? "normal" : target });
  }, []);
  const reset = useCallback(() => {
    stop();
    setPrefs(DEFAULTS);
  }, [stop]);

  return {
    scale: p.scale, setScale,
    mode: p.mode, setMode,
    rate: p.rate, setRate,
    hoverRead: p.hoverRead, setHoverRead,
    toggleMode,
    supported, speaking, paused, readPage, pause, resume, stop, reset,
  };
}

export type Accessibility = ReturnType<typeof useAccessibility>;
