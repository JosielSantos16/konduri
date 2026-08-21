import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/fireBaseCondig';
import { sendEmailVerification } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

