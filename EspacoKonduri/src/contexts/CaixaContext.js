import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { abrirOperacao, fecharOperacao, subscribeToOperacaoAtiva } from '../services/queries/operacoesQueries';
import { paraDataISOLocal } from '../utils/dataLocal';
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

  // Acompanha em tempo real o caixa aberto no Firestore. Antes isso era lido
  // só no login: o PDV da atendente não via o caixa que o admin acabou de
  // abrir, e continuava vendendo num caixa que já tinha sido fechado.
  const usuarioUid = usuario?.uid;
  useEffect(() => {
    if (!usuarioUid) {
      setCaixaAberto(false);
      setOperacaoId(null);
      setRestaurandoOperacao(false);
      return undefined;
    }

    setRestaurandoOperacao(true);
    return subscribeToOperacaoAtiva((operacaoAtiva) => {
      setOperacaoId(operacaoAtiva ? operacaoAtiva.id : null);
      setCaixaAberto(!!operacaoAtiva);
      if (operacaoAtiva?.local) setLocal(operacaoAtiva.local);
      setRestaurandoOperacao(false);
    });
  }, [usuarioUid]);

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
        dataISO: paraDataISOLocal(dataOperacao),
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
  }, [usuario, local, produtos, dataOperacao]);

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