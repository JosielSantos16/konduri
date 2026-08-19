import React from 'react';
import { Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { formatPrice } from '../../../utils/formatPrice';
import {
  Overlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ItemRow,
  ItemImage,
  ItemInfo,
  ItemTitle,
  ItemPrice,
  ItemQtyControls,
  QtyButton,
  QtyText,
  RemoveButton,
  ItemSubtotal,
  TotalRow,
  TotalLabel,
  TotalValue,
  ProceedButton,
  ProceedButtonText,
} from './cartReviewModalStyle';

const ObservacaoContainer = styled.View`
  margin-top: 4px;
  margin-bottom: 6px;
`;

const ObservacaoLabel = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #8C7355;
  margin-bottom: 6px;
`;

const ObservacaoInput = styled.TextInput`
  background-color: #FAF8F5;
  border-radius: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding: 10px 12px;
  font-size: 13px;
  color: #3D2C22;
  min-height: 60px;
  text-align-vertical: top;
`;

export default function CartReviewModal({
  visible,
  onClose,
  itensCarrinho,
  totalPrice,
  onIncrease,
  onDecrease,
  onRemove,
  onProceed,
  proceedLabel = 'Continuar para Pagamento',
  observacoes,
  onChangeObservacoes,
  mostrarObservacoes = false, // só a tela do cliente precisa disso, o PDV não
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Overlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Revisar Carrinho</ModalTitle>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color="#3D2C22" />
            </CloseButton>
          </ModalHeader>

          <FlatList
            data={itensCarrinho}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemRow>
                <ItemImage source={{ uri: item.image }} resizeMode="cover" />
                <ItemInfo>
                  <ItemTitle numberOfLines={1}>{item.title}</ItemTitle>
                  <ItemPrice>{formatPrice(item.price)} / un</ItemPrice>
                </ItemInfo>

                <ItemQtyControls>
                  <QtyButton onPress={() => onDecrease(item.id)}>
                    <Ionicons name="remove" size={14} color="#D35400" />
                  </QtyButton>
                  <QtyText>{item.qty}</QtyText>
                  <QtyButton onPress={() => onIncrease(item.id)}>
                    <Ionicons name="add" size={14} color="#D35400" />
                  </QtyButton>
                </ItemQtyControls>

                <ItemSubtotal>{formatPrice(item.qty * item.price)}</ItemSubtotal>

                <RemoveButton onPress={() => onRemove(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#C0392B" />
                </RemoveButton>
              </ItemRow>
            )}
            showsVerticalScrollIndicator={false}
          />

          {mostrarObservacoes && (
            <ObservacaoContainer>
              <ObservacaoLabel>Observações (opcional)</ObservacaoLabel>
              <ObservacaoInput
                placeholder="Ex: sem gelo, embalar pra viagem..."
                placeholderTextColor="#A99B8F"
                value={observacoes}
                onChangeText={onChangeObservacoes}
                multiline
                numberOfLines={3}
              />
            </ObservacaoContainer>
          )}

          <TotalRow>
            <TotalLabel>Total</TotalLabel>
            <TotalValue>{formatPrice(totalPrice)}</TotalValue>
          </TotalRow>

          <ProceedButton onPress={onProceed}>
            <Ionicons name="arrow-forward-circle-outline" size={20} color="#FFFFFF" />
            <ProceedButtonText>{proceedLabel}</ProceedButtonText>
          </ProceedButton>
        </ModalContent>
      </Overlay>
    </Modal>
  );
}