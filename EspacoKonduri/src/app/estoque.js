import React from 'react';
import Estoque from '../pages/estoque/Estoque';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function EstoqueScreen() {
  return (
    <RotaAdmin>
      <Estoque />
    </RotaAdmin>
  );
}
