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
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_PRODUTOS = 'products';

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

export async function registrarEntradaComCusto(produtoId, { quantidade, custoUnitario }) {
  const produto = await buscarProdutoPorId(produtoId);
  if (!produto) throw new Error('Produto não encontrado.');

  const estoqueAtual = produto.estoque ?? 0;
  const custoMedioAtual = produto.custoMedio ?? produto.custoUnitario ?? 0;

  const valorEstoqueAtual = estoqueAtual * custoMedioAtual;
  const valorEntrada = quantidade * custoUnitario;
  const novoEstoque = estoqueAtual + quantidade;

  const novoCustoMedio = novoEstoque > 0
    ? (valorEstoqueAtual + valorEntrada) / novoEstoque
    : custoUnitario;

  await updateDoc(doc(db, COLECAO_PRODUTOS, produtoId), {
    estoque: novoEstoque,
    custoMedio: novoCustoMedio,
    custoUnitario: novoCustoMedio,
  });

  return { novoEstoque, novoCustoMedio };
}