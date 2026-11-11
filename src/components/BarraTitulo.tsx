import type { ReactNode } from "react";

/** Faixa verde com o título da tela, no padrão do dashboard. */
export function BarraTitulo({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md bg-brand-600 px-4 py-2 text-white shadow-sm">
      <h1 className="text-lg font-bold">{titulo}</h1>
      {children && <div className="flex items-center gap-4 text-xs">{children}</div>}
    </div>
  );
}
