import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Container,
  SuccessIconContainer,
  Title,
  Subtitle,
  DetailsCard,
  DetailRow,
  DetailLabel,
  DetailValue,
  Divider,
  ActionButtonPrimary,
  ActionButtonPrimaryText,
  ActionButtonSecondary,
  ActionButtonSecondaryText,
} from './statusStyles';

export default function StatusVenda() {
  const router = useRouter();

  const handleNewSale = () => {
    router.replace('/pdv');
  };

  const handlePrint = () => {
    alert('Enviando comando de impressão térmica para o PDA...');
  };

  return (
    <Container>
      <SuccessIconContainer>
        <Ionicons name="checkmark" size={50} color="#FFFFFF" />
      </SuccessIconContainer>

      <Title>Venda Realizada com Sucesso!</Title>
      <Subtitle>Comprovante #0042 — 13/08/2026 às 14:32</Subtitle>

      <DetailsCard>
        <DetailRow>
          <DetailLabel>MÉTODO DE PAGAMENTO</DetailLabel>
          <DetailValue>Dinheiro</DetailValue>
        </DetailRow>

        <Divider />

        <DetailRow>
          <DetailLabel>Valor Pago:</DetailLabel>
          <DetailValue style={{ color: '#E67E22', fontSize: 18 }}>R$ 47,00</DetailValue>
        </DetailRow>
      </DetailsCard>

      <ActionButtonPrimary onPress={handleNewSale}>
        <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
        <ActionButtonPrimaryText>Nova Venda</ActionButtonPrimaryText>
      </ActionButtonPrimary>

      <ActionButtonSecondary onPress={handlePrint}>
        <Ionicons name="print-outline" size={20} color="#E67E22" />
        <ActionButtonSecondaryText>Imprimir Comprovante (PDA)</ActionButtonSecondaryText>
      </ActionButtonSecondary>
    </Container>
  );
}