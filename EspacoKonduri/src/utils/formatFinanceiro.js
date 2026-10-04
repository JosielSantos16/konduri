import { formatPrice } from './formatPrice';

// Como formatPrice, mas com sinal para valores negativos (ex: resultado no prejuízo)
export function formatarMoeda(valor) {
  return valor < 0 ? `-${formatPrice(-valor)}` : formatPrice(valor);
}

// Recebe pontos percentuais (45.09) e devolve "45,09%"; null vira "—"
export function formatarPercentual(valor) {
  return valor == null ? '—' : `${valor.toFixed(2).replace('.', ',')}%`;
}
