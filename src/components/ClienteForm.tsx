"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import {
  hojeISO,
  type CampoCliente,
  type EstadoFormulario,
} from "@/lib/validacao";

type Props = {
  acao: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  valoresIniciais?: Partial<Record<CampoCliente, string>>;
  textoBotao: string;
};

const estadoInicial: EstadoFormulario = {};

export function ClienteForm({ acao, valoresIniciais = {}, textoBotao }: Props) {
  const [estado, formAction, pendente] = useActionState(acao, estadoInicial);
  const campoData = useRef<HTMLInputElement>(null);

  // Impede escolher datas futuras no seletor (o servidor valida de novo).
  useEffect(() => {
    if (campoData.current) campoData.current.max = hojeISO();
  }, []);

  const valores = estado.valores ?? valoresIniciais;
  const erro = (campo: CampoCliente) => estado.erros?.[campo]?.[0];

  return (
    <form action={formAction} noValidate className="space-y-5">
      {estado.mensagem && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {estado.mensagem}
        </p>
      )}

      <Campo id="nome" rotulo="Nome" erro={erro("nome")}>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          defaultValue={valores.nome}
          key={`nome-${valores.nome}`}
          aria-invalid={!!erro("nome")}
          aria-describedby={erro("nome") ? "nome-erro" : undefined}
          className={classeInput(!!erro("nome"))}
        />
      </Campo>

      <Campo id="dataNascimento" rotulo="Data de nascimento" erro={erro("dataNascimento")}>
        <input
          ref={campoData}
          id="dataNascimento"
          name="dataNascimento"
          type="date"
          required
          min="1900-01-01"
          defaultValue={valores.dataNascimento}
          key={`data-${valores.dataNascimento}`}
          aria-invalid={!!erro("dataNascimento")}
          aria-describedby={erro("dataNascimento") ? "dataNascimento-erro" : undefined}
          className={classeInput(!!erro("dataNascimento"))}
        />
      </Campo>

      <Campo id="endereco" rotulo="Endereço" erro={erro("endereco")}>
        <input
          id="endereco"
          name="endereco"
          type="text"
          required
          maxLength={255}
          autoComplete="street-address"
          placeholder="Rua, número, bairro, cidade - UF"
          defaultValue={valores.endereco}
          key={`endereco-${valores.endereco}`}
          aria-invalid={!!erro("endereco")}
          aria-describedby={erro("endereco") ? "endereco-erro" : undefined}
          className={classeInput(!!erro("endereco"))}
        />
      </Campo>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href="/clientes"
          className="rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pendente}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pendente ? "Salvando..." : textoBotao}
        </button>
      </div>
    </form>
  );
}

function Campo({
  id,
  rotulo,
  erro,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-800">
        {rotulo} <span className="text-red-600" aria-hidden>*</span>
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

function classeInput(comErro: boolean) {
  return [
    "block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2",
    comErro
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-red-500 focus:ring-red-200",
  ].join(" ");
}
