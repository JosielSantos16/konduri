import React, { createContext, useContext } from 'react';
import { useProdutos } from './ProdutosContext';

const EstoqueContext = createContext(null);

// Mesmo padrão do Painel, do PDV e do Controle do Dia quando o produto não
// define o "Avisar quando o estoque for menor que"
const LIMITE_BAIXO_PADRAO = 5;

// Esgotado = crítico; até o limite do produto = baixo
function getStatus(qty, item) {
  const limiteBaixo = item.limiteEstoqueBaixo ?? LIMITE_BAIXO_PADRAO;

  if (qty <= 0) return { status: 'critico', statusText: 'Esgotado' };
  if (qty <= limiteBaixo) return { status: 'baixo', statusText: 'Baixo' };
  return { status: 'ok', statusText: 'OK' };
}

// O estoque só muda por transações (venda, ENTRADA, perda/ajuste, cancelamento),
// então este contexto só monta a lista para a tela de Estoque
export function EstoqueProvider({ children }) {
  const { produtos } = useProdutos();

  const stock = produtos.map((item) => ({
    id: item.id,
    title: item.title,
    qty: item.estoque || 0,
    unit: item.unidade || 'un.',
    ...getStatus(item.estoque || 0, item),
  }));

  return <EstoqueContext.Provider value={{ stock }}>{children}</EstoqueContext.Provider>;
}

export function useEstoque() {
  const context = useContext(EstoqueContext);
  if (!context) {
    throw new Error('useEstoque deve ser usado dentro de um EstoqueProvider');
  }
  return context;
}
