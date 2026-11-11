import Form from "next/form";

export function BuscaClientes({ termo }: { termo: string }) {
  return (
    <Form action="/clientes" role="search" className="flex gap-2">
      <label htmlFor="q" className="sr-only">
        Buscar por nome
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={termo}
        placeholder="Buscar por nome..."
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
      />
      <button
        type="submit"
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Buscar
      </button>
    </Form>
  );
}
