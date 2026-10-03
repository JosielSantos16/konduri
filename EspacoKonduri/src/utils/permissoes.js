// Dados gerenciais (custo, CMV, margem, despesas, ponto de equilíbrio) são só do admin.
// Por enquanto a restrição é apenas na interface; as regras do Firestore serão
// endurecidas numa fase separada.
export function ehAdmin(usuario) {
  return usuario?.perfil === 'adm';
}
