import React from 'react';
import Despesas from '../pages/despesas/Despesas';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function DespesasScreen() {
  return (
    <RotaAdmin>
      <Despesas />
    </RotaAdmin>
  );
}
