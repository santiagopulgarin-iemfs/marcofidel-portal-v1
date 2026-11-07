"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Año actual calculado en el navegador del visitante.
 *
 * El pie de página se genera estático al publicar el sitio: si el año se calculara solo en el
 * servidor quedaría congelado en el año de la publicación. `fallback` (año de la publicación) se usa
 * para el HTML inicial y la hidratación; enseguida se reemplaza por el año real, sin avisos de React.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => fallback);
  return <>{year}</>;
}
