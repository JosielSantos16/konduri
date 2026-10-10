// Saldo de um produto dentro da operação (caixa do dia). Perdas, cortesias e
// ajustes ficam em ajusteSaidaQtd, separados das vendas (saidaQtd), para não
// aparecerem como venda nem entrarem no valor das saídas. Unidades devolvidas
// por cancelamento de uma venda de outro caixa (já fechado) ficam em
// estornoQtd, separadas das compras (entradaQtd).
export function calcularSaldoOperacao(produtoOperacao) {
  return (
    (produtoOperacao.estoqueInicial || 0) +
    (produtoOperacao.entradaQtd || 0) +
    (produtoOperacao.estornoQtd || 0) -
    (produtoOperacao.saidaQtd || 0) -
    (produtoOperacao.ajusteSaidaQtd || 0)
  );
}
