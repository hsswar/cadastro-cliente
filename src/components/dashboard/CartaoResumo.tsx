import type { ReactNode } from "react";

type Props = {
  categoria: string;
  titulo: string;
  valor: string;
  rodape: string;
  data: string;
  icone: ReactNode;
  destaque?: boolean;
};

/** Cartão grande de indicador, com valor em destaque. */
export function CartaoResumo({ categoria, titulo, valor, rodape, data, icone, destaque }: Props) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-l-4 border-gray-200 border-l-brand-600 shadow-sm ${
        destaque ? "bg-linear-to-br from-brand-100 to-white" : "bg-linear-to-br from-brand-50 to-white"
      }`}
    >
      <div className="flex items-start gap-3 px-5 pt-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl text-brand-700">
          {icone}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-gray-600">{categoria}</p>
          <h2 className="truncate text-sm font-medium text-gray-900">{titulo}</h2>
        </div>
      </div>
      <p className="px-5 pb-5 pt-4 text-3xl font-bold tracking-tight text-gray-900">{valor}</p>
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-white/60 px-5 py-2 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-1.5 rounded-full bg-brand-600" />
          {rodape}
        </span>
        <span className="text-right">{data}</span>
      </div>
    </section>
  );
}
