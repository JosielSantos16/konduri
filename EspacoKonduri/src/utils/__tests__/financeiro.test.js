import {
  calcularIndicadores,
  compararIndicadores,
  intervaloDaCompetencia,
  intervaloDoPeriodo,
  intervalosDaComparacao,
  margemDoProduto,
  mesesDoIntervalo,
  ordenarRentabilidade,
  rentabilidadePorProduto,
  ORDENACOES_RENTABILIDADE,
  PERIODOS,
  STATUS_EQUILIBRIO,
} from '../financeiro';

// Venda de um dia com faturamento e CMV (custo congelado) definidos
function venda(data, total, cmv, metodo = 'pix', extra = {}) {
  return { data, total, metodo, itens: [{ qty: 1, price: total, custoTotal: cmv }], ...extra };
}

function custoFixo(valor, competencia = '2026-09') {
  return { tipo: 'FIXO', forma: 'VALOR', valor, periodicidade: 'MENSAL', competencia };
}

function custoVariavel(valor, competencia = '2026-09') {
  return { tipo: 'VARIAVEL', forma: 'VALOR', valor, periodicidade: 'MENSAL', competencia };
}

function custoPercentual(percentual, competencia = '2026-09') {
  return { tipo: 'VARIAVEL', forma: 'PERCENTUAL', percentual, periodicidade: 'MENSAL', competencia };
}

// Setembro de 2026 inteiro, visto depois do fim do mês (sem meta diária)
const SETEMBRO = { inicio: '2026-09-01', fim: '2026-09-30', hoje: '2026-10-05' };

describe('exemplos do documento de especificação', () => {
  test('§4: faturamento 20.000, CMV 8.000, variáveis 2.000, fixos 6.000', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [venda('2026-09-10', 20000, 8000)],
      despesas: [custoFixo(6000), custoVariavel(2000)],
      comissoes: [],
    });

    expect(r.margemContribuicao).toBe(10000);
    expect(r.margemContribuicaoPercentual).toBe(50);
    expect(r.pontoEquilibrio.valor).toBe(12000);
    expect(r.resultado).toBe(4000);
  });

  test('§15 e §16: quadro de resultado e indicadores de margem', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [venda('2026-09-10', 25400, 10800)],
      despesas: [custoFixo(6300), custoVariavel(2100)],
      comissoes: [],
    });

    // §15
    expect(r.faturamento).toBe(25400);
    expect(r.cmv).toBe(10800);
    expect(r.margemBruta).toBe(14600);
    expect(r.custosVariaveis.total).toBe(2100);
    expect(r.margemContribuicao).toBe(12500);
    expect(r.custosFixos).toBe(6300);
    expect(r.resultado).toBe(6200);

    // §16
    expect(r.margemBrutaPercentual).toBe(57.48);
    expect(r.margemContribuicaoPercentual).toBe(49.21);
    expect(r.margemOperacionalPercentual).toBe(24.41);
  });

  test('§24: ponto de equilíbrio do mesmo mês (~R$ 12.800) já atingido', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [venda('2026-09-10', 25400, 10800)],
      despesas: [custoFixo(6300), custoVariavel(2100)],
      comissoes: [],
    });

    expect(r.pontoEquilibrio.valor).toBe(12801.6);
    expect(r.pontoEquilibrio.status).toBe(STATUS_EQUILIBRIO.ATINGIDO);
    expect(r.pontoEquilibrio.excedente).toBe(12598.4);
  });

  test('§25: faltam R$ 4.200 com 10 dias restantes → R$ 420 por dia', () => {
    // Ponto de equilíbrio de R$ 12.000 (fixos 6.000, margem de contribuição 50%),
    // R$ 7.800 faturados, hoje = 21/09 (restam 21 a 30 = 10 dias)
    const r = calcularIndicadores({
      ...SETEMBRO,
      hoje: '2026-09-21',
      vendas: [venda('2026-09-10', 7800, 3120)],
      despesas: [custoFixo(6000), custoVariavel(780)],
      comissoes: [],
    });

    expect(r.pontoEquilibrio.valor).toBe(12000);
    expect(r.pontoEquilibrio.status).toBe(STATUS_EQUILIBRIO.EM_ANDAMENTO);
    expect(r.pontoEquilibrio.faltam).toBe(4200);
    expect(r.pontoEquilibrio.diasRestantes).toBe(10);
    expect(r.pontoEquilibrio.metaDiaria).toBe(420);
  });
});

