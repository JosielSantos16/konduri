import React from 'react';
import FechamentoCaixa from '../pages/fechamentoCaixa/FechamentoCaixa';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function FechamentoScreen() {
  return (
    <RotaAdmin>
      <FechamentoCaixa />
    </RotaAdmin>
  );
}
