"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  clienteSchema,
  paraDate,
  type EstadoFormulario,
} from "@/lib/validacao";

function lerFormulario(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? ""),
    dataNascimento: String(formData.get("dataNascimento") ?? ""),
    endereco: String(formData.get("endereco") ?? ""),
  };
}

export async function criarCliente(
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const valores = lerFormulario(formData);
  const resultado = clienteSchema.safeParse(valores);

  if (!resultado.success) {
    return { erros: z.flattenError(resultado.error).fieldErrors, valores };
  }

  try {
    await prisma.cliente.create({
      data: {
        nome: resultado.data.nome,
        dataNascimento: paraDate(resultado.data.dataNascimento),
        endereco: resultado.data.endereco,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro);
    return { mensagem: "Não foi possível salvar o cliente. Tente novamente.", valores };
  }

  revalidatePath("/clientes");
  redirect("/clientes?sucesso=criado");
}

export async function atualizarCliente(
  id: string,
  _estado: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const valores = lerFormulario(formData);
  const resultado = clienteSchema.safeParse(valores);

  if (!resultado.success) {
    return { erros: z.flattenError(resultado.error).fieldErrors, valores };
  }

  try {
    const { count } = await prisma.cliente.updateMany({
      where: { id },
      data: {
        nome: resultado.data.nome,
        dataNascimento: paraDate(resultado.data.dataNascimento),
        endereco: resultado.data.endereco,
      },
    });
    if (count === 0) {
      return { mensagem: "Este cliente não existe mais.", valores };
    }
  } catch (erro) {
    console.error("Erro ao atualizar cliente:", erro);
    return { mensagem: "Não foi possível salvar as alterações. Tente novamente.", valores };
  }

  revalidatePath("/clientes");
  redirect("/clientes?sucesso=atualizado");
}

export async function excluirCliente(id: string): Promise<{ erro?: string }> {
  try {
    await prisma.cliente.deleteMany({ where: { id } });
  } catch (erro) {
    console.error("Erro ao excluir cliente:", erro);
    return { erro: "Não foi possível excluir o cliente. Tente novamente." };
  }

  revalidatePath("/clientes");
  return {};
}
