import { paraDataISOLocal } from '../../utils/dataLocal';

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_VENDAS = 'vendas';

function dataDeHoje() {
  return paraDataISOLocal();
}

export async function registrarVendaFirestore({
  operacaoId,
  responsavelUid,
  responsavelNome,
  total,
  metodo,
  itens,
}) {
  const vendaRef = doc(collection(db, COLECAO_VENDAS));

  const venda = {
    operacaoId: operacaoId || null,
    responsavelUid: responsavelUid || null,
    responsavelNome: responsavelNome || '',
    total,
    metodo,
    itens,
    data: dataDeHoje(),
    criadoEm: new Date().toISOString(),
  };

  await setDoc(vendaRef, venda);

  return { id: vendaRef.id, ...venda };
}

export function subscribeToVendasHoje(callback) {
  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '==', dataDeHoje()),
    orderBy('criadoEm', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const vendas = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(vendas);
  });
}

export function subscribeToVendasPorData(dataISO, callback) {
  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '==', dataISO),
    orderBy('criadoEm', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const vendas = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(vendas);
  });
}

/**
 * Busca quais dias, dentro de um mês específico, tiveram pelo menos
 * uma venda registrada — usado para marcar bolinhas no calendário.
 * anoMes no formato "2026-08".
 */
export async function buscarDiasComVendasNoMes(anoMes) {
  const inicio = `${anoMes}-01`;
  const fim = `${anoMes}-31`; // comparação de string funciona bem com YYYY-MM-DD

  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '>=', inicio),
    where('data', '<=', fim)
  );

  const snapshot = await getDocs(q);

  const diasComVenda = new Set();
  snapshot.docs.forEach((docSnap) => {
    diasComVenda.add(docSnap.data().data);
  });

  return Array.from(diasComVenda);
}