import { useState, useEffect } from "react";
import { paraDataISOLocal } from "../utils/dataLocal";
import {
  subscribeToVendasPorData,
  buscarDiasComVendasNoMes,
} from "../services/queries/vendasQueries";
import { buscarDiasComComissaoNoMes } from "../services/queries/comissaoQueries";
import { buscarOperacaoPorData } from "../services/queries/operacoesQueries";
import { useAuth } from "./useAuth";
import { totalPorMetodo } from "../utils/metodosPagamento";
import { vendaValida } from "../utils/financeiro";
import { subtotalProdutosDaVenda } from "../utils/estornoVenda";

const FILTROS_METODO_TODOS = "todos";

function paraDataISO(data) {
  return paraDataISOLocal(data);
}

/**
 * Concentra toda a lógica de estado, busca de dados e cálculos da tela
 * de Vendas do Dia — a página fica só responsável por renderizar.
 */
export function useVendasDoDia() {
  const { usuario } = useAuth();

  const [filtroData, setFiltroData] = useState(new Date());
  const [vendasFiltradas, setVendasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [diasComVenda, setDiasComVenda] = useState([]);
  const [diasComComissao, setDiasComComissao] = useState([]);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [ordemAscendente, setOrdemAscendente] = useState(false);
  const [buscaVisivel, setBuscaVisivel] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState(FILTROS_METODO_TODOS);
  const [operacaoDoDia, setOperacaoDoDia] = useState(null);

  const dataISO = paraDataISO(filtroData);
  const isHoje = dataISO === paraDataISOLocal();

  const carregarDadosDoMes = async (anoMes) => {
    try {
      const [dias, diasComissao] = await Promise.all([
        buscarDiasComVendasNoMes(anoMes),
        buscarDiasComComissaoNoMes(anoMes),
      ]);
      setDiasComVenda(dias);
      setDiasComComissao(diasComissao);
    } catch (erro) {
      console.error("Erro ao buscar dados do mês:", erro);
    }
  };

  // Carrega os dias marcados no calendário assim que a tela abre
  useEffect(() => {
    const anoMesAtual = dataISO.slice(0, 7);
    carregarDadosDoMes(anoMesAtual);
  }, []);

  // Escuta em tempo real as vendas do dia selecionado
  useEffect(() => {
    setCarregando(true);
    const unsubscribe = subscribeToVendasPorData(dataISO, (lista) => {
      setVendasFiltradas(lista);
      setCarregando(false);
    });
    return unsubscribe;
  }, [dataISO]);

  // Verifica se o caixa daquele dia já foi fechado
  useEffect(() => {
    buscarOperacaoPorData(dataISO)
      .then(setOperacaoDoDia)
      .catch((erro) => console.error("Erro ao buscar operação do dia:", erro));
  }, [dataISO]);

  // Aplica ordenação + filtro de método + busca por texto
  const vendasBase = ordemAscendente ? [...vendasFiltradas] : [...vendasFiltradas].reverse();

  const vendasExibidas = vendasBase.filter((venda) => {
    const bateMetodo = filtroMetodo === FILTROS_METODO_TODOS || venda.metodo === filtroMetodo;

    const termoBusca = busca.trim().toLowerCase();
    const bateBusca =
      !termoBusca ||
      (venda.responsavelNome || "").toLowerCase().includes(termoBusca) ||
      (venda.itens || []).some((item) => item.title.toLowerCase().includes(termoBusca));

    return bateMetodo && bateBusca;
  });

  // Totais gerais do dia. Vendas canceladas aparecem na lista, mas não somam
  const vendasValidas = vendasFiltradas.filter(vendaValida);
  const qtdVendasValidas = vendasValidas.length;
  const totalPeriodo = vendasValidas.reduce((sum, v) => sum + v.total, 0);
  const totalPix = totalPorMetodo(vendasValidas, "pix");
  const totalCartao = totalPorMetodo(vendasValidas, "cartao");
  const totalDinheiro = totalPorMetodo(vendasValidas, "dinheiro");

  // Base de comissão (só produtos) e resumo geral, agrupados por atendente
  const atendentesDoDia = {};
  const resumoGeralPorAtendente = {};

  vendasValidas.forEach((venda) => {
    const uid = venda.responsavelUid;
    if (!uid) return;

    if (!atendentesDoDia[uid]) {
      atendentesDoDia[uid] = {
        responsavelUid: uid,
        responsavelNome: venda.responsavelNome || "Sem nome",
        baseCalculo: 0,
      };
    }
    if (!resumoGeralPorAtendente[uid]) {
      resumoGeralPorAtendente[uid] = {
        responsavelUid: uid,
        responsavelNome: venda.responsavelNome || "Sem nome",
        totalGeral: 0,
      };
    }

    atendentesDoDia[uid].baseCalculo += subtotalProdutosDaVenda(venda);
    resumoGeralPorAtendente[uid].totalGeral += venda.total;
  });

  const listaAtendentes = Object.values(atendentesDoDia);
  const listaResumoGeral = Object.values(resumoGeralPorAtendente);

  const numeroDaVenda = (venda) => {
    const idx = vendasFiltradas.findIndex((v) => v.id === venda.id);
    return String(idx + 1).padStart(4, "0");
  };

  const handleRefresh = async () => {
    setAtualizando(true);
    const anoMesAtual = dataISO.slice(0, 7);
    await carregarDadosDoMes(anoMesAtual);
    const operacao = await buscarOperacaoPorData(dataISO).catch(() => null);
    setOperacaoDoDia(operacao);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setAtualizando(false);
  };

  const handleToggleBusca = () => {
    if (buscaVisivel) setBusca("");
    setBuscaVisivel((prev) => !prev);
  };

  return {
    usuario,
    filtroData,
    setFiltroData,
    dataISO,
    isHoje,
    vendasFiltradas,
    vendasExibidas,
    carregando,
    atualizando,
    handleRefresh,
    diasComVenda,
    diasComComissao,
    carregarDadosDoMes,
    vendaSelecionada,
    setVendaSelecionada,
    ordemAscendente,
    setOrdemAscendente,
    buscaVisivel,
    busca,
    setBusca,
    handleToggleBusca,
    filtroMetodo,
    setFiltroMetodo,
    operacaoDoDia,
    totalPeriodo,
    qtdVendasValidas,
    totalPix,
    totalCartao,
    totalDinheiro,
    listaAtendentes,
    listaResumoGeral,
    numeroDaVenda,
  };
}