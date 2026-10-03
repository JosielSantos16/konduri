// Cálculos da Gestão Financeira, sem acesso ao Firestore.
//
//   FATURAMENTO          = soma das vendas válidas do período
//   CMV                  = soma do custo congelado de cada item vendido
//   MARGEM BRUTA         = faturamento - CMV
//   CUSTOS VARIÁVEIS     = despesas variáveis em R$ + % sobre a venda + comissões
//   MARGEM CONTRIBUIÇÃO  = faturamento - CMV - custos variáveis
//   PONTO DE EQUILÍBRIO  = custos fixos ÷ (margem de contribuição ÷ faturamento)
//   RESULTADO            = margem de contribuição - custos fixos
//
// Datas são strings 'AAAA-MM-DD' (data local); percentuais são retornados em
// pontos percentuais (45.09 = 45,09%) ou null quando não há faturamento.

import { paraDataISOLocal } from './dataLocal';
import {
  competenciaDe,
  diasNoMes,
  ocorrenciasDaCompetencia,
  FORMAS_CALCULO,
  TIPOS_DESPESA,
} from './despesas';

export const PERIODOS = {
  HOJE: 'HOJE',
  SETE_DIAS: 'SETE_DIAS',
  MES_ATUAL: 'MES_ATUAL',
  MES_ANTERIOR: 'MES_ANTERIOR',
  PERSONALIZADO: 'PERSONALIZADO',
};

export const STATUS_EQUILIBRIO = {
  ATINGIDO: 'ATINGIDO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  SEM_FATURAMENTO: 'SEM_FATURAMENTO', // ainda não dá para medir a margem
  INATINGIVEL: 'INATINGIVEL', // margem de contribuição <= 0: vender mais não cobre os fixos
};

