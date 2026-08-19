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

/**
 * Cria uma notificação pessoal (só um destinatário específico vê).
 */
export async function criarNotificacaoPessoal({ destinatarioUid, tipo, titulo, mensagem, pedidoId }) {
  const ref = doc(collection(db, COLECAO_NOTIFICACOES));
  await setDoc(ref, {
    destinatarioUid,
    paraPerfis: [],
    tipo,
    titulo,
    mensagem,
    pedidoId: pedidoId || null,
    lidaPor: [],
    criadoEm: new Date().toISOString(),
  });
}

/**
 * Cria uma notificação pra todo mundo que tiver um dos perfis informados
 * (ex: ['atendente', 'adm']) — usado pra avisos que interessam à equipe.
 */
export async function criarNotificacaoPorPerfil({ paraPerfis, tipo, titulo, mensagem, pedidoId }) {
  const ref = doc(collection(db, COLECAO_NOTIFICACOES));
  await setDoc(ref, {
    destinatarioUid: null,
    paraPerfis,
    tipo,
    titulo,
    mensagem,
    pedidoId: pedidoId || null,
    lidaPor: [],
    criadoEm: new Date().toISOString(),
  });
}

/**
 * Escuta em tempo real as notificações relevantes pro usuário logado —
 * combina as pessoais (por uid) com as do perfil dele (por cargo).
 */
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

/**
 * Marca uma notificação como lida pelo usuário atual.
 */
export async function marcarNotificacaoComoLida(notifId, uid) {
  await updateDoc(doc(db, COLECAO_NOTIFICACOES, notifId), {
    lidaPor: arrayUnion(uid),
  });
}