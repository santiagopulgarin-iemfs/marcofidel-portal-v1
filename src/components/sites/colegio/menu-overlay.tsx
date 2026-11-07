"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, House, X } from "lucide-react";
import Link from "next/link";
import { groupHref, hrefFor, itemHref, nav, sectionHref } from "./content";
import { useT } from "./i18n";

/** Menú completo a pantalla completa (se abre desde el botón "Menú" en cualquier ancho). */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const [drop, setDrop] = useState<number | null>(null);
  const [subOpen, setSubOpen] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const toggleSub = (key: string) =>
    setSubOpen((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  // Bloquear el scroll del fondo, cerrar con Escape y enfocar el botón de cerrar
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Marca "menú abierto": oculta la barra de accesibilidad y los botones flotantes mientras dure
    document.body.dataset.menuOpen = "true";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      delete document.body.dataset.menuOpen;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="main-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("Menú principal")}
      className="fixed inset-0 z-[70] overflow-y-auto bg-brand font-ui text-white"
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
      </div>
    </div>
  );
}
