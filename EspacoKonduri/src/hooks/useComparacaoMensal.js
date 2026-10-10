import { useMemo } from 'react';
import { useGestaoFinanceira } from './useGestaoFinanceira';
import { compararIndicadores, intervaloDaCompetencia } from '../utils/financeiro';
import { deslocarCompetencia } from '../utils/despesas';

// Indicadores do mês de referência ('AAAA-MM') comparados com o mês anterior
export function useComparacaoMensal(competencia) {
  const competenciaAnterior = deslocarCompetencia(competencia, -1);

  const atual = useGestaoFinanceira(intervaloDaCompetencia(competencia));
  const anterior = useGestaoFinanceira(intervaloDaCompetencia(competenciaAnterior));

  const carregando = atual.carregando || anterior.carregando;

  const linhas = useMemo(() => {
    if (carregando) return null;
    return compararIndicadores(anterior.indicadores, atual.indicadores);
  }, [carregando, anterior.indicadores, atual.indicadores]);

  return { competencia, competenciaAnterior, linhas, carregando };
}
