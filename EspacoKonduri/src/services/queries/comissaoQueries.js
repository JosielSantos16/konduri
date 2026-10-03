import { doc, setDoc, onSnapshot, collection, query, where, getDocs} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { criarNotificacaoPessoal } from './notificacoesQueries';

const COLECAO_COMISSOES = 'comissoes';

function gerarId(dataISO, responsavelUid) {
  return `${dataISO}_${responsavelUid}`;
}

export async function salvarComissao({
  dataISO,
  responsavelUid,
  responsavelNome,
  percentual,
  baseCalculo,
  definidoPorUid,
}) {
  const valorComissao = baseCalculo * (percentual / 100);
  const id = gerarId(dataISO, responsavelUid);

  await setDoc(doc(db, COLECAO_COMISSOES, id), {
    data: dataISO,
    responsavelUid,
    responsavelNome,
    percentual,
    baseCalculo,
    valorComissao,
    definidoPorUid,
    atualizadoEm: new Date().toISOString(),
  });

  await criarNotificacaoPessoal({
  destinatarioUid: responsavelUid,
  tipo: 'comissao_definida',
  titulo: 'Comissão definida',
  mensagem: `Sua comissão de ${dataISO} foi definida em ${percentual}%.`,
});

  return { id, valorComissao };
}

export function subscribeToComissao(dataISO, responsavelUid, callback) {
  const id = gerarId(dataISO, responsavelUid);

  return onSnapshot(doc(db, COLECAO_COMISSOES, id), (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  });
}

export async function buscarDiasComComissaoNoMes(anoMes) {
  const inicio = `${anoMes}-01`;
  const fim = `${anoMes}-31`;

  const q = query(
    collection(db, COLECAO_COMISSOES),
    where('data', '>=', inicio),
    where('data', '<=', fim)
  );

  const snapshot = await getDocs(q);

  const diasComComissao = new Set();
  snapshot.docs.forEach((docSnap) => {
    diasComComissao.add(docSnap.data().data);
  });

  return Array.from(diasComComissao);
}

// Comissões de todos os atendentes entre duas datas 'AAAA-MM-DD' (inclusive)
export function subscribeToComissoesPorPeriodo(inicioISO, fimISO, callback) {
  const q = query(
    collection(db, COLECAO_COMISSOES),
    where('data', '>=', inicioISO),
    where('data', '<=', fimISO)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
}

// Comissões do mês (anoMes = 'AAAA-MM'), usadas como custo variável automático
// em Custos e Despesas
export function subscribeToComissoesDoMes(anoMes, callback) {
  return subscribeToComissoesPorPeriodo(`${anoMes}-01`, `${anoMes}-31`, callback);
}
