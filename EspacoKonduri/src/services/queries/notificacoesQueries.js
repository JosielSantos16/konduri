import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_NOTIFICACOES = 'notificacoes';

export async function criarNotificacaoPorPerfil({
  paraPerfis,
  tipo,
  titulo,
  mensagem,
  pedidoId,
  imagens,
  total,
  clienteNome,
  rota,
}) {
  const ref = doc(collection(db, COLECAO_NOTIFICACOES));
  await setDoc(ref, {
    destinatarioUid: null,
    paraPerfis,
    tipo,
    titulo,
    mensagem,
    pedidoId: pedidoId || null,
    imagens: imagens || [],
    total: total ?? null,
    clienteNome: clienteNome || null,
    rota: rota || null,
    lidaPor: [],
    criadoEm: new Date().toISOString(),
  });
}

export async function criarNotificacaoPessoal({
  destinatarioUid,
  tipo,
  titulo,
  mensagem,
  pedidoId,
  imagem,
  total,
  rota,
}) {
  const ref = doc(collection(db, COLECAO_NOTIFICACOES));
  await setDoc(ref, {
    destinatarioUid,
    paraPerfis: [],
    tipo,
    titulo,
    mensagem,
    pedidoId: pedidoId || null,
    imagem: imagem || null,
    total: total ?? null,
    clienteNome: null,
    rota: rota || null,
    lidaPor: [],
    criadoEm: new Date().toISOString(),
  });
}

export function subscribeToNotificacoes(usuario, callback) {
  if (!usuario?.uid) return () => {};

  let pessoais = [];
  let porPerfil = [];

  const emitir = () => {
    const combinadas = [...pessoais, ...porPerfil].sort(
      (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
    );
    callback(combinadas);
  };

  const qPessoal = query(
    collection(db, COLECAO_NOTIFICACOES),
    where('destinatarioUid', '==', usuario.uid),
    orderBy('criadoEm', 'desc')
  );

  const qPerfil = query(
    collection(db, COLECAO_NOTIFICACOES),
    where('paraPerfis', 'array-contains', usuario.perfil),
    orderBy('criadoEm', 'desc')
  );

  const unsub1 = onSnapshot(qPessoal, (snapshot) => {
    pessoais = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    emitir();
  });

  const unsub2 = onSnapshot(qPerfil, (snapshot) => {
    porPerfil = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    emitir();
  });

  return () => {
    unsub1();
    unsub2();
  };
}

export async function marcarNotificacaoComoLida(notifId, uid) {
  await updateDoc(doc(db, COLECAO_NOTIFICACOES, notifId), {
    lidaPor: arrayUnion(uid),
  });
}