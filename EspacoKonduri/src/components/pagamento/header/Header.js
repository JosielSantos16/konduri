import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Header,
  BackButton,
  HeaderTitleContainer,
  HeaderTitle,
  HeaderSubtitle,
} from './headerStyle';

export default function PagamentoHeader({ onBack }) {
  return (
    <Header>
      <BackButton onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color="#3D2C22" />
      </BackButton>
      <HeaderTitleContainer>
        <HeaderTitle>Forma de pagamento</HeaderTitle>
        <HeaderSubtitle>Finalização do pedido</HeaderSubtitle>
      </HeaderTitleContainer>
    </Header>
  );
}