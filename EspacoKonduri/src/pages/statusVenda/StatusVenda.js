import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { formatPrice } from '../../utils/formatPrice';
import { formatDataHoraComprovante } from '../../utils/formatDateTime';
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
  const { total, metodo, comprovante, data } = useLocalSearchParams();

  const valorPago = Number(total) || 0;
  const metodoLabel = metodo === 'pix' ? 'PIX' : 'Dinheiro';
  const dataFormatada = data ? formatDataHoraComprovante(data) : '';
  const numeroComprovante = comprovante ? comprovante.slice(-4) : '0000';

  const handleNewSale = () => router.replace('/pdv');
  const handlePrint = () => alert('Enviando comando de impressão térmica para o PDA...');

  return (
    <Container>
      <SuccessIconContainer>
        <Ionicons name="checkmark" size={50} color="#FFFFFF" />
      </SuccessIconContainer>

      <Title>Venda Realizada com Sucesso!</Title>
      <Subtitle>Comprovante #{numeroComprovante} — {dataFormatada}</Subtitle>

      <DetailsCard>
        <DetailRow>
          <DetailLabel>MÉTODO DE PAGAMENTO</DetailLabel>
          <DetailValue>{metodoLabel}</DetailValue>
        </DetailRow>

        <Divider />

        <DetailRow>
          <DetailLabel>Valor Pago:</DetailLabel>
          <DetailValue style={{ color: '#E67E22', fontSize: 18 }}>{formatPrice(valorPago)}</DetailValue>
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