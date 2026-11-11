"use client";

import { useState, useTransition } from "react";
import { excluirCliente } from "@/app/clientes/actions";

export function BotaoExcluir({ id, nome }: { id: string; nome: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string>();
  const [pendente, iniciarTransicao] = useTransition();

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Excluir
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-700">Excluir {nome}?</span>
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciarTransicao(async () => {
            const resultado = await excluirCliente(id);
            if (resultado.erro) setErro(resultado.erro);
          })
        }
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pendente ? "Excluindo..." : "Sim, excluir"}
      </button>
      <button
        type="button"
        disabled={pendente}
        onClick={() => {
          setConfirmando(false);
          setErro(undefined);
        }}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancelar
      </button>
      {erro && <p className="w-full text-sm text-red-700">{erro}</p>}
    </div>
  );
}
