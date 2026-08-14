export const formatPrice = (value) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;