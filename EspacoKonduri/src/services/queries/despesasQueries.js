import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { deslocarCompetencia, ehRecorrente } from '../../utils/despesas';

const COLECAO_DESPESAS = 'despesas';

// A coleção é pequena (dezenas de despesas), então a lista inteira é lida e o
// filtro por competência é feito no app (utils/despesas)
export function subscribeToDespesas(callback) {
  const q = query(collection(db, COLECAO_DESPESAS), orderBy('criadoEm', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const despesas = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(despesas);
  });
}

export async function buscarDespesaPorId(despesaId) {
  const snapshot = await getDoc(doc(db, COLECAO_DESPESAS, despesaId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function criarDespesa(dados, { usuarioUid, usuarioNome } = {}) {
  const despesaRef = doc(collection(db, COLECAO_DESPESAS));
  const agora = new Date().toISOString();

  await setDoc(despesaRef, {
    competenciaFim: null,
    pagamentos: {},
    ...dados,
    usuarioUid: usuarioUid || null,
    usuarioNome: usuarioNome || '',
    criadoEm: agora,
    atualizadoEm: agora,
  });

  return { id: despesaRef.id };
}

export async function atualizarDespesa(despesaId, campos) {
  await updateDoc(doc(db, COLECAO_DESPESAS, despesaId), {
    ...campos,
    atualizadoEm: new Date().toISOString(),
  });
}

export async function excluirDespesa(despesaId) {
  await deleteDoc(doc(db, COLECAO_DESPESAS, despesaId));
}

// Despesa única guarda pago/dataPagamento; recorrente guarda um pagamento por
// competência no mapa pagamentos
export async function marcarPagamento(despesa, competencia, pago) {
  const hoje = paraDataISOLocal();

  if (!ehRecorrente(despesa)) {
    await atualizarDespesa(despesa.id, { pago, dataPagamento: pago ? hoje : null });
    return;
  }

  await atualizarDespesa(despesa.id, {
    [`pagamentos.${competencia}`]: pago ? hoje : deleteField(),
  });
}

// Para de repetir a despesa a partir da competência informada. Se ela nem
// chegou a valer antes disso, é excluída.
export async function encerrarRecorrencia(despesa, competencia) {
  const competenciaFim = deslocarCompetencia(competencia, -1);

  if (competenciaFim < despesa.competencia) {
    await excluirDespesa(despesa.id);
    return;
  }

  await atualizarDespesa(despesa.id, { competenciaFim });
}

// Altera uma despesa recorrente só daqui para frente: a original é encerrada
// no mês anterior e uma nova começa na competência informada. Assim os meses
// passados continuam com o valor antigo.
export async function alterarRecorrenteAPartirDe(despesa, novosCampos, competencia) {
  const batch = writeBatch(db);
  const agora = new Date().toISOString();

  const pagamentosFuturos = Object.fromEntries(
    Object.entries(despesa.pagamentos || {}).filter(([comp]) => comp >= competencia)
  );

  const novaRef = doc(collection(db, COLECAO_DESPESAS));
  batch.set(novaRef, {
    ...novosCampos,
    competencia,
    competenciaFim: despesa.competenciaFim || null,
    pagamentos: pagamentosFuturos,
    usuarioUid: despesa.usuarioUid || null,
    usuarioNome: despesa.usuarioNome || '',
    criadoEm: agora,
    atualizadoEm: agora,
  });

  batch.update(doc(db, COLECAO_DESPESAS, despesa.id), {
    competenciaFim: deslocarCompetencia(competencia, -1),
    atualizadoEm: agora,
  });

  await batch.commit();
  return { id: novaRef.id };
}
