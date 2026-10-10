import { planejarBaixaDoProduto, alertaDeEstoque } from '../baixaEstoque';

describe('baixa de estoque na venda', () => {
  test('produto no caixa aberto: soma a saída e o estoque passa a ser o saldo do caixa', () => {
    const plano = planejarBaixaDoProduto({
      grupo: { quantidade: 3, valor: 18 },
      produto: { estoque: 999 },
      produtoNaOperacao: { estoqueInicial: 20, entradaQtd: 5, saidaQtd: 4, valorSaidas: 24, ajusteSaidaQtd: 1, estornoQtd: 2 },
    });

    // 20 + 5 + 2 - (4 + 3) - 1 = 19
    expect(plano).toEqual({
      produto: { estoque: 19 },
      operacao: { saidaQtd: 7, valorSaidas: 42, saldoEstoque: 19 },
      novoEstoque: 19,
    });
  });

  test('produto fora do caixa: abate do estoque, sem ficar negativo', () => {
    expect(planejarBaixaDoProduto({ grupo: { quantidade: 3, valor: 18 }, produto: { estoque: 10 } }))
      .toEqual({ produto: { estoque: 7 }, operacao: null, novoEstoque: 7 });
    expect(planejarBaixaDoProduto({ grupo: { quantidade: 3, valor: 18 }, produto: { estoque: 2 } }).novoEstoque).toBe(0);
  });

  test('alerta usa o limite do produto (padrão 5)', () => {
    expect(alertaDeEstoque(0, 10)).toBe('esgotado');
    expect(alertaDeEstoque(8, 10)).toBe('baixo');
    expect(alertaDeEstoque(8, undefined)).toBeNull();
    expect(alertaDeEstoque(5, undefined)).toBe('baixo');
  });
});
