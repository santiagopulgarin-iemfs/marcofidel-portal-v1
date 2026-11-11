"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, Users } from "lucide-react";
import Link from "next/link";
import { audiences, groupHref, hrefFor, itemHref, nav, sectionHref } from "./content";
import { LangFlag, languages } from "./flags";
import { wideWrap } from "./layout";
import { setLang, useLang, useT } from "./i18n";
import { Logo } from "./logo";
import { MenuOverlay } from "./menu-overlay";
import { useSiteSearch } from "./use-site-search";

type PanelId = "lang" | "info" | "search";

export function Header() {
  const t = useT();
  const lang = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drop, setDrop] = useState<number | null>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [query, setQuery] = useState("");
  const barRef = useRef<HTMLDivElement>(null);
  const results = useSiteSearch(query);

  // Cerrar el panel abierto con clic afuera o con Escape
  useEffect(() => {
    if (!panel) return;
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const toggle = (id: PanelId) => setPanel((p) => (p === id ? null : id));

  const actionBtn =
    "inline-flex cursor-pointer items-center gap-2 rounded-md p-1.5 text-ink min-[400px]:p-2 transition-colors duration-150 hover:text-action focus-visible:text-action";
  const label = "hidden lg:inline";
  // Celular: panel fijo a lo ancho de la pantalla (no se corta). Escritorio: anclado al botón.
  const popoverBase =
    "fixed inset-x-4 top-[72px] z-50 max-h-[calc(100dvh-88px)] overflow-y-auto rounded-xl bg-white p-4 text-left text-sm font-medium text-ink shadow-[0_12px_32px_rgba(0,0,0,0.16)] lg:absolute lg:inset-x-auto lg:right-0 lg:top-full lg:mt-2";
  const popover = `${popoverBase} lg:w-72`;
  const popoverWide = `${popoverBase} lg:w-80`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white lg:contents">
      <div className="relative z-[60] w-full bg-white border-b border-white/40 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {/* [--spacing:4px]: los íconos, el logo y los botones de esta barra miden lo mismo con el texto ampliado */}
        <div className={`${wideWrap} flex items-center justify-between gap-3 [--spacing:4px] py-4 min-[400px]:gap-6 lg:h-[88px] lg:py-0`}>
          <Link href="/" aria-label={t("Ir al inicio")} className="flex shrink-0 items-center gap-2 min-[400px]:gap-3">
            {/* Decorativo: el enlace ya tiene su nombre accesible */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sites/colegio/escudo.png"
              alt=""
              width={480}
              height={646}
              className="h-9 w-auto min-[400px]:h-11 lg:h-14"
            />
            {/* Letras IEMFS más pequeñas que el escudo (que es el protagonista) */}
            <Logo className="h-5 min-[400px]:h-6 lg:h-8" />
          </Link>

          <div ref={barRef} className="relative flex items-center gap-0.5 font-ui text-[15px] font-bold lg:gap-4">
            {/* Idioma, Información para ti y Búsqueda: solo escritorio. En celular y tableta están dentro del menú. */}
            {/* Idioma */}
            <div className="relative hidden lg:block">
              <button className={actionBtn} aria-label={t("Idioma")} aria-expanded={panel === "lang"} onClick={() => toggle("lang")}>
                <LangFlag code={lang} />
                <span className={label}>{t("Idioma")}</span>
              </button>
              {panel === "lang" && (
                <ul className={popover}>
                  {languages.map((l) => {
                    const current = l.code === lang;
                    return (
                      <li key={l.code}>
                        <button
                          lang={l.code}
                          aria-current={current ? "true" : undefined}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors hover:bg-brand/10 ${current ? "bg-soft-bg" : ""}`}
                          onClick={() => {
                            setLang(l.code);
                            setPanel(null);
                          }}
                        >
                          <span className="flex items-center gap-3">
                            <LangFlag code={l.code} />
                            {l.label}
                          </span>
                          {current && <span className="text-xs font-normal">{t("Actual")}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Información para ti */}
            <div className="relative hidden lg:block">
              <button
                className={actionBtn}
                aria-label={t("Información para ti")}
                aria-expanded={panel === "info"}
                onClick={() => toggle("info")}
              >
                <Users className="size-5" />
                <span className={label}>{t("Información para ti")}</span>
              </button>
              {panel === "info" && (
                <ul className={popover}>
                  {audiences.map((a) => (
                    <li key={a}>
                      <Link href={hrefFor(a)} onClick={() => setPanel(null)} className="block rounded-md px-3 py-2 hover:bg-brand/10">
                        {t(a)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Búsqueda */}
            <div className="relative hidden lg:block">
              <button className={actionBtn} aria-label={t("Búsqueda")} aria-expanded={panel === "search"} onClick={() => toggle("search")}>
                <Search className="size-5" />
                <span className={label}>{t("Búsqueda")}</span>
              </button>
              {panel === "search" && (
                <div className={popoverWide}>
                  <input
                    autoFocus
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("Buscar en el sitio")}
                    aria-label={t("Buscar en el sitio")}
                    className="w-full rounded-md border border-ink/30 px-3 py-2 font-normal outline-none focus:border-brand"
                  />
                  <ul className="mt-2">
                    {results.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          onClick={() => {
                            setPanel(null);
                            setQuery("");
                          }}
                          className="block rounded-md px-3 py-2 hover:bg-brand/10"
                        >
                          {r.label}
                          {r.context && <span className="block text-xs font-normal text-body">{r.context}</span>}
                        </Link>
                      </li>
                    ))}
                    {query.trim().length >= 2 && results.length === 0 && (
                      <li className="px-3 py-2 font-normal text-body">{t("Sin resultados para “{q}”.", { q: query.trim() })}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Menú */}
            <button
              className={`${actionBtn} lg:hidden`}
              aria-label={t("Menú")}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              onClick={() => {
                setPanel(null);
                setMenuOpen(true);
              }}
            >
              <Menu className="size-7" strokeWidth={1.75} />
              <span className={label}>{t("Menú")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de secciones (solo escritorio; en celular se usa el botón Menú) */}
      <nav className="hidden bg-brand lg:sticky lg:top-0 lg:z-50 lg:block" onMouseLeave={() => setDrop(null)}>
        {/* Mismo contenedor que la barra de arriba (wideWrap): así el menú y el CTA quedan
            alineados con el escudo y los botones de arriba, sin pegarse a los bordes */}
        <div className={`${wideWrap} flex min-h-[76px] items-stretch`}>
          <ul className="flex flex-1 font-ui text-base font-medium text-white">
            {nav.map((n, i) => {
              const active = drop === i;
              return (
                <li key={n.label} className={active ? "bg-brand-active" : ""} onMouseEnter={() => setDrop(i)}>
                  <div className="relative flex h-full items-stretch">
                    {n.menu && (
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-1/2 top-full z-10 size-0 -translate-x-1/2 border-x-[8px] border-t-[8px] border-x-transparent border-t-brand-active transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
                      />
                    )}
                    <Link href={sectionHref(n)} onClick={() => setDrop(null)} className="flex h-full items-center gap-1.5 px-5 py-[20px]">
                      {t(n.label)}
                      {n.menu && <ChevronDown className={`size-4 transition-transform ${active ? "rotate-180" : ""}`} />}
                    </Link>
                  </div>

                  {n.menu && (
                    <div
                      className={`${active ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"} absolute left-10 right-10 top-full bg-white font-display text-navy shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition duration-150`}
                    >
                      <div className="flex gap-10 px-12 pb-12 pt-16">
                        {n.menu.columns.map((c) => (
                          <div key={c.heading} className="min-w-0 max-w-[306px] flex-1">
                            <Link
                              href={groupHref(n, c)}
                              onClick={() => setDrop(null)}
                              className="block border-b-[1.6px] border-brand/30 pb-1 text-base font-medium"
                            >
                              {t(c.heading)}
                            </Link>
                            <ul className="mt-4">
                              {c.items.map((it) => (
                                <li key={it}>
                                  <Link
                                    href={itemHref(n, c, it)}
                                    onClick={() => setDrop(null)}
                                    className="flex gap-2 py-1 text-base hover:underline"
                                  >
                                    <span aria-hidden>·</span>
                                    {t(it)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-10 bg-promo py-6 pl-[201.6px] pr-12">
                        <Link
                          href={hrefFor(n.menu.promo.to)}
                          onClick={() => setDrop(null)}
                          className="text-[40px] font-medium leading-[44px]"
                        >
                          {t(n.menu.promo.title)}
                        </Link>
                        <Link
                          href={hrefFor(n.menu.promo.to)}
                          onClick={() => setDrop(null)}
                          className="rounded-2xl bg-action px-4 py-3 font-ui text-base font-medium text-white transition-colors duration-150 hover:bg-action-hover focus-visible:bg-action-hover"
                        >
                          {t(n.menu.promo.cta)}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href={hrefFor("Proceso de admisión")}
            onClick={() => setDrop(null)}
            className="flex shrink-0 items-center justify-center bg-action px-6 py-4 font-ui font-medium text-white transition-colors duration-150 hover:bg-action-hover focus-visible:bg-action-hover"
          >
            {t("Cómo inscribirse")}
          </Link>
        </div>
      </nav>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
