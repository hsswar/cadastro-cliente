import type { Metadata } from "next";
import { ClienteForm } from "@/components/ClienteForm";
import { criarCliente } from "../actions";

export const metadata: Metadata = { title: "Novo cliente | Cadastro de Clientes" };

export default function NovoClientePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Novo cliente</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <ClienteForm acao={criarCliente} textoBotao="Cadastrar" />
      </div>
    </div>
  );
}
