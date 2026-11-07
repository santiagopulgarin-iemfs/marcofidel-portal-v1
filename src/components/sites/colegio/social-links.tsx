"use client";

import { SOCIALS } from "./content";
import { useT } from "./i18n";
import { FacebookIcon, InstagramIcon } from "./social-icons";

/** Redes sociales del colegio (cliente: el nombre accesible depende del idioma). */
export function SocialLinks() {
  const t = useT();
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {SOCIALS.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("{name}: {handle} (se abre en una pestaña nueva)", { name: s.name, handle: s.handle })}
          className="inline-flex items-center gap-3 rounded-full bg-white/10 py-1 pl-1 pr-4 text-base transition-colors duration-150 hover:bg-white/20 focus-visible:bg-white/20"
        >
          <span
            className={`flex size-8 items-center justify-center rounded-full text-white ${
              s.id === "instagram" ? "bg-[linear-gradient(45deg,#f09433,#dc2743,#bc1888)]" : "bg-[#1877f2]"
            }`}
          >
            {s.id === "instagram" ? <InstagramIcon className="size-4" /> : <FacebookIcon className="size-4" />}
          </span>
          {s.handle}
        </a>
      ))}
    </div>
  );
}
