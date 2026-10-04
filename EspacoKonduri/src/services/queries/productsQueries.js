import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { TIPOS_MOVIMENTO, novoMovimentoRef, montarMovimento } from './estoqueMovimentosQueries';
import { calcularSaldoOperacao } from '../../utils/saldoOperacao';

const COLECAO_PRODUTOS = 'products';
// Mesmo nome usado em operacoesQueries (não importado de lá para evitar import circular)
const COLECAO_OPERACOES = 'operacoes';

export function subscribeToProducts(callback) {
  const q = query(collection(db, COLECAO_PRODUTOS), orderBy('criadoEm', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const produtos = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(produtos);
  });
}

export async function buscarProdutoPorId(produtoId) {
  const snapshot = await getDoc(doc(db, COLECAO_PRODUTOS, produtoId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function criarProduto({
  title,
  price,
  image,
  category,
  unidade,
  estoqueInicial,
  entradaQtd,
  saidaQtd,
  valorEntradas,
  valorSaidas,
  observacoes,
  limiteEstoqueBaixo,
  custoUnitario,
  categoriaProduto,
}) {
  const produtoRef = doc(collection(db, COLECAO_PRODUTOS));

  const saldoEstoque = estoqueInicial + entradaQtd - saidaQtd;

  // No cadastro inicial, o custo médio começa igual ao custo informado
  const custoMedioInicial = custoUnitario || 0;

  await setDoc(produtoRef, {
    title,
    price,
    image: image || null,
    category,
    unidade,
    estoque: saldoEstoque,
    estoqueInicial,
    entradaQtd,
    saidaQtd,
    valorEntradas,
    valorSaidas,
    observacoes: observacoes || '',
    limiteEstoqueBaixo: limiteEstoqueBaixo || 5,
    categoriaProduto: categoriaProduto || null,
    custoUnitario: custoMedioInicial,
    custoMedio: custoMedioInicial,
    criadoEm: new Date().toISOString(),
  });

  return { id: produtoRef.id };
}

export async function atualizarProduto(produtoId, campos) {
  await updateDoc(doc(db, COLECAO_PRODUTOS, produtoId), campos);
}

export async function excluirProduto(produtoId) {
  await deleteDoc(doc(db, COLECAO_PRODUTOS, produtoId));
}

// Registra uma compra de mercadoria e recalcula o custo médio ponderado móvel.
// Roda em transação: se dois aparelhos registrarem entrada ou venda ao mesmo
// tempo, o Firestore repete a operação com os dados atualizados.
export async function registrarEntradaComCusto(
  produtoId,
  { quantidade, custoUnitario, operacaoId, usuarioUid, usuarioNome, observacao }
) {
  if (!(quantidade > 0)) throw new Error('Quantidade inválida.');
  if (!(custoUnitario > 0)) throw new Error('Custo unitário inválido.');

  const produtoRef = doc(db, COLECAO_PRODUTOS, produtoId);
  const produtoOperacaoRef = operacaoId
    ? doc(db, COLECAO_OPERACOES, operacaoId, 'produtos', produtoId)
    : null;

  return runTransaction(db, async (transaction) => {
    const produtoSnap = await transaction.get(produtoRef);
    if (!produtoSnap.exists()) throw new Error('Produto não encontrado.');

    const produtoOperacaoSnap = produtoOperacaoRef
      ? await transaction.get(produtoOperacaoRef)
      : null;
    const estaNaOperacao = !!produtoOperacaoSnap?.exists();

    const produto = produtoSnap.data();
    const dadosOperacao = estaNaOperacao ? produtoOperacaoSnap.data() : null;

    // Com caixa aberto, vale o saldo da operação: é ele que as vendas gravam no produto
    const estoqueAtual = estaNaOperacao
      ? calcularSaldoOperacao(dadosOperacao)
      : produto.estoque ?? 0;
    const novoEstoque = estoqueAtual + quantidade;

    const custoMedioAtual = produto.custoMedio ?? produto.custoUnitario ?? 0;
    const estoqueParaMedia = Math.max(0, estoqueAtual);

    // Sem custo anterior conhecido, o estoque existente não pode entrar na média
    // (entraria valendo zero), então o custo médio passa a ser o da compra
    const novoCustoMedio = custoMedioAtual > 0
      ? (estoqueParaMedia * custoMedioAtual + quantidade * custoUnitario) / (estoqueParaMedia + quantidade)
      : custoUnitario;
    const novoCustoMedioArredondado = Math.round(novoCustoMedio * 10000) / 10000;

    transaction.update(produtoRef, {
      estoque: novoEstoque,
      custoMedio: novoCustoMedioArredondado,
      custoUnitario: novoCustoMedioArredondado,
    });

    if (estaNaOperacao) {
      const valorCompra = Math.round(quantidade * custoUnitario * 100) / 100;
      transaction.update(produtoOperacaoRef, {
        entradaQtd: (dadosOperacao.entradaQtd || 0) + quantidade,
        valorEntradas: Math.round(((dadosOperacao.valorEntradas || 0) + valorCompra) * 100) / 100,
        saldoEstoque: novoEstoque,
      });
    }

    transaction.set(novoMovimentoRef(), {
      ...montarMovimento({
        produtoId,
        produtoNome: produto.title,
        tipo: TIPOS_MOVIMENTO.ENTRADA,
        quantidade,
        custoUnitario,
        usuarioUid,
        usuarioNome,
        operacaoId: estaNaOperacao ? operacaoId : null,
        observacao,
      }),
      estoqueAnterior: estoqueAtual,
      estoquePosterior: novoEstoque,
      custoMedioAnterior: custoMedioAtual,
      custoMedioPosterior: novoCustoMedioArredondado,
    });

    return { novoEstoque, novoCustoMedio: novoCustoMedioArredondado };
  });
}

export const TIPOS_SAIDA_AJUSTE = [
  TIPOS_MOVIMENTO.PERDA,
  TIPOS_MOVIMENTO.CORTESIA,
  TIPOS_MOVIMENTO.AJUSTE_SAIDA,
];

// Registra uma saída que não é venda (perda, cortesia, ajuste de contagem).
// Não muda o custo médio; o movimento guarda o custo médio atual para que a
// perda possa ser valorizada depois.
export async function registrarSaidaAjuste(
  produtoId,
  { quantidade, tipo, operacaoId, usuarioUid, usuarioNome, observacao }
) {
  if (!(quantidade > 0)) throw new Error('Quantidade inválida.');
  if (!TIPOS_SAIDA_AJUSTE.includes(tipo)) throw new Error('Tipo de saída inválido.');

  const produtoRef = doc(db, COLECAO_PRODUTOS, produtoId);
  const produtoOperacaoRef = operacaoId
    ? doc(db, COLECAO_OPERACOES, operacaoId, 'produtos', produtoId)
    : null;

  return runTransaction(db, async (transaction) => {
    const produtoSnap = await transaction.get(produtoRef);
    if (!produtoSnap.exists()) throw new Error('Produto não encontrado.');

    const produtoOperacaoSnap = produtoOperacaoRef
      ? await transaction.get(produtoOperacaoRef)
      : null;
    const estaNaOperacao = !!produtoOperacaoSnap?.exists();

    const produto = produtoSnap.data();
    const dadosOperacao = estaNaOperacao ? produtoOperacaoSnap.data() : null;

    const estoqueAtual = estaNaOperacao
      ? calcularSaldoOperacao(dadosOperacao)
      : produto.estoque ?? 0;

    if (quantidade > estoqueAtual) {
      throw new Error(`Quantidade maior que o estoque atual (${Math.max(0, estoqueAtual)} un).`);
    }

    const novoEstoque = estoqueAtual - quantidade;
    const custoMedio = produto.custoMedio ?? produto.custoUnitario ?? 0;

    transaction.update(produtoRef, { estoque: novoEstoque });

    if (estaNaOperacao) {
      transaction.update(produtoOperacaoRef, {
        ajusteSaidaQtd: (dadosOperacao.ajusteSaidaQtd || 0) + quantidade,
        saldoEstoque: novoEstoque,
      });
    }

    transaction.set(novoMovimentoRef(), {
      ...montarMovimento({
        produtoId,
        produtoNome: produto.title,
        tipo,
        quantidade,
        custoUnitario: custoMedio > 0 ? custoMedio : null,
        usuarioUid,
        usuarioNome,
        operacaoId: estaNaOperacao ? operacaoId : null,
        observacao,
      }),
      estoqueAnterior: estoqueAtual,
      estoquePosterior: novoEstoque,
    });

    return { novoEstoque };
  });
}
