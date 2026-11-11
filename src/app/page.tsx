import { ArrowUpRight, BookOpen, CalendarDays, FileText, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Carousel } from "@/components/sites/colegio/carousel";
import { hrefFor, offer, quickLinks } from "@/components/sites/colegio/content";
import { T } from "@/components/sites/colegio/i18n";
import { wrap } from "@/components/sites/colegio/layout";
import { Placeholder } from "@/components/sites/colegio/placeholder";

// Ícono de cada acceso rápido: verde sobre la franja verde suave (como la tarjeta de la UPB, 32 px y 40 px desde tableta)
const quickIcons: Record<string, LucideIcon> = {
  "Calendario escolar": CalendarDays,
  "Manual de convivencia": BookOpen,
  "Trámites y formatos": FileText,
};

function QuickIcon({ label }: { label: string }) {
  const Icon = quickIcons[label] ?? FileText;
  return (
    <Icon
      className="size-8 text-deep transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand md:size-10"
      strokeWidth={1.75}
      aria-hidden
    />
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      // Celular y tableta: dos por fila, pero el botón queda chico, del tamaño de su texto
      // (no estira a ocupar toda la mitad). Desde escritorio, el mismo tamaño compacto en fila.
      className="inline-flex items-center gap-2.5 rounded-md bg-deep px-5 py-3.5 text-base font-extrabold text-white transition duration-200 ease-out hover:-translate-y-1.5 hover:bg-deep-hover hover:shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus-visible:-translate-y-1.5 focus-visible:bg-deep-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:text-lg lg:gap-3 lg:px-7 lg:py-5 lg:text-xl"
    >
      <span className="break-words">{children}</span>
      <ArrowUpRight className="size-5 shrink-0" />
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Foto principal de borde a borde en todos los tamaños, sin esquinas redondeadas (como la de la UPB) */}
      <section className="relative h-[320px] w-full overflow-hidden md:h-[420px] lg:h-[480px]">
        <Placeholder className="size-full" label={<T>Imagen principal del colegio</T>} />
      </section>

      <section className={`${wrap} grid gap-8 py-8 md:grid-cols-3 lg:py-12`}>
        {quickLinks.map((q) => (
          <Link
            key={q.label}
            href={hrefFor(q.link)}
            className="group flex h-full min-h-[120px] flex-col overflow-hidden rounded-[24px] border-2 border-[#D1D1D1] bg-white transition duration-300 ease-out hover:-translate-y-2 hover:border-brand hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] focus-visible:-translate-y-2 focus-visible:border-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {/* Franja de color con el ícono (división de la tarjeta de la UPB) */}
            <div className="flex w-full shrink-0 items-center justify-center bg-soft-bg py-4">
              <QuickIcon label={q.label} />
            </div>
            {/* Título: 16 px en celular y 20 px desde tableta, negrita y centrado */}
            <div className="flex flex-1 flex-col items-center gap-1 p-4 text-center md:gap-2 md:px-6 md:py-4">
              <span className="break-words text-base font-bold text-ink md:text-xl">
                <T>{q.label}</T>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className={`${wrap} py-12 lg:py-16`}>
        <h2 className="text-4xl font-extrabold leading-[41px]">
          <T>Programas y énfasis</T>
        </h2>
        <div className="mt-8 grid grid-cols-2 items-start justify-items-start gap-4 lg:flex lg:flex-row lg:flex-wrap">
          {offer.map((o) => (
            <Pill key={o} href={hrefFor(o)}>
              <T>{o}</T>
            </Pill>
          ))}
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className={wrap}>
          <h2 className="mb-8 text-center text-4xl font-extrabold">
            <T>¿Por qué elegirnos?</T>
          </h2>
          <Carousel />
        </div>
      </section>

      <section className={`${wrap} flex flex-col items-center py-16`}>
        <h2 className="mb-8 text-4xl font-extrabold">
          <T>Servicios</T>
        </h2>
        <Pill href={hrefFor("Trámites")}>
          <T>Ver todos los servicios</T>
        </Pill>
      </section>
    </main>
  );
}
