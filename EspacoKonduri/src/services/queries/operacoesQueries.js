import { db } from "../../firebase/fireBaseCondig";
import { atualizarProduto } from "./productsQueries";
import { calcularSaldoOperacao } from "../../utils/saldoOperacao";
import { planejarBaixaDoProduto, alertaDeEstoque } from "../../utils/baixaEstoque";
import { agruparItensPorProduto } from "../../utils/estornoVenda";
import { criarNotificacaoPorPerfil } from "../../services/queries/notificacoesQueries";
import { deleteDoc } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { paraDataISOLocal } from "../../utils/dataLocal";

const COLECAO_OPERACOES = "operacoes";
// Mesmo nome de productsQueries (não importado de lá para evitar import circular)
const COLECAO_PRODUTOS = "products";

// Item do produto na operação, partindo do estoque atual do produto. Usado na
// abertura do caixa e ao incluir um produto com o caixa já aberto.
function montarProdutoDaOperacao(produto) {
  const estoqueAtual = produto.estoque || 0;
  return {
    produtoId: produto.id,
    nome: produto.title,
    unidade: produto.unidade || "unidades",
    image: produto.image || null,
    estoqueInicial: estoqueAtual,
    entradaQtd: 0,
    saidaQtd: 0,
    ajusteSaidaQtd: 0,
    estornoQtd: 0,
    valorEntradas: 0,
    valorSaidas: 0,
    saldoEstoque: estoqueAtual,
  };
}

// dataISO: data escolhida na abertura ('AAAA-MM-DD', horário local)
export async function abrirOperacao({
  responsavelUid,
  responsavelNome,
  local,
  produtos,
  dataISO,
}) {
  const hoje = new Date();
  // toISOString() daria a data em UTC: depois das 21h no Brasil, o caixa
  // ficaria com a data do dia seguinte
  const dataFormatada = dataISO || paraDataISOLocal(hoje);

  const operacaoRef = doc(collection(db, COLECAO_OPERACOES));

  await setDoc(operacaoRef, {
    data: dataFormatada,
    responsavelUid,
    responsavelNome,
    local,
    status: "aberta",
    criadoEm: hoje.toISOString(),
    fechadoEm: null,
  });

  await Promise.all(
    produtos.map((produto) =>
      setDoc(
        doc(db, COLECAO_OPERACOES, operacaoRef.id, "produtos", produto.id),
        montarProdutoDaOperacao(produto),
      ),
    ),
  );

  return { id: operacaoRef.id };
}

// Acompanha em tempo real o caixa aberto (null quando não há), para todos os
// aparelhos verem na hora quando o admin abre ou fecha o caixa
export function subscribeToOperacaoAtiva(callback) {
  const q = query(
    collection(db, COLECAO_OPERACOES),
    where("status", "==", "aberta"),
    orderBy("criadoEm", "desc"),
    limit(1),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }
      const docSnap = snapshot.docs[0];
      callback({ id: docSnap.id, ...docSnap.data() });
    },
    (erro) => console.error("Erro ao acompanhar o caixa aberto:", erro),
  );
}