describe('casos de borda', () => {
  test('custo percentual sobre a venda, comissões e separação por forma de pagamento', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [
        venda('2026-09-02', 600, 300, 'pix'),
        venda('2026-09-03', 300, 150, 'dinheiro'),
        venda('2026-09-04', 100, 50, 'cartao'),
      ],
      despesas: [custoPercentual(2.5)],
      comissoes: [{ valorComissao: 100 }],
    });

    expect(r.porMetodo).toEqual({ pix: 600, dinheiro: 300, cartao: 100 });
    expect(r.custosVariaveis).toEqual({
      total: 125,
      despesasEmValor: 0,
      despesasPercentuais: 25,
      comissoes: 100,
    });
  });

  test('sem faturamento: ponto de equilíbrio ainda não pode ser medido', () => {
    const r = calcularIndicadores({ ...SETEMBRO, vendas: [], despesas: [custoFixo(6000)], comissoes: [] });

    expect(r.resultado).toBe(-6000);
    expect(r.margemBrutaPercentual).toBeNull();
    expect(r.pontoEquilibrio.status).toBe(STATUS_EQUILIBRIO.SEM_FATURAMENTO);
    expect(r.pontoEquilibrio.valor).toBeNull();
  });

  test('margem de contribuição negativa: ponto de equilíbrio inatingível', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [venda('2026-09-10', 1000, 900)],
      despesas: [custoFixo(500), custoVariavel(200)],
      comissoes: [],
    });

    expect(r.margemContribuicao).toBe(-100);
    expect(r.pontoEquilibrio.status).toBe(STATUS_EQUILIBRIO.INATINGIVEL);
  });

  test('sem custos fixos: meta zero, já atingida', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [venda('2026-09-10', 1000, 400)],
      despesas: [],
      comissoes: [],
    });

    expect(r.pontoEquilibrio.status).toBe(STATUS_EQUILIBRIO.ATINGIDO);
    expect(r.pontoEquilibrio.valor).toBe(0);
  });

  test('venda cancelada fica de fora; itens sem custo não entram no CMV e são informados', () => {
    const r = calcularIndicadores({
      ...SETEMBRO,
      vendas: [
        venda('2026-09-10', 100, 40),
        {
          data: '2026-09-11',
          total: 50,
          metodo: 'pix',
          itens: [
            { qty: 2, price: 10, custoTotal: 8 },
            { qty: 3, price: 10, custoTotal: null },
          ],
        },
        { data: '2026-09-12', total: 80, metodo: 'pix', itens: [{ qty: 8, price: 10 }] },
        venda('2026-09-13', 999, 1, 'pix', { status: 'cancelada' }),
      ],
      despesas: [],
      comissoes: [],
    });

    expect(r.faturamento).toBe(230);
    expect(r.quantidadeVendas).toBe(3);
    expect(r.cmv).toBe(48);
    expect(r.cobertura).toEqual({ completa: false, vendasSemCusto: 2, faturamentoSemCusto: 110 });
  });

  test('período que atravessa dois meses recebe custos fixos proporcionais', () => {
    expect(mesesDoIntervalo('2026-09-28', '2026-10-04')).toEqual([
      { competencia: '2026-09', dias: 3, fracao: 3 / 30 },
      { competencia: '2026-10', dias: 4, fracao: 4 / 31 },
    ]);

    const r = calcularIndicadores({
      inicio: '2026-09-28',
      fim: '2026-10-04',
      vendas: [],
      despesas: [custoFixo(3000)],
      comissoes: [],
    });

    // 3.000 × 3/30 + 3.000 × 4/31
    expect(r.custosFixos).toBe(687.1);
  });

  test('intervalos dos períodos pré-definidos', () => {
    const hoje = new Date(2026, 9, 3); // 03/10/2026

    expect(intervaloDoPeriodo(PERIODOS.HOJE, hoje)).toEqual({ inicio: '2026-10-03', fim: '2026-10-03' });
    expect(intervaloDoPeriodo(PERIODOS.SETE_DIAS, hoje)).toEqual({ inicio: '2026-09-27', fim: '2026-10-03' });
    expect(intervaloDoPeriodo(PERIODOS.MES_ATUAL, hoje)).toEqual({ inicio: '2026-10-01', fim: '2026-10-31' });
    expect(intervaloDoPeriodo(PERIODOS.MES_ANTERIOR, hoje)).toEqual({ inicio: '2026-09-01', fim: '2026-09-30' });
    expect(intervaloDoPeriodo(PERIODOS.MES_ANTERIOR, new Date(2027, 0, 15))).toEqual({
      inicio: '2026-12-01',
      fim: '2026-12-31',
    });
  });
});

