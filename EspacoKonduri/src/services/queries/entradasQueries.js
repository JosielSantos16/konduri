import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { paraDataISOLocal } from '../../utils/dataLocal';
import {
  METODO_CORTESIA,
  STATUS_RESERVA,
  VALOR_ENTRADA_PADRAO,
  avaliarReserva,
  configDaData,
  montarVendaDeEntrada,
} from '../../utils/entradas';

const COLECAO_RESERVAS = 'reservas_entrada';
// Pessoas reservadas por data, num documento por dia: o cliente confere as
// vagas sem precisar ler as reservas dos outros clientes
const COLECAO_OCUPACAO = 'ocupacao_entradas';
const COLECAO_VENDAS = 'vendas';

const configRef = () => doc(db, 'configuracoes', 'entradas');
const ocupacaoRef = (dataISO) => doc(db, COLECAO_OCUPACAO, dataISO);

export const ERROS_ENTRADA = {
  RESERVA_INDISPONIVEL: 'RESERVA_INDISPONIVEL',
  CORTESIA_SO_ADMIN: 'CORTESIA_SO_ADMIN',
};

function comPadroes(dados) {
  return {
    valorPadrao: VALOR_ENTRADA_PADRAO,
    lotacaoPadrao: null,
    datas: {},
    ...(dados || {}),
  };
}

/* Configuração (admin) */

export function subscribeToConfigEntradas(callback) {
  return onSnapshot(configRef(), (snapshot) => callback(comPadroes(snapshot.exists() ? snapshot.data() : null)));
}

export async function salvarPadroesEntradas({ valorPadrao, lotacaoPadrao }, { usuarioUid } = {}) {
  await setDoc(
    configRef(),
    { valorPadrao, lotacaoPadrao, atualizadoEm: new Date().toISOString(), atualizadoPor: usuarioUid || null },
    { merge: true }
  );
}

// valor ou lotacao null = usa o padrão; lotacao '' não é aceito aqui
export async function salvarDataEspecial(dataISO, { valor, lotacao }) {
  const excecao = {};
  if (valor !== null && valor !== undefined) excecao.valor = valor;
  if (lotacao !== undefined) excecao.lotacao = lotacao; // null = sem limite nesse dia
  await setDoc(configRef(), { datas: { [dataISO]: excecao } }, { merge: true });
}

export async function removerDataEspecial(dataISO) {
  await updateDoc(configRef(), { [`datas.${dataISO}`]: deleteField() });
}

/* Ocupação (previsão) */

export function subscribeToOcupacao(inicioISO, fimISO, callback) {
  const q = query(collection(db, COLECAO_OCUPACAO), where('data', '>=', inicioISO), where('data', '<=', fimISO));
  return onSnapshot(q, (snapshot) => {
    const porData = {};
    snapshot.docs.forEach((d) => {
      porData[d.id] = d.data().pessoasReservadas || 0;
    });
    callback(porData);
  });
}

/* Reservas (cliente) */

// Cria a reserva e soma as pessoas na ocupação do dia numa transação, para
// a lotação valer mesmo com várias pessoas reservando ao mesmo tempo
export async function reservarEntrada({ cliente, dataISO, quantidade }) {
  const reservaRef = doc(collection(db, COLECAO_RESERVAS));

  return runTransaction(db, async (transaction) => {
    const configSnap = await transaction.get(configRef());
    const ocupacaoSnap = await transaction.get(ocupacaoRef(dataISO));
    const config = comPadroes(configSnap.exists() ? configSnap.data() : null);
    const pessoasReservadas = ocupacaoSnap.exists() ? ocupacaoSnap.data().pessoasReservadas || 0 : 0;

    const avaliacao = avaliarReserva({
      config,
      dataISO,
      hojeISO: paraDataISOLocal(),
      quantidade,
      pessoasReservadas,
    });
    if (!avaliacao.ok) {
      const erro = new Error(avaliacao.motivo);
      erro.vagas = avaliacao.vagas;
      throw erro;
    }

    const { valor } = configDaData(config, dataISO);
    const agora = new Date().toISOString();
    const reserva = {
      clienteUid: cliente.uid,
      clienteNome: cliente.nome || '',
      clienteFoto: cliente.foto || null,
      clienteTelefone: cliente.telefone || null,
      data: dataISO,
      quantidade,
      valorPrevistoUnitario: valor, // informativo: o valor cobrado é o da portaria no dia
      status: STATUS_RESERVA.RESERVADA,
      criadoEm: agora,
    };

    transaction.set(reservaRef, reserva);
    transaction.set(ocupacaoRef(dataISO), {
      data: dataISO,
      pessoasReservadas: pessoasReservadas + quantidade,
      atualizadoEm: agora,
    });

    return { id: reservaRef.id, ...reserva };
  });
}

