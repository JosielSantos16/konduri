import React from 'react';
import Painel from '../pages/painel/Painel';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function PainelScreen() {
  return (
    <RotaAdmin>
      <Painel />
    </RotaAdmin>
  );
}