// Venda de um produto com custo unitário congelado (como gravado desde a Fase 1)
function vendaDeProduto(data, id, title, qty, price, custoUnitario) {
  return {
    data,
    total: qty * price,
    metodo: 'pix',
    itens: [{ id, title, qty, price, custoUnitario, custoTotal: Math.round(custoUnitario * qty * 100) / 100 }],
  };
}

describe('rentabilidade, margem e comparação (Fase 7)', () => {
  test('§6: 10 cervejas a R$ 6,00 com custo R$ 3,20', () => {
    const [imperio] = rentabilidadePorProduto([vendaDeProduto('2026-09-10', 'imp', 'Império', 10, 6, 3.2)]);

    expect(imperio).toMatchObject({ quantidade: 10, receita: 60, cmv: 32, lucroBruto: 28, margem: 46.67 });
  });

  test('§13: tabela de rentabilidade e as três ordenações', () => {
    const produtos = rentabilidadePorProduto([
      vendaDeProduto('2026-09-05', 'imp', 'Império', 180, 6, 3.2),
      vendaDeProduto('2026-09-06', 'agua', 'Água', 100, 3, 1.1),
      vendaDeProduto('2026-09-07', 'flesh', 'Flesh 2L', 40, 12, 6.5),
    ]);
    const porId = Object.fromEntries(produtos.map((p) => [p.produtoId, p]));

    expect(porId.imp).toMatchObject({ quantidade: 180, receita: 1080, cmv: 576, lucroBruto: 504, margem: 46.67 });
    expect(porId.agua).toMatchObject({ quantidade: 100, receita: 300, cmv: 110, lucroBruto: 190, margem: 63.33 });
    expect(porId.flesh).toMatchObject({ quantidade: 40, receita: 480, cmv: 260, lucroBruto: 220, margem: 45.83 });

    const ids = (ordenacao) => ordenarRentabilidade(produtos, ordenacao).map((p) => p.produtoId);
    expect(ids(ORDENACOES_RENTABILIDADE.MAIS_RENTAVEIS)).toEqual(['imp', 'flesh', 'agua']);
    expect(ids(ORDENACOES_RENTABILIDADE.MENOR_MARGEM)).toEqual(['flesh', 'imp', 'agua']);
    expect(ids(ORDENACOES_RENTABILIDADE.MAIS_VENDIDOS)).toEqual(['imp', 'agua', 'flesh']);
  });

  test('produto vendido sem custo registrado só aparece em "Mais vendidos"', () => {
    const produtos = rentabilidadePorProduto([
      vendaDeProduto('2026-09-05', 'imp', 'Império', 10, 6, 3.2),
      { data: '2026-09-06', total: 50, metodo: 'pix', itens: [{ id: 'velho', title: 'Antigo', qty: 50, price: 1 }] },
    ]);

    expect(produtos.find((p) => p.produtoId === 'velho')).toMatchObject({ custoCompleto: false, margem: null });
    expect(ordenarRentabilidade(produtos, ORDENACOES_RENTABILIDADE.MAIS_RENTAVEIS).map((p) => p.produtoId)).toEqual(['imp']);
    expect(ordenarRentabilidade(produtos, ORDENACOES_RENTABILIDADE.MAIS_VENDIDOS).map((p) => p.produtoId)).toEqual(['velho', 'imp']);
  });

  test('§14: Michelob a R$ 8,00 com custo R$ 6,20 tem margem de 22,5%', () => {
    expect(margemDoProduto(8, 6.2)).toBe(22.5);
    expect(margemDoProduto(8, 0)).toBeNull();
  });

  test('§17: setembro x agosto', () => {
    const agosto = calcularIndicadores({
      ...intervaloDaCompetencia('2026-08'),
      vendas: [venda('2026-08-10', 20800, 9400)],
      despesas: [custoFixo(5400, '2026-08'), custoVariavel(1900, '2026-08')],
      comissoes: [],
    });
    const setembro = calcularIndicadores({
      ...intervaloDaCompetencia('2026-09'),
      vendas: [venda('2026-09-10', 25400, 10800)],
      despesas: [custoFixo(6300), custoVariavel(2100)],
      comissoes: [],
    });
    const linhas = Object.fromEntries(compararIndicadores(agosto, setembro).map((l) => [l.chave, l]));

    expect(linhas.faturamento).toMatchObject({ anterior: 20800, atual: 25400, variacao: 22.1 });
    expect(linhas.cmv).toMatchObject({ anterior: 9400, atual: 10800, variacao: 14.9 });
    expect(linhas.margemBruta).toMatchObject({ anterior: 54.81, atual: 57.48, variacao: 2.7 });
    expect(linhas.resultado).toMatchObject({ anterior: 4100, atual: 6200, variacao: 51.2 });
  });

  test('intervalo de uma competência', () => {
    expect(intervaloDaCompetencia('2026-02')).toEqual({ inicio: '2026-02-01', fim: '2026-02-28' });
  });
});

