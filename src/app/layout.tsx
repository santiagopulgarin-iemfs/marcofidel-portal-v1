import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/sites/colegio/accessibility-context";
import { AccessibilitySidebar } from "@/components/sites/colegio/accessibility-sidebar";
import { FloatingActions } from "@/components/sites/colegio/floating-actions";
import { Footer } from "@/components/sites/colegio/footer";
import { Header } from "@/components/sites/colegio/header";
import { LangEffects } from "@/components/sites/colegio/i18n";

const nunito = Nunito_Sans({ variable: "--font-nunito", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Institución Educativa Marco Fidel Suárez | Andes, Antioquia",
  description: "Sitio de la Institución Educativa Marco Fidel Suárez, Andes (Antioquia): ciencia y valores.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${nunito.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-display text-ink">
        <AccessibilityProvider>
          <LangEffects />
          <Header />
          {children}
          <Footer />
          <FloatingActions />
          <AccessibilitySidebar />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
