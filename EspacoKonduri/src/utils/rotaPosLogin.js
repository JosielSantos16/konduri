export function getRotaPosLogin(usuario, firebaseUser) {
  if (!firebaseUser?.emailVerified) {
    return '/verificar-email';
  }

  if (!usuario?.nome) {
    return '/completar-perfil';
  }

  if (usuario.perfil === 'adm') return '/painel';
  if (usuario.perfil === 'atendente') return '/pdv';
  return '/cliente-home';
}