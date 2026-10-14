// Regras do cancelamento de venda, sem acesso ao Firestore. A transação em
// vendasQueries.cancelarVenda lê os documentos, chama estas funções e grava
// o que elas devolvem.

import { calcularSaldoOperacao } from './saldoOperacao';

function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

// Como o estoque de um produto volta quando a venda é cancelada:
//   A) o caixa da venda ainda está aberto: desfaz a saída nesse caixa
//   B) o caixa da venda já fechou e há outro caixa aberto com o produto: soma
//      em estornoQtd do caixa aberto (o caixa fechado não muda)
//   C) nenhum caixa aberto tem o produto: soma direto no estoque do produto
export const CASOS_ESTORNO = {
  CAIXA_DA_VENDA_ABERTO: 'A',
  OUTRO_CAIXA_ABERTO: 'B',
  SEM_CAIXA_ABERTO: 'C',
};

export function vendaCancelada(venda) {
  return venda?.status === 'cancelada';
}

// Junta itens do mesmo produto, para devolver cada produto uma vez só.
// Itens sem id (vendas muito antigas) não têm produto para receber o estoque.
export function agruparItensPorProduto(itens) {
  const porProduto = {};
  const semProduto = [];

  (itens || []).forEach((item) => {
    // Entrada (portaria) não tem estoque
    if (item.tipo === 'entrada') return;
    if (!item.id) {
      semProduto.push(item);
      return;
    }
    if (!porProduto[item.id]) {
      porProduto[item.id] = {
        produtoId: item.id,
        title: item.title,
        quantidade: 0,
        valor: 0,
        custoUnitario: item.custoUnitario ?? null,
      };
    }
    porProduto[item.id].quantidade += item.qty || 0;
    porProduto[item.id].valor += (item.qty || 0) * (Number(item.price) || 0);
  });

  return {
    grupos: Object.values(porProduto).map((g) => ({ ...g, valor: arredondarCentavos(g.valor) })),
    semProduto,
  };
}

// Devolve o que gravar para um produto. Os produtos da operação passados aqui
// são os documentos lidos na transação (ou null se não existirem).
//   grupo: { quantidade, valor } do produto na venda
//   produto: documento em products
//   produtoNaOperacaoDaVenda: operacoes/{venda.operacaoId}/produtos/{id}, só se esse caixa estiver aberto
//   produtoNaOperacaoAberta: operacoes/{caixa aberto}/produtos/{id}, só se for outro caixa
export function planejarEstornoDoProduto({ grupo, produto, produtoNaOperacaoDaVenda, produtoNaOperacaoAberta }) {
  if (produtoNaOperacaoDaVenda) {
    const saidaQtd = Math.max(0, (produtoNaOperacaoDaVenda.saidaQtd || 0) - grupo.quantidade);
    const valorSaidas = arredondarCentavos(
      Math.max(0, (produtoNaOperacaoDaVenda.valorSaidas || 0) - grupo.valor)
    );
    const saldoEstoque = calcularSaldoOperacao({ ...produtoNaOperacaoDaVenda, saidaQtd });
    return {
      caso: CASOS_ESTORNO.CAIXA_DA_VENDA_ABERTO,
      produto: { estoque: saldoEstoque },
      operacaoDaVenda: { saidaQtd, valorSaidas, saldoEstoque },
      operacaoAberta: null,
    };
  }

  if (produtoNaOperacaoAberta) {
    const estornoQtd = (produtoNaOperacaoAberta.estornoQtd || 0) + grupo.quantidade;
    const saldoEstoque = calcularSaldoOperacao({ ...produtoNaOperacaoAberta, estornoQtd });
    return {
      caso: CASOS_ESTORNO.OUTRO_CAIXA_ABERTO,
      produto: { estoque: saldoEstoque },
      operacaoDaVenda: null,
      operacaoAberta: { estornoQtd, saldoEstoque },
    };
  }

  return {
    caso: CASOS_ESTORNO.SEM_CAIXA_ABERTO,
    produto: { estoque: (produto?.estoque || 0) + grupo.quantidade },
    operacaoDaVenda: null,
    operacaoAberta: null,
  };
}

// Subtotal de produtos da venda: é a base da comissão (ingressos não entram),
// a mesma conta da tela de Vendas
export function subtotalProdutosDaVenda(venda) {
  return arredondarCentavos(
    (venda.itens || [])
      .filter((item) => item.category === 'produtos')
      .reduce((soma, item) => soma + (item.qty || 0) * (Number(item.price) || 0), 0)
  );
}

// Comissão do dia recalculada sem a venda cancelada (nova base × mesmo %).
// null quando não há o que ajustar: sem comissão definida, venda sem produtos,
// ou venda feita depois da comissão ser salva (não entrou na base guardada).
export function recalcularComissao(comissao, venda) {
  if (!comissao) return null;
  if (comissao.atualizadoEm && venda.criadoEm && venda.criadoEm > comissao.atualizadoEm) return null;

  const subtotal = subtotalProdutosDaVenda(venda);
  if (subtotal <= 0) return null;

  const baseCalculo = arredondarCentavos(Math.max(0, (comissao.baseCalculo || 0) - subtotal));
  const valorComissao = arredondarCentavos(baseCalculo * ((comissao.percentual || 0) / 100));

  return {
    baseCalculo,
    valorComissao,
    valorAnterior: comissao.valorComissao || 0,
  };
}