export async function cancelarReserva(reservaId) {
  const reservaRef = doc(db, COLECAO_RESERVAS, reservaId);

  await runTransaction(db, async (transaction) => {
    const reservaSnap = await transaction.get(reservaRef);
    if (!reservaSnap.exists()) throw new Error(ERROS_ENTRADA.RESERVA_INDISPONIVEL);
    const reserva = reservaSnap.data();
    if (reserva.status !== STATUS_RESERVA.RESERVADA) throw new Error(ERROS_ENTRADA.RESERVA_INDISPONIVEL);

    const ocupacaoSnap = await transaction.get(ocupacaoRef(reserva.data));
    const pessoasReservadas = ocupacaoSnap.exists() ? ocupacaoSnap.data().pessoasReservadas || 0 : 0;

    const agora = new Date().toISOString();
    transaction.update(reservaRef, { status: STATUS_RESERVA.CANCELADA, canceladaEm: agora });
    transaction.set(ocupacaoRef(reserva.data), {
      data: reserva.data,
      pessoasReservadas: Math.max(0, pessoasReservadas - reserva.quantidade),
      atualizadoEm: agora,
    });
  });
}

// Ordenadas no app (sem índice composto no Firestore)
export function subscribeToReservasDoCliente(clienteUid, callback) {
  const q = query(collection(db, COLECAO_RESERVAS), where('clienteUid', '==', clienteUid));
  return onSnapshot(q, (snapshot) => {
    const reservas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    reservas.sort((a, b) => b.data.localeCompare(a.data) || b.criadoEm.localeCompare(a.criadoEm));
    callback(reservas);
  });
}

export function subscribeToReservasDaData(dataISO, callback) {
  const q = query(collection(db, COLECAO_RESERVAS), where('data', '==', dataISO));
  return onSnapshot(q, (snapshot) => {
    const reservas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    reservas.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
    callback(reservas);
  });
}

/* Portaria */

// Registra a entrada como uma venda (fecha por dia com as outras vendas e
// entra no faturamento). O valor é lido da configuração na hora e fica
// gravado na venda. Se veio de uma reserva, ela vira "utilizada" junto.
// metodo: 'pix' | 'cartao' | 'dinheiro' | 'cortesia' (cortesia só o admin)
export async function registrarEntrada({ quantidade, metodo, motivoCortesia, reservaId, clienteNome, usuario, operacaoId }) {
  // Cortesia é só do admin (a tela já esconde a opção dos outros perfis)
  if (metodo === METODO_CORTESIA && usuario?.perfil !== 'adm') {
    throw new Error(ERROS_ENTRADA.CORTESIA_SO_ADMIN);
  }

  const vendaRef = doc(collection(db, COLECAO_VENDAS));
  const dataISO = paraDataISOLocal();

  return runTransaction(db, async (transaction) => {
    const configSnap = await transaction.get(configRef());
    const reservaRef = reservaId ? doc(db, COLECAO_RESERVAS, reservaId) : null;
    const reservaSnap = reservaRef ? await transaction.get(reservaRef) : null;

    // Dois aparelhos na portaria não podem dar entrada na mesma reserva
    if (reservaRef && (!reservaSnap.exists() || reservaSnap.data().status !== STATUS_RESERVA.RESERVADA)) {
      throw new Error(ERROS_ENTRADA.RESERVA_INDISPONIVEL);
    }

    const { valor } = configDaData(comPadroes(configSnap.exists() ? configSnap.data() : null), dataISO);
    const agora = new Date().toISOString();
    const venda = {
      ...montarVendaDeEntrada({ quantidade, valorUnitario: valor, metodo, motivoCortesia }),
      operacaoId: operacaoId || null,
      responsavelUid: usuario?.uid || null,
      responsavelNome: usuario?.nome || '',
      clienteNome: clienteNome || (reservaSnap?.exists() ? reservaSnap.data().clienteNome : '') || '',
      reservaId: reservaId || null,
      data: dataISO,
      criadoEm: agora,
    };

    transaction.set(vendaRef, venda);
    if (reservaRef) {
      transaction.update(reservaRef, { status: STATUS_RESERVA.UTILIZADA, utilizadaEm: agora, vendaId: vendaRef.id });
    }

    return { id: vendaRef.id, ...venda };
  });
}
