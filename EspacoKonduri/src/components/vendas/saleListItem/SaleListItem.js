import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../../utils/formatPrice";
import { formatHora } from "../../../utils/formatDateTime";
import {
  SaleCard,
  SaleLeft,
  SaleIconContainer,
  SaleProductImage,
  MetodoBadge,
  SaleInfo,
  SaleTitle,
  SaleDetails,
  SaleRight,
  SalePrice,
} from "./saleListItemStyle";

export default function SaleListItem({ venda, numero, onPress }) {
  const itens = venda.itens || [];
  const primeiroItem = itens[0];
  const outrosItensCount = itens.length - 1;
  const totalUnidades = itens.reduce((soma, i) => soma + i.qty, 0);

  const nomeExibido = primeiroItem
    ? outrosItensCount > 0
      ? `${primeiroItem.title} +${outrosItensCount} ${outrosItensCount === 1 ? "item" : "itens"}`
      : primeiroItem.title
    : "Venda sem itens";

  return (
    <SaleCard onPress={onPress}>
      <SaleLeft>
        <SaleIconContainer>
          {primeiroItem?.image ? (
            <SaleProductImage source={{ uri: primeiroItem.image }} resizeMode="cover" />
          ) : (
            <Ionicons name="cube-outline" size={20} color="#C9BBA8" />
          )}
        </SaleIconContainer>
        <SaleInfo>
          <SaleTitle numberOfLines={1}>{nomeExibido}</SaleTitle>
          <SaleDetails>
            Venda #{numero} • {formatHora(venda.data)} • {totalUnidades}{" "}
            {totalUnidades === 1 ? "unidade" : "unidades"}
          </SaleDetails>
        </SaleInfo>
      </SaleLeft>

      <SaleRight>
        <MetodoBadge type={venda.metodo}>
          <Ionicons
            name={venda.metodo === "pix" ? "qr-code-outline" : "cash-outline"}
            size={11}
            color={venda.metodo === "pix" ? "#16A085" : "#27AE60"}
          />
        </MetodoBadge>
        <SalePrice>{formatPrice(venda.total)}</SalePrice>
      </SaleRight>
    </SaleCard>
  );
}