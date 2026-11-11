import Link from "next/link";
import { Suspense } from "react";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { BuscaClientes } from "@/components/BuscaClientes";
import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/validacao";

const MENSAGENS_SUCESSO: Record<string, string> = {
  criado: "Cliente cadastrado com sucesso.",
  atualizado: "Cliente atualizado com sucesso.",
};

export default function ClientesPage(props: PageProps<"/clientes">) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Link
          href="/clientes/novo"
          className="rounded-md bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
        >
          Novo cliente
        </Link>
      </div>

      <Suspense fallback={<p className="text-sm text-gray-500">Carregando clientes...</p>}>
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
        <p role="status" className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {sucesso}
        </p>
      )}

      <BuscaClientes termo={termo} />

      {clientes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          {termo ? (
            <>
              Nenhum cliente encontrado para “{termo}”.{" "}
              <Link href="/clientes" className="font-medium text-red-700 underline">
                Limpar busca
              </Link>
            </>
          ) : (
            "Nenhum cliente cadastrado ainda."
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
            {termo && <> encontrados para “{termo}”</>}
          </p>

          {/* Celular: cartões */}
          <ul className="space-y-3 md:hidden">
            {clientes.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="font-medium">{c.nome}</p>
                <p className="mt-1 text-sm text-gray-600">Nascimento: {formatarData(c.dataNascimento)}</p>
                <p className="text-sm text-gray-600 break-words">{c.endereco}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <LinkEditar id={c.id} />
                  <BotaoExcluir id={c.id} nome={c.nome} />
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm md:block">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Nome</th>
                  <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">Data de nascimento</th>
                  <th scope="col" className="px-4 py-3 font-medium">Endereço</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="px-4 py-3 font-medium">{c.nome}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatarData(c.dataNascimento)}</td>
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
        </>
      )}
    </div>
  );
}

function LinkEditar({ id }: { id: string }) {
  return (
    <Link
      href={`/clientes/${id}/editar`}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Editar
    </Link>
  );
}
