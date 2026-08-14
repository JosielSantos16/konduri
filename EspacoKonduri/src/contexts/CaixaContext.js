import React, { createContext, useContext, useState, useCallback } from 'react';

const CaixaContext = createContext(null);

export function CaixaProvider({ children }) {
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [dataOperacao, setDataOperacao] = useState(new Date());
  const [responsavel, setResponsavel] = useState('');
  const [local, setLocal] = useState('Espaço Konduri');
  const [ultimoFechamento, setUltimoFechamento] = useState(null);

  const abrirCaixa = useCallback(() => {
    setCaixaAberto(true);
  }, []);

  const fecharCaixa = useCallback(() => {
    setCaixaAberto(false);
    setUltimoFechamento(new Date().toISOString());
  }, []);

  return (
    <CaixaContext.Provider
      value={{
        caixaAberto,
        dataOperacao,
        setDataOperacao,
        responsavel,
        setResponsavel,
        local,
        setLocal,
        ultimoFechamento,
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