import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { MenuPrincipal } from "@/components/MenuPrincipal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cadastro de Clientes",
  description: "Cadastre, consulte, edite e exclua clientes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-linear-to-b from-white via-brand-50 to-brand-100 bg-fixed text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-[1400px] items-center px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-brand-800">
              Cadastro de Clientes
            </Link>
          </div>
        </header>

        <Suspense fallback={<div className="h-11 bg-neutral-700" />}>
          <MenuPrincipal />
        </Suspense>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-4 sm:py-5">{children}</main>
      </body>
    </html>
  );
}