export async function buscarOperacaoAtiva() {
  const q = query(
    collection(db, COLECAO_OPERACOES),
    where("status", "==", "aberta"),
    orderBy("criadoEm", "desc"),
    limit(1),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function listarProdutosDaOperacao(operacaoId) {
  const snapshot = await getDocs(
    collection(db, COLECAO_OPERACOES, operacaoId, "produtos"),
  );
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function buscarOperacaoPorData(dataISO) {
  const q = query(
    collection(db, COLECAO_OPERACOES),
    where('data', '==', dataISO),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  docs.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

  return docs[0];
}

export async function fecharOperacao(operacaoId) {
  await updateDoc(doc(db, COLECAO_OPERACOES, operacaoId), {
    status: "fechada",
    fechadoEm: new Date().toISOString(),
  });
}

export async function buscarProdutoDaOperacao(operacaoId, produtoId) {
  const snapshot = await getDoc(
    doc(db, COLECAO_OPERACOES, operacaoId, "produtos", produtoId),
  );
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function atualizarProdutoDaOperacao(
  operacaoId,
  produtoId,
  campos,
) {
  const produtoRef = doc(
    db,
    COLECAO_OPERACOES,
    operacaoId,
    "produtos",
    produtoId,
  );
  const atual = await getDoc(produtoRef);

  if (!atual.exists()) {
    throw new Error("Produto não encontrado nesta operação.");
  }

  const dadosAtuais = atual.data();
  const dadosAtualizados = { ...dadosAtuais, ...campos };

  const saldoEstoque = calcularSaldoOperacao(dadosAtualizados);

  await updateDoc(produtoRef, { ...campos, saldoEstoque });

  await atualizarProduto(produtoId, { estoque: saldoEstoque });
}

// Baixa o estoque dos produtos de uma venda numa única transação: com dois
// aparelhos vendendo o mesmo produto ao mesmo tempo, o Firestore repete a conta
// com o saldo atualizado e nenhuma baixa se perde. Se o produto está no caixa
// aberto, atualiza saída, valor das saídas e saldo desse caixa; senão, só o
// estoque do produto. Depois avisa o admin de estoque baixo ou esgotado.
export async function baixarEstoqueDaVenda(operacaoId, itensVendidos) {
  const { grupos } = agruparItensPorProduto(itensVendidos);
  if (grupos.length === 0) return;

  const resultados = await runTransaction(db, async (transaction) => {
    const operacaoSnap = operacaoId
      ? await transaction.get(doc(db, COLECAO_OPERACOES, operacaoId))
      : null;
    // Caixa fechado em outro aparelho: não mexe mais nele
    const caixaAberto = !!operacaoSnap?.exists() && operacaoSnap.data().status === "aberta";

    const leituras = [];
    for (const grupo of grupos) {
      const produtoRef = doc(db, COLECAO_PRODUTOS, grupo.produtoId);
      const produtoNaOperacaoRef = caixaAberto
        ? doc(db, COLECAO_OPERACOES, operacaoId, "produtos", grupo.produtoId)
        : null;
      const produtoSnap = await transaction.get(produtoRef);
      const produtoNaOperacaoSnap = produtoNaOperacaoRef ? await transaction.get(produtoNaOperacaoRef) : null;
      leituras.push({ grupo, produtoRef, produtoSnap, produtoNaOperacaoRef, produtoNaOperacaoSnap });
    }

    const baixas = [];
    leituras.forEach(({ grupo, produtoRef, produtoSnap, produtoNaOperacaoRef, produtoNaOperacaoSnap }) => {
      if (!produtoSnap.exists()) return; // produto excluído do catálogo

      const produto = produtoSnap.data();
      const plano = planejarBaixaDoProduto({
        grupo,
        produto,
        produtoNaOperacao: produtoNaOperacaoSnap?.exists() ? produtoNaOperacaoSnap.data() : null,
      });

      transaction.update(produtoRef, plano.produto);
      if (plano.operacao) transaction.update(produtoNaOperacaoRef, plano.operacao);

      baixas.push({
        nome: produto.title || grupo.title,
        image: produto.image || null,
        novoEstoque: plano.novoEstoque,
        alerta: alertaDeEstoque(plano.novoEstoque, produto.limiteEstoqueBaixo),
      });
    });

    return baixas;
  });

  // Avisos fora da transação: se falharem, a baixa já está gravada
  await Promise.all(
    resultados
      .filter((r) => r.alerta)
      .map((r) =>
        criarNotificacaoPorPerfil({
          paraPerfis: ["adm"],
          tipo: r.alerta === "esgotado" ? "estoque_esgotado" : "estoque_baixo",
          titulo: r.alerta === "esgotado" ? "Estoque esgotado" : "Estoque baixo",
          mensagem:
            r.alerta === "esgotado"
              ? `${r.nome} está sem estoque.`
              : `${r.nome} está com apenas ${r.novoEstoque} unidades.`,
          imagens: r.image ? [r.image] : [],
          rota: "/controle",
        }).catch((erro) => console.error("Erro ao avisar estoque baixo:", erro))
      )
  );
}

// Inclui um produto no caixa já aberto (produto novo, ou que ficou de fora na
// abertura). produto = { id, title, unidade, image, estoque }
export async function adicionarProdutoAOperacao(operacaoId, produto) {
  await setDoc(
    doc(db, COLECAO_OPERACOES, operacaoId, "produtos", produto.id),
    montarProdutoDaOperacao(produto),
  );
}

export async function removerProdutoDaOperacao(operacaoId, produtoId) {
  await deleteDoc(
    doc(db, COLECAO_OPERACOES, operacaoId, "produtos", produtoId),
  );
}
