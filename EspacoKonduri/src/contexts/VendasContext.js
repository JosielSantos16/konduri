import React, { createContext, useContext, useState, useCallback } from 'react';
import { isMesmoDia } from '../utils/formatDateTime';

const VendasContext = createContext(null);

export function VendasProvider({ children }) {
  const [vendas, setVendas] = useState([]);

  const registrarVenda = useCallback(({ total, metodo, itens }) => {
    const novaVenda = {
      id: String(Date.now()),
      total,
      metodo,
      itens: itens || [],
      data: new Date().toISOString(),
    };
    setVendas(prev => [...prev, novaVenda]);
    return novaVenda;
  }, []);

  const vendasHoje = vendas.filter(v => isMesmoDia(v.data));

  const faturamentoDia = vendasHoje.reduce((sum, v) => sum + v.total, 0);

  const totalPix = vendasHoje
    .filter(v => v.metodo === 'pix')
    .reduce((sum, v) => sum + v.total, 0);

  const totalDinheiro = vendasHoje
    .filter(v => v.metodo === 'dinheiro')
    .reduce((sum, v) => sum + v.total, 0);

  const maisVendidos = (() => {
    const contagem = {};
    vendasHoje.forEach(venda => {
      venda.itens.forEach(item => {
        if (!contagem[item.title]) {
          contagem[item.title] = { title: item.title, qty: 0 };
        }
        contagem[item.title].qty += item.qty;
      });
    });
    return Object.values(contagem).sort((a, b) => b.qty - a.qty);
  })();

  return (
    <VendasContext.Provider
      value={{ vendas, vendasHoje, registrarVenda, faturamentoDia, totalPix, totalDinheiro, maisVendidos }}
    >
      {children}
    </VendasContext.Provider>
  );
}

export function useVendas() {
  const context = useContext(VendasContext);
  if (!context) {
    throw new Error('useVendas deve ser usado dentro de um VendasProvider');
  }
  return context;
}