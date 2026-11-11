import type { PontoGrafico } from "@/lib/dashboard";

const PALETA_BARRAS = ["bg-brand-600", "bg-brand-500", "bg-brand-400", "bg-brand-200", "bg-brand-100"];

function descricao(pontos: PontoGrafico[]) {
  return pontos.map((p) => `${p.rotulo}: ${p.valor}`).join("; ");
}

/** Barras verticais (evolução ao longo do tempo). */
export function BarrasVerticais({ pontos }: { pontos: PontoGrafico[] }) {
  const maximo = Math.max(1, ...pontos.map((p) => p.valor));

  return (
    <div role="img" aria-label={descricao(pontos)} className="overflow-x-auto">
      <div className="flex h-56 min-w-[20rem] items-end gap-2 border-b border-gray-300 px-2 sm:gap-4">
        {pontos.map((p) => (
          <div key={p.rotulo} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs font-semibold text-gray-700">{p.valor}</span>
            <div
              className="w-full max-w-14 rounded-t bg-brand-500"
              style={{ height: `${(p.valor / maximo) * 85}%`, minHeight: p.valor > 0 ? 4 : 0 }}
            />
          </div>
        ))}
      </div>
      <div className="flex min-w-[20rem] gap-2 px-2 pt-2 sm:gap-4">
        {pontos.map((p) => (
          <span key={p.rotulo} className="flex-1 text-center text-xs text-gray-600">
            {p.rotulo}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Barras horizontais (ranking / distribuição). */
export function BarrasHorizontais({ pontos }: { pontos: PontoGrafico[] }) {
  const maximo = Math.max(1, ...pontos.map((p) => p.valor));

  return (
    <ul aria-label={descricao(pontos)} className="space-y-3">
      {pontos.map((p, i) => (
        <li key={p.rotulo} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm sm:grid-cols-[9rem_1fr_2.5rem]">
          <span className="truncate text-right text-xs text-gray-700">{p.rotulo}</span>
          <div className="h-5 rounded bg-gray-100">
            <div
              className={`h-full rounded ${PALETA_BARRAS[i % PALETA_BARRAS.length]}`}
              style={{ width: `${(p.valor / maximo) * 100}%`, minWidth: p.valor > 0 ? 6 : 0 }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-800">{p.valor}</span>
        </li>
      ))}
    </ul>
  );
}
