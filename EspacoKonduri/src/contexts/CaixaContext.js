import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { abrirOperacao, fecharOperacao } from '../services/queries/operacoesQueries';
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

  const responsavel = usuario?.nome || '';

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