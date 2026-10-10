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
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { TIPOS_MOVIMENTO, novoMovimentoRef, montarMovimento } from './estoqueMovimentosQueries';
import { comissaoRef } from './comissaoQueries';
import {
  CASOS_ESTORNO,
  agruparItensPorProduto,
  planejarEstornoDoProduto,
  recalcularComissao,
  vendaCancelada,
} from '../../utils/estornoVenda';

const COLECAO_VENDAS = 'vendas';
// Mesmos nomes de productsQueries e operacoesQueries (não importados de lá para evitar import circular)
const COLECAO_PRODUTOS = 'products';
const COLECAO_OPERACOES = 'operacoes';

export const ERRO_VENDA_JA_CANCELADA = 'VENDA_JA_CANCELADA';

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

  // A venda já está gravada: se o aviso ao admin falhar (sem internet, ou sem
  // permissão para buscar os aparelhos do admin), isso não pode virar "venda
  // não finalizada" na tela, senão a atendente tenta de novo e duplica a venda.
  // Também não segura o caixa esperando o push sair.
  criarNotificacaoPorPerfil({
    paraPerfis: ['adm'],
    tipo: 'venda_realizada',
    titulo: 'Venda realizada',
    mensagem: `${responsavelNome}: ${resumoItens} — ${formatPrice(total)}`,
    imagens: (itens || []).slice(0, 3).map((i) => i.image).filter(Boolean),
    total,
    rota: '/vendas',
  }).catch((erro) => console.error('Venda registrada, mas o aviso ao admin falhou:', erro));

  return { id: vendaRef.id, ...venda };
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

