import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_VENDAS = 'vendas';

function dataDeHoje() {
  return new Date().toISOString().split('T')[0]; // "2026-08-15"
}

/**
 * Registra uma venda concluída, vinculada à operação do dia (se houver).
 */
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

/**
 * Escuta em tempo real todas as vendas registradas hoje.
 */
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