import { useMemo } from 'react';
import { useGestaoFinanceira } from './useGestaoFinanceira';
import { compararIndicadores, intervalosDaComparacao } from '../utils/financeiro';
import { paraDataISOLocal } from '../utils/dataLocal';

// Indicadores do mês de referência ('AAAA-MM') comparados com o mês anterior.
// Com o mês em andamento, os dois lados usam o mesmo recorte de dias
// (ver intervalosDaComparacao).
export function useComparacaoMensal(competencia) {
  const { competenciaAnterior, emAndamento, atual: intervaloAtual, anterior: intervaloAnterior } =
    intervalosDaComparacao(competencia, paraDataISOLocal());

  const atual = useGestaoFinanceira(intervaloAtual);
  const anterior = useGestaoFinanceira(intervaloAnterior);

  const carregando = atual.carregando || anterior.carregando;

  const linhas = useMemo(() => {
    if (carregando) return null;
    return compararIndicadores(anterior.indicadores, atual.indicadores);
  }, [carregando, anterior.indicadores, atual.indicadores]);

  return {
    competencia,
    competenciaAnterior,
    emAndamento,
    intervaloAtual,
    intervaloAnterior,
    linhas,
    carregando,
  };
}
