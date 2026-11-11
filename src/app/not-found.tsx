import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-xl space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-gray-600">O cliente ou a página que você procura não existe.</p>
      <Link href="/clientes" className="inline-block rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
        Voltar para a lista
      </Link>
    </div>
  );
}
