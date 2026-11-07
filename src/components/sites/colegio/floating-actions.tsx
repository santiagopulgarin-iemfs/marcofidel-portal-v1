import { Headphones, NotebookPen } from "lucide-react";
import Link from "next/link";
import { hrefFor } from "./content";
import { T } from "./i18n";

const actions = [
  { t: "Inscríbete", I: NotebookPen, to: "Proceso de admisión" },
  { t: "Contáctanos", I: Headphones, to: "Contacto" },
];

export function FloatingActions() {
  return (
    <div className="fixed bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] right-6 z-[60] grid gap-3">
      {actions.map(({ t, I, to }) => (
        <Link
          key={t}
          href={hrefFor(to)}
          className="a11y-keep inline-flex w-full items-center justify-center gap-4 rounded-full border-4 border-white/70 bg-float p-3.5 font-ui font-bold text-ink shadow-lg transition duration-150 hover:-translate-y-0.5 hover:bg-float-hover focus-visible:bg-float-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[182px] lg:justify-between lg:px-6 lg:py-3"
        >
          {/* En móvil solo ícono: el texto queda accesible para lectores de pantalla */}
          <span className="sr-only whitespace-nowrap text-[15px] lg:not-sr-only">
            <T>{t}</T>
          </span>
          <I className="size-5 shrink-0" aria-hidden />
        </Link>
      ))}
    </div>
  );
}
