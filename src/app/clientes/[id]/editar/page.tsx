import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BarraTitulo } from "@/components/BarraTitulo";
import { ClienteForm } from "@/components/ClienteForm";
import { prisma } from "@/lib/prisma";
import { paraISO } from "@/lib/validacao";
import { atualizarCliente } from "../../actions";

export const metadata: Metadata = { title: "Editar cliente | Cadastro de Clientes" };

export default function EditarClientePage(props: PageProps<"/clientes/[id]/editar">) {
  return (
    <div className="space-y-4">
      <BarraTitulo titulo="Editar cliente" />
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <Suspense fallback={<p className="text-sm text-gray-600">Carregando...</p>}>
          <FormularioEdicao params={props.params} />
        </Suspense>
      </div>
    </div>
  );
}

async function FormularioEdicao({
  params,
}: {
  params: PageProps<"/clientes/[id]/editar">["params"];
}) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) notFound();

  return (
    <ClienteForm
      acao={atualizarCliente.bind(null, cliente.id)}
      textoBotao="Salvar alterações"
      valoresIniciais={{
        nome: cliente.nome,
        dataNascimento: paraISO(cliente.dataNascimento),
        endereco: cliente.endereco,
      }}
    />
  );
}
