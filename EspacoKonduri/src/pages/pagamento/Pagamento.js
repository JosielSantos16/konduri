import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Container,
  Header,
  BackButton,
  HeaderTitleContainer,
  HeaderTitle,
  HeaderSubtitle,
  TotalCard,
  TotalLabel,
  TotalValue,
  TotalDivider,
  TotalDetails,
  SectionTitle,
  PaymentMethodsContainer,
  MethodCard,
  MethodIconContainer,
  MethodTitle,
  MethodSubtitle,
  ChangeContainer,
  ChangeHeader,
  ChangeTitle,
  ChangeBadge,
  ChangeBadgeText,
  ChangeInputsRow,
  InputWrapper,
  InputLabel,
  StyledInput,
  ChangeOutputWrapper,
  ChangeBox,
  ChangeValueText,
  FinalizeButton,
  FinalizeButtonText,
} from './pagamentoStyles';

export default function Pagamento() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('pix'); 
  const [valorRecebido, setValorRecebido] = useState('50,00');

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3D2C22" />
        </BackButton>
        <HeaderTitleContainer>
          <HeaderTitle>Forma de pagamento</HeaderTitle>
          <HeaderSubtitle>Finalização do pedido</HeaderSubtitle>
        </HeaderTitleContainer>
      </Header>

      <TotalCard>
        <TotalLabel>VALOR TOTAL DA VENDA</TotalLabel>
        <TotalValue>R$ 47,00</TotalValue>
        <TotalDivider />
        <TotalDetails>Atendente: Maria Silva | Caixa ID: #04</TotalDetails>
      </TotalCard>

      <SectionTitle>Selecione o Método de Pagamento</SectionTitle>
      <PaymentMethodsContainer>
        <MethodCard 
          selected={selectedMethod === 'pix'} 
          onPress={() => setSelectedMethod('pix')}
        >
          <MethodIconContainer>
            <Ionicons name="qr-code-outline" size={22} color="#E67E22" />
          </MethodIconContainer>
          <MethodTitle>PIX</MethodTitle>
          <MethodSubtitle>QR Code Gerado</MethodSubtitle>
        </MethodCard>

        <MethodCard 
          selected={selectedMethod === 'dinheiro'} 
          onPress={() => setSelectedMethod('dinheiro')}
        >
          <MethodIconContainer>
            <Ionicons name="cash-outline" size={22} color="#137333" />
          </MethodIconContainer>
          <MethodTitle>Dinheiro</MethodTitle>
          <MethodSubtitle>Espécie em Mãos</MethodSubtitle>
        </MethodCard>
      </PaymentMethodsContainer>

      {selectedMethod === 'dinheiro' && (
        <ChangeContainer>
          <ChangeHeader>
            <ChangeTitle>Simular Recebimento (Troco)</ChangeTitle>
            <ChangeBadge>
              <ChangeBadgeText>Dinheiro Selecionado</ChangeBadgeText>
            </ChangeBadge>
          </ChangeHeader>

          <ChangeInputsRow>
            <InputWrapper>
              <InputLabel>Valor Recebido</InputLabel>
              <StyledInput
                value={valorRecebido}
                onChangeText={setValorRecebido}
                keyboardType="numeric"
              />
            </InputWrapper>

            <ChangeOutputWrapper>
              <InputLabel>Troco a Devolver</InputLabel>
              <ChangeBox>
                <ChangeValueText>R$ 3,00</ChangeValueText>
              </ChangeBox>
            </ChangeOutputWrapper>
          </ChangeInputsRow>
        </ChangeContainer>
      )}

      <FinalizeButton onPress={() => router.push('/status')}>
        <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
        <FinalizeButtonText>Finalizar e Emitir Comprovante</FinalizeButtonText>
      </FinalizeButton>
    </Container>
  );
}