import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { BarraTitulo } from "@/components/BarraTitulo";
import { CartaoResumo } from "@/components/dashboard/CartaoResumo";
import { BarrasHorizontais, BarrasVerticais } from "@/components/dashboard/Graficos";
import {
  IconeBusca,
  IconeCalendario,
  IconeCheck,
  IconeGrafico,
  IconePresente,
  IconeRelogio,
  IconeUsuarioMais,
  IconeUsuarios,
} from "@/components/Icones";
import {
  atalhosPeriodo,
  carregarDashboard,
  formatarPeriodo,
  isoParaBR,
  lerPeriodo,
  type AtalhoPeriodo,
} from "@/lib/dashboard";
import { hojeISO } from "@/lib/validacao";

export const metadata: Metadata = { title: "Dashboard | Cadastro de Clientes" };

const ATALHOS: { id: AtalhoPeriodo; rotulo: string }[] = [
  { id: "hoje", rotulo: "Hoje" },
  { id: "7dias", rotulo: "7 dias" },
  { id: "mes", rotulo: "Este mês" },
  { id: "mes-anterior", rotulo: "Mês anterior" },
];

const numero = new Intl.NumberFormat("pt-BR");
const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function DashboardPage(props: PageProps<"/">) {
  return (
    <div className="space-y-4">
      <BarraTitulo titulo="Dashboard">
        <Suspense fallback={null}>
          <AtualizadoEm />
        </Suspense>
      </BarraTitulo>

      <Suspense fallback={<p className="p-4 text-sm text-gray-600">Carregando indicadores...</p>}>
        <PainelDashboard searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function AtualizadoEm() {
  await connection(); // a data muda a cada acesso
  return (
    <>
      <span className="flex items-center gap-1.5">
        <IconeCalendario className="text-sm" />
        {isoParaBR(hojeISO())}
      </span>
      <span className="flex items-center gap-1.5">
        <IconeCheck className="text-sm" />
        Atualizado
      </span>
    </>
  );
}

async function PainelDashboard({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const params = await searchParams;
  const hoje = hojeISO();
  const periodo = lerPeriodo(params, hoje);
  const atalhos = atalhosPeriodo(hoje);
  const dados = await carregarDashboard(periodo, hoje);
  const dataBR = isoParaBR(hoje);
  const textoPeriodo = formatarPeriodo(periodo);
  const { indicadores } = dados;

  return (
    <div className="space-y-4">
      {/* Filtro de período */}
      <section
        aria-label="Filtro de período"
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap gap-1 rounded-md bg-gray-100 p-1">
          {ATALHOS.map(({ id, rotulo }) => {
            const { de, ate } = atalhos[id];
            const ativo = periodo.de === de && periodo.ate === ate;
            return (
              <Link
                key={id}
                href={`/?de=${de}&ate=${ate}`}
                aria-current={ativo ? "true" : undefined}
                className={`rounded px-3 py-1.5 text-xs font-semibold ${
                  ativo ? "bg-brand-600 text-white" : "text-gray-700 hover:bg-white"
                }`}
              >
                {rotulo}
              </Link>
            );
          })}
        </div>

        <Form action="/" className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <label htmlFor="de">De</label>
          <input
            id="de"
            name="de"
            type="date"
            required
            defaultValue={periodo.de}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-gray-900"
          />
          <label htmlFor="ate">Até</label>
          <input
            id="ate"
            name="ate"
            type="date"
            required
            defaultValue={periodo.ate}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-gray-900"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md bg-brand-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-800"
          >
            <IconeBusca className="text-sm" />
            Analisar
          </button>
        </Form>
      </section>

      {/* Cartões principais */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoResumo
          categoria="Carteira"
          titulo="Total de clientes"
          valor={numero.format(dados.total)}
          rodape="Todos os cadastrados"
          data={dataBR}
          icone={<IconeUsuarios />}
        />
        <CartaoResumo
          categoria="Cadastros"
          titulo="Novos clientes"
          valor={numero.format(dados.novosPeriodo)}
          rodape="No período"
          data={textoPeriodo}
          icone={<IconeUsuarioMais />}
          destaque
        />
        <CartaoResumo
          categoria="Relacionamento"
          titulo="Aniversariantes"
          valor={numero.format(dados.aniversariantesPeriodo)}
          rodape="No período"
          data={textoPeriodo}
          icone={<IconePresente />}
        />
        <CartaoResumo
          categoria="Perfil"
          titulo="Idade média"
          valor={dados.idadeMedia === null ? "—" : `${decimal.format(dados.idadeMedia)} anos`}
          rodape="Todos os clientes"
          data={dataBR}
          icone={<IconeRelogio />}
        />
      </div>

      {/* Indicadores e aniversariantes */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Painel titulo="Indicadores" icone={<IconeGrafico />}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
            <Indicador rotulo="Novos hoje" valor={indicadores.novosHoje} />
            <Indicador rotulo="Novos em 7 dias" valor={indicadores.novos7dias} />
            <Indicador rotulo="Novos no mês" valor={indicadores.novosMes} />
            <Indicador rotulo="Aniversariantes hoje" valor={indicadores.aniversariantesHoje} />
            <Indicador rotulo="Aniversariantes no mês" valor={indicadores.aniversariantesMes} />
            <Indicador rotulo="Menores de 18 anos" valor={indicadores.menoresDeIdade} />
          </dl>
        </Painel>

        <Painel titulo="Próximos aniversariantes · 30 dias" icone={<IconePresente />}>
          {dados.proximos.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-600">
              Nenhum aniversário nos próximos 30 dias.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {dados.proximos.map((a) => (
                <li key={`${a.nome}-${a.dia}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0 truncate font-medium">{a.nome}</span>
                  <span className="shrink-0 text-right text-xs text-gray-600">
                    {a.dias === 0 ? (
                      <strong className="text-brand-700">Hoje</strong>
                    ) : (
                      `${a.dia} · em ${a.dias} ${a.dias === 1 ? "dia" : "dias"}`
                    )}
                    {" · "}
                    {a.idade} anos
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Painel>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Painel titulo="Novos cadastros · Últimos 7 meses" centralizado>
          <BarrasVerticais pontos={dados.evolucao} />
        </Painel>
        <Painel titulo="Clientes por faixa etária" centralizado>
          {dados.total === 0 ? (
            <p className="py-10 text-center text-sm text-gray-600">Cadastre clientes para ver o gráfico.</p>
          ) : (
            <BarrasHorizontais pontos={dados.faixas} />
          )}
        </Painel>
      </div>
    </div>
  );
}

function Painel({
  titulo,
  icone,
  centralizado,
  children,
}: {
  titulo: string;
  icone?: ReactNode;
  centralizado?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <h2
        className={`mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-semibold text-gray-800 ${
          centralizado ? "justify-center" : "justify-center sm:justify-start"
        }`}
      >
        {icone && <span className="text-base text-brand-700">{icone}</span>}
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Indicador({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="text-center">
      <dt className="text-xs text-gray-600">{rotulo}</dt>
      <dd className="mt-2 text-xl font-bold text-gray-900">{numero.format(valor)}</dd>
    </div>
  );
}
