import { db } from "../../firebase/fireBaseCondig";
import { atualizarProduto } from "./productsQueries";
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
} from "firebase/firestore";

const COLECAO_OPERACOES = "operacoes";

export async function abrirOperacao({
  responsavelUid,
  responsavelNome,
  local,
  produtos,
}) {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0];

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
        {
          produtoId: produto.id,
          nome: produto.title,
          unidade: produto.unidade || "unidades",
          image: produto.image || null,
          estoqueInicial: produto.estoque || 0,
          entradaQtd: 0,
          saidaQtd: 0,
          valorEntradas: 0,
          valorSaidas: 0,
          saldoEstoque: produto.estoque || 0,
        },
      ),
    ),
  );

  return { id: operacaoRef.id };
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

  const saldoEstoque =
    dadosAtualizados.estoqueInicial +
    dadosAtualizados.entradaQtd -
    dadosAtualizados.saidaQtd;

  await updateDoc(produtoRef, { ...campos, saldoEstoque });

  await atualizarProduto(produtoId, { estoque: saldoEstoque });
}

export async function registrarVendaNaOperacao(operacaoId, itensVendidos) {
  await Promise.all(
    itensVendidos.map(async (item) => {
      const produtoRef = doc(
        db,
        COLECAO_OPERACOES,
        operacaoId,
        "produtos",
        item.id,
      );
      const snapshot = await getDoc(produtoRef);

      if (!snapshot.exists()) return;

      const dados = snapshot.data();
      const novaSaidaQtd = (dados.saidaQtd || 0) + item.qty;
      const novoValorSaidas = (dados.valorSaidas || 0) + item.qty * item.price;
      const novoSaldo = dados.estoqueInicial + dados.entradaQtd - novaSaidaQtd;

      await updateDoc(produtoRef, {
        saidaQtd: novaSaidaQtd,
        valorSaidas: novoValorSaidas,
        saldoEstoque: novoSaldo,
      });

      await atualizarProduto(item.id, { estoque: novoSaldo });
    }),
  );
}

export async function adicionarProdutoAOperacao(operacaoId, produto) {
  const estoqueInicial = produto.estoqueInicial || 0;
  const entradaQtd = produto.entradaQtd || 0;
  const saidaQtd = produto.saidaQtd || 0;

  await setDoc(doc(db, COLECAO_OPERACOES, operacaoId, "produtos", produto.id), {
    produtoId: produto.id,
    nome: produto.title,
    unidade: produto.unidade || "un",
    image: produto.image || null, 
    estoqueInicial,
    entradaQtd,
    saidaQtd,
    valorEntradas: produto.valorEntradas || 0,
    valorSaidas: produto.valorSaidas || 0,
    saldoEstoque: estoqueInicial + entradaQtd - saidaQtd,
  });
}

export async function removerProdutoDaOperacao(operacaoId, produtoId) {
  await deleteDoc(
    doc(db, COLECAO_OPERACOES, operacaoId, "produtos", produtoId),
  );
}
