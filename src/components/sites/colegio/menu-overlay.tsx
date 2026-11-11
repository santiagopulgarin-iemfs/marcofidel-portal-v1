"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, House, Search, X } from "lucide-react";
import Link from "next/link";
import { audiences, groupHref, hrefFor, itemHref, nav, sectionHref } from "./content";
import { LangFlag, languages } from "./flags";
import { setLang, useLang, useT } from "./i18n";
import { useSiteSearch } from "./use-site-search";

// Botones redondeados blancos del menú en celular (como los de la UPB)
const chip =
  "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:bg-soft-bg focus-visible:bg-soft-bg";
const subheading = "px-2 text-sm font-bold uppercase tracking-wide text-white/80";

/** Menú completo a pantalla completa (se abre desde el botón "Menú" en cualquier ancho). */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = useState("");
  const results = useSiteSearch(query);
  const [drop, setDrop] = useState<number | null>(null);
  const [subOpen, setSubOpen] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const toggleSub = (key: string) =>
    setSubOpen((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  // Animación de despliegue: el menú sigue montado un instante más al cerrar, para poder
  // reproducir la transición de salida (si se desmontara de una, no habría nada que animar).
  // El cambio de fase al abrir/cerrar se detecta en el render comparando con el valor anterior
  // guardado en estado (no en una ref: React ya no deja leer/escribir refs durante el render).
  // Los efectos solo reaccionan después, con requestAnimationFrame y setTimeout.
  const [phase, setPhase] = useState<"closed" | "entering" | "open" | "closing">(open ? "entering" : "closed");
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setPhase(open ? "entering" : "closing");
  }
  useEffect(() => {
    if (phase === "entering") {
      const id = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(id);
    }
    if (phase === "closing") {
      const id = setTimeout(() => setPhase("closed"), 300);
      return () => clearTimeout(id);
    }
  }, [phase]);
  const mounted = phase !== "closed";
  const visible = phase === "open";

  // Bloquear el scroll del fondo mientras esté montado (abierto o cerrándose, para no
  // dejar scrollear detrás mientras el menú todavía se está desvaneciendo)
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Marca "menú abierto": oculta la barra de accesibilidad y los botones flotantes mientras dure
    document.body.dataset.menuOpen = "true";
    return () => {
      document.body.style.overflow = prev;
      delete document.body.dataset.menuOpen;
    };
  }, [mounted]);

  // Enfocar el botón de cerrar y escuchar Escape solo mientras está realmente abierto
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      id="main-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("Menú principal")}
      aria-hidden={!open}
      className={`menu-bg fixed inset-0 z-[70] overflow-y-auto font-ui text-white transition duration-300 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
      }`}
    >
      <button
        ref={closeRef}
        className="fixed right-4 top-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-md p-2 font-bold"
        aria-label={t("Cerrar menú")}
        onClick={onClose}
      >
        <span className="hidden sm:inline">{t("Cerrar")}</span>
        <X className="size-6" />
      </button>

      <div className="mx-auto flex max-w-3xl flex-col px-5 pb-12 pt-16">
        {/* Búsqueda (en celular y tableta solo está aquí) */}
        <div role="search" className="mb-2">
          <label className="relative block">
            <span className="sr-only">{t("Buscar en el sitio")}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-body" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Buscar en el sitio")}
              className="w-full rounded-full bg-white py-3 pl-12 pr-4 font-display text-base text-ink outline-none ring-2 ring-transparent placeholder:text-body focus:ring-soft"
            />
          </label>
          {query.trim().length >= 2 && (
            <ul className="mt-2 rounded-2xl bg-white p-2 text-ink">
              {results.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    onClick={() => {
                      setQuery("");
                      onClose();
                    }}
                    className="block rounded-xl px-3 py-2 font-medium hover:bg-soft-bg"
                  >
                    {r.label}
                    {r.context && <span className="block text-xs font-normal text-body">{r.context}</span>}
                  </Link>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-2 text-body">{t("Sin resultados para “{q}”.", { q: query.trim() })}</li>
              )}
            </ul>
          )}
        </div>

        <Link href="/" onClick={onClose} className="flex items-center gap-4 border-b border-white/20 px-2 py-4 font-bold">
          <House className="size-6" />
          {t("Inicio")}
        </Link>

        <ul className="flex flex-col text-base font-medium">
          {nav.map((n, i) => {
            const active = drop === i;
            return (
              <li key={n.label} className="border-b border-white/20">
                <div className="flex items-stretch">
                  <Link href={sectionHref(n)} onClick={onClose} className="flex-1 px-2 py-5 font-bold">
                    {t(n.label)}
                  </Link>
                  {n.menu && (
                    <button
                      className="px-4"
                      aria-label={t("Desplegar {x}", { x: t(n.label) })}
                      aria-expanded={active}
                      onClick={() => setDrop(active ? null : i)}
                    >
                      <ChevronDown className={`size-5 transition-transform ${active ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {n.menu && active && (
                  <div className="pb-2 font-display">
                    {n.menu.columns.map((c) => {
                      const key = `${i}-${c.heading}`;
                      const subActive = subOpen.includes(key);
                      return (
                        <div key={c.heading}>
                          <div className="flex items-stretch">
                            <Link href={groupHref(n, c)} onClick={onClose} className="block flex-1 px-5 py-3 text-base font-medium">
                              {t(c.heading)}
                            </Link>
                            <button
                              className="px-4"
                              aria-label={t("Desplegar {x}", { x: t(c.heading) })}
                              aria-expanded={subActive}
                              onClick={() => toggleSub(key)}
                            >
                              <ChevronRight className={`size-4 transition-transform ${subActive ? "rotate-90" : ""}`} />
                            </button>
                          </div>
                          {subActive && (
                            <ul>
                              {c.items.map((it) => (
                                <li key={it}>
                                  <Link
                                    href={itemHref(n, c, it)}
                                    onClick={onClose}
                                    className="block py-3 pl-10 text-base font-normal hover:underline"
                                  >
                                    {t(it)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                    <Link href={hrefFor(n.menu.promo.to)} onClick={onClose} className="block px-5 py-3 text-base font-medium">
                      {t(n.menu.promo.title)}
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <Link
          href={hrefFor("Proceso de admisión")}
          onClick={onClose}
          className="my-6 flex items-center justify-center rounded-lg bg-action px-6 py-4 font-medium text-white transition-colors duration-150 hover:bg-action-hover focus-visible:bg-action-hover"
        >
          {t("Cómo inscribirse")}
        </Link>

        {/* Información para ti (en celular y tableta solo está aquí) */}
        <section aria-labelledby="menu-info" className="mt-4">
          <h2 id="menu-info" className={subheading}>
            {t("Información para ti")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {audiences.map((a) => (
              <li key={a}>
                <Link href={hrefFor(a)} onClick={onClose} className={chip}>
                  {t(a)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Idioma (en celular y tableta solo está aquí) */}
        <section aria-labelledby="menu-lang" className="mt-8">
          <h2 id="menu-lang" className={subheading}>
            {t("Idioma")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {languages.map((l) => {
              const current = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    lang={l.code}
                    aria-pressed={current}
                    onClick={() => setLang(l.code)}
                    className={`${chip} cursor-pointer ${current ? "!bg-soft-bg ring-2 ring-soft" : ""}`}
                  >
                    <LangFlag code={l.code} />
                    {l.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
