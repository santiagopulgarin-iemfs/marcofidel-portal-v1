"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { hrefFor, why } from "./content";
import { useT } from "./i18n";
import { Placeholder } from "./placeholder";

// 10 tarjetas con 3 visibles => 8 posiciones (contador "x / 8")
const SLIDES = why.length;
const VISIBLE = 3;
const POSITIONS = SLIDES - VISIBLE + 1;

export function Carousel() {
  const t = useT();
  const [i, setI] = useState(0);

  return (
    <div>
      <div className="overflow-x-clip py-3">
        <div
          className="flex gap-[30px] transition-transform duration-300 ease-out [--step:calc(100%_+_30px)] motion-reduce:transition-none md:[--step:calc((100%_-_60px)/3_+_30px)]"
          style={{ transform: `translateX(calc(var(--step) * ${-i}))` }}
        >
          {why.map((card, n) => (
            <article
              key={n}
              className="flex min-h-[520px] shrink-0 basis-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:basis-[calc((100%_-_60px)/3)]"
            >
              <Placeholder className="h-[236px] w-full shrink-0 rounded-none" label={t(card.title)} />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[32px] font-extrabold leading-[41.6px] text-ink">{t(card.title)}</h3>
                <p className="mt-4 flex-1 text-lg leading-[28.8px] text-body">{t(card.text)}</p>
                <Link href={hrefFor(card.link ?? card.title)} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  {t("Ver más información")} <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-bold">{i + 1} / {POSITIONS}</span>
        <div className="flex gap-2">
          <button
            aria-label={t("Anterior")}
            disabled={i === 0}
            onClick={() => setI((v) => Math.max(0, v - 1))}
            className="flex size-11 items-center justify-center rounded-md border border-deep bg-white text-deep transition-colors hover:enabled:border-deep-hover hover:enabled:text-deep-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            aria-label={t("Siguiente")}
            disabled={i === POSITIONS - 1}
            onClick={() => setI((v) => Math.min(POSITIONS - 1, v + 1))}
            className="flex size-11 items-center justify-center rounded-md bg-deep text-white transition-colors hover:enabled:bg-deep-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
