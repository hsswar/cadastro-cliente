import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
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
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link href="/clientes" className="text-lg font-semibold text-gray-900">
              Cadastro de Clientes
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
