"use client";

export default function ErroClientes({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-xl space-y-4 rounded-lg border border-red-200 bg-white p-6 text-center">
      <h2 className="text-lg font-semibold">Não foi possível carregar os dados</h2>
      <p className="text-sm text-gray-600">
        Verifique a conexão com o banco de dados e tente novamente.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Tentar novamente
      </button>
    </div>
  );
}