// Como a consulta do Firestore no hook: só as vendas dentro do intervalo
function noIntervalo(vendas, { inicio, fim }) {
  return vendas.filter((v) => v.data >= inicio && v.data <= fim);
}

describe('comparação mensal com o mês em andamento', () => {
  test('mês em andamento compara os mesmos dias nos dois meses', () => {
    expect(intervalosDaComparacao('2026-10', '2026-10-04')).toEqual({
      competenciaAnterior: '2026-09',
      emAndamento: true,
      atual: { inicio: '2026-10-01', fim: '2026-10-04' },
      anterior: { inicio: '2026-09-01', fim: '2026-09-04' },
    });
  });

  test('mês anterior mais curto: o recorte para no último dia dele', () => {
    expect(intervalosDaComparacao('2026-03', '2026-03-31')).toMatchObject({
      emAndamento: true,
      atual: { inicio: '2026-03-01', fim: '2026-03-31' },
      anterior: { inicio: '2026-02-01', fim: '2026-02-28' },
    });
  });

  test('mês fechado compara os dois meses inteiros', () => {
    expect(intervalosDaComparacao('2026-09', '2026-10-04')).toEqual({
      competenciaAnterior: '2026-08',
      emAndamento: false,
      atual: { inicio: '2026-09-01', fim: '2026-09-30' },
      anterior: { inicio: '2026-08-01', fim: '2026-08-31' },
    });
  });

  test('faturamento, CMV, margens e resultado usam o mesmo recorte nos dois lados', () => {
    // Hoje = 10/10. Aluguel de R$ 100 por dia nos dois meses (3.100 em outubro, 3.000 em setembro)
    const { atual, anterior } = intervalosDaComparacao('2026-10', '2026-10-10');
    const vendas = [
      venda('2026-09-05', 1000, 400), // dentro do recorte de setembro
      venda('2026-09-20', 5000, 2000), // depois do dia 10: fica de fora
      venda('2026-10-03', 1200, 480),
    ];
    const despesas = [
      // Aluguel antigo encerrado em setembro e o novo valendo a partir de outubro
      { ...custoFixo(3000, '2026-09'), competenciaFim: '2026-09' },
      custoFixo(3100, '2026-10'),
    ];

    const indicadoresAnterior = calcularIndicadores({ ...anterior, vendas: noIntervalo(vendas, anterior), despesas, comissoes: [] });
    const indicadoresAtual = calcularIndicadores({ ...atual, vendas: noIntervalo(vendas, atual), despesas, comissoes: [] });

    // 10 dias de aluguel dos dois lados: 3.000 ÷ 30 × 10 e 3.100 ÷ 31 × 10
    expect(indicadoresAnterior.custosFixos).toBe(1000);
    expect(indicadoresAtual.custosFixos).toBe(1000);

    const linhas = Object.fromEntries(compararIndicadores(indicadoresAnterior, indicadoresAtual).map((l) => [l.chave, l]));
    expect(linhas.faturamento).toMatchObject({ anterior: 1000, atual: 1200, variacao: 20 });
    expect(linhas.cmv).toMatchObject({ anterior: 400, atual: 480, variacao: 20 });
    expect(linhas.margemBruta).toMatchObject({ anterior: 60, atual: 60, variacao: 0 });
    // Resultado: 1.000 - 400 - 1.000 = -400 em setembro; 1.200 - 480 - 1.000 = -280 em outubro
    expect(linhas.resultado).toMatchObject({ anterior: -400, atual: -280, variacao: 30 });
  });
});

