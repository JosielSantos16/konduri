import {
  MOTIVOS_RESERVA_RECUSADA,
  avaliarReserva,
  configDaData,
  montarVendaDeEntrada,
  resumirEntradasPorDia,
  vagasRestantes,
} from '../entradas';
import { calcularIndicadores, rentabilidadePorProduto } from '../financeiro';
import { agruparItensPorProduto } from '../estornoVenda';

const CONFIG = {
  valorPadrao: 10,
  lotacaoPadrao: null,
  datas: {
    '2026-10-17': { valor: 15, lotacao: 200 }, // sábado
    '2026-10-12': { valor: 20 }, // feriado, sem limite
    '2026-10-18': { lotacao: null }, // domingo: valor padrão, sem limite mesmo se o padrão mudar
  },
};

describe('valor e lotação por data', () => {
  test('usa a exceção da data e cai no padrão no resto', () => {
    expect(configDaData(CONFIG, '2026-10-17')).toEqual({ valor: 15, lotacao: 200 });
    expect(configDaData(CONFIG, '2026-10-12')).toEqual({ valor: 20, lotacao: null });
    expect(configDaData(CONFIG, '2026-10-14')).toEqual({ valor: 10, lotacao: null });
  });

  test('sem configuração salva usa R$ 10 e sem limite', () => {
    expect(configDaData(null, '2026-10-14')).toEqual({ valor: 10, lotacao: null });
  });

  test('lotação padrão vale nos dias sem exceção; exceção pode tirar o limite', () => {
    const comLimite = { ...CONFIG, lotacaoPadrao: 300 };
    expect(configDaData(comLimite, '2026-10-14').lotacao).toBe(300);
    expect(configDaData(comLimite, '2026-10-18').lotacao).toBeNull();
  });

  test('vagas: null sem limite, nunca negativas', () => {
    expect(vagasRestantes(null, 50)).toBeNull();
    expect(vagasRestantes(200, 180)).toBe(20);
    expect(vagasRestantes(200, 250)).toBe(0);
  });
});

describe('reserva pelo app', () => {
  const base = { config: CONFIG, hojeISO: '2026-10-10' };

  test('aceita quando há vagas, recusa quando lota', () => {
    expect(avaliarReserva({ ...base, dataISO: '2026-10-17', quantidade: 5, pessoasReservadas: 190 })).toEqual({ ok: true, vagas: 10 });
    expect(avaliarReserva({ ...base, dataISO: '2026-10-17', quantidade: 11, pessoasReservadas: 190 })).toEqual({
      ok: false,
      motivo: MOTIVOS_RESERVA_RECUSADA.LOTADO,
      vagas: 10,
    });
  });

  test('sem limite aceita qualquer quantidade', () => {
    expect(avaliarReserva({ ...base, dataISO: '2026-10-12', quantidade: 40, pessoasReservadas: 5000 }).ok).toBe(true);
  });

  test('recusa data passada e quantidade inválida', () => {
    expect(avaliarReserva({ ...base, dataISO: '2026-10-09', quantidade: 2, pessoasReservadas: 0 }).motivo).toBe(
      MOTIVOS_RESERVA_RECUSADA.DATA_PASSADA
    );
    expect(avaliarReserva({ ...base, dataISO: '2026-10-10', quantidade: 0, pessoasReservadas: 0 }).motivo).toBe(
      MOTIVOS_RESERVA_RECUSADA.QUANTIDADE_INVALIDA
    );
  });
});

describe('entrada registrada na portaria', () => {
  test('paga: quantidade × valor do dia, sem custo', () => {
    const venda = montarVendaDeEntrada({ quantidade: 4, valorUnitario: 15, metodo: 'pix' });
    expect(venda).toMatchObject({ tipoVenda: 'entrada', total: 60, metodo: 'pix', cortesia: false, cmvTotal: 0 });
    expect(venda.itens[0]).toMatchObject({ tipo: 'entrada', qty: 4, price: 15, category: 'ingressos', custoTotal: 0 });
  });

  test('cortesia: R$ 0 e guarda o motivo', () => {
    const venda = montarVendaDeEntrada({ quantidade: 2, valorUnitario: 15, metodo: 'cortesia', motivoCortesia: 'Banda' });
    expect(venda).toMatchObject({ total: 0, cortesia: true, motivoCortesia: 'Banda' });
    expect(venda.itens[0].price).toBe(0);
  });

  test('não mexe em estoque nem aparece na rentabilidade de produtos', () => {
    const venda = { ...montarVendaDeEntrada({ quantidade: 3, valorUnitario: 10, metodo: 'dinheiro' }), data: '2026-10-10' };
    expect(agruparItensPorProduto(venda.itens)).toEqual({ grupos: [], semProduto: [] });
    expect(rentabilidadePorProduto([venda])).toEqual([]);
  });

  test('entra no faturamento; cortesia não conta como venda nem baixa o ticket médio', () => {
    const r = calcularIndicadores({
      inicio: '2026-10-01',
      fim: '2026-10-31',
      vendas: [
        { ...montarVendaDeEntrada({ quantidade: 4, valorUnitario: 10, metodo: 'pix' }), data: '2026-10-10' },
        { ...montarVendaDeEntrada({ quantidade: 2, valorUnitario: 10, metodo: 'cortesia' }), data: '2026-10-10' },
      ],
      despesas: [],
      comissoes: [],
    });
    expect(r).toMatchObject({ faturamento: 40, cmv: 0, quantidadeVendas: 1, ticketMedio: 40 });
    expect(r.cobertura.completa).toBe(true); // entrada tem custo zero conhecido, sem aviso de "sem custo"
  });
});

describe('fechamento por dia e relatório do período', () => {
  test('totaliza por dia: pagantes, cortesias, total e forma de pagamento; ignora canceladas e outras vendas', () => {
    const entrada = (data, quantidade, metodo, extra = {}) => ({
      ...montarVendaDeEntrada({ quantidade, valorUnitario: 10, metodo }),
      data,
      ...extra,
    });
    const { dias, totais } = resumirEntradasPorDia([
      entrada('2026-10-07', 3, 'pix'),
      entrada('2026-10-07', 2, 'dinheiro'),
      entrada('2026-10-07', 1, 'cortesia'),
      entrada('2026-10-08', 4, 'cartao'),
      entrada('2026-10-08', 5, 'pix', { status: 'cancelada' }),
      { data: '2026-10-08', total: 30, metodo: 'pix', itens: [{ id: 'imp', title: 'Império', qty: 5, price: 6 }] },
    ]);

    expect(dias).toEqual([
      { data: '2026-10-07', pagantes: 5, cortesias: 1, pessoas: 6, total: 50, porMetodo: { pix: 30, dinheiro: 20 } },
      { data: '2026-10-08', pagantes: 4, cortesias: 0, pessoas: 4, total: 40, porMetodo: { cartao: 40 } },
    ]);
    expect(totais).toMatchObject({ pagantes: 9, cortesias: 1, pessoas: 10, total: 90 });
  });
});
