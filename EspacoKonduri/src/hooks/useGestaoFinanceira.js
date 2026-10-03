import { useState, useEffect, useMemo } from 'react';
import { subscribeToVendasPorPeriodo } from '../services/queries/vendasQueries';
import { subscribeToDespesas } from '../services/queries/despesasQueries';
import { subscribeToComissoesPorPeriodo } from '../services/queries/comissaoQueries';
import { calcularIndicadores } from '../utils/financeiro';
import { paraDataISOLocal } from '../utils/dataLocal';

// Indicadores financeiros de um intervalo { inicio, fim } ('AAAA-MM-DD'),
// atualizados em tempo real conforme entram vendas, despesas e comissões.
// Use intervaloDoPeriodo (utils/financeiro) para os períodos pré-definidos.
export function useGestaoFinanceira({ inicio, fim }) {
  const [vendas, setVendas] = useState(null);
  const [despesas, setDespesas] = useState(null);
  const [comissoes, setComissoes] = useState(null);

  useEffect(() => subscribeToDespesas(setDespesas), []);

  useEffect(() => {
    setVendas(null);
    setComissoes(null);
    const pararVendas = subscribeToVendasPorPeriodo(inicio, fim, setVendas);
    const pararComissoes = subscribeToComissoesPorPeriodo(inicio, fim, setComissoes);
    return () => {
      pararVendas();
      pararComissoes();
    };
  }, [inicio, fim]);

  const carregando = vendas === null || despesas === null || comissoes === null;

  const indicadores = useMemo(() => {
    if (carregando) return null;
    return calcularIndicadores({ vendas, despesas, comissoes, inicio, fim, hoje: paraDataISOLocal() });
  }, [carregando, vendas, despesas, comissoes, inicio, fim]);

  return { indicadores, vendas: vendas || [], carregando };
}
