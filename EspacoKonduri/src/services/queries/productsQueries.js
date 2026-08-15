import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { deleteDoc } from 'firebase/firestore';

const COLECAO_PRODUTOS = 'products';

/**
 * Escuta a coleção de produtos em tempo real. Toda vez que um produto
 * é criado ou editado no Firestore (em qualquer tela, por qualquer usuário),
 * o callback é chamado de novo com a lista atualizada — automaticamente,
 * sem precisar recarregar nada.
 *
 * Retorna uma função de "unsubscribe" para parar de escutar quando o
 * componente que usa isso for desmontado.
 */
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

/**
 * Cria um novo produto no Firestore.
 */
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
}) {
  const produtoRef = doc(collection(db, COLECAO_PRODUTOS));

  const saldoEstoque = estoqueInicial + entradaQtd - saidaQtd;

  await setDoc(produtoRef, {
    title,
    price,
    image: image || null,
    category,
    unidade,
    estoque: saldoEstoque, // saldo real, usado pelo PDV e pelas operações
    estoqueInicial,
    entradaQtd,
    saidaQtd,
    valorEntradas,
    valorSaidas,
    observacoes: observacoes || '',
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