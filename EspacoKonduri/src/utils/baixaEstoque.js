// Regra da baixa de estoque de uma venda, sem acesso ao Firestore (a transação
// fica em operacoesQueries.baixarEstoqueDaVenda). É o inverso do estorno em
// utils/estornoVenda.

import { calcularSaldoOperacao } from './saldoOperacao';

function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

// grupo: { quantidade, valor } do produto na venda (ver agruparItensPorProduto)
// produto: documento em products
// produtoNaOperacao: operacoes/{caixa aberto}/produtos/{id}, ou null
export function planejarBaixaDoProduto({ grupo, produto, produtoNaOperacao }) {
  // Com o produto no caixa aberto, o saldo do caixa é o estoque que vale
  if (produtoNaOperacao) {
    const saidaQtd = (produtoNaOperacao.saidaQtd || 0) + grupo.quantidade;
    const valorSaidas = arredondarCentavos((produtoNaOperacao.valorSaidas || 0) + grupo.valor);
    const saldoEstoque = calcularSaldoOperacao({ ...produtoNaOperacao, saidaQtd });
    return {
      produto: { estoque: saldoEstoque },
      operacao: { saidaQtd, valorSaidas, saldoEstoque },
      novoEstoque: saldoEstoque,
    };
  }

  const novoEstoque = Math.max(0, (produto?.estoque || 0) - grupo.quantidade);
  return { produto: { estoque: novoEstoque }, operacao: null, novoEstoque };
}

// Alerta para o admin depois da venda: 'esgotado', 'baixo' ou null.
// Usa o "Avisar quando o estoque for menor que" do produto (padrão 5).
export function alertaDeEstoque(novoEstoque, limiteEstoqueBaixo) {
  if (novoEstoque <= 0) return 'esgotado';
  if (novoEstoque <= (limiteEstoqueBaixo ?? 5)) return 'baixo';
  return null;
}
