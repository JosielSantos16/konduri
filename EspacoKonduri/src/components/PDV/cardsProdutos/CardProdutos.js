import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../../utils/formatPrice";
import DetalheProdutoModal from "../../PDV/detalheProduto/DetalheProdutoModal";

import {
  ProductCard,
  ProductImage,
  ProductImagePlaceholder,
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
  const [detalheVisivel, setDetalheVisivel] = useState(false);

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
    <>
      <ProductCard
        semEstoque={semEstoque}
        estoqueBaixo={estoqueBaixo}
        selecionado={selecionado}
        onPress={handlePressCard}
        onLongPress={() => setDetalheVisivel(true)}
        activeOpacity={0.7}
      >
        {destaque && !semEstoque && (
          <DestaqueBadge>
            <Ionicons name="flame" size={10} color="#FFFFFF" />
            <DestaqueText>MAIS PEDIDO</DestaqueText>
          </DestaqueBadge>
        )}

        {item.image ? (
          <ProductImage source={{ uri: item.image }} resizeMode="cover" />
        ) : (
          <ProductImagePlaceholder>
            <Ionicons name="image-outline" size={28} color="#C9BBA8" />
          </ProductImagePlaceholder>
        )}

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

      <DetalheProdutoModal
        visible={detalheVisivel}
        item={item}
        onClose={() => setDetalheVisivel(false)}
      />
    </>
  );
}