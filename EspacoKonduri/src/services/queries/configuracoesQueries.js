import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

// Configurações da Gestão Financeira num documento único
const configuracoesGestaoRef = () => doc(db, 'configuracoes', 'gestao');

export const MARGEM_MINIMA_PADRAO = 30;

export function subscribeToConfiguracoesGestao(callback) {
  return onSnapshot(configuracoesGestaoRef(), (snapshot) => {
    callback({
      margemMinima: MARGEM_MINIMA_PADRAO,
      ...(snapshot.exists() ? snapshot.data() : {}),
    });
  });
}

export async function salvarMargemMinima(margemMinima, { usuarioUid } = {}) {
  await setDoc(
    configuracoesGestaoRef(),
    {
      margemMinima,
      atualizadoEm: new Date().toISOString(),
      atualizadoPor: usuarioUid || null,
    },
    { merge: true }
  );
}
