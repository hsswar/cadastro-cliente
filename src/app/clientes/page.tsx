import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BarraTitulo } from "@/components/BarraTitulo";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { BuscaClientes } from "@/components/BuscaClientes";
import { IconeMais } from "@/components/Icones";
import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/validacao";

export const metadata: Metadata = { title: "Clientes | Cadastro de Clientes" };

const MENSAGENS_SUCESSO: Record<string, string> = {
  criado: "Cliente cadastrado com sucesso.",
  atualizado: "Cliente atualizado com sucesso.",
};

export default function ClientesPage(props: PageProps<"/clientes">) {
  return (
    <div className="space-y-4">
      <BarraTitulo titulo="Clientes" />

      <Suspense fallback={<p className="p-4 text-sm text-gray-600">Carregando clientes...</p>}>
        <ConteudoClientes searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function ConteudoClientes({
  searchParams,
}: {
  searchParams: PageProps<"/clientes">["searchParams"];
}) {
  const params = await searchParams;
  const termo = typeof params.q === "string" ? params.q.trim() : "";
  const sucesso = typeof params.sucesso === "string" ? MENSAGENS_SUCESSO[params.sucesso] : undefined;

  const clientes = await prisma.cliente.findMany({
    where: termo ? { nome: { contains: termo, mode: "insensitive" } } : undefined,
    orderBy: { nome: "asc" },
  });

  return (
    <div className="space-y-4">
      {sucesso && (
        <p role="status" className="rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">
          {sucesso}
        </p>
      )}

      {/* Barra de ações: busca + novo cliente */}
      <section
        aria-label="Busca e ações"
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="sm:w-full sm:max-w-md">
          <BuscaClientes termo={termo} />
        </div>
        <Link
          href="/clientes/novo"
          className="flex items-center justify-center gap-1.5 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <IconeMais className="text-base" />
          Novo cliente
        </Link>
      </section>

      {clientes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          {termo ? (
            <>
              Nenhum cliente encontrado para “{termo}”.{" "}
              <Link href="/clientes" className="font-medium text-brand-700 underline">
                Limpar busca
              </Link>
            </>
          ) : (
            "Nenhum cliente cadastrado ainda."
          )}
        </div>
      ) : (
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <p className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-800">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
            {termo && <span className="font-normal text-gray-600"> encontrados para “{termo}”</span>}
          </p>

          {/* Celular: cartões */}
          <ul className="divide-y divide-gray-100 md:hidden">
            {clientes.map((c) => (
              <li key={c.id} className="p-4">
                <p className="font-medium">{c.nome}</p>
                <p className="mt-1 text-sm text-gray-600">Nascimento: {formatarData(c.dataNascimento)}</p>
                <p className="break-words text-sm text-gray-600">{c.endereco}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <LinkEditar id={c.id} />
                  <BotaoExcluir id={c.id} nome={c.nome} />
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-50 text-left text-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Nome</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Data de nascimento</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Endereço</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes.map((c) => (
                  <tr key={c.id} className="align-top hover:bg-brand-50/50">
                    <td className="px-4 py-3 font-medium">{c.nome}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatarData(c.dataNascimento)}</td>
                    <td className="px-4 py-3 text-gray-700">{c.endereco}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <LinkEditar id={c.id} />
                        <BotaoExcluir id={c.id} nome={c.nome} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function LinkEditar({ id }: { id: string }) {
  return (
    <Link
      href={`/clientes/${id}/editar`}
      className="rounded-md border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-50"
    >
      Editar
    </Link>
  );
}
