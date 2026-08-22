import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../../utils/formatPrice";

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
  DestaqueBadge,
  DestaqueText,
} from "./cardStyle";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export default function CardProd({
  item,
  qty,
  onIncrease,
  onDecrease,
  destaque,
}) {
  const estoqueDisponivel = item.estoque ?? 0;
  const limiteBaixo = item.limiteEstoqueBaixo ?? 5;
  const semEstoque = estoqueDisponivel <= 0;
  const estoqueBaixo = !semEstoque && estoqueDisponivel <= limiteBaixo;
  const atingiuLimite = qty >= estoqueDisponivel;
  const selecionado = qty > 0;

  const restante = Math.max(0, estoqueDisponivel - qty);

  const handlePressCard = () => {
    if (semEstoque || atingiuLimite) return;
    onIncrease();
  };

  return (
    <ProductCard
      semEstoque={semEstoque}
      estoqueBaixo={estoqueBaixo}
      selecionado={selecionado}
      onPress={handlePressCard}
      activeOpacity={0.7}
    >
      {destaque && !semEstoque && (
        <DestaqueBadge>
          <Ionicons name="flame" size={10} color="#FFFFFF" />
          <DestaqueText>MAIS PEDIDO</DestaqueText>
        </DestaqueBadge>
      )}

      <ProductImage source={{ uri: item.image }} resizeMode="cover" />

      <CardContent>
        <ProductTitle numberOfLines={1}>{item.title}</ProductTitle>

        <StockText semEstoque={semEstoque} estoqueBaixo={estoqueBaixo}>
          {semEstoque ? "Sem estoque" : `Restam: ${restante} un`}
        </StockText>

        <ProductFooter>
          <ProductPrice>{formatPrice(item.price)}</ProductPrice>

          {semEstoque ? (
            <EsgotadoBadge>
              <EsgotadoText>ESGOTADO</EsgotadoText>
            </EsgotadoBadge>
          ) : qty > 0 ? (
            <QtyControls>
              <QtyButton onPress={onDecrease} hitSlop={HIT_SLOP}>
                <Ionicons name="remove" size={14} color="#D35400" />
              </QtyButton>
              <QtyText>{qty}</QtyText>
              <QtyButton
                onPress={onIncrease}
                disabled={atingiuLimite}
                hitSlop={HIT_SLOP}
              >
                <Ionicons
                  name="add"
                  size={14}
                  color={atingiuLimite ? "#C9BBA8" : "#D35400"}
                />
              </QtyButton>
            </QtyControls>
          ) : (
            <AddButton onPress={handlePressCard} hitSlop={HIT_SLOP}>
              <Ionicons name="add" size={16} color="#D35400" />
            </AddButton>
          )}
        </ProductFooter>
      </CardContent>
    </ProductCard>
  );
}
