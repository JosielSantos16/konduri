import { useState, useEffect } from "react";
import { paraDataISOLocal } from "../utils/dataLocal";
import {
  subscribeToVendasPorData,
  buscarDiasComVendasNoMes,
} from "../services/queries/vendasQueries";
import { buscarDiasComComissaoNoMes } from "../services/queries/comissaoQueries";
import { buscarOperacaoPorData } from "../services/queries/operacoesQueries";
import { useAuth } from "./useAuth";

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

  // Totais gerais do dia
  const totalPeriodo = vendasFiltradas.reduce((sum, v) => sum + v.total, 0);
  const totalPix = vendasFiltradas.filter((v) => v.metodo === "pix").reduce((s, v) => s + v.total, 0);
  const totalDinheiro = vendasFiltradas
    .filter((v) => v.metodo === "dinheiro")
    .reduce((s, v) => s + v.total, 0);

  // Base de comissão (só produtos) e resumo geral, agrupados por atendente
  const atendentesDoDia = {};
  const resumoGeralPorAtendente = {};

  vendasFiltradas.forEach((venda) => {
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

    const subtotalProdutos = (venda.itens || [])
      .filter((item) => item.category === "produtos")
      .reduce((s, item) => s + item.qty * item.price, 0);

    atendentesDoDia[uid].baseCalculo += subtotalProdutos;
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
    totalPix,
    totalDinheiro,
    listaAtendentes,
    listaResumoGeral,
    numeroDaVenda,
  };
}