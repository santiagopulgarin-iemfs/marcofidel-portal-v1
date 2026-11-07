/**
 * Contenido y mapa de rutas del sitio de la I.E. Marco Fidel Suárez (Andes, Antioquia).
 *
 * Fuentes:
 *  - Escudo institucional: nombre, municipio, año 1997 y lema "Ciencia y Valores".
 *  - Sitio anterior del colegio (iemfs.edu.co): contacto, programas, proyectos, documentos,
 *    trámites y plataformas. Esa página puede estar desactualizada: confirmar con el colegio.
 *
 * Lo que no figura en ninguna fuente (NIT, rector, misión, visión, historia) NO se inventa:
 * esas páginas muestran un aviso de contenido pendiente con los datos de contacto reales.
 */

export const SCHOOL = {
  name: "Institución Educativa Marco Fidel Suárez",
  short: "I.E. Marco Fidel Suárez",
  city: "Andes, Antioquia",
  founded: 1997,
  motto: "Ciencia y Valores",
  tagline: "Promoviendo la excelencia y el desarrollo social",
  address: "Carrera Cajibio Nro. 55 A 06, Barrio San Pedro",
  phone: "441 4448",
  email: "secretaria@iemfs.edu.co",
} as const;

/** Redes sociales oficiales (solo las que el colegio ha entregado). */
export const SOCIALS = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@iemarcofidelandes",
    url: "https://www.instagram.com/iemarcofidelandes/",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "Facebook",
    // Se quitó el parámetro de rastreo `ref=...` y el `#` final de la URL original
    url: "https://www.facebook.com/profile.php?id=61587166274259",
  },
] as const;

/** Datos que el colegio aún debe confirmar. */
export const PENDING = {
  nit: "NIT por confirmar",
} as const;

// ---------------------------------------------------------------------------
// Navegación
// ---------------------------------------------------------------------------

export type Column = { heading: string; items: string[] };
export type NavItem = {
  label: string;
  menu?: {
    columns: Column[];
    /** `to`: nombre de la página a la que lleva la banda y su botón */
    promo: { title: string; cta: string; to: string };
  };
};

export const nav: NavItem[] = [
  {
    label: "Estudia con nosotros",
    menu: {
      columns: [
        { heading: "Horarios", items: ["Bachillerato", "Horario sabatino"] },
        { heading: "Trámites", items: ["Cuenta para pagos", "Excusas", "Formatos", "Acta de recuperación"] },
        { heading: "Admisiones", items: ["Proceso de admisión", "Proceso de matrícula", "Documentos requeridos"] },
        { heading: "Por qué elegirnos", items: ["Proyección Social", "Colegio Digital", "Bilingüismo", "Ciencia y valores"] },
      ],
      promo: { title: "Te esperamos en el colegio", cta: "Cómo inscribirse", to: "Proceso de admisión" },
    },
  },
  {
    label: "Cómo formamos",
    menu: {
      columns: [
        { heading: "Proyección académica", items: ["Proyecto Educativo Institucional (PEI)", "Sistema de evaluación", "Calendario escolar"] },
        { heading: "Bienestar integral", items: ["Manual de convivencia", "Kit de Convivencia Escolar"] },
      ],
      promo: { title: "Promoviendo la excelencia y el desarrollo social", cta: "Nuestro PEI", to: "Proyecto Educativo Institucional (PEI)" },
    },
  },
  {
    label: "Programas y proyectos",
    menu: {
      columns: [
        { heading: "Programas", items: ["Proyección Social", "Colegio Digital", "Bilingüismo e internacionalización"] },
        { heading: "Proyectos", items: ["Tu mascota, bienestar de amor", "A lo Natural", "Proyecto Visualizarte"] },
        { heading: "Voluntariado", items: ["Idiomas", "Formación", "Proyección comunitaria"] },
      ],
      promo: { title: "Aprender para transformar", cta: "Conoce los proyectos", to: "Proyectos" },
    },
  },
  {
    label: "El Colegio",
    menu: {
      columns: [
        { heading: "Nuestra identidad", items: ["Reseña histórica", "Escudo institucional", "Himno del colegio"] },
        { heading: "Documentos", items: ["Resoluciones", "PEI", "Manual de convivencia", "Sistema de evaluación"] },
        { heading: "Plataformas", items: ["CIUCE", "Sinai", "Kit de Convivencia Escolar", "Recursos"] },
        { heading: "Atención", items: ["PQRS", "Contacto"] },
      ],
      promo: { title: "Conoce nuestro colegio", cta: "Escríbenos", to: "Contacto" },
    },
  },
  { label: "Contáctenos" },
];

/** Accesos por tipo de usuario (menú "Información para ti"). */
export const audiences = ["Estudiantes", "Familias", "Docentes", "Egresados"];

/** `link`: nombre de la página destino cuando el título no coincide con una página. */
export const quickLinks: { label: string; link: string }[] = [
  { label: "Calendario escolar", link: "Calendario escolar" },
  { label: "Manual de convivencia", link: "Manual de convivencia" },
  { label: "Trámites y formatos", link: "Trámites" },
];

/** Programas y énfasis (sitio anterior del colegio). */
export const offer = ["Proyección Social", "Colegio Digital", "Bilingüismo", "Voluntariado"];

export const why: { title: string; text: string; link?: string }[] = [
  {
    title: "Proyección Social",
    text: "Una pedagogía basada en proyectos integradores para formar líderes del cambio social.",
  },
  {
    title: "Colegio Digital",
    text: "Alianza con el Tecnológico de Antioquia: desde 2022, los egresados pueden acceder a sus programas y homologar materias de la media.",
  },
  {
    title: "Bilingüismo e internacionalización",
    text: "Un proyecto prioritario de la institución.",
  },
  {
    title: "Voluntariado",
    text: "Convocamos voluntarios para proyectos de idiomas, formación y proyección comunitaria.",
  },
  {
    title: "Convivencia escolar",
    text: "Contamos con un Manual de Convivencia y con el Kit de Convivencia Escolar para cuidar la vida en comunidad.",
    link: "Manual de convivencia",
  },
  {
    title: "Ciencia y valores",
    text: "El lema de nuestro escudo resume lo que buscamos: formar con conocimiento y con principios.",
  },
  {
    title: "Tu mascota, bienestar de amor",
    text: "Uno de los proyectos institucionales del colegio.",
  },
  {
    title: "A lo Natural",
    text: "Uno de los proyectos institucionales del colegio.",
  },
  {
    title: "Proyecto Visualizarte",
    text: "Uno de los proyectos institucionales del colegio.",
  },
  {
    title: "Plataformas digitales",
    text: "Acceso a CIUCE, Sinai y otros recursos digitales para toda la comunidad educativa.",
    link: "Plataformas",
  },
];

export const footerSitemap: { heading: string; items?: string[] }[][] = [
  [
    { heading: "Nuestra identidad", items: ["Reseña histórica", "Escudo institucional", "Himno del colegio"] },
    { heading: "Horarios" },
    { heading: "Trámites" },
  ],
  [
    { heading: "Programas", items: ["Proyección Social", "Colegio Digital", "Bilingüismo e internacionalización"] },
    { heading: "Plataformas" },
    { heading: "Voluntariado" },
  ],
  [
    { heading: "Documentos", items: ["Resoluciones", "PEI", "Manual de convivencia", "Sistema de evaluación"] },
    { heading: "Atención", items: ["PQRS", "Contacto"] },
    { heading: "Contáctenos" },
  ],
];

// ---------------------------------------------------------------------------
// Mapa de rutas: el árbol de navegación genera todas las páginas
// ---------------------------------------------------------------------------

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type PageKind = "section" | "group" | "item";
export type Crumb = { title: string; href: string };
export type Page = {
  href: string;
  path: string[];
  title: string;
  kind: PageKind;
  parent?: string;
  crumbs: Crumb[];
};

const byHref = new Map<string, Page>();
const childMap = new Map<string, string[]>();
const labelIndex = new Map<string, string>();

function addPage(title: string, path: string[], kind: PageKind, parent?: Page) {
  const href = "/" + path.join("/");
  const page: Page = {
    href,
    path,
    title,
    kind,
    parent: parent?.href,
    crumbs: [...(parent?.crumbs ?? []), { title, href }],
  };
  byHref.set(href, page);
  if (parent) childMap.set(parent.href, [...(childMap.get(parent.href) ?? []), href]);
  // Gana la primera página con ese nombre (los nombres repetidos apuntan a la primera)
  const key = slugify(title);
  if (!labelIndex.has(key)) labelIndex.set(key, href);
  return page;
}

for (const n of nav) {
  const section = addPage(n.label, [slugify(n.label)], "section");
  for (const c of n.menu?.columns ?? []) {
    const group = addPage(c.heading, [section.path[0], slugify(c.heading)], "group", section);
    for (const it of c.items) addPage(it, [section.path[0], group.path[1], slugify(it)], "item", group);
  }
}
{
  const section = addPage("Información para ti", ["informacion-para-ti"], "section");
  for (const a of audiences) addPage(a, [section.path[0], slugify(a)], "item", section);
}

const RESOLVE_FALLBACK = "/contactenos";
const unresolved = new Set<string>();

/** Dirección de la página cuyo nombre coincide con `label` (sin importar tildes ni mayúsculas). */
export function hrefFor(label: string): string {
  const href = labelIndex.get(slugify(label));
  if (!href) {
    unresolved.add(label);
    return RESOLVE_FALLBACK;
  }
  return href;
}

export const sectionHref = (n: NavItem) => "/" + slugify(n.label);
export const groupHref = (n: NavItem, c: Column) => `/${slugify(n.label)}/${slugify(c.heading)}`;
export const itemHref = (n: NavItem, c: Column, item: string) =>
  `/${slugify(n.label)}/${slugify(c.heading)}/${slugify(item)}`;

export const allPages = (): Page[] => [...byHref.values()];
export const getPage = (path: string[]): Page | undefined => byHref.get("/" + path.join("/"));
export const childrenOf = (href: string): Page[] =>
  (childMap.get(href) ?? []).map((h) => byHref.get(h)!).filter(Boolean);
export const siblingsOf = (page: Page): Page[] => (page.parent ? childrenOf(page.parent) : []);

/** Entradas del buscador: todo lo navegable, con su ubicación. */
export function searchEntries(): { label: string; trail: string[]; href: string }[] {
  return allPages().map((p) => ({
    label: p.title,
    trail: p.crumbs.slice(0, -1).map((c) => c.title),
    href: p.href,
  }));
}

/** Nombres usados en enlaces que no coinciden con ninguna página (debe estar vacío). */
export function unresolvedLabels(): string[] {
  const used: string[] = [
    ...nav.flatMap((n) => (n.menu ? [n.menu.promo.to] : [])),
    ...quickLinks.map((q) => q.link),
    ...offer,
    ...why.map((w) => w.link ?? w.title),
    ...footerSitemap.flat().flatMap((g) => [g.heading, ...(g.items ?? [])]),
    "Proceso de admisión",
    "Contacto",
  ];
  return [...new Set(used.filter((l) => !labelIndex.has(slugify(l))))];
}

// ---------------------------------------------------------------------------
// Contenido de cada página (solo lo que las fuentes afirman)
// ---------------------------------------------------------------------------

export type Detail = {
  intro?: string;
  paragraphs?: string[];
  facts?: { label: string; value: string; href?: string; external?: boolean; tr?: boolean }[];
  image?: { src: string; alt: string; width: number; height: number };
};

const contactFacts: NonNullable<Detail["facts"]> = [
  { label: "Dirección", value: `${SCHOOL.address}, ${SCHOOL.city}` },
  { label: "Teléfono", value: SCHOOL.phone, href: `tel:${SCHOOL.phone.replace(/\s/g, "")}` },
  { label: "Correo", value: SCHOOL.email, href: `mailto:${SCHOOL.email}` },
  ...SOCIALS.map((s) => ({ label: s.name, value: s.handle, href: s.url, external: true })),
];

const DETAIL_LIST: [string, Detail][] = [
  ["Proyección Social", { intro: "Una pedagogía basada en proyectos integradores para formar líderes del cambio social." }],
  [
    "Colegio Digital",
    {
      intro: "Alianza con el Tecnológico de Antioquia (TdeA).",
      paragraphs: [
        "Desde 2022, los egresados pueden acceder a los programas del Tecnológico de Antioquia y homologar materias de la media.",
      ],
      image: { src: "/sites/colegio/tdea.png", alt: "Logo del Tecnológico de Antioquia (TdeA)", width: 191, height: 200 },
    },
  ],
  ["Bilingüismo", { intro: "Un proyecto prioritario de la institución." }],
  ["Bilingüismo e internacionalización", { intro: "Un proyecto prioritario de la institución." }],
  [
    "Voluntariado",
    { intro: "Buscamos voluntarios para proyectos de idiomas, formación y proyección comunitaria." },
  ],
  [
    "Ciencia y valores",
    { intro: "“Ciencia y Valores” es el lema que aparece en el escudo del colegio." },
  ],
  [
    "Escudo institucional",
    {
      intro: "Escudo de la I.E. Marco Fidel Suárez, Andes, Antioquia.",
      paragraphs: [
        "El escudo es un óvalo verde con el año 1997 en la parte superior y el nombre de la institución. En su interior se ven una familia sobre una franja azul, un computador, unas manos con granos de café y la palabra ANDES. Debajo, un libro abierto con las palabras CIENCIA y VALORES.",
      ],
      image: { src: "/sites/colegio/escudo.png", alt: "Escudo de la I.E. Marco Fidel Suárez", width: 480, height: 646 },
      facts: [
        { label: "Año", value: String(SCHOOL.founded) },
        { label: "Lema", value: SCHOOL.motto, tr: true },
      ],
    },
  ],
  ["Contacto", { intro: "Escríbenos o llámanos: estos son los datos del colegio.", facts: contactFacts }],
  ["Contáctenos", { intro: "Escríbenos o llámanos: estos son los datos del colegio.", facts: contactFacts }],
];

const details = new Map(DETAIL_LIST.map(([title, d]) => [slugify(title), d]));
export const detailFor = (page: Page): Detail | undefined => details.get(slugify(page.title));
