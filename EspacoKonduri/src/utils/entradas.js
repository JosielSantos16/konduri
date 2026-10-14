// Regras das entradas do Espaço Konduri (portaria, restaurante, bar, praias e
// cachoeira), sem acesso ao Firestore.
//
// - Configuração (admin): valor padrão e lotação padrão (null = sem limite),
//   com exceções por data. Datas são 'AAAA-MM-DD' (horário local).
// - Reserva (cliente, pelo app): só previsão; paga na portaria.
// - Entrada registrada na portaria: vira uma venda (tipoVenda 'entrada'), por
//   isso entra no faturamento e fecha por dia como as outras vendas.
// - Cortesia: só o admin registra; o cliente nunca vê essa opção.

import { vendaValida } from './financeiro';

export const VALOR_ENTRADA_PADRAO = 10;
export const METODO_CORTESIA = 'cortesia';
export const STATUS_RESERVA = {
  RESERVADA: 'reservada',
  UTILIZADA: 'utilizada',
  CANCELADA: 'cancelada',
};

function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

// Valor e lotação que valem numa data: a exceção da data, se houver, senão o padrão
export function configDaData(config, dataISO) {
  const excecao = config?.datas?.[dataISO] || {};
  const valor = excecao.valor ?? config?.valorPadrao ?? VALOR_ENTRADA_PADRAO;
  const lotacao = excecao.lotacao !== undefined ? excecao.lotacao : config?.lotacaoPadrao ?? null;
  return { valor, lotacao: lotacao === null || lotacao === '' ? null : Number(lotacao) };
}

// null quando não há limite
export function vagasRestantes(lotacao, pessoasReservadas) {
  if (lotacao === null || lotacao === undefined) return null;
  return Math.max(0, lotacao - (pessoasReservadas || 0));
}

export const MOTIVOS_RESERVA_RECUSADA = {
  DATA_PASSADA: 'DATA_PASSADA',
  QUANTIDADE_INVALIDA: 'QUANTIDADE_INVALIDA',
  LOTADO: 'LOTADO',
};

export function avaliarReserva({ config, dataISO, hojeISO, quantidade, pessoasReservadas }) {
  if (!dataISO || dataISO < hojeISO) return { ok: false, motivo: MOTIVOS_RESERVA_RECUSADA.DATA_PASSADA };
  if (!Number.isInteger(quantidade) || quantidade < 1) {
    return { ok: false, motivo: MOTIVOS_RESERVA_RECUSADA.QUANTIDADE_INVALIDA };
  }

  const { lotacao } = configDaData(config, dataISO);
  const vagas = vagasRestantes(lotacao, pessoasReservadas);
  if (vagas !== null && quantidade > vagas) return { ok: false, motivo: MOTIVOS_RESERVA_RECUSADA.LOTADO, vagas };

  return { ok: true, vagas };
}

export function ehItemDeEntrada(item) {
  return item?.tipo === 'entrada';
}

export function ehVendaDeEntrada(venda) {
  return venda?.tipoVenda === 'entrada';
}

export function ehCortesia(venda) {
  return venda?.metodo === METODO_CORTESIA;
}

// Venda de entrada no mesmo formato das outras vendas. A entrada não tem custo
// (CMV zero), não mexe em estoque e não entra na comissão (category 'ingressos').
export function montarVendaDeEntrada({ quantidade, valorUnitario, metodo, motivoCortesia }) {
  const cortesia = metodo === METODO_CORTESIA;
  const preco = cortesia ? 0 : valorUnitario;
  const total = arredondarCentavos(preco * quantidade);

  return {
    tipoVenda: 'entrada',
    total,
    metodo,
    cortesia,
    motivoCortesia: cortesia ? motivoCortesia || '' : null,
    itens: [
      {
        tipo: 'entrada',
        title: cortesia ? 'Entrada (cortesia)' : 'Entrada',
        qty: quantidade,
        price: preco,
        category: 'ingressos',
        custoUnitario: 0,
        custoTotal: 0,
      },
    ],
    cmvTotal: 0,
    margemBruta: total,
    status: 'concluida',
  };
}

function pessoasDaVenda(venda) {
  return (venda.itens || []).filter(ehItemDeEntrada).reduce((soma, item) => soma + (item.qty || 0), 0);
}

// Totais de entradas por dia (fecha sozinho pela data da venda) e do período.
// Vendas canceladas não contam.
export function resumirEntradasPorDia(vendas) {
  const porDia = {};
  const novoDia = (data) => ({ data, pagantes: 0, cortesias: 0, pessoas: 0, total: 0, porMetodo: {} });
  const totais = novoDia(null);

  vendas.filter((v) => ehVendaDeEntrada(v) && vendaValida(v)).forEach((venda) => {
    const pessoas = pessoasDaVenda(venda);
    const dia = porDia[venda.data] || (porDia[venda.data] = novoDia(venda.data));

    [dia, totais].forEach((alvo) => {
      alvo.pessoas += pessoas;
      if (ehCortesia(venda)) {
        alvo.cortesias += pessoas;
      } else {
        alvo.pagantes += pessoas;
        alvo.total = arredondarCentavos(alvo.total + (Number(venda.total) || 0));
        alvo.porMetodo[venda.metodo] = arredondarCentavos((alvo.porMetodo[venda.metodo] || 0) + (Number(venda.total) || 0));
      }
    });
  });

  return {
    dias: Object.values(porDia).sort((a, b) => a.data.localeCompare(b.data)),
    totais,
  };
}
