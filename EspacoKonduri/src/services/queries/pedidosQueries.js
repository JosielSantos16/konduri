import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_PEDIDOS = 'pedidos';

export async function criarPedido({ clienteUid, clienteNome, itens, total, observacoes }) {
  const pedidoRef = doc(collection(db, COLECAO_PEDIDOS));

  await setDoc(pedidoRef, {
    clienteUid,
    clienteNome,
    itens,
    total,
    observacoes: observacoes || '',
    status: 'pendente',
    pago: false,
    criadoEm: new Date().toISOString(),
  });

  return { id: pedidoRef.id };
}

export async function buscarPedidoPorId(pedidoId) {
  const snapshot = await getDoc(doc(db, COLECAO_PEDIDOS, pedidoId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export function subscribeToPedidosAtivos(callback) {
  const q = query(
    collection(db, COLECAO_PEDIDOS),
    where('status', 'in', ['pendente', 'aceito', 'preparando', 'pronto']),
    orderBy('criadoEm', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(pedidos);
  });
}

export function subscribeToPedidosDoCliente(clienteUid, callback) {
  const q = query(
    collection(db, COLECAO_PEDIDOS),
    where('clienteUid', '==', clienteUid),
    orderBy('criadoEm', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(pedidos);
  });
}

export async function atualizarStatusPedido(pedidoId, novoStatus) {
  await updateDoc(doc(db, COLECAO_PEDIDOS, pedidoId), {
    status: novoStatus,
    atualizadoEm: new Date().toISOString(),
  });
}

export async function atualizarItensPedido(pedidoId, itens, total, observacoes) {
  await updateDoc(doc(db, COLECAO_PEDIDOS, pedidoId), {
    itens,
    total,
    observacoes: observacoes || '',
    atualizadoEm: new Date().toISOString(),
  });
}

export async function atualizarPagamentoPedido(pedidoId, pago) {
  await updateDoc(doc(db, COLECAO_PEDIDOS, pedidoId), {
    pago,
    atualizadoEm: new Date().toISOString(),
  });
}