import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Carousel } from "@/components/sites/colegio/carousel";
import { hrefFor, offer, quickLinks, SCHOOL } from "@/components/sites/colegio/content";
import { T } from "@/components/sites/colegio/i18n";
import { Placeholder } from "@/components/sites/colegio/placeholder";

const wrap = "mx-auto w-full max-w-[1240px] px-6 xl:px-0";

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-md bg-deep px-6 py-[18px] text-lg font-extrabold text-white transition duration-200 ease-out hover:-translate-y-1.5 hover:bg-deep-hover hover:shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus-visible:-translate-y-1.5 focus-visible:bg-deep-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {children} <ArrowUpRight className="size-4" />
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative h-[320px] w-full overflow-hidden md:h-[420px] lg:h-[480px]">
        <Placeholder className="size-full" label={<T>Imagen principal del colegio</T>} />
      </section>

      <section className={`${wrap} grid gap-8 py-8 md:grid-cols-3 lg:py-12`}>
        {quickLinks.map((q) => (
          <Link
            key={q.label}
            href={hrefFor(q.link)}
            className="flex h-[135px] items-end justify-center rounded-3xl border border-ink/30 pb-5 text-2xl font-extrabold transition duration-200 ease-out hover:-translate-y-2 hover:border-brand hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] focus-visible:-translate-y-2 focus-visible:border-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <T>{q.label}</T>
          </Link>
        ))}
      </section>

      <section className={`${wrap} py-8 lg:py-12`}>
        <h2 className="text-4xl font-extrabold leading-[41px]">
          <T>{SCHOOL.name}</T>
        </h2>
        <p className="mt-6 max-w-[900px] text-lg leading-[28.8px] text-body">
          <T
            vars={{ tagline: SCHOOL.tagline, city: SCHOOL.city, motto: SCHOOL.motto, founded: SCHOOL.founded }}
            tvars={["tagline", "motto"]}
          >
            {
              "{tagline}. Somos una institución educativa de {city}, con una pedagogía basada en proyectos integradores para formar líderes del cambio social. Nuestro escudo resume el camino: {motto}, desde {founded}."
            }
          </T>
        </p>
      </section>

      <section className={`${wrap} py-12 lg:py-16`}>
        <h2 className="text-4xl font-extrabold leading-[41px]">
          <T>Programas y énfasis</T>
        </h2>
        <div className="mt-8 flex flex-wrap gap-4">
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
