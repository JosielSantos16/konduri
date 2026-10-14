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
  deslocarCompetencia,
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
    // Cortesia de entrada (R$ 0) não é venda: não pode baixar o ticket médio
    if (venda.metodo !== 'cortesia') resumo.quantidadeVendas += 1;
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

// Intervalo de um mês inteiro a partir da competência 'AAAA-MM'
export function intervaloDaCompetencia(competencia) {
  return {
    inicio: `${competencia}-01`,
    fim: `${competencia}-${String(diasNoMes(competencia)).padStart(2, '0')}`,
  };
}

// Intervalos da comparação mensal (mês de referência x mês anterior).
// Mês fechado: os dois meses inteiros. Mês em andamento (hoje dentro dele): do
// dia 1 até hoje nos dois meses, para comparar o mesmo número de dias; no mês
// anterior o recorte para no último dia dele (ex.: 31/03 x 28/02). Os custos
// fixos entram proporcionais aos dias do recorte nos dois lados
// (custosDoIntervalo), então o Resultado também fica comparável.
export function intervalosDaComparacao(competencia, hojeISO = paraDataISOLocal()) {
  const competenciaAnterior = deslocarCompetencia(competencia, -1);

  if (hojeISO.slice(0, 7) !== competencia) {
    return {
      competenciaAnterior,
      emAndamento: false,
      atual: intervaloDaCompetencia(competencia),
      anterior: intervaloDaCompetencia(competenciaAnterior),
    };
  }

  const diaDeHoje = Number(hojeISO.slice(8, 10));
  const ultimoDiaAnterior = Math.min(diaDeHoje, diasNoMes(competenciaAnterior));

  return {
    competenciaAnterior,
    emAndamento: true,
    atual: { inicio: `${competencia}-01`, fim: hojeISO },
    anterior: {
      inicio: `${competenciaAnterior}-01`,
      fim: `${competenciaAnterior}-${String(ultimoDiaAnterior).padStart(2, '0')}`,
    },
  };
}

// Margem de um produto pelo preço e custo atuais (alerta de margem baixa).
// null quando falta preço ou custo.
export function margemDoProduto(preco, custo) {
  if (!(preco > 0) || !(custo > 0)) return null;
  return arredondar(((preco - custo) / preco) * 100);
}

export const ORDENACOES_RENTABILIDADE = {
  MAIS_RENTAVEIS: 'MAIS_RENTAVEIS',
  MENOR_MARGEM: 'MENOR_MARGEM',
  MAIS_VENDIDOS: 'MAIS_VENDIDOS',
};

// Quantidade, receita, CMV, lucro bruto e margem de cada produto vendido no
// período, a partir do custo congelado nos itens. Se algum item do produto foi
// vendido sem custo registrado, CMV, lucro e margem ficam null (custoCompleto = false).
export function rentabilidadePorProduto(vendas) {
  const porProduto = {};

  vendas.filter(vendaValida).forEach((venda) => {
    (venda.itens || []).forEach((item) => {
      // Entradas têm relatório próprio; aqui só produtos do catálogo
      if (item.tipo === 'entrada') return;
      const chave = item.id || item.title;
      if (!porProduto[chave]) {
        porProduto[chave] = { produtoId: item.id || null, nome: item.title, quantidade: 0, receita: 0, cmv: 0, temItemSemCusto: false };
      }
      const produto = porProduto[chave];
      produto.quantidade += item.qty || 0;
      produto.receita += (Number(item.price) || 0) * (item.qty || 0);
      if (item.custoTotal != null) produto.cmv += item.custoTotal;
      else produto.temItemSemCusto = true;
    });
  });

  return Object.values(porProduto).map(({ temItemSemCusto, ...produto }) => {
    const receita = arredondar(produto.receita);
    if (temItemSemCusto) {
      return { ...produto, receita, cmv: null, lucroBruto: null, margem: null, custoCompleto: false };
    }
    const cmv = arredondar(produto.cmv);
    const lucroBruto = arredondar(receita - cmv);
    return { ...produto, receita, cmv, lucroBruto, margem: percentualDe(lucroBruto, receita), custoCompleto: true };
  });
}

// "Mais rentáveis" e "Menor margem" só listam produtos com custo completo;
// "Mais vendidos" lista todos
export function ordenarRentabilidade(produtos, ordenacao) {
  switch (ordenacao) {
    case ORDENACOES_RENTABILIDADE.MAIS_RENTAVEIS:
      return produtos.filter((p) => p.lucroBruto !== null).sort((a, b) => b.lucroBruto - a.lucroBruto);
    case ORDENACOES_RENTABILIDADE.MENOR_MARGEM:
      return produtos.filter((p) => p.margem !== null).sort((a, b) => a.margem - b.margem);
    case ORDENACOES_RENTABILIDADE.MAIS_VENDIDOS:
    default:
      return [...produtos].sort((a, b) => b.quantidade - a.quantidade || b.receita - a.receita);
  }
}

// Variação percentual sobre o valor anterior (base em módulo, para resultados
// negativos); null se o anterior for zero
function variacaoPercentual(anterior, atual) {
  if (anterior == null || atual == null || anterior === 0) return null;
  return arredondar(((atual - anterior) / Math.abs(anterior)) * 100, 1);
}

function variacaoPontos(anterior, atual) {
  if (anterior == null || atual == null) return null;
  return arredondar(atual - anterior, 1);
}

// Linhas da comparação entre dois períodos (ex.: setembro x agosto). Valores
// em R$ variam em %; margens variam em pontos percentuais (p.p.).
export function compararIndicadores(anterior, atual) {
  const moeda = (chave, label, campo) => ({
    chave, label, tipo: 'moeda',
    anterior: anterior[campo], atual: atual[campo],
    variacao: variacaoPercentual(anterior[campo], atual[campo]),
  });
  const margem = (chave, label, campo) => ({
    chave, label, tipo: 'percentual',
    anterior: anterior[campo], atual: atual[campo],
    variacao: variacaoPontos(anterior[campo], atual[campo]),
  });

  return [
    moeda('faturamento', 'Faturamento', 'faturamento'),
    moeda('cmv', 'CMV', 'cmv'),
    margem('margemBruta', 'Margem bruta', 'margemBrutaPercentual'),
    margem('margemContribuicao', 'Margem de contribuição', 'margemContribuicaoPercentual'),
    moeda('resultado', 'Resultado', 'resultado'),
  ];
}
