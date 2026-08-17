import React from 'react';
import { Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import {
  CartBar as StyledCartBar,
  CartBarTouchable,
  CartBarInfo,
  CartItemsText,
  ActionsRow,
  ClearButton,
  FinalizeButton,
  FinalizeButtonText,
} from './cartBarStyle';

export default function CartBar({ totalItems, totalPrice, onFinalize, onReview, onClear }) {
  if (totalItems === 0) return null;

  const handleClear = () => {
    Alert.alert(
      'Limpar carrinho',
      'Tem certeza que deseja remover todos os itens do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: onClear },
      ]
    );
  };

  return (
    <StyledCartBar>
      <CartBarTouchable onPress={onReview} activeOpacity={0.7}>
        <CartBarInfo>
          <CartItemsText>
            Carrinho Atual{'\n'}
            <Text style={{ fontWeight: 'bold', color: '#3D2C22' }}>
              {totalItems} {totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
            </Text>
          </CartItemsText>
        </CartBarInfo>
        <Ionicons name="chevron-up-outline" size={20} color="#8C7355" />
      </CartBarTouchable>

      <ActionsRow>
        <ClearButton onPress={handleClear}>
          <Ionicons name="trash-outline" size={20} color="#C0392B" />
        </ClearButton>

        <FinalizeButton onPress={onFinalize}>
          <FinalizeButtonText>
            FINALIZAR VENDA · {formatPrice(totalPrice)}
          </FinalizeButtonText>
        </FinalizeButton>
      </ActionsRow>
    </StyledCartBar>
  );
}