"use client";

import { useMemo } from "react";
import { searchEntries } from "./content";
import { useT } from "./i18n";

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Búsqueda del sitio (la usan la barra de arriba en escritorio y el menú en celular).
 * Busca sobre los textos del idioma activo (`t` cambia con el idioma) y devuelve hasta 8 resultados.
 */
export function useSiteSearch(query: string) {
  const t = useT();
  const entries = useMemo(() => searchEntries(), []);

  return useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return entries
      .map((e) => ({ href: e.href, label: t(e.label), context: e.trail.map((x) => t(x)).join(" › ") }))
      .filter((e) => normalize(e.label).includes(q))
      .slice(0, 8);
  }, [query, entries, t]);
}
