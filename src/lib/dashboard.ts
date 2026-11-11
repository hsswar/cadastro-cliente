import { prisma } from "@/lib/prisma";

// Todas as datas aqui são strings "AAAA-MM-DD" no fuso de São Paulo.

export type Periodo = { de: string; ate: string };

export type ClienteResumo = {
  nome: string;
  dataNascimento: string; // AAAA-MM-DD
  criadoEm: string; // AAAA-MM-DD (fuso de São Paulo)
};

export type PontoGrafico = { rotulo: string; valor: number };

export type Aniversariante = {
  nome: string;
  dia: string; // dd/mm
  dias: number; // faltam N dias (0 = hoje)
  idade: number; // idade que vai completar
};

export type DadosDashboard = {
  total: number;
  novosPeriodo: number;
  aniversariantesPeriodo: number;
  idadeMedia: number | null;
  indicadores: {
    novosHoje: number;
    novos7dias: number;
    novosMes: number;
    aniversariantesHoje: number;
    aniversariantesMes: number;
    menoresDeIdade: number;
  };
  proximos: Aniversariante[];
  evolucao: PontoGrafico[];
  faixas: PontoGrafico[];
};

const DIA_MS = 86_400_000;
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const toISO = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const partes = (iso: string) => iso.split("-").map(Number) as [number, number, number];

export function isoValido(valor: unknown): valor is string {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const d = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && toISO(d.getTime()) === valor;
}

export function somarDias(iso: string, dias: number): string {
  return toISO(Date.parse(`${iso}T00:00:00Z`) + dias * DIA_MS);
}

