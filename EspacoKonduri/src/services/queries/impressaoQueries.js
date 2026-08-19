import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_IMPRESSOES = 'impressoes';

/**
 * Cria um pedido de impressão na fila. É chamado toda vez que uma venda
 * é finalizada, em qualquer aparelho (celular ou Sunmi/PDA).
 * O aparelho responsável por imprimir (rodando um "ouvinte" da fila)
 * processa esse pedido automaticamente quando estiver configurado.
 */
export async function criarPedidoImpressao({ itens, total, metodo, data, responsavel }) {
  const pedidoRef = doc(collection(db, COLECAO_IMPRESSOES));

  await setDoc(pedidoRef, {
    itens,
    total,
    metodo,
    data,
    responsavel,
    status: 'pendente', // 'pendente' | 'impresso' | 'erro'
    criadoEm: new Date().toISOString(),
  });

  return { id: pedidoRef.id };
}

/**
 * Escuta em tempo real os pedidos de impressão ainda pendentes.
 * Usado pelo aparelho que efetivamente imprime (o Sunmi/PDA).
 */
export function subscribeToPedidosPendentes(callback) {
  const q = query(
    collection(db, COLECAO_IMPRESSOES),
    where('status', '==', 'pendente'),
    orderBy('criadoEm', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(pedidos);
  });
}

/**
 * Escuta em tempo real o status de um pedido de impressão específico —
 * usado pela tela de Status pra mostrar se já imprimiu, ainda está
 * pendente, ou deu erro.
 */
export function subscribeToStatusImpressao(pedidoId, callback) {
  return onSnapshot(doc(db, COLECAO_IMPRESSOES, pedidoId), (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  });
}

/**
 * Marca um pedido como já impresso, para não processar de novo.
 */
export async function marcarComoImpresso(pedidoId) {
  await updateDoc(doc(db, COLECAO_IMPRESSOES, pedidoId), {
    status: 'impresso',
    impressoEm: new Date().toISOString(),
  });
}

/**
 * Marca um pedido com erro, se a impressão falhar.
 */
export async function marcarComoErro(pedidoId, mensagemErro) {
  await updateDoc(doc(db, COLECAO_IMPRESSOES, pedidoId), {
    status: 'erro',
    erro: mensagemErro,
  });
}