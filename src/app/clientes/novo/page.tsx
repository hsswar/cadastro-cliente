import type { Metadata } from "next";
import { BarraTitulo } from "@/components/BarraTitulo";
import { ClienteForm } from "@/components/ClienteForm";
import { criarCliente } from "../actions";

export const metadata: Metadata = { title: "Novo cliente | Cadastro de Clientes" };

export default function NovoClientePage() {
  return (
    <div className="space-y-4">
      <BarraTitulo titulo="Novo cliente" />
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <ClienteForm acao={criarCliente} textoBotao="Cadastrar" />
      </div>
    </div>
  );
}
