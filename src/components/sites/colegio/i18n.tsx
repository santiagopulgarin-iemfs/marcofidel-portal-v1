"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { EN } from "./en";

export type Lang = "es" | "en";
export type Vars = Record<string, string | number>;

// ---------------------------------------------------------------------------
// Idioma: almacén externo con persistencia en localStorage
// ---------------------------------------------------------------------------
const KEY = "site-lang";
let current: Lang = "es";
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    if (localStorage.getItem(KEY) === "en") current = "en";
  } catch {
    /* sin almacenamiento: el idioma solo dura la sesión */
  }
}

export function setLang(lang: Lang) {
  load();
  current = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* ignorar */
  }
  listeners.forEach((l) => l());
}

/** Idioma actual para código que no es un componente (p. ej. la voz). */
export function getLang(): Lang {
  load();
  return current;
}

// Si el idioma cambia en otra pestaña del mismo sitio, esta pestaña lo sigue
const onStorage = (e: StorageEvent) => {
  if (e.key !== KEY) return;
  const next: Lang = e.newValue === "en" ? "en" : "es";
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  load();
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(l);
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
};
const getSnapshot = () => {
  load();
  return current;
};
// El HTML inicial siempre sale en español; si el visitante eligió inglés se cambia al hidratar.
const getServerSnapshot = (): Lang => "es";

export const useLang = (): Lang => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

// ---------------------------------------------------------------------------
// Traducción
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    __i18nMissing?: Set<string>;
  }
}

/** Traduce `es` al idioma `lang`. Si falta la traducción, devuelve el español y la registra. */
export function translate(lang: Lang, es: string, vars?: Vars): string {
  let out = es;
  if (lang === "en") {
    const hit = EN[es];
    if (hit !== undefined) out = hit;
    else if (typeof window !== "undefined" && /[A-Za-zÁÉÍÓÚáéíóúñ]/.test(es)) {
      (window.__i18nMissing ??= new Set()).add(es);
    }
  }
  if (vars) out = out.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
  return out;
}

export function useT() {
  const lang = useLang();
  return useCallback((es: string, vars?: Vars) => translate(lang, es, vars), [lang]);
}

/** Texto traducible para usar también en componentes de servidor: <T>Texto en español</T> */
export function T({ children, vars, tvars }: { children: string; vars?: Vars; tvars?: string[] }) {
  const t = useT();
  // `tvars`: nombres de variables cuyo valor también es un texto del sitio y se traduce antes de insertarlo
  const resolved = vars
    ? Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, tvars?.includes(k) ? t(String(v)) : v]))
    : undefined;
  return <>{t(children, resolved)}</>;
}

/** Imagen con texto alternativo traducible (para componentes de servidor). */
export function TImg({
  alt,
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt"> & { alt: string }) {
  const t = useT();
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={t(alt)} {...props} />;
}

/** Mantiene el atributo lang de <html> sincronizado con el idioma elegido. */
export function LangEffects() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
