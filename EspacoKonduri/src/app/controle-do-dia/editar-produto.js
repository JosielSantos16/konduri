import React from 'react';
import EditarProduto from '../../pages/editarProduto/EditarProduto';
import RotaAdmin from '../../components/shared/RotaAdmin';

export default function EditarProdutoScreen() {
  return (
    <RotaAdmin>
      <EditarProduto />
    </RotaAdmin>
  );
}
