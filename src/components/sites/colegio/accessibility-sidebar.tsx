"use client";

import { Contrast, Moon, Volume2, VolumeX } from "lucide-react";
import { useA11y } from "./accessibility-context";
import { useT } from "./i18n";
import { SCALE_MAX, SCALE_MIN } from "./use-accessibility";

const btn =
  "flex size-9 items-center justify-center rounded-md border-2 border-white text-sm font-extrabold text-white transition-colors duration-150 hover:enabled:bg-white/20 focus-visible:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 sm:size-11 sm:text-base";
// Botón activo (modo encendido): fondo blanco y texto verde
const active = "bg-white !text-deep hover:enabled:!bg-white/90";

/** Barra lateral de accesibilidad: tamaño de texto, contraste, modo oscuro y lector de voz. */
export function AccessibilitySidebar() {
  const t = useT();
  const { scale, setScale, mode, toggleMode, supported, hoverRead, setHoverRead } = useA11y();

  return (
    <aside
      aria-label={t("Herramientas rápidas de accesibilidad")}
      className="fixed right-0 top-1/4 z-[55] flex flex-col gap-2 rounded-l-2xl bg-deep p-2 shadow-[0_4px_16px_rgba(0,0,0,0.25)] sm:top-1/2 sm:-translate-y-1/2 sm:gap-3 sm:p-3"
    >
      <button
        className={btn}
        title={t("Aumentar texto")}
        aria-label={t("Aumentar texto (actual {n}%)", { n: scale })}
        disabled={scale >= SCALE_MAX}
        onClick={() => setScale((s) => Math.min(SCALE_MAX, s + 10))}
      >
        A+
      </button>
      <button
        className={btn}
        title={t("Disminuir texto")}
        aria-label={t("Disminuir texto (actual {n}%)", { n: scale })}
        disabled={scale <= SCALE_MIN}
        onClick={() => setScale((s) => Math.max(SCALE_MIN, s - 10))}
      >
        A-
      </button>
      <button
        className={btn}
        title={t("Tamaño de texto normal")}
        aria-label={t("Tamaño de texto normal")}
        disabled={scale === 100}
        onClick={() => setScale(100)}
      >
        A
      </button>

      <button
        className={`${btn} ${mode === "high" ? active : ""}`}
        title={t("Alto contraste")}
        aria-label={t("Alto contraste")}
        aria-pressed={mode === "high"}
        onClick={() => toggleMode("high")}
      >
        <Contrast className="size-5" aria-hidden />
      </button>
      <button
        className={`${btn} ${mode === "dark" ? active : ""}`}
        title={t("Modo oscuro")}
        aria-label={t("Modo oscuro")}
        aria-pressed={mode === "dark"}
        onClick={() => toggleMode("dark")}
      >
        <Moon className="size-5" aria-hidden />
      </button>

      {supported && (
        <button
          className={`${btn} ${hoverRead ? active : ""}`}
          title={hoverRead ? t("Desactivar el lector de voz") : t("Lector de voz: lee lo que señalas o tocas")}
          aria-label={
            hoverRead ? t("Desactivar el lector de voz") : t("Activar el lector de voz: lee lo que señalas o tocas")
          }
          aria-pressed={hoverRead}
          onClick={() => setHoverRead(!hoverRead)}
        >
          {hoverRead ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
        </button>
      )}
    </aside>
  );
}
