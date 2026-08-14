import React from 'react';
import { Text } from 'react-native';
import { formatPrice } from '../../../utils/formatPrice';
import {
  CartBar as StyledCartBar,
  CartBarInfo,
  CartItemsText,
  CartTotalText,
  FinalizeButton,
  FinalizeButtonText,
} from './cartBarStyle';

export default function CartBar({ totalItems, totalPrice, onFinalize }) {
  if (totalItems === 0) return null;

  return (
    <StyledCartBar>
      <CartBarInfo>
        <CartItemsText>
          Carrinho Atual{'\n'}
          <Text style={{ fontWeight: 'bold', color: '#3D2C22' }}>
            {totalItems} {totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
          </Text>
        </CartItemsText>
        <CartTotalText>{formatPrice(totalPrice)}</CartTotalText>
      </CartBarInfo>

      <FinalizeButton onPress={onFinalize}>
        <FinalizeButtonText>FINALIZAR VENDA  →</FinalizeButtonText>
      </FinalizeButton>

      
    </StyledCartBar>
  );
}