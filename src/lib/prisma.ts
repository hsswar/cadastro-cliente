import { PrismaClient } from "@prisma/client";

// Reaproveita a mesma instância durante o hot reload em desenvolvimento,
// evitando abrir uma nova conexão a cada alteração de arquivo.
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalParaPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
