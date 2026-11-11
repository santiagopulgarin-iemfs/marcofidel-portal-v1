import type { Lang } from "./i18n";

/** Bandera de Colombia: amarillo (1/2), azul (1/4) y rojo (1/4). */
function ColombiaFlag() {
  return (
    <svg viewBox="0 0 3 2" aria-hidden className="h-full w-full">
      <rect width="3" height="1" fill="#FCD116" />
      <rect y="1" width="3" height=".5" fill="#003893" />
      <rect y="1.5" width="3" height=".5" fill="#CE1126" />
    </svg>
  );
}

// Estrellas de EE. UU. (50) como puntos: 9 filas que alternan 6 y 5
const STARS = Array.from({ length: 9 }, (_, row) =>
  Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, col) => ({
    x: (row % 2 === 0 ? 0.633 : 1.267) + col * 1.267,
    y: 0.5 + row * 0.5,
  })),
).flat();

/** Bandera de Estados Unidos: 13 franjas y un cantón azul con 50 estrellas (simplificadas). */
function UsaFlag() {
  const stripe = 10 / 13;
  return (
    <svg viewBox="0 0 19 10" aria-hidden className="h-full w-full">
      <rect width="19" height="10" fill="#FFFFFF" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * stripe} width="19" height={stripe} fill="#B22234" />
      ))}
      <rect width="7.6" height={7 * stripe} fill="#3C3B6E" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="0.19" fill="#FFFFFF" />
      ))}
    </svg>
  );
}

/** Idiomas disponibles. Los nombres se muestran siempre en su propio idioma. */
export const languages: { code: Lang; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

/** Bandera del idioma: español (Colombia) o inglés (Estados Unidos). Decorativa: el nombre va en el texto. */
export function LangFlag({ code, className = "" }: { code: Lang; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/15 ${className}`}
    >
      {code === "es" ? <ColombiaFlag /> : <UsaFlag />}
    </span>
  );
}
