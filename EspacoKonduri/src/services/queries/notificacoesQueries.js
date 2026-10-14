import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { enviarPushExpo } from '../notificacoes/enviarPushExpo';
import { buscarPushTokenPorUid, buscarPushTokensPorPerfis } from './usuariosQueries';

const COLECAO_NOTIFICACOES = 'notificacoes';

export async function criarNotificacaoPessoal({ destinatarioUid, tipo, titulo, mensagem, pedidoId, imagens, total, rota }) {
  const ref = doc(collection(db, COLECAO_NOTIFICACOES));
  await setDoc(ref, {
    destinatarioUid,
    paraPerfis: [],
    tipo,
    titulo,
    mensagem,
    pedidoId: pedidoId || null,
    imagens: imagens || [],
    total: total ?? null,
    clienteNome: null,
    rota: rota || null,
    lidaPor: [],
    ocultoPara: [],
    criadoEm: new Date().toISOString(),
  });

  const token = await buscarPushTokenPorUid(destinatarioUid);
  if (token) {
    await enviarPushExpo({
      pushToken: token,
      titulo,
      mensagem,
      dados: { rota },
    });
  }
}

export async function criarNotificacaoPorPerfil({ paraPerfis, tipo, titulo, mensagem, pedidoId, imagens, total, clienteNome, rota }) {
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
    ocultoPara: [],
    criadoEm: new Date().toISOString(),
  });

  const tokens = await buscarPushTokensPorPerfis(paraPerfis);
  await Promise.all(
    tokens.map((token) =>
      enviarPushExpo({
        pushToken: token,
        titulo,
        mensagem,
        dados: { rota },
      })
    )
  );
}

// Só as mais recentes: cada venda gera uma notificação para o admin, e baixar
// o histórico inteiro deixava a tela lenta (e cada vez mais lenta)
export const LIMITE_NOTIFICACOES = 50;

// callback(lista, { carregado }): carregado fica true quando as duas buscas
// (pessoais e do perfil) já responderam, para a tela saber quando parar de
// mostrar "carregando" em vez de mostrar "nenhuma notificação" cedo demais
export function subscribeToNotificacoes(usuario, callback) {
  if (!usuario?.uid) return () => {};

  let pessoais = [];
  let porPerfil = [];
  let recebeuPessoais = false;
  let recebeuPorPerfil = false;

  const emitir = () => {
    const combinadas = [...pessoais, ...porPerfil]
      .filter((n) => !(n.ocultoPara || []).includes(usuario.uid)) // ← filtra ocultadas
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
      .slice(0, LIMITE_NOTIFICACOES);
    callback(combinadas, { carregado: recebeuPessoais && recebeuPorPerfil });
  };

  const qPessoal = query(
    collection(db, COLECAO_NOTIFICACOES),
    where('destinatarioUid', '==', usuario.uid),
    orderBy('criadoEm', 'desc'),
    limit(LIMITE_NOTIFICACOES)
  );

  const qPerfil = query(
    collection(db, COLECAO_NOTIFICACOES),
    where('paraPerfis', 'array-contains', usuario.perfil),
    orderBy('criadoEm', 'desc'),
    limit(LIMITE_NOTIFICACOES)
  );

  // Se uma busca falhar (sem internet, sem permissão), a tela não pode ficar
  // carregando para sempre: conta como respondida, com o que houver
  const unsub1 = onSnapshot(
    qPessoal,
    (snapshot) => {
      pessoais = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      recebeuPessoais = true;
      emitir();
    },
    (erro) => {
      console.error('Erro ao carregar notificações pessoais:', erro);
      recebeuPessoais = true;
      emitir();
    }
  );

  const unsub2 = onSnapshot(
    qPerfil,
    (snapshot) => {
      porPerfil = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      recebeuPorPerfil = true;
      emitir();
    },
    (erro) => {
      console.error('Erro ao carregar notificações do perfil:', erro);
      recebeuPorPerfil = true;
      emitir();
    }
  );

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

export async function ocultarNotificacao(notifId, uid) {
  await updateDoc(doc(db, COLECAO_NOTIFICACOES, notifId), {
    ocultoPara: arrayUnion(uid),
  });
}

export async function ocultarTodasNotificacoes(notificacoesIds, uid) {
  await Promise.all(
    notificacoesIds.map((id) =>
      updateDoc(doc(db, COLECAO_NOTIFICACOES, id), { ocultoPara: arrayUnion(uid) })
    )
  );
}