import { ArrowRight, ChevronRight, ExternalLink, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { childrenOf, detailFor, hrefFor, SCHOOL, siblingsOf, type Page } from "./content";
import { T, TImg } from "./i18n";
import { wrap } from "./layout";

const card =
  "group flex items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/** Plantilla de subpágina: cabecera con ruta, contenido (o aviso de pendiente) y navegación de la sección. */
export function SubPage({ page }: { page: Page }) {
  const detail = detailFor(page);
  const kids = childrenOf(page.href);
  const siblings = siblingsOf(page);
  const isHub = kids.length > 0;
  const pending = !detail && !isHub;
  const phoneHref = `tel:${SCHOOL.phone.replace(/\s/g, "")}`;
  const asideTitle = page.crumbs.length > 1 ? page.crumbs[page.crumbs.length - 2].title : "En esta sección";

  return (
    <main className="flex-1">
      {/* Cabecera: ruta de navegación y título */}
      <section className="bg-footer-light text-navy">
        <div className={`${wrap} py-10 lg:py-14`}>
          {/* El nombre accesible se traduce con un texto oculto (aria-labelledby) */}
          <nav aria-labelledby="breadcrumb-label" className="font-ui text-sm">
            <span id="breadcrumb-label" className="sr-only">
              <T>Ruta de navegación</T>
            </span>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  <T>Inicio</T>
                </Link>
              </li>
              {page.crumbs.map((c, i) => {
                const last = i === page.crumbs.length - 1;
                return (
                  <li key={c.href} className="flex items-center gap-1.5">
                    <ChevronRight className="size-4 opacity-70" aria-hidden />
                    {last ? (
                      <span aria-current="page" className="font-bold">
                        <T>{c.title}</T>
                      </span>
                    ) : (
                      <Link href={c.href} className="underline-offset-4 hover:underline">
                        <T>{c.title}</T>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight lg:text-5xl">
            <T>{page.title}</T>
          </h1>
        </div>
      </section>

      <div className={`${wrap} grid gap-12 py-12 lg:py-16 ${siblings.length > 1 ? "lg:grid-cols-[1fr_340px]" : ""}`}>
        <div className="min-w-0">
          {/* Contenido verificado */}
          {detail && (
            <article className="flex flex-col gap-8 md:flex-row md:items-start">
              {detail.image && (
                <TImg
                  src={detail.image.src}
                  alt={detail.image.alt}
                  width={detail.image.width}
                  height={detail.image.height}
                  className="h-auto w-48 shrink-0 md:w-56"
                />
              )}
              <div className="min-w-0">
                {detail.intro && (
                  <p className="text-xl font-medium leading-8">
                    <T>{detail.intro}</T>
                  </p>
                )}
                {detail.paragraphs?.map((p) => (
                  <p key={p} className="mt-5 text-lg leading-[28.8px] text-body">
                    <T>{p}</T>
                  </p>
                ))}
                {detail.facts && (
                  <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-[auto_1fr]">
                    {detail.facts.map((f) => (
                      <div key={f.label} className="contents">
                        <dt className="font-bold">
                          <T>{f.label}</T>
                        </dt>
                        <dd className="min-w-0 break-words text-lg">
                          {f.href ? (
                            <a
                              href={f.href}
                              {...(f.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-action"
                            >
                              {f.tr ? <T>{f.value}</T> : f.value}
                              {f.external && (
                                <>
                                  <ExternalLink className="size-4" aria-hidden />
                                  <span className="sr-only">
                                    <T>(se abre en una pestaña nueva)</T>
                                  </span>
                                </>
                              )}
                            </a>
                          ) : f.tr ? (
                            <T>{f.value}</T>
                          ) : (
                            f.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </article>
          )}

          {/* Páginas hijas (secciones y grupos) */}
          {isHub && (
            <div className={detail ? "mt-12" : ""}>
              <p className="mb-6 text-lg text-body">
                {page.kind === "section" ? (
                  <T>Explora lo que encuentras en esta sección.</T>
                ) : (
                  <T>Elige una página para ver más.</T>
                )}
              </p>
              <ul className="grid gap-5 sm:grid-cols-2">
                {kids.map((k) => {
                  const n = childrenOf(k.href).length;
                  return (
                    <li key={k.href}>
                      <Link href={k.href} className={card}>
                        <span>
                          <span className="block text-xl font-extrabold">
                            <T>{k.title}</T>
                          </span>
                          {k.kind === "group" && (
                            <span className="mt-1 block text-sm text-body">
                              <T vars={{ n }}>{n === 1 ? "{n} página" : "{n} páginas"}</T>
                            </span>
                          )}
                        </span>
                        <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Aviso honesto cuando aún no hay texto oficial */}
          {pending && (
            <div className="rounded-2xl border-2 border-dashed border-ink/30 p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold">
                <T>Contenido en preparación</T>
              </h2>
              <p className="mt-3 text-lg leading-[28.8px] text-body">
                <T vars={{ title: page.title }} tvars={["title"]}>
                  {
                    "Esta página ya está lista para recibir la información oficial sobre «{title}». Mientras tanto, puedes consultarla directamente con el colegio."
                  }
                </T>
              </p>
              <div className="mt-6 flex flex-wrap gap-3 font-ui font-medium">
                <a
                  href={phoneHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-deep px-5 py-3 text-white transition-colors hover:bg-deep-hover"
                >
                  <Phone className="size-4" aria-hidden /> <T vars={{ phone: SCHOOL.phone }}>{"Llamar al {phone}"}</T>
                </a>
                <a
                  href={`mailto:${SCHOOL.email}`}
                  className="inline-flex max-w-full items-center gap-2 rounded-lg border border-ink/30 px-5 py-3 transition-colors hover:border-brand"
                >
                  <Mail className="size-4 shrink-0" aria-hidden /> <span className="min-w-0 break-all">{SCHOOL.email}</span>
                </a>
                <Link
                  href={hrefFor("Contacto")}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-3 underline underline-offset-4 hover:text-action"
                >
                  <T>Ver datos de contacto</T>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navegación de la sección */}
        {siblings.length > 1 && (
          <aside aria-labelledby="aside-label" className="lg:sticky lg:top-24 lg:self-start">
            <span id="aside-label" className="sr-only">
              <T>En esta sección</T>
            </span>
            <div className="rounded-3xl border border-ink/15 bg-white p-6 sm:p-8">
              {/* El título es el grupo (o la sección) al que pertenece la página */}
              <h2 className="text-3xl font-extrabold leading-tight">
                <T>{asideTitle}</T>
              </h2>
              <span aria-hidden className="mt-5 block h-1 w-12 rounded-full bg-soft" />
              <ul className="mt-4">
                {siblings.map((s) => {
                  const current = s.href === page.href;
                  return (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        aria-current={current ? "page" : undefined}
                        className={`group -mx-3 flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 font-bold transition-colors duration-150 ${
                          current ? "bg-soft-bg" : "hover:bg-soft-bg/70 focus-visible:bg-soft-bg/70"
                        }`}
                      >
                        <span className="min-w-0">
                          <T>{s.title}</T>
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
