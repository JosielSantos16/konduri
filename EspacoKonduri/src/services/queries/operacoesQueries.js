import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_OPERACOES = 'operacoes';

export async function abrirOperacao({ responsavelUid, responsavelNome, local, produtos }) {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split('T')[0]; // "2026-08-14"

  const operacaoRef = doc(collection(db, COLECAO_OPERACOES));

  await setDoc(operacaoRef, {
    data: dataFormatada,
    responsavelUid,
    responsavelNome,
    local,
    status: 'aberta',
    criadoEm: hoje.toISOString(),
    fechadoEm: null,
  });

  await Promise.all(
    produtos.map((produto) =>
      setDoc(doc(db, COLECAO_OPERACOES, operacaoRef.id, 'produtos', produto.id), {
        produtoId: produto.id,
        nome: produto.title,
        unidade: produto.unidade || 'un',
        estoqueInicial: produto.estoque || 0,
        entradaQtd: 0,
        saidaQtd: 0,
        valorEntradas: 0,
        valorSaidas: 0,
        saldoEstoque: produto.estoque || 0,
      })
    )
  );

  return { id: operacaoRef.id };
}

export async function buscarOperacaoAtiva() {
  const q = query(
    collection(db, COLECAO_OPERACOES),
    where('status', '==', 'aberta'),
    orderBy('criadoEm', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function listarProdutosDaOperacao(operacaoId) {
  const snapshot = await getDocs(
    collection(db, COLECAO_OPERACOES, operacaoId, 'produtos')
  );
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function buscarOperacaoPorId(operacaoId) {
  const snapshot = await getDoc(doc(db, COLECAO_OPERACOES, operacaoId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function fecharOperacao(operacaoId) {
  await updateDoc(doc(db, COLECAO_OPERACOES, operacaoId), {
    status: 'fechada',
    fechadoEm: new Date().toISOString(),
  });
}

/**
 * Busca um único produto dentro de uma operação específica.
 */
export async function buscarProdutoDaOperacao(operacaoId, produtoId) {
  const snapshot = await getDoc(doc(db, COLECAO_OPERACOES, operacaoId, 'produtos', produtoId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

/**
 * Atualiza a entrada/saída de um produto dentro de uma operação, recalculando
 * o saldo em estoque automaticamente (estoqueInicial + entradaQtd - saidaQtd).
 */
export async function atualizarProdutoDaOperacao(operacaoId, produtoId, campos) {
  const produtoRef = doc(db, COLECAO_OPERACOES, operacaoId, 'produtos', produtoId);
  const atual = await getDoc(produtoRef);

  if (!atual.exists()) {
    throw new Error('Produto não encontrado nesta operação.');
  }

  const dadosAtuais = atual.data();
  const dadosAtualizados = { ...dadosAtuais, ...campos };

  const saldoEstoque =
    dadosAtualizados.estoqueInicial + dadosAtualizados.entradaQtd - dadosAtualizados.saidaQtd;

  await updateDoc(produtoRef, { ...campos, saldoEstoque });
}