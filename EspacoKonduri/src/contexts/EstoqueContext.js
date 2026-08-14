import React, { createContext, useContext, useState, useCallback } from 'react';

const EstoqueContext = createContext(null);

const ESTOQUE_INICIAL = [
  { id: '1', title: 'Cerveja Gelada (Garrafa)', qty: 45, unit: 'un.', baixoAt: 15, criticoAt: 5 },
  { id: '2', title: 'Refrigerante Can', qty: 12, unit: 'un.', baixoAt: 15, criticoAt: 5 },
  { id: '3', title: 'Água Mineral 500ml', qty: 30, unit: 'un.', baixoAt: 15, criticoAt: 5 },
  { id: '4', title: 'Galinha Caipira', qty: 5, unit: 'porções', baixoAt: 10, criticoAt: 5 },
  { id: '5', title: 'Ingresso Entrada Box', qty: 200, unit: 'un.', baixoAt: 30, criticoAt: 10 },
];

const getStatus = (qty, item) => {
  if (qty <= item.criticoAt) return { status: 'critico', statusText: 'Crítico' };
  if (qty <= item.baixoAt) return { status: 'baixo', statusText: 'Baixo' };
  return { status: 'ok', statusText: 'OK' };
};

export function EstoqueProvider({ children }) {
  const [stock, setStock] = useState(ESTOQUE_INICIAL);

  const increase = useCallback((id) => {
    setStock(prev => prev.map(item => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
  }, []);

  const decrease = useCallback((id) => {
    setStock(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item))
    );
  }, []);

  // Usado na finalização da venda para abater o estoque pelo nome do produto vendido
  const decreaseByTitle = useCallback((title, amount) => {
    setStock(prev =>
      prev.map(item => {
        const nomeBase = item.title.split(' (')[0].toLowerCase();
        const match = title.toLowerCase().includes(nomeBase) || nomeBase.includes(title.toLowerCase());
        return match ? { ...item, qty: Math.max(0, item.qty - amount) } : item;
      })
    );
  }, []);

  const stockComStatus = stock.map(item => ({ ...item, ...getStatus(item.qty, item) }));

  return (
    <EstoqueContext.Provider value={{ stock: stockComStatus, increase, decrease, decreaseByTitle }}>
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