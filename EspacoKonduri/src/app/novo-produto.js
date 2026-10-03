import React from 'react';
import NovoProduto from '../pages/novoProduto/NovoProduto';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function NovoProdutoScreen() {
  return (
    <RotaAdmin>
      <NovoProduto />
    </RotaAdmin>
  );
}
