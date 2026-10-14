// Formas de pagamento aceitas no PDV, com rótulo, ícone e cores usados nas telas
export const METODOS_PAGAMENTO = {
  pix: { label: 'Pix', icone: 'qr-code-outline', cor: '#16A085', fundo: '#E8F8F5' },
  cartao: { label: 'Cartão', icone: 'card-outline', cor: '#1A73C0', fundo: '#E8F0FB' },
  dinheiro: { label: 'Dinheiro', icone: 'cash-outline', cor: '#27AE60', fundo: '#E9F7EF' },
};

// Entrada de cortesia (só o admin registra): não é forma de pagamento, R$ 0
const CORTESIA = { label: 'Cortesia', icone: 'gift-outline', cor: '#8A6A00', fundo: '#FFF7D1' };

export function infoMetodo(metodo) {
  if (metodo === 'cortesia') return CORTESIA;
  return (
    METODOS_PAGAMENTO[metodo] || {
      label: metodo || '—',
      icone: 'help-circle-outline',
      cor: '#6B6B6B',
      fundo: '#F1F1EB',
    }
  );
}

export function totalPorMetodo(vendas, metodo) {
  return vendas
    .filter((v) => v.metodo === metodo)
    .reduce((soma, v) => soma + (Number(v.total) || 0), 0);
}
