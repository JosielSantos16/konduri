import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/fireBaseCondig';
import { deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

const COLECAO_USUARIOS = 'usuarios';

export async function cadastrarUsuario({ nome, email, senha, perfil = 'cliente' }) {
  const credenciais = await createUserWithEmailAndPassword(auth, email, senha);

  await setDoc(doc(db, 'usuarios', credenciais.user.uid), {
    nome,
    email,
    perfil,
    criadoEm: new Date().toISOString(),
  });

  await sendEmailVerification(credenciais.user);

  return credenciais.user;
}

export async function loginUsuario({ email, senha }) {
  const credenciais = await signInWithEmailAndPassword(auth, email, senha);
  const perfil = await buscarPerfilUsuario(credenciais.user.uid);

  if (!perfil) {
    throw new Error('Usuário autenticado, mas sem registro na coleção de usuários.');
  }

  return perfil;
}

export async function buscarPerfilUsuario(uid) {
  const snapshot = await getDoc(doc(db, COLECAO_USUARIOS, uid));
  if (!snapshot.exists()) return null;
  return { uid, ...snapshot.data() };
}

export async function deslogarUsuario() {
  await signOut(auth);
}

export async function enviarRecuperacaoSenha(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function garantirUsuarioNoFirestore({ uid, nome, email }) {
  const ref = doc(db, COLECAO_USUARIOS, uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      nome,
      email,
      perfil: 'cliente',
      criadoEm: new Date().toISOString(),
    });
  }

  return buscarPerfilUsuario(uid);
}

export async function atualizarPerfilUsuario(uid, { nome, foto }) {
  const dados = {};
  if (nome !== undefined) dados.nome = nome;
  if (foto !== undefined) dados.foto = foto;

  await updateDoc(doc(db, COLECAO_USUARIOS, uid), dados);
}

export async function reenviarEmailVerificacao() {
  if (!auth.currentUser) {
    throw new Error('Nenhum usuário logado.');
  }
  await sendEmailVerification(auth.currentUser);
}

export async function buscarPushTokenPorUid(uid) {
  const snapshot = await getDoc(doc(db, COLECAO_USUARIOS, uid));
  if (!snapshot.exists()) return null;
  const dados = snapshot.data();
  if (dados?.notificacoesAtivadas === false) return null; // ← respeita a preferência
  return dados?.pushToken || null;
}

export async function buscarPushTokensPorPerfis(perfis) {
  const q = query(collection(db, COLECAO_USUARIOS), where('perfil', 'in', perfis));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .filter((d) => d.data()?.notificacoesAtivadas !== false) // ← respeita a preferência
    .map((d) => d.data()?.pushToken)
    .filter(Boolean);
}

export async function trocarSenha(senhaAtual, novaSenha) {
  const usuarioAtual = auth.currentUser;
  if (!usuarioAtual) throw new Error('Nenhum usuário logado.');

  const credential = EmailAuthProvider.credential(usuarioAtual.email, senhaAtual);
  await reauthenticateWithCredential(usuarioAtual, credential);
  await updatePassword(usuarioAtual, novaSenha);
}

export async function excluirConta(senhaAtual) {
  const usuarioAtual = auth.currentUser;
  if (!usuarioAtual) throw new Error('Nenhum usuário logado.');

  const provedor = usuarioAtual.providerData[0]?.providerId;

  if (provedor === 'password') {
    if (!senhaAtual) throw new Error('Senha necessária para confirmar a exclusão.');
    const credential = EmailAuthProvider.credential(usuarioAtual.email, senhaAtual);
    await reauthenticateWithCredential(usuarioAtual, credential);
  }

  // Apaga os dados do Firestore primeiro, enquanto ainda está autenticado
  // (depois de apagar a conta, ele perde acesso pra fazer isso)
  await deleteDoc(doc(db, COLECAO_USUARIOS, usuarioAtual.uid));

  await deleteUser(usuarioAtual);
}