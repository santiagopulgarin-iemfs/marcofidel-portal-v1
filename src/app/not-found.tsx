import Link from "next/link";
import { T } from "@/components/sites/colegio/i18n";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="font-ui text-sm font-bold uppercase tracking-widest text-body">
        <T>Error 404</T>
      </p>
      <h1 className="text-4xl font-extrabold">
        <T>No encontramos esta página</T>
      </h1>
      <p className="max-w-md text-lg text-body">
        <T>Puede que el enlace haya cambiado. Vuelve al inicio o usa el buscador de la barra superior.</T>
      </p>
      <Link
        href="/"
        className="rounded-lg bg-deep px-6 py-3 font-ui font-medium text-white transition-colors hover:bg-deep-hover"
      >
        <T>Volver al inicio</T>
      </Link>
    </main>
  );
}
