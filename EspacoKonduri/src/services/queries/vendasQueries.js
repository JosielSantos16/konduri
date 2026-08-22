import { paraDataISOLocal } from '../../utils/dataLocal';
import { criarNotificacaoPorPerfil } from '../../services/queries/notificacoesQueries'; // ajusta o caminho se necessário
import { formatPrice } from '../../utils/formatPrice';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const COLECAO_VENDAS = 'vendas';

function dataDeHoje() {
  return paraDataISOLocal();
}

export async function registrarVendaFirestore({
  operacaoId,
  responsavelUid,
  responsavelNome,
  total,
  metodo,
  itens,
}) {
  const vendaRef = doc(collection(db, COLECAO_VENDAS));

  const venda = {
    operacaoId: operacaoId || null,
    responsavelUid: responsavelUid || null,
    responsavelNome: responsavelNome || '',
    total,
    metodo,
    itens,
    data: dataDeHoje(),
    criadoEm: new Date().toISOString(),
  };

  await setDoc(vendaRef, venda);

  const resumoItens = (itens || [])
    .map((item) => `${item.qty}x ${item.title}`)
    .join(', ');

  await criarNotificacaoPorPerfil({
    paraPerfis: ['adm'],
    tipo: 'venda_realizada',
    titulo: 'Venda realizada',
    mensagem: `${responsavelNome}: ${resumoItens} — ${formatPrice(total)}`,
    imagens: (itens || []).slice(0, 3).map((i) => i.image).filter(Boolean),
    total,
    rota: '/vendas',
  });

  return { id: vendaRef.id, ...venda };
}

export function subscribeToVendasHoje(callback) {
  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '==', dataDeHoje()),
    orderBy('criadoEm', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const vendas = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(vendas);
  });
}

export function subscribeToVendasPorData(dataISO, callback) {
  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '==', dataISO),
    orderBy('criadoEm', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const vendas = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    callback(vendas);
  });
}

export async function buscarDiasComVendasNoMes(anoMes) {
  const inicio = `${anoMes}-01`;
  const fim = `${anoMes}-31`; 

  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '>=', inicio),
    where('data', '<=', fim)
  );

  const snapshot = await getDocs(q);

  const diasComVenda = new Set();
  snapshot.docs.forEach((docSnap) => {
    diasComVenda.add(docSnap.data().data);
  });

  return Array.from(diasComVenda);
}