import React from 'react';
import HistoricoVendas from '../pages/vendas/Vendas';
import RotaAdmin from '../components/shared/RotaAdmin';

export default function Vendas() {
  return (
    <RotaAdmin>
      <HistoricoVendas />
    </RotaAdmin>
  );
}
