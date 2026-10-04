// Formas de pagamento aceitas no PDV, com rótulo, ícone e cores usados nas telas
export const METODOS_PAGAMENTO = {
  pix: { label: 'Pix', icone: 'qr-code-outline', cor: '#16A085', fundo: '#E8F8F5' },
  cartao: { label: 'Cartão', icone: 'card-outline', cor: '#1A73C0', fundo: '#E8F0FB' },
  dinheiro: { label: 'Dinheiro', icone: 'cash-outline', cor: '#27AE60', fundo: '#E9F7EF' },
};

export function infoMetodo(metodo) {
  return (
    METODOS_PAGAMENTO[metodo] || {
      label: metodo || '—',
      icone: 'help-circle-outline',
      cor: '#8C7355',
      fundo: '#F0EAE1',
    }
  );
}

export function totalPorMetodo(vendas, metodo) {
  return vendas
    .filter((v) => v.metodo === metodo)
    .reduce((soma, v) => soma + (Number(v.total) || 0), 0);
}
