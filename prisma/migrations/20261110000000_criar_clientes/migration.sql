-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "endereco" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clientes_nome_idx" ON "clientes"("nome");