describe('venda cancelada (Fase 8)', () => {
  const vendas = [
    vendaDeProduto('2026-09-05', 'imp', 'Império', 10, 6, 3.2), // R$ 60, CMV 32
    { ...vendaDeProduto('2026-09-06', 'imp', 'Império', 5, 6, 3.2), status: 'cancelada', metodo: 'cartao' }, // R$ 30
    { ...vendaDeProduto('2026-09-07', 'agua', 'Água', 4, 3, 1.1), status: 'concluida', metodo: 'dinheiro' }, // R$ 12
  ];

  test('fica fora do faturamento, do CMV e dos totais por forma de pagamento', () => {
    const r = calcularIndicadores({ ...SETEMBRO, vendas, despesas: [], comissoes: [] });

    expect(r.faturamento).toBe(72);
    expect(r.quantidadeVendas).toBe(2);
    expect(r.cmv).toBe(36.4); // 32 + 4 × 1,10
    expect(r.porMetodo).toEqual({ pix: 60, dinheiro: 12 });
  });

  test('fica fora da rentabilidade por produto', () => {
    const porId = Object.fromEntries(rentabilidadePorProduto(vendas).map((p) => [p.produtoId, p]));

    expect(porId.imp).toMatchObject({ quantidade: 10, receita: 60, cmv: 32, lucroBruto: 28 });
    expect(porId.agua).toMatchObject({ quantidade: 4, receita: 12 });
  });

  test('produto vendido só em venda cancelada não aparece na rentabilidade', () => {
    const produtos = rentabilidadePorProduto([
      { ...vendaDeProduto('2026-09-06', 'flesh', 'Flesh 2L', 2, 12, 6.5), status: 'cancelada' },
    ]);

    expect(produtos).toEqual([]);
  });

  test('venda antiga sem status continua valendo', () => {
    const antiga = vendaDeProduto('2026-09-05', 'imp', 'Império', 3, 6, 3.2);
    delete antiga.status;
    const r = calcularIndicadores({ ...SETEMBRO, vendas: [antiga], despesas: [], comissoes: [] });

    expect(r.faturamento).toBe(18);
    expect(r.quantidadeVendas).toBe(1);
  });
});
