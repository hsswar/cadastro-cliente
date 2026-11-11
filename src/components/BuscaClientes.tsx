import Form from "next/form";
import { IconeBusca } from "@/components/Icones";

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
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <IconeBusca className="text-base" />
        Buscar
      </button>
    </Form>
  );
}
