import React from 'react';
import ControleDoDia from '../pages/controleDoDia/ControleDoDia';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function ControleScreen() {
  return (
    <RotaAdmin>
      <ControleDoDia />
    </RotaAdmin>
  );
}
