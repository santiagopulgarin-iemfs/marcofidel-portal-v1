import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages, getPage, SCHOOL } from "@/components/sites/colegio/content";
import { SubPage } from "@/components/sites/colegio/subpage";

type Props = { params: Promise<{ slug: string[] }> };

// Todas las subpáginas salen del árbol de navegación y se generan estáticas
export function generateStaticParams() {
  return allPages().map((p) => ({ slug: p.path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return { title: `Página no encontrada | ${SCHOOL.short}` };
  return { title: `${page.title} | ${SCHOOL.short}` };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();
  return <SubPage page={page} />;
}
