import {
  CASOS_ESTORNO,
  agruparItensPorProduto,
  planejarEstornoDoProduto,
  recalcularComissao,
  subtotalProdutosDaVenda,
  vendaCancelada,
} from '../estornoVenda';

const item = (id, qty, price, extra = {}) => ({ id, title: id, qty, price, category: 'produtos', ...extra });

describe('agrupar itens da venda', () => {
  test('junta o mesmo produto e separa itens sem id', () => {
    const { grupos, semProduto } = agruparItensPorProduto([
      item('imp', 2, 6, { custoUnitario: 3.2 }),
      item('imp', 3, 6),
      item('agua', 1, 3),
      { title: 'Antigo', qty: 1, price: 5 },
    ]);

    expect(grupos).toEqual([
      { produtoId: 'imp', title: 'imp', quantidade: 5, valor: 30, custoUnitario: 3.2 },
      { produtoId: 'agua', title: 'agua', quantidade: 1, valor: 3, custoUnitario: null },
    ]);
    expect(semProduto.map((i) => i.title)).toEqual(['Antigo']);
  });
});

describe('estorno do estoque (casos A, B e C)', () => {
  const grupo = { quantidade: 3, valor: 18 };

  test('A: caixa da venda aberto desfaz a saída nesse caixa', () => {
    // Abriu com 20, vendeu 5 (R$ 30), perdeu 1: saldo 14. Cancela a venda de 3
    const plano = planejarEstornoDoProduto({
      grupo,
      produto: { estoque: 14 },
      produtoNaOperacaoDaVenda: { estoqueInicial: 20, entradaQtd: 0, saidaQtd: 5, valorSaidas: 30, ajusteSaidaQtd: 1 },
      produtoNaOperacaoAberta: null,
    });

    expect(plano).toEqual({
      caso: CASOS_ESTORNO.CAIXA_DA_VENDA_ABERTO,
      produto: { estoque: 17 },
      operacaoDaVenda: { saidaQtd: 2, valorSaidas: 12, saldoEstoque: 17 },
      operacaoAberta: null,
    });
  });

  test('B: caixa da venda fechado e outro caixa aberto soma em estornoQtd', () => {
    // Caixa de hoje abriu com 10, vendeu 4: saldo 6. Devolve 3 de uma venda de ontem
    const plano = planejarEstornoDoProduto({
      grupo,
      produto: { estoque: 6 },
      produtoNaOperacaoDaVenda: null,
      produtoNaOperacaoAberta: { estoqueInicial: 10, entradaQtd: 0, saidaQtd: 4, valorSaidas: 24 },
    });

    expect(plano).toEqual({
      caso: CASOS_ESTORNO.OUTRO_CAIXA_ABERTO,
      produto: { estoque: 9 },
      operacaoDaVenda: null,
      operacaoAberta: { estornoQtd: 3, saldoEstoque: 9 },
    });
  });

  test('B: estornos se acumulam no mesmo caixa aberto', () => {
    const plano = planejarEstornoDoProduto({
      grupo,
      produto: { estoque: 8 },
      produtoNaOperacaoAberta: { estoqueInicial: 10, saidaQtd: 4, estornoQtd: 2 },
    });

    expect(plano.operacaoAberta).toEqual({ estornoQtd: 5, saldoEstoque: 11 });
    expect(plano.produto.estoque).toBe(11);
  });

  test('C: sem caixa aberto com o produto, soma direto no estoque', () => {
    const plano = planejarEstornoDoProduto({ grupo, produto: { estoque: 7 } });

    expect(plano).toEqual({
      caso: CASOS_ESTORNO.SEM_CAIXA_ABERTO,
      produto: { estoque: 10 },
      operacaoDaVenda: null,
      operacaoAberta: null,
    });
  });

  test('A: nunca deixa saída ou valor das saídas negativos', () => {
    const plano = planejarEstornoDoProduto({
      grupo,
      produto: { estoque: 0 },
      produtoNaOperacaoDaVenda: { estoqueInicial: 5, saidaQtd: 1, valorSaidas: 6 },
    });

    expect(plano.operacaoDaVenda).toMatchObject({ saidaQtd: 0, valorSaidas: 0, saldoEstoque: 5 });
  });
});

describe('comissão recalculada no cancelamento', () => {
  const venda = {
    criadoEm: '2026-10-10T15:00:00.000Z',
    itens: [item('imp', 5, 6), { id: 'ing', title: 'Ingresso', qty: 2, price: 20, category: 'ingressos' }],
  };

  test('base da comissão conta só produtos', () => {
    expect(subtotalProdutosDaVenda(venda)).toBe(30);
  });

  test('nova base × mesmo percentual (João: R$ 12,00 → R$ 9,00)', () => {
    const comissao = { baseCalculo: 120, percentual: 10, valorComissao: 12, atualizadoEm: '2026-10-10T23:00:00.000Z' };

    expect(recalcularComissao(comissao, venda)).toEqual({ baseCalculo: 90, valorComissao: 9, valorAnterior: 12 });
  });

  test('venda feita depois de a comissão ser salva não mexe nela', () => {
    const comissao = { baseCalculo: 120, percentual: 10, valorComissao: 12, atualizadoEm: '2026-10-10T12:00:00.000Z' };

    expect(recalcularComissao(comissao, venda)).toBeNull();
  });

  test('sem comissão definida ou venda só de ingressos: nada a ajustar', () => {
    expect(recalcularComissao(null, venda)).toBeNull();
    const soIngresso = { criadoEm: venda.criadoEm, itens: [venda.itens[1]] };
    expect(recalcularComissao({ baseCalculo: 50, percentual: 10, valorComissao: 5 }, soIngresso)).toBeNull();
  });

  test('base nunca fica negativa', () => {
    expect(recalcularComissao({ baseCalculo: 20, percentual: 10, valorComissao: 2 }, venda)).toEqual({
      baseCalculo: 0,
      valorComissao: 0,
      valorAnterior: 2,
    });
  });
});

describe('status da venda', () => {
  test('só status "cancelada" conta como cancelada; venda antiga sem status vale', () => {
    expect(vendaCancelada({ status: 'cancelada' })).toBe(true);
    expect(vendaCancelada({ status: 'concluida' })).toBe(false);
    expect(vendaCancelada({})).toBe(false);
  });
});
