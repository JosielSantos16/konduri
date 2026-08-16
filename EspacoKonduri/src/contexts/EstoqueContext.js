import React, { createContext, useContext, useCallback } from 'react';
import { useProdutos } from './ProdutosContext';
import { atualizarProduto } from '../services/queries/productsQueries';

const EstoqueContext = createContext(null);

// Limites padrão de alerta, usados quando o produto não define os próprios
const BAIXO_PADRAO = 10;
const CRITICO_PADRAO = 3;

function getStatus(qty, item) {
  const criticoAt = item.criticoAt ?? CRITICO_PADRAO;
  const baixoAt = item.baixoAt ?? BAIXO_PADRAO;

  if (qty <= criticoAt) return { status: 'critico', statusText: 'Crítico' };
  if (qty <= baixoAt) return { status: 'baixo', statusText: 'Baixo' };
  return { status: 'ok', statusText: 'OK' };
}

export function EstoqueProvider({ children }) {
  const { produtos } = useProdutos();

  const increase = useCallback(
    async (id) => {
      const produto = produtos.find((p) => p.id === id);
      if (!produto) return;
      await atualizarProduto(id, { estoque: (produto.estoque || 0) + 1 });
    },
    [produtos]
  );

  const decrease = useCallback(
    async (id) => {
      const produto = produtos.find((p) => p.id === id);
      if (!produto) return;
      await atualizarProduto(id, { estoque: Math.max(0, (produto.estoque || 0) - 1) });
    },
    [produtos]
  );

  /**
   * Abate o estoque real do produto no Firestore após uma venda.
   * Prioriza casar pelo id (mais confiável); se não vier, tenta pelo nome.
   */
  const decreaseByTitle = useCallback(
    async (title, amount, produtoId) => {
      const produto = produtoId
        ? produtos.find((p) => p.id === produtoId)
        : produtos.find((p) => p.title.toLowerCase() === title.toLowerCase());

      if (!produto) return;

      await atualizarProduto(produto.id, {
        estoque: Math.max(0, (produto.estoque || 0) - amount),
      });
    },
    [produtos]
  );

  const stock = produtos.map((item) => ({
    id: item.id,
    title: item.title,
    qty: item.estoque || 0,
    unit: item.unidade || 'un.',
    ...getStatus(item.estoque || 0, item),
  }));

  return (
    <EstoqueContext.Provider value={{ stock, increase, decrease, decreaseByTitle }}>
      {children}
    </EstoqueContext.Provider>
  );
}

export function useEstoque() {
  const context = useContext(EstoqueContext);
  if (!context) {
    throw new Error('useEstoque deve ser usado dentro de um EstoqueProvider');
  }
  return context;
}