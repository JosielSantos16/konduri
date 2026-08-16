import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { abrirOperacao, fecharOperacao, buscarOperacaoAtiva } from '../services/queries/operacoesQueries';
import { useProdutos } from './ProdutosContext';

const CaixaContext = createContext(null);

export function CaixaProvider({ children }) {
  const { usuario } = useAuth();
  const { produtos } = useProdutos();

  const [caixaAberto, setCaixaAberto] = useState(false);
  const [dataOperacao, setDataOperacao] = useState(new Date());
  const [local, setLocal] = useState('Espaço Konduri');
  const [ultimoFechamento, setUltimoFechamento] = useState(null);
  const [operacaoId, setOperacaoId] = useState(null);
  const [abrindoCaixa, setAbrindoCaixa] = useState(false);
  const [erroAbertura, setErroAbertura] = useState(null);
  const [restaurandoOperacao, setRestaurandoOperacao] = useState(true);

  const responsavel = usuario?.nome || '';

  // Ao logar (ou recarregar o app), verifica se já existe uma operação
  // aberta no Firestore e restaura o estado local a partir dela —
  // evita perder a referência da operação após um reload/Fast Refresh.
  useEffect(() => {
    async function restaurar() {
      if (!usuario) {
        setRestaurandoOperacao(false);
        return;
      }

      setRestaurandoOperacao(true);
      try {
        const operacaoAtiva = await buscarOperacaoAtiva();
        if (operacaoAtiva) {
          setOperacaoId(operacaoAtiva.id);
          setCaixaAberto(true);
          if (operacaoAtiva.local) setLocal(operacaoAtiva.local);
        }
      } catch (erro) {
        console.error('Erro ao restaurar operação ativa:', erro);
      } finally {
        setRestaurandoOperacao(false);
      }
    }

    restaurar();
  }, [usuario]);

  const abrirCaixa = useCallback(async () => {
    if (!usuario) {
      setErroAbertura('Usuário não identificado. Faça login novamente.');
      return null;
    }

    setAbrindoCaixa(true);
    setErroAbertura(null);

    try {
      const operacao = await abrirOperacao({
        responsavelUid: usuario.uid,
        responsavelNome: usuario.nome,
        local,
        produtos,
      });

      setOperacaoId(operacao.id);
      setCaixaAberto(true);

      return operacao.id;
    } catch (erro) {
      console.error('Erro ao abrir caixa:', erro);
      setErroAbertura('Não foi possível abrir o caixa. Tente novamente.');
      return null;
    } finally {
      setAbrindoCaixa(false);
    }
  }, [usuario, local, produtos]);

  const fecharCaixa = useCallback(async () => {
    if (!operacaoId) return;

    try {
      await fecharOperacao(operacaoId);
      setCaixaAberto(false);
      setUltimoFechamento(new Date().toISOString());
      setOperacaoId(null);
    } catch (erro) {
      console.error('Erro ao fechar caixa:', erro);
      throw erro;
    }
  }, [operacaoId]);

  return (
    <CaixaContext.Provider
      value={{
        caixaAberto,
        dataOperacao,
        setDataOperacao,
        responsavel,
        local,
        setLocal,
        ultimoFechamento,
        operacaoId,
        abrindoCaixa,
        erroAbertura,
        restaurandoOperacao,
        abrirCaixa,
        fecharCaixa,
      }}
    >
      {children}
    </CaixaContext.Provider>
  );
}

export function useCaixa() {
  const context = useContext(CaixaContext);
  if (!context) {
    throw new Error('useCaixa deve ser usado dentro de um CaixaProvider');
  }
  return context;
}