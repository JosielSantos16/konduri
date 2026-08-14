import { useState, useMemo } from 'react';
import { parseCurrency } from '../utils/parsetCurrency';

export function useTroco(total) {
  const [valorRecebido, setValorRecebido] = useState('');

  const troco = useMemo(() => {
    const recebido = parseCurrency(valorRecebido);
    const diff = recebido - total;
    return diff > 0 ? diff : 0;
  }, [valorRecebido, total]);

  const insuficiente = useMemo(() => {
    const recebido = parseCurrency(valorRecebido);
    return valorRecebido.length > 0 && recebido < total;
  }, [valorRecebido, total]);

  return { valorRecebido, setValorRecebido, troco, insuficiente };
}