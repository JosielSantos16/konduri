import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import {
  ProductCard,
  ProductImage,
  CardContent,
  ProductTitle,
  StockText,
  ProductFooter,
  ProductPrice,
  AddButton,
  QtyControls,
  QtyButton,
  QtyText,
  EsgotadoBadge,
  EsgotadoText,
} from './cardStyle';

export default function CardProd({ item, qty, onIncrease, onDecrease }) {
  const estoqueDisponivel = item.estoque ?? 0;
  const limiteBaixo = item.limiteEstoqueBaixo ?? 5;
  const semEstoque = estoqueDisponivel <= 0;
  const estoqueBaixo = !semEstoque && estoqueDisponivel <= limiteBaixo;
  const atingiuLimite = qty >= estoqueDisponivel;

  return (
    <ProductCard semEstoque={semEstoque} estoqueBaixo={estoqueBaixo}>
      <ProductImage source={{ uri: item.image }} resizeMode="cover" />

      <CardContent>
        <ProductTitle numberOfLines={1}>{item.title}</ProductTitle>

        <StockText semEstoque={semEstoque} estoqueBaixo={estoqueBaixo}>
          {semEstoque ? 'Sem estoque' : `Restam: ${estoqueDisponivel} un`}
        </StockText>

        <ProductFooter>
          <ProductPrice>{formatPrice(item.price)}</ProductPrice>

          {semEstoque ? (
            <EsgotadoBadge>
              <EsgotadoText>ESGOTADO</EsgotadoText>
            </EsgotadoBadge>
          ) : qty > 0 ? (
            <QtyControls>
              <QtyButton onPress={onDecrease}>
                <Ionicons name="remove" size={14} color="#D35400" />
              </QtyButton>
              <QtyText>{qty}</QtyText>
              <QtyButton onPress={onIncrease} disabled={atingiuLimite}>
                <Ionicons name="add" size={14} color={atingiuLimite ? '#C9BBA8' : '#D35400'} />
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