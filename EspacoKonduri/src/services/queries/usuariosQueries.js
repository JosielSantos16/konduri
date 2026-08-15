import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/fireBaseCondig';
import { signOut } from 'firebase/auth';

const COLECAO_USUARIOS = 'usuarios';

const PERFIL_PADRAO = 'Atendente';

export async function cadastrarUsuario({ nome, email, senha }) {
  const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
  const uid = credenciais.user.uid;

  const dadosUsuario = {
    nome,
    email,
    perfil: PERFIL_PADRAO,
    criadoEm: new Date().toISOString(),
  };

  await setDoc(doc(db, COLECAO_USUARIOS, uid), dadosUsuario);

  return { uid, ...dadosUsuario };
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