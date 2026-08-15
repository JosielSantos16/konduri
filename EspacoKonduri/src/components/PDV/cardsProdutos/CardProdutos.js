import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import {
  ProductCard,
  ProductImage,
  CardContent,
  ProductTitle,
  ProductFooter,
  ProductPrice,
  AddButton,
  QtyControls,
  QtyButton,
  QtyText,
} from './cardStyle';

export default function CardProd({ item, qty, onIncrease, onDecrease }) {
  return (
    <ProductCard>
      <ProductImage source={{ uri: item.image }} resizeMode="cover" />

      <CardContent>
        <ProductTitle numberOfLines={1}>{item.title}</ProductTitle>
        <ProductFooter>
          <ProductPrice>{formatPrice(item.price)}</ProductPrice>

          {qty > 0 ? (
            <QtyControls>
              <QtyButton onPress={onDecrease}>
                <Ionicons name="remove" size={14} color="#D35400" />
              </QtyButton>
              <QtyText>{qty}</QtyText>
              <QtyButton onPress={onIncrease}>
                <Ionicons name="add" size={14} color="#D35400" />
              </QtyButton>
            </QtyControls>
          ) : (
            <AddButton onPress={onIncrease}>
              <Ionicons name="add" size={16} color="#D35400" />
            </AddButton>
          )}
        </ProductFooter>
      </CardContent>
    </ProductCard>
  );
}