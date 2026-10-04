import React from 'react';
import Gestao from '../pages/gestao/Gestao';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function GestaoScreen() {
  return (
    <RotaAdmin>
      <Gestao />
    </RotaAdmin>
  );
}