// Cancela uma venda registrada por engano (só admin). A venda não é apagada:
// ganha status 'cancelada' e os dados do cancelamento. Na mesma transação o
// estoque volta (ver utils/estornoVenda), cada produto ganha um movimento
// ESTORNO_VENDA e a comissão do dia do atendente é recalculada.
// operacaoAbertaId: caixa aberto agora (CaixaContext), que pode ser outro dia.
export async function cancelarVenda({ vendaId, motivo, usuarioUid, usuarioNome, operacaoAbertaId }) {
  const vendaRef = doc(db, COLECAO_VENDAS, vendaId);

  const resultado = await runTransaction(db, async (transaction) => {
    // Leituras (o Firestore exige todas antes das gravações)
    const vendaSnap = await transaction.get(vendaRef);
    if (!vendaSnap.exists()) throw new Error('Venda não encontrada.');
    const venda = { id: vendaSnap.id, ...vendaSnap.data() };
    // Protege contra toque duplo e dois aparelhos: a transação é repetida com
    // o dado novo e para aqui se outro cancelamento já foi gravado
    if (vendaCancelada(venda)) throw new Error(ERRO_VENDA_JA_CANCELADA);

    const operacaoDaVendaSnap = venda.operacaoId
      ? await transaction.get(doc(db, COLECAO_OPERACOES, venda.operacaoId))
      : null;
    const caixaDaVendaAberto = !!operacaoDaVendaSnap?.exists() && operacaoDaVendaSnap.data().status === 'aberta';

    const idOutroCaixa = operacaoAbertaId && operacaoAbertaId !== venda.operacaoId ? operacaoAbertaId : null;
    const outroCaixaSnap = idOutroCaixa ? await transaction.get(doc(db, COLECAO_OPERACOES, idOutroCaixa)) : null;
    const outroCaixaAberto = !!outroCaixaSnap?.exists() && outroCaixaSnap.data().status === 'aberta';

    const { grupos, semProduto } = agruparItensPorProduto(venda.itens);

    const leituras = [];
    for (const grupo of grupos) {
      const produtoRef = doc(db, COLECAO_PRODUTOS, grupo.produtoId);
      const produtoNaOperacaoDaVendaRef = caixaDaVendaAberto
        ? doc(db, COLECAO_OPERACOES, venda.operacaoId, 'produtos', grupo.produtoId)
        : null;
      const produtoNaOperacaoAbertaRef = outroCaixaAberto
        ? doc(db, COLECAO_OPERACOES, idOutroCaixa, 'produtos', grupo.produtoId)
        : null;

      const produtoSnap = await transaction.get(produtoRef);
      const naOperacaoDaVendaSnap = produtoNaOperacaoDaVendaRef ? await transaction.get(produtoNaOperacaoDaVendaRef) : null;
      const naOperacaoAbertaSnap = produtoNaOperacaoAbertaRef ? await transaction.get(produtoNaOperacaoAbertaRef) : null;

      leituras.push({
        grupo,
        produtoRef,
        produtoSnap,
        produtoNaOperacaoDaVendaRef,
        naOperacaoDaVendaSnap,
        produtoNaOperacaoAbertaRef,
        naOperacaoAbertaSnap,
      });
    }

    const refComissao = venda.responsavelUid ? comissaoRef(venda.data, venda.responsavelUid) : null;
    const comissaoSnap = refComissao ? await transaction.get(refComissao) : null;
    const comissao = comissaoSnap?.exists() ? comissaoSnap.data() : null;

    // Gravações
    const agora = new Date().toISOString();
    transaction.update(vendaRef, {
      status: 'cancelada',
      canceladaEm: agora,
      canceladaPorUid: usuarioUid || null,
      canceladaPorNome: usuarioNome || '',
      motivoCancelamento: motivo,
    });

    const casos = [];
    const produtosNaoEncontrados = [];

    leituras.forEach((leitura) => {
      const { grupo } = leitura;
      // Produto excluído do catálogo: não há estoque para devolver
      if (!leitura.produtoSnap.exists()) {
        produtosNaoEncontrados.push(grupo.title);
        return;
      }

      const plano = planejarEstornoDoProduto({
        grupo,
        produto: leitura.produtoSnap.data(),
        produtoNaOperacaoDaVenda: leitura.naOperacaoDaVendaSnap?.exists() ? leitura.naOperacaoDaVendaSnap.data() : null,
        produtoNaOperacaoAberta: leitura.naOperacaoAbertaSnap?.exists() ? leitura.naOperacaoAbertaSnap.data() : null,
      });
      casos.push(plano.caso);

      transaction.update(leitura.produtoRef, plano.produto);
      if (plano.operacaoDaVenda) transaction.update(leitura.produtoNaOperacaoDaVendaRef, plano.operacaoDaVenda);
      if (plano.operacaoAberta) transaction.update(leitura.produtoNaOperacaoAbertaRef, plano.operacaoAberta);

      transaction.set(
        novoMovimentoRef(),
        montarMovimento({
          produtoId: grupo.produtoId,
          produtoNome: grupo.title,
          tipo: TIPOS_MOVIMENTO.ESTORNO_VENDA,
          quantidade: grupo.quantidade,
          custoUnitario: grupo.custoUnitario,
          usuarioUid,
          usuarioNome,
          vendaId: venda.id,
          operacaoId:
            plano.caso === CASOS_ESTORNO.CAIXA_DA_VENDA_ABERTO
              ? venda.operacaoId
              : plano.caso === CASOS_ESTORNO.OUTRO_CAIXA_ABERTO
                ? idOutroCaixa
                : null,
          observacao: motivo,
        })
      );
    });

    const ajusteComissao = recalcularComissao(comissao, venda);
    if (ajusteComissao) {
      transaction.update(refComissao, {
        baseCalculo: ajusteComissao.baseCalculo,
        valorComissao: ajusteComissao.valorComissao,
        atualizadoEm: agora,
      });
    }

    return {
      venda,
      // O caixa da venda não foi alterado: o fechamento daquele dia não muda
      caixaDaVendaFechado: casos.some((caso) => caso !== CASOS_ESTORNO.CAIXA_DA_VENDA_ABERTO),
      comissaoAjustada: ajusteComissao
        ? {
            atendente: venda.responsavelNome || 'atendente',
            de: ajusteComissao.valorAnterior,
            para: ajusteComissao.valorComissao,
          }
        : null,
      itensSemProduto: semProduto.map((item) => item.title),
      produtosNaoEncontrados,
    };
  });

  // Fora da transação: se a notificação falhar, o cancelamento já está gravado
  try {
    await criarNotificacaoPorPerfil({
      paraPerfis: ['adm'],
      tipo: 'venda_cancelada',
      titulo: 'Venda cancelada',
      mensagem: `${usuarioNome || 'Admin'} cancelou uma venda de ${resultado.venda.responsavelNome || 'atendente'} (${formatPrice(resultado.venda.total)}). Motivo: ${motivo}`,
      imagens: (resultado.venda.itens || []).slice(0, 3).map((i) => i.image).filter(Boolean),
      total: resultado.venda.total,
      rota: '/vendas',
    });
  } catch (erro) {
    console.error('Venda cancelada, mas a notificação falhou:', erro);
  }

  return resultado;
}
