import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../../utils/formatPrice";
import { infoMetodo } from "../../../utils/metodosPagamento";
import { formatHora } from "../../../utils/formatDateTime";
import { vendaCancelada } from "../../../utils/estornoVenda";
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
  CanceladaSelo,
  CanceladaSeloTexto,
} from "./saleListItemStyle";

export default function SaleListItem({ venda, numero, onPress }) {
  const itens = venda.itens || [];
  const primeiroItem = itens[0];
  const outrosItensCount = itens.length - 1;
  const totalUnidades = itens.reduce((soma, i) => soma + i.qty, 0);
  const cancelada = vendaCancelada(venda);

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
            <Ionicons name="cube-outline" size={20} color="#C4C4BE" />
          )}
        </SaleIconContainer>
        <SaleInfo>
          <SaleTitle numberOfLines={1}>{nomeExibido}</SaleTitle>
          <SaleDetails>
            Venda #{numero} • {formatHora(venda.criadoEm || venda.data)} • {totalUnidades}{" "}
            {totalUnidades === 1 ? "unidade" : "unidades"}
          </SaleDetails>
        </SaleInfo>
      </SaleLeft>

      <SaleRight>
        {cancelada && (
          <CanceladaSelo>
            <CanceladaSeloTexto>Cancelada</CanceladaSeloTexto>
          </CanceladaSelo>
        )}
        <MetodoBadge bg={infoMetodo(venda.metodo).fundo}>
          <Ionicons
            name={infoMetodo(venda.metodo).icone}
            size={11}
            color={infoMetodo(venda.metodo).cor}
          />
        </MetodoBadge>
        <SalePrice cancelada={cancelada}>{formatPrice(venda.total)}</SalePrice>
      </SaleRight>
    </SaleCard>
  );
}