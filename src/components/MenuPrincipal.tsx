"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconeDashboard, IconeSeta, IconeUsuarios } from "@/components/Icones";

const itemBase =
  "flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none";

export function MenuPrincipal() {
  const pathname = usePathname();
  // Guarda em qual rota o submenu foi aberto: ao navegar, ele fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === pathname;
  const setAberto = (valor: boolean) => setAbertoEm(valor ? pathname : null);
  const raiz = useRef<HTMLLIElement>(null);

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbertoEm(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbertoEm(null);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  const emDashboard = pathname === "/";
  const emCadastros = pathname.startsWith("/clientes");

  return (
    <nav aria-label="Menu principal" className="bg-neutral-700">
      <ul className="mx-auto flex max-w-[1400px] px-1 sm:px-3">
        <li>
          <Link
            href="/"
            aria-current={emDashboard ? "page" : undefined}
            className={`${itemBase} ${emDashboard ? "bg-white/15" : ""}`}
          >
            <IconeDashboard className="text-base" />
            Dashboard
          </Link>
        </li>

        <li ref={raiz} className="relative">
          <button
            type="button"
            aria-expanded={aberto}
            aria-haspopup="menu"
            onClick={() => setAberto(!aberto)}
            className={`${itemBase} ${emCadastros || aberto ? "bg-white/15" : ""}`}
          >
            <IconeUsuarios className="text-base" />
            Cadastros
            <IconeSeta className={`text-sm transition-transform ${aberto ? "rotate-180" : ""}`} />
          </button>

          {aberto && (
            <ul
              role="menu"
              className="absolute left-0 top-full z-20 min-w-48 overflow-hidden rounded-b-md border border-t-0 border-gray-200 bg-white py-1 shadow-lg"
            >
              <li role="none">
                <Link
                  role="menuitem"
                  href="/clientes"
                  aria-current={emCadastros ? "page" : undefined}
                  className={`block px-4 py-2 text-sm hover:bg-brand-50 ${
                    emCadastros ? "font-semibold text-brand-700" : "text-gray-800"
                  }`}
                >
                  Clientes
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
