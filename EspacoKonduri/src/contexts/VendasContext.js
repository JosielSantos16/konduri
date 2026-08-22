import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registrarVendaFirestore, subscribeToVendasHoje } from '../services/queries/vendasQueries';
import { useAuth } from '../hooks/useAuth';
import { useCaixa } from './CaixaContext';

const VendasContext = createContext(null);

export function VendasProvider({ children }) {
  const { usuario } = useAuth();
  const { operacaoId } = useCaixa();

  const [vendasHoje, setVendasHoje] = useState([]);
  const [carregandoVendas, setCarregandoVendas] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setVendasHoje([]);
      setCarregandoVendas(false);
      return;
    }

    setCarregandoVendas(true);
    const unsubscribe = subscribeToVendasHoje((lista) => {
      setVendasHoje(lista);
      setCarregandoVendas(false);
    });

    return unsubscribe;
  }, [usuario]);

  const registrarVenda = useCallback(
    async ({ total, metodo, itens }) => {
      const venda = await registrarVendaFirestore({
        operacaoId,
        responsavelUid: usuario?.uid,
        responsavelNome: usuario?.nome,
        total,
        metodo,
        itens,
      });
      return venda;
    },
    [operacaoId, usuario]
  );

  const faturamentoDia = vendasHoje.reduce((sum, v) => sum + v.total, 0);

  const totalPix = vendasHoje
    .filter((v) => v.metodo === 'pix')
    .reduce((sum, v) => sum + v.total, 0);

  const totalDinheiro = vendasHoje
    .filter((v) => v.metodo === 'dinheiro')
    .reduce((sum, v) => sum + v.total, 0);

  const maisVendidos = (() => {
  const contagem = {};
  vendasHoje.forEach((venda) => {
    (venda.itens || []).forEach((item) => {
      if (!contagem[item.title]) {
        contagem[item.title] = { title: item.title, qty: 0, image: item.image || null };
      }
      contagem[item.title].qty += item.qty;
    });
  });
  return Object.values(contagem).sort((a, b) => b.qty - a.qty);
})();

  return (
    <VendasContext.Provider
      value={{
        vendasHoje,
        carregandoVendas,
        registrarVenda,
        faturamentoDia,
        totalPix,
        totalDinheiro,
        maisVendidos,
      }}
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