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
      // El lector NUNCA arranca activado al abrir la página: sin un toque o clic real del usuario el navegador
      // no deja hablar, y un lector "activado" pero mudo confunde. Se vuelve a activar con el botón.
      hoverRead: false,
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

// Memoria de voces: algunas voces de Windows aparecen en la lista pero no arrancan (o lo hacen a ratos).
// Se recuerda la última que SÍ habló y las que fallaron, para no insistir con una voz muda.
const VOICE_KEY = "a11y-voice-ok";
const badVoices = new Set<string>();
let goodVoice: string | null | undefined; // undefined = aún no se leyó de localStorage

function readGoodVoice(): string | null {
  if (goodVoice === undefined) {
    try {
      goodVoice = localStorage.getItem(VOICE_KEY);
    } catch {
      goodVoice = null;
    }
  }
  return goodVoice;
}

function rememberVoice(voice: SpeechSynthesisVoice | undefined, worked: boolean) {
  if (!voice) return;
  if (worked) {
    badVoices.delete(voice.voiceURI);
    goodVoice = voice.voiceURI;
    try {
      localStorage.setItem(VOICE_KEY, voice.voiceURI);
    } catch {
      /* sin almacenamiento: solo dura la sesión */
    }
  } else {
    badVoices.add(voice.voiceURI);
  }
}

/**
 * Voces del idioma del sitio, de la mejor a la peor. La primera es la que se usa; cada reintento usa la siguiente.
 * Orden: la que ya funcionó > preferencia de acento (español colombiano/latino, inglés de EE. UU.) > locales antes
 * que en línea > las que fallaron van al final.
 */
function voiceCandidates(lang: Lang): SpeechSynthesisVoice[] {
  const good = readGoodVoice();
  const rank = (v: SpeechSynthesisVoice) => {
    let r = 0;
    if (v.voiceURI === good) r -= 100;
    if (badVoices.has(v.voiceURI)) r += 100;
    if (lang === "en") r += /en[-_]us/i.test(v.lang) ? 0 : /en[-_]gb/i.test(v.lang) ? 1 : 2;
    else r += /es[-_]co/i.test(v.lang) ? 0 : /es[-_](mx|us|419)/i.test(v.lang) ? 1 : 2;
    return r + (v.localService ? 0 : 0.5);
  };
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith(lang))
    .sort((a, b) => rank(a) - rank(b));
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
  const sourceRef = useRef<"page" | "item" | "system">("item");
  const speakingRef = useRef(false);
  // Vigilancia del arranque: Chrome a veces acepta la frase pero no empieza a hablar (sobre todo la primera vez)
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startedRef = useRef(false);
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
    startedRef.current = false;
    clearTimeout(watchdogRef.current);
    liveUtterances.current = [];
    setSpeaking(false);
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    clearTimeout(watchdogRef.current);
    if ("speechSynthesis" in window) {
      // `resume` antes de `cancel`: en Chrome, cancelar estando en pausa puede dejar la cola trabada
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    }
    markIdle();
  }, [markIdle]);

  const speak = useCallback(
    (text: string, source: "page" | "item" | "system" = "item") => {
      if (!("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      clearTimeout(watchdogRef.current);
      const id = ++runId.current;
      const parts = chunk(text);
      if (parts.length === 0) {
        synth.cancel();
        markIdle();
        return;
      }
      const lang = getLang();
      const candidates = voiceCandidates(lang);
      sourceRef.current = source;
      speakingRef.current = true;
      startedRef.current = false;
      setSpeaking(true);
      setPaused(false);

      // Cada intento tiene su número: al reintentar, los eventos de error del intento anterior
      // (el `cancel()` los dispara como "interrupted") no deben contar como fin de la lectura.
      let attempt = 0;
      const run = () => {
        const mine = ++attempt;
        const live = () => id === runId.current && mine === attempt;
        // Cada reintento prueba la siguiente voz: si la primera no arranca, el problema suele ser esa voz
        const voice = candidates.length ? candidates[(mine - 1) % candidates.length] : undefined;
        // Solo se cancela si hay algo hablando o en cola, o si es un reintento: cancelar con el motor libre
        // lo deja a veces mudo en Chrome.
        if (mine > 1 || synth.speaking || synth.pending || synth.paused) synth.cancel();
        const utterances = parts.map((part, i) => {
          const u = new SpeechSynthesisUtterance(part);
          u.lang = voice?.lang ?? (lang === "en" ? "en-US" : "es-ES");
          if (voice) u.voice = voice;
          u.rate = rateRef.current;
          if (i === 0) {
            u.onstart = () => {
              if (!live()) return;
              startedRef.current = true;
              rememberVoice(voice, true);
            };
          }
          u.onend = () => {
            if (live() && i === parts.length - 1) markIdle();
          };
          u.onerror = () => {
            if (live()) markIdle();
          };
          return u;
        });
        liveUtterances.current = utterances;
        utterances.forEach((u) => synth.speak(u));

        // Si no arrancó, se cancela y se vuelve a pedir (hasta 2 reintentos). El primer plazo es más largo porque
        // el motor puede tardar más de 1 s en "despertar"; cancelar demasiado pronto lo vuelve a trabar.
        watchdogRef.current = setTimeout(
          () => {
            if (!live() || startedRef.current) return;
            rememberVoice(voice, false); // esta voz no arrancó: se baja en la lista
            if (attempt < 3) run();
            else markIdle(); // el navegador no deja hablar: se refleja en la interfaz
          },
          attempt === 1 ? 1400 : 1800,
        );
      };
      run();
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
      // Solo después de haber oído el arranque: antes, el vigilante de arranque se encarga
      if (startedRef.current && !synth.speaking && !synth.pending && !synth.paused) markIdle();
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
    let pointerType = "mouse";
    let tapped: { el: Element; at: number } | null = null;

    const pick = (target: EventTarget | null) => {
      const el = (target as Element | null)?.closest?.(READABLE);
      if (!el) return null;
      const text = accessibleText(el);
      return text ? { el, text } : null;
    };
    // No interrumpir la lectura de la página completa con lecturas sueltas
    const blocked = () => speakingRef.current && sourceRef.current !== "item";

    const onPointerDown = (e: PointerEvent) => {
      pointerType = e.pointerType;
    };

    // Mouse: leer al pasar por encima. Los navegadores táctiles inventan un `mouseover` tras cada toque:
    // se ignora, porque el toque ya se lee en `onClick` (si no, se leería dos veces).
    const onOver = (e: MouseEvent) => {
      // Sobre la barra de accesibilidad no se lee con el mouse: al activar un botón cambia su ícono, el navegador
      // dispara un mouseover falso y el lector cortaría su propio aviso. Esos botones ya tienen su sugerencia (title).
      if ((e.target as Element).closest?.("aside[aria-label]")) return;
      if (pointerType === "touch" || blocked()) return;
      const hit = pick(e.target);
      if (!hit || hit.el === last) return;
      last = hit.el;
      clearTimeout(timer);
      timer = setTimeout(() => speak(hit.text), 350);
    };

    // Teclado: leer al llegar con Tab (solo foco "visible", no el que causa un toque)
    const onFocus = (e: FocusEvent) => {
      if (blocked() || !(e.target as HTMLElement).matches?.(":focus-visible")) return;
      const hit = pick(e.target);
      if (!hit || hit.el === last) return;
      last = hit.el;
      clearTimeout(timer);
      speak(hit.text);
    };

    // Pantalla táctil, como un lector de pantalla: el primer toque LEE; tocar de nuevo lo mismo lo ABRE.
    // Se lee de forma síncrona dentro del toque: iPhone solo permite hablar si se pide dentro del `click`.
    // La barra de accesibilidad es la excepción: sus botones actúan con un solo toque.
    const onClick = (e: MouseEvent) => {
      if (pointerType !== "touch" || blocked()) return;
      const hit = pick(e.target);
      if (!hit) return;
      const target = e.target as Element;
      const control = target.closest("a,button,[role=button],input,select,label");
      if (control && !target.closest("aside[aria-label]")) {
        const again = tapped && tapped.el === control && Date.now() - tapped.at < 8000;
        if (!again) {
          e.preventDefault();
          e.stopPropagation();
          tapped = { el: control, at: Date.now() };
          speak(hit.text);
          return;
        }
        tapped = null; // segundo toque sobre lo mismo: se deja pasar para que abra
        return;
      }
      speak(hit.text);
    };

    // El tipo de puntero se actualiza también al mover el mouse: así, en equipos con pantalla táctil y mouse,
    // el mouse vuelve a leer sin necesidad de un clic (los eventos de mouse "inventados" tras un toque
    // no generan eventos de puntero de tipo mouse, por eso esto no los confunde).
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerDown, true);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onClick, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerDown, true);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onClick, true);
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
      if (on) {
        // En pantallas táctiles el aviso explica el "primer toque lee, segundo toque abre"
        const touch = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
        const msg = translate(
          getLang(),
          touch
            ? "Lector activado. Toca un elemento para escucharlo y vuelve a tocarlo para abrirlo."
            : "Lector activado. Pasa el mouse o toca un elemento para escucharlo.",
        );
        speak(msg, "system");
      } else {
        stop();
        speak(translate(getLang(), "Lector desactivado."), "system");
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