function arredondar(valor, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

function percentualDe(parte, total) {
  return total > 0 ? arredondar((parte / total) * 100) : null;
}

function dataDeISO(dataISO) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function diasEntre(inicioISO, fimISO) {
  const umDia = 24 * 60 * 60 * 1000;
  return Math.round((dataDeISO(fimISO) - dataDeISO(inicioISO)) / umDia) + 1;
}

// Mês atual e mês anterior vão do dia 1 ao último dia, para que custos fixos e
// ponto de equilíbrio sejam os do mês inteiro (a meta é mensal). Hoje e 7 dias
// recebem a parte proporcional dos custos do mês.
export function intervaloDoPeriodo(periodo, hoje = new Date()) {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  switch (periodo) {
    case PERIODOS.HOJE:
      return { inicio: paraDataISOLocal(hoje), fim: paraDataISOLocal(hoje) };
    case PERIODOS.SETE_DIAS:
      return {
        inicio: paraDataISOLocal(new Date(ano, mes, hoje.getDate() - 6)),
        fim: paraDataISOLocal(hoje),
      };
    case PERIODOS.MES_ANTERIOR:
      return {
        inicio: paraDataISOLocal(new Date(ano, mes - 1, 1)),
        fim: paraDataISOLocal(new Date(ano, mes, 0)),
      };
    case PERIODOS.MES_ATUAL:
    default:
      return {
        inicio: paraDataISOLocal(new Date(ano, mes, 1)),
        fim: paraDataISOLocal(new Date(ano, mes + 1, 0)),
      };
  }
}

// Divide o intervalo pelos meses que ele toca, com quantos dias caem em cada um
export function mesesDoIntervalo(inicioISO, fimISO) {
  const meses = [];
  let cursor = dataDeISO(inicioISO);
  const fim = dataDeISO(fimISO);

  while (cursor <= fim) {
    const competencia = competenciaDe(cursor);
    const ultimoDiaDoMes = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const fimNoMes = ultimoDiaDoMes < fim ? ultimoDiaDoMes : fim;
    const dias = Math.round((fimNoMes - cursor) / (24 * 60 * 60 * 1000)) + 1;

    meses.push({ competencia, dias, fracao: dias / diasNoMes(competencia) });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return meses;
}

export function vendaValida(venda) {
  // Vendas antigas não têm status; só 'cancelada' (futuro) fica de fora
  return venda.status !== 'cancelada';
}

// Faturamento e CMV. O custo é lido item a item: um item sem custo registrado
// (vendas anteriores à Fase 1 ou produto sem custo) não entra no CMV, e o
// faturamento dele é informado à parte para a tela avisar.
export function resumirVendas(vendas) {
  const resumo = {
    faturamento: 0,
    quantidadeVendas: 0,
    porMetodo: {},
    porCompetencia: {},
    cmv: 0,
    faturamentoSemCusto: 0,
    vendasSemCusto: 0,
  };

  vendas.filter(vendaValida).forEach((venda) => {
    const total = Number(venda.total) || 0;
    const competencia = venda.data.slice(0, 7);

    resumo.faturamento += total;
    resumo.quantidadeVendas += 1;
    resumo.porMetodo[venda.metodo] = (resumo.porMetodo[venda.metodo] || 0) + total;
    resumo.porCompetencia[competencia] = (resumo.porCompetencia[competencia] || 0) + total;

    let vendaTemItemSemCusto = false;
    (venda.itens || []).forEach((item) => {
      if (item.custoTotal != null) {
        resumo.cmv += item.custoTotal;
      } else {
        vendaTemItemSemCusto = true;
        resumo.faturamentoSemCusto += (Number(item.price) || 0) * (item.qty || 0);
      }
    });
    if (vendaTemItemSemCusto) resumo.vendasSemCusto += 1;
  });

  resumo.faturamento = arredondar(resumo.faturamento);
  resumo.cmv = arredondar(resumo.cmv);
  resumo.faturamentoSemCusto = arredondar(resumo.faturamentoSemCusto);
  Object.keys(resumo.porMetodo).forEach((m) => { resumo.porMetodo[m] = arredondar(resumo.porMetodo[m]); });
  return resumo;
}

// Custos das despesas cadastradas no intervalo. Valores em R$ são mensais e
// entram proporcionais aos dias do intervalo em cada mês; percentuais incidem
// sobre o faturamento de cada mês.
export function custosDoIntervalo(despesas, inicioISO, fimISO, faturamentoPorCompetencia = {}) {
  const custos = { fixos: 0, variaveisValor: 0, variaveisPercentual: 0 };

  mesesDoIntervalo(inicioISO, fimISO).forEach(({ competencia, fracao }) => {
    const faturamentoDoMes = faturamentoPorCompetencia[competencia] || 0;

    ocorrenciasDaCompetencia(despesas, competencia).forEach(({ despesa, valor, percentual }) => {
      if (despesa.forma === FORMAS_CALCULO.PERCENTUAL) {
        custos.variaveisPercentual += (faturamentoDoMes * (percentual || 0)) / 100;
      } else if (despesa.tipo === TIPOS_DESPESA.FIXO) {
        custos.fixos += valor * fracao;
      } else {
        custos.variaveisValor += valor * fracao;
      }
    });
  });

  return {
    fixos: arredondar(custos.fixos),
    variaveisValor: arredondar(custos.variaveisValor),
    variaveisPercentual: arredondar(custos.variaveisPercentual),
  };
}

export function calcularPontoEquilibrio({ faturamento, margemContribuicao, custosFixos, inicio, fim, hoje }) {
  const base = { valor: null, progresso: null, faltam: null, excedente: null, diasRestantes: null, metaDiaria: null };

  if (custosFixos <= 0) {
    return { ...base, status: STATUS_EQUILIBRIO.ATINGIDO, valor: 0, progresso: 100, faltam: 0, excedente: faturamento };
  }
  if (faturamento <= 0) return { ...base, status: STATUS_EQUILIBRIO.SEM_FATURAMENTO };
  if (margemContribuicao <= 0) return { ...base, status: STATUS_EQUILIBRIO.INATINGIVEL };

  const mcFracao = margemContribuicao / faturamento;
  const valor = arredondar(custosFixos / mcFracao);
  const faltam = arredondar(Math.max(0, valor - faturamento));
  const atingido = faltam === 0;

  // "Quanto preciso vender por dia": só quando hoje está dentro do período
  let diasRestantes = null;
  let metaDiaria = null;
  if (hoje && hoje >= inicio && hoje <= fim) {
    diasRestantes = diasEntre(hoje, fim);
    metaDiaria = atingido ? 0 : arredondar(faltam / diasRestantes);
  }

  return {
    status: atingido ? STATUS_EQUILIBRIO.ATINGIDO : STATUS_EQUILIBRIO.EM_ANDAMENTO,
    valor,
    progresso: arredondar((faturamento / valor) * 100, 1),
    faltam,
    excedente: arredondar(Math.max(0, faturamento - valor)),
    diasRestantes,
    metaDiaria,
  };
}

export function calcularIndicadores({ vendas, despesas, comissoes, inicio, fim, hoje = paraDataISOLocal() }) {
  const resumoVendas = resumirVendas(vendas);
  const { faturamento, cmv } = resumoVendas;

  const custos = custosDoIntervalo(despesas, inicio, fim, resumoVendas.porCompetencia);
  const totalComissoes = arredondar(comissoes.reduce((soma, c) => soma + (c.valorComissao || 0), 0));
  const custosVariaveis = arredondar(custos.variaveisValor + custos.variaveisPercentual + totalComissoes);

  const margemBruta = arredondar(faturamento - cmv);
  const margemContribuicao = arredondar(margemBruta - custosVariaveis);
  const resultado = arredondar(margemContribuicao - custos.fixos);

  return {
    periodo: { inicio, fim, dias: diasEntre(inicio, fim) },
    faturamento,
    quantidadeVendas: resumoVendas.quantidadeVendas,
    ticketMedio: resumoVendas.quantidadeVendas > 0 ? arredondar(faturamento / resumoVendas.quantidadeVendas) : null,
    porMetodo: resumoVendas.porMetodo,

    cmv,
    cmvPercentual: percentualDe(cmv, faturamento),
    margemBruta,
    margemBrutaPercentual: percentualDe(margemBruta, faturamento),

    custosVariaveis: {
      total: custosVariaveis,
      despesasEmValor: custos.variaveisValor,
      despesasPercentuais: custos.variaveisPercentual,
      comissoes: totalComissoes,
    },
    margemContribuicao,
    margemContribuicaoPercentual: percentualDe(margemContribuicao, faturamento),

    custosFixos: custos.fixos,
    resultado,
    margemOperacionalPercentual: percentualDe(resultado, faturamento),

    pontoEquilibrio: calcularPontoEquilibrio({
      faturamento,
      margemContribuicao,
      custosFixos: custos.fixos,
      inicio,
      fim,
      hoje,
    }),

    // Para o aviso de "vendas sem custo registrado"
    cobertura: {
      completa: resumoVendas.vendasSemCusto === 0,
      vendasSemCusto: resumoVendas.vendasSemCusto,
      faturamentoSemCusto: resumoVendas.faturamentoSemCusto,
    },
  };
}
