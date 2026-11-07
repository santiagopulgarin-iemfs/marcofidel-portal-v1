"use client";

import { createContext, useContext } from "react";
import { useAccessibility, type Accessibility } from "./use-accessibility";

const Ctx = createContext<Accessibility | null>(null);

/** Una sola instancia de accesibilidad (texto, contraste y voz) compartida por el header y la barra lateral. */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const a11y = useAccessibility();
  return <Ctx.Provider value={a11y}>{children}</Ctx.Provider>;
}

export function useA11y(): Accessibility {
  const v = useContext(Ctx);
  if (!v) throw new Error("useA11y debe usarse dentro de <AccessibilityProvider>");
  return v;
}