export function isoParaBR(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

export function formatarPeriodo({ de, ate }: Periodo): string {
  return de === ate ? isoParaBR(de) : `${isoParaBR(de)} a ${isoParaBR(ate)}`;
}

/** Converte um instante (timestamp do banco) para a data em São Paulo (UTC-3). */
export function dataSP(instante: Date): string {
  return toISO(instante.getTime() - 3 * 3_600_000);
}

export type AtalhoPeriodo = "hoje" | "7dias" | "mes" | "mes-anterior";

export function atalhosPeriodo(hoje: string): Record<AtalhoPeriodo, Periodo> {
  const [ano, mes] = partes(hoje);
  return {
    hoje: { de: hoje, ate: hoje },
    "7dias": { de: somarDias(hoje, -6), ate: hoje },
    mes: { de: toISO(Date.UTC(ano, mes - 1, 1)), ate: hoje },
    "mes-anterior": {
      de: toISO(Date.UTC(ano, mes - 2, 1)),
      ate: toISO(Date.UTC(ano, mes - 1, 0)),
    },
  };
}

export function lerPeriodo(
  params: Record<string, string | string[] | undefined>,
  hoje: string,
): Periodo {
  const { de, ate } = params;
  if (!isoValido(de) || !isoValido(ate)) return { de: hoje, ate: hoje };
  return de <= ate ? { de, ate } : { de: ate, ate: de };
}

export function calcularIdade(nascimento: string, referencia: string): number {
  const [na, nm, nd] = partes(nascimento);
  const [ra, rm, rd] = partes(referencia);
  return ra - na - (rm < nm || (rm === nm && rd < nd) ? 1 : 0);
}

/** O aniversário (mês/dia) cai dentro do período? 29/02 vira 01/03 em anos não bissextos. */
export function aniversarioNoPeriodo(nascimento: string, { de, ate }: Periodo): boolean {
  const [anoNasc, mes, dia] = partes(nascimento);
  for (let ano = Math.max(partes(de)[0], anoNasc + 1); ano <= partes(ate)[0]; ano++) {
    const data = toISO(Date.UTC(ano, mes - 1, dia));
    if (data >= de && data <= ate) return true;
  }
  return false;
}

export function proximosAniversariantes(
  clientes: ClienteResumo[],
  hoje: string,
  limite = 5,
  janelaDias = 30,
): Aniversariante[] {
  const [anoHoje] = partes(hoje);
  const lista: Aniversariante[] = [];

  for (const c of clientes) {
    const [anoNasc, mes, dia] = partes(c.dataNascimento);
    let ano = anoHoje;
    let data = toISO(Date.UTC(ano, mes - 1, dia));
    if (data < hoje) {
      ano += 1;
      data = toISO(Date.UTC(ano, mes - 1, dia));
    }
    const dias = Math.round((Date.parse(data) - Date.parse(hoje)) / DIA_MS);
    if (dias <= janelaDias) {
      lista.push({
        nome: c.nome,
        dia: `${data.slice(8, 10)}/${data.slice(5, 7)}`,
        dias,
        idade: ano - anoNasc,
      });
    }
  }

  return lista.sort((a, b) => a.dias - b.dias || a.nome.localeCompare(b.nome, "pt-BR")).slice(0, limite);
}

export function calcularDashboard(
  clientes: ClienteResumo[],
  periodo: Periodo,
  hoje: string,
): DadosDashboard {
  const atalhos = atalhosPeriodo(hoje);
  const [anoHoje, mesHoje] = partes(hoje);
  const mesCompleto: Periodo = {
    de: atalhos.mes.de,
    ate: toISO(Date.UTC(anoHoje, mesHoje, 0)),
  };

  const criadosEm = (p: Periodo) =>
    clientes.filter((c) => c.criadoEm >= p.de && c.criadoEm <= p.ate).length;
  const aniversariantesEm = (p: Periodo) =>
    clientes.filter((c) => aniversarioNoPeriodo(c.dataNascimento, p)).length;

  const idades = clientes.map((c) => calcularIdade(c.dataNascimento, hoje));
  const idadeMedia = idades.length ? idades.reduce((s, i) => s + i, 0) / idades.length : null;

  const evolucao: PontoGrafico[] = [];
  for (let i = 6; i >= 0; i--) {
    const inicio = new Date(Date.UTC(anoHoje, mesHoje - 1 - i, 1));
    const chave = toISO(inicio.getTime()).slice(0, 7);
    evolucao.push({
      rotulo: `${MESES[inicio.getUTCMonth()]}/${String(inicio.getUTCFullYear()).slice(2)}`,
      valor: clientes.filter((c) => c.criadoEm.startsWith(chave)).length,
    });
  }

  const faixas: PontoGrafico[] = [
    { rotulo: "Até 17 anos", valor: idades.filter((i) => i <= 17).length },
    { rotulo: "18 a 29 anos", valor: idades.filter((i) => i >= 18 && i <= 29).length },
    { rotulo: "30 a 44 anos", valor: idades.filter((i) => i >= 30 && i <= 44).length },
    { rotulo: "45 a 59 anos", valor: idades.filter((i) => i >= 45 && i <= 59).length },
    { rotulo: "60 anos ou mais", valor: idades.filter((i) => i >= 60).length },
  ];

  return {
    total: clientes.length,
    novosPeriodo: criadosEm(periodo),
    aniversariantesPeriodo: aniversariantesEm(periodo),
    idadeMedia,
    indicadores: {
      novosHoje: criadosEm(atalhos.hoje),
      novos7dias: criadosEm(atalhos["7dias"]),
      novosMes: criadosEm(atalhos.mes),
      aniversariantesHoje: aniversariantesEm(atalhos.hoje),
      aniversariantesMes: aniversariantesEm(mesCompleto),
      menoresDeIdade: idades.filter((i) => i < 18).length,
    },
    proximos: proximosAniversariantes(clientes, hoje),
    evolucao,
    faixas,
  };
}

export async function carregarDashboard(periodo: Periodo, hoje: string): Promise<DadosDashboard> {
  // Busca só as colunas necessárias e agrega em memória. Para algumas milhares de
  // linhas é instantâneo; se a base crescer muito, trocar por consultas agregadas (SQL).
  const linhas = await prisma.cliente.findMany({
    select: { nome: true, dataNascimento: true, criadoEm: true },
  });

  return calcularDashboard(
    linhas.map((l) => ({
      nome: l.nome,
      dataNascimento: l.dataNascimento.toISOString().slice(0, 10),
      criadoEm: dataSP(l.criadoEm),
    })),
    periodo,
    hoje,
  );
}
