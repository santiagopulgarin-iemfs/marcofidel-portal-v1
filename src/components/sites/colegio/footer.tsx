import Link from "next/link";
import { footerSitemap, hrefFor, SCHOOL } from "./content";
import { CurrentYear } from "./current-year";
import { T, TImg } from "./i18n";
import { wideWrap } from "./layout";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

const heading =
  "block border-b-[1.6px] border-[#a0a4a8] pb-2 text-base font-bold leading-6 text-navy";

export function Footer() {
  return (
    <footer>
      <div className="bg-footer-light text-navy">
        <div className={`${wideWrap} grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16`}>
          {/* Marca (4 de 12 columnas) */}
          <div className="flex flex-col gap-10 lg:col-span-4">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <TImg
                    src="/sites/colegio/escudo.png"
                    alt="Escudo de la I.E. Marco Fidel Suárez"
                    width={480}
                    height={646}
                    className="h-24 w-auto shrink-0"
                  />
                  <Logo className="h-8" />
                </div>
                <p className="text-lg font-medium leading-[28.8px]">{SCHOOL.city}</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3">
                <a href={`mailto:${SCHOOL.email}`} className="rounded-xl bg-coral px-8 py-3.5 font-ui text-white">
                  <T>Escríbenos</T>
                </a>
                <Link href={hrefFor("PQRS")} className="whitespace-nowrap text-base underline">
                  <T>Peticiones, quejas y reclamos</T>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="border-b-[1.6px] border-[#a0a4a8] pb-2 text-lg font-extrabold uppercase">
                <T>Alianzas</T>
              </h4>
              <ul className="mt-6 flex flex-wrap items-center gap-6">
                <li>
                  {/* Convenio de alianza: logo en blanco y negro */}
                  <TImg
                    src="/sites/colegio/tdea.png"
                    alt="Tecnológico de Antioquia (TdeA), alianza del colegio"
                    width={191}
                    height={200}
                    className="h-24 w-auto"
                  />
                </li>
              </ul>
            </div>
          </div>

          {/* Mapa del sitio (8 de 12 columnas, 3 columnas de contenido) */}
          <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {footerSitemap.map((column, ci) => (
              <li key={ci} className="flex flex-col gap-8">
                {column.map((g) => (
                  <div key={g.heading}>
                    <Link href={hrefFor(g.heading)} className={heading}>
                      <T>{g.heading}</T>
                    </Link>
                    {g.items && (
                      <ul className="mt-6 list-disc space-y-0.5 pl-6 leading-6">
                        {g.items.map((it) => (
                          <li key={it}>
                            <Link href={hrefFor(it)} className="hover:underline">
                              <T>{it}</T>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-footer-dark text-white">
        <div className={`${wideWrap} grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4`}>
          <div className="max-w-[314px] text-lg">
            <h4 className="font-extrabold">
              <T>Sede principal</T>
            </h4>
            <p>{SCHOOL.address}</p>
            <p>{SCHOOL.city}</p>
            <p className="mt-4 border-t border-dotted border-white/60 pt-4">
              <T vars={{ phone: SCHOOL.phone }}>{"Teléfono: {phone}"}</T>
              <br />
              <a href={`mailto:${SCHOOL.email}`} className="break-all underline">
                {SCHOOL.email}
              </a>
            </p>
            <SocialLinks />
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-6 text-center text-base">
          <p>
            © <CurrentYear fallback={new Date().getFullYear()} /> {SCHOOL.short}. <T>Todos los derechos reservados.</T>
          </p>
        </div>
      </div>
    </footer>
  );
}
