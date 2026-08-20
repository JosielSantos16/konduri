import { db } from "../../firebase/fireBaseCondig";
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
} from "firebase/firestore";

import {
  criarNotificacaoPorPerfil,
  criarNotificacaoPessoal,
} from "./notificacoesQueries";

const COLECAO_PEDIDOS = "pedidos";

export async function criarPedido({
  clienteUid,
  clienteNome,
  itens,
  total,
  observacoes,
}) {
  const pedidoRef = doc(collection(db, COLECAO_PEDIDOS));

  await setDoc(pedidoRef, {
    clienteUid,
    clienteNome,
    itens,
    total,
    observacoes: observacoes || "",
    status: "pendente",
    pago: false,
    criadoEm: new Date().toISOString(),
  });

  await criarNotificacaoPorPerfil({
    paraPerfis: ["atendente", "adm"],
    tipo: "novo_pedido",
    titulo: "Novo pedido recebido",
    mensagem: `${clienteNome}: ${formatarResumoItens(itens)}`,
    pedidoId: pedidoRef.id,
    imagens: itens
      .slice(0, 3)
      .map((i) => i.image)
      .filter(Boolean), 
    total: total,
    clienteNome: clienteNome,
    rota: "/pedido",
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
    where("status", "in", ["pendente", "aceito", "preparando", "pronto"]),
    orderBy("criadoEm", "asc"),
  );

  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(pedidos);
  });
}

export function subscribeToPedidosDoCliente(clienteUid, callback) {
  const q = query(
    collection(db, COLECAO_PEDIDOS),
    where("clienteUid", "==", clienteUid),
    orderBy("criadoEm", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(pedidos);
  });
}

export async function atualizarStatusPedido(pedidoId, novoStatus, clienteUid) {
  await updateDoc(doc(db, COLECAO_PEDIDOS, pedidoId), {
    status: novoStatus,
    atualizadoEm: new Date().toISOString(),
  });

  const mensagens = {
    aceito: "Seu pedido foi aceito e já entrou na fila!",
    preparando: "Seu pedido está sendo preparado.",
    pronto: "Seu pedido está pronto! Pode vir buscar.",
  };

  if (clienteUid && mensagens[novoStatus]) {
    const pedido = await buscarPedidoPorId(pedidoId);

    await criarNotificacaoPessoal({
      destinatarioUid: clienteUid,
      tipo: 'status_pedido',
      titulo: 'Atualização do seu pedido',
      mensagem: `${mensagens[novoStatus]} ${formatarResumoItens(pedido?.itens)}`,
      pedidoId,
      imagens: (pedido?.itens || []).slice(0, 3).map((i) => i.image).filter(Boolean),
      total: pedido?.total ?? null,
      rota: '/meu-pedido',
    });
  }
}

export async function atualizarItensPedido(
  pedidoId,
  itens,
  total,
  observacoes,
) {
  await updateDoc(doc(db, COLECAO_PEDIDOS, pedidoId), {
    itens,
    total,
    observacoes: observacoes || "",
    atualizadoEm: new Date().toISOString(),
  });
}

export async function atualizarPagamentoPedido(pedidoId, pago) {
  await updateDoc(doc(db, COLECAO_PEDIDOS, pedidoId), {
    pago,
    atualizadoEm: new Date().toISOString(),
  });
}

function formatarResumoItens(itens) {
  if (!itens || itens.length === 0) return "pedido vazio";

  const linhas = itens.map((item) => `${item.qty}x ${item.title}`);

  if (linhas.length <= 2) {
    return linhas.join(", ");
  }

  return `${linhas.slice(0, 2).join(", ")} e mais ${linhas.length - 2}`;
}

export function subscribeToPedidosDoAtendente(callback) {
  const q = query(
    collection(db, COLECAO_PEDIDOS),
    where("status", "in", [
      "pendente",
      "aceito",
      "preparando",
      "pronto",
      "cancelado",
    ]),
    orderBy("criadoEm", "asc"),
  );

  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(pedidos);
  });
}
