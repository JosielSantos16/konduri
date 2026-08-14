import React from 'react';
import { formatPrice } from '../../../utils/formatPrice';
import {
  TotalCard,
  TotalLabel,
  TotalValue,
  TotalDivider,
  TotalDetails,
} from './totalCardStyle';

export default function VendaTotalCard({ total, atendente, caixaId }) {
  return (
    <TotalCard>
      <TotalLabel>VALOR TOTAL DA VENDA</TotalLabel>
      <TotalValue>{formatPrice(total)}</TotalValue>
      <TotalDivider />
      <TotalDetails>
        Atendente: {atendente} | Caixa ID: #{caixaId}
      </TotalDetails>
    </TotalCard>
  );
}