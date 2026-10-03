import { paraDataISOLocal } from '../../utils/dataLocal';
import { criarNotificacaoPorPerfil } from '../../services/queries/notificacoesQueries'; // ajusta o caminho se necessário
import { formatPrice } from '../../utils/formatPrice';
import {
  collection,
  doc,
  writeBatch,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { TIPOS_MOVIMENTO, novoMovimentoRef, montarMovimento } from './estoqueMovimentosQueries';

const COLECAO_VENDAS = 'vendas';

function dataDeHoje() {
  return paraDataISOLocal();
}

function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

// Congela o custo de cada item no momento da venda, para que mudanças futuras
// no custo do produto não alterem o CMV histórico. Item sem custo cadastrado
// fica com custo null ("sem custo registrado"), e o CMV da venda também.
function congelarCustos(itens) {
  const itensComCusto = (itens || []).map((item) => {
    const custo = Number(item.custoUnitario);
    const custoUnitario = custo > 0 ? custo : null;

    return {
      ...item,
      custoUnitario,
      custoTotal: custoUnitario !== null ? arredondarCentavos(custoUnitario * item.qty) : null,
    };
  });

  const algumItemSemCusto = itensComCusto.some((item) => item.custoTotal === null);
  const cmvTotal = algumItemSemCusto
    ? null
    : arredondarCentavos(itensComCusto.reduce((soma, item) => soma + item.custoTotal, 0));

  return { itensComCusto, cmvTotal };
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

  const { itensComCusto, cmvTotal } = congelarCustos(itens);

  const venda = {
    operacaoId: operacaoId || null,
    responsavelUid: responsavelUid || null,
    responsavelNome: responsavelNome || '',
    total,
    metodo,
    itens: itensComCusto,
    cmvTotal,
    margemBruta: cmvTotal !== null ? arredondarCentavos(total - cmvTotal) : null,
    status: 'concluida',
    data: dataDeHoje(),
    criadoEm: new Date().toISOString(),
  };

  // Venda e movimentos de estoque são gravados juntos: ou tudo entra, ou nada
  const batch = writeBatch(db);
  batch.set(vendaRef, venda);

  itensComCusto.forEach((item) => {
    batch.set(
      novoMovimentoRef(),
      montarMovimento({
        produtoId: item.id,
        produtoNome: item.title,
        tipo: TIPOS_MOVIMENTO.VENDA,
        quantidade: item.qty,
        custoUnitario: item.custoUnitario,
        usuarioUid: responsavelUid,
        usuarioNome: responsavelNome,
        vendaId: vendaRef.id,
        operacaoId,
      })
    );
  });

  await batch.commit();

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

// Vendas entre duas datas 'AAAA-MM-DD' (inclusive), para a Gestão Financeira
export function subscribeToVendasPorPeriodo(inicioISO, fimISO, callback) {
  const q = query(
    collection(db, COLECAO_VENDAS),
    where('data', '>=', inicioISO),
    where('data', '<=', fimISO)
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