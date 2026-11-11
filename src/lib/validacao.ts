import { z } from "zod";

/** Data de hoje no formato AAAA-MM-DD, no fuso de São Paulo. */
export function hojeISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

export const clienteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  dataNascimento: z
    .string()
    .min(1, "Informe a data de nascimento.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.")
    .refine((v) => {
      const d = new Date(`${v}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Data inválida.")
    .refine((v) => v >= "1900-01-01", "A data deve ser a partir de 01/01/1900.")
    .refine((v) => v <= hojeISO(), "A data de nascimento não pode estar no futuro."),
  endereco: z
    .string()
    .trim()
    .min(1, "Informe o endereço.")
    .max(255, "O endereço deve ter no máximo 255 caracteres."),
});

export type ClienteInput = z.infer<typeof clienteSchema>;

export type CampoCliente = keyof ClienteInput;

export type EstadoFormulario = {
  erros?: Partial<Record<CampoCliente, string[]>>;
  mensagem?: string;
  valores?: Partial<Record<CampoCliente, string>>;
};

/** Converte "AAAA-MM-DD" em Date (meia-noite UTC), como o Postgres guarda DATE. */
export function paraDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** Converte Date (coluna DATE) de volta para "AAAA-MM-DD". */
export function paraISO(data: Date): string {
  return data.toISOString().slice(0, 10);
}

/** Formata Date (coluna DATE) como dd/mm/aaaa. */
export function formatarData(data: Date): string {
  const [ano, mes, dia] = paraISO(data).split("-");
  return `${dia}/${mes}/${ano}`;
}
