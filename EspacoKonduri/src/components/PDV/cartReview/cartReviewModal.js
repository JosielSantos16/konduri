import React from 'react';
import { Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function CartReviewModal({
  visible,
  onClose,
  itensCarrinho,
  totalPrice,
  onIncrease,
  onDecrease,
  onRemove,
  onProceed,
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

          <TotalRow>
            <TotalLabel>Total</TotalLabel>
            <TotalValue>{formatPrice(totalPrice)}</TotalValue>
          </TotalRow>

          <ProceedButton onPress={onProceed}>
            <Ionicons name="arrow-forward-circle-outline" size={20} color="#FFFFFF" />
            <ProceedButtonText>Continuar para Pagamento</ProceedButtonText>
          </ProceedButton>
        </ModalContent>
      </Overlay>
    </Modal>
  );
}