import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  SectionTitle,
  PaymentMethodsContainer,
  MethodCard,
  MethodIconContainer,
  MethodTitle,
  MethodSubtitle,
} from './formaPagamentoStyle';

const METHODS = [
  { key: 'pix', title: 'PIX', subtitle: 'QR Code Gerado', icon: 'qr-code-outline', color: '#E67E22' },
  { key: 'dinheiro', title: 'Dinheiro', subtitle: 'Espécie em Mãos', icon: 'cash-outline', color: '#137333' },
];

export default function PaymentMethodSelector({ selected, onSelect, disabled }) {
  const handleSelect = (key) => {
    if (disabled) return;
    Haptics.selectionAsync();
    onSelect(key);
  };

  return (
    <>
      <SectionTitle>Selecione o Método de Pagamento</SectionTitle>
      <PaymentMethodsContainer>
        {METHODS.map((method) => (
          <MethodCard
            key={method.key}
            selected={selected === method.key}
            onPress={() => handleSelect(method.key)}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            <MethodIconContainer>
              <Ionicons name={method.icon} size={22} color={method.color} />
            </MethodIconContainer>
            <MethodTitle>{method.title}</MethodTitle>
            <MethodSubtitle>{method.subtitle}</MethodSubtitle>
          </MethodCard>
        ))}
      </PaymentMethodsContainer>
    </>
  );
}