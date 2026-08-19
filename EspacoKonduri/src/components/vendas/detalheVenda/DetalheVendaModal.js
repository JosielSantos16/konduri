import React from "react";
import { Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../../utils/formatPrice";
import { formatHora } from "../../../utils/formatDateTime";
import {
  DetalheOverlay,
  DetalheContent,
  DetalheHeader,
  DetalheTitle,
  DetalheCloseButton,
  DetalheInfoRow,
  DetalheInfoLabel,
  DetalheInfoValue,
  DetalheDivider,
  DetalheItemRow,
  DetalheItemImage,
  DetalheItemImagePlaceholder,
  DetalheItemInfo,
  DetalheItemNome,
  DetalheItemQty,
  DetalheItemSubtotal,
  DetalheTotalRow,
  DetalheTotalLabel,
  DetalheTotalValue,
} from "./detalheVendaModalStyle"; // ← antes vinha de "../../pages/vendas/vendasStyles"

export default function DetalheVendaModal({ venda, onClose }) {
  if (!venda) return null;

  const itens = venda.itens || [];
  const totalUnidades = itens.reduce((soma, item) => soma + item.qty, 0);

  return (
    <Modal visible={!!venda} transparent animationType="slide" onRequestClose={onClose}>
      <DetalheOverlay>
        <DetalheContent>
          <DetalheHeader>
            <DetalheTitle>Detalhes da Venda</DetalheTitle>
            <DetalheCloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color="#3D2C22" />
            </DetalheCloseButton>
          </DetalheHeader>

          <DetalheInfoRow>
            <DetalheInfoLabel>Horário</DetalheInfoLabel>
            <DetalheInfoValue>{formatHora(venda.data)}</DetalheInfoValue>
          </DetalheInfoRow>
          <DetalheInfoRow>
            <DetalheInfoLabel>Atendente</DetalheInfoLabel>
            <DetalheInfoValue>{venda.responsavelNome || "Desconhecido"}</DetalheInfoValue>
          </DetalheInfoRow>
          <DetalheInfoRow>
            <DetalheInfoLabel>Forma de pagamento</DetalheInfoLabel>
            <DetalheInfoValue>{venda.metodo === "pix" ? "Pix" : "Dinheiro"}</DetalheInfoValue>
          </DetalheInfoRow>
          <DetalheInfoRow>
            <DetalheInfoLabel>Total de unidades</DetalheInfoLabel>
            <DetalheInfoValue>{totalUnidades}</DetalheInfoValue>
          </DetalheInfoRow>

          <DetalheDivider />

          {itens.map((produto, index) => (
            <DetalheItemRow key={`${produto.id || produto.title}-${index}`}>
              {produto.image ? (
                <DetalheItemImage source={{ uri: produto.image }} resizeMode="cover" />
              ) : (
                <DetalheItemImagePlaceholder>
                  <Ionicons name="cube-outline" size={20} color="#C9BBA8" />
                </DetalheItemImagePlaceholder>
              )}
              <DetalheItemInfo>
                <DetalheItemNome numberOfLines={1}>{produto.title}</DetalheItemNome>
                <DetalheItemQty>
                  {produto.qty} un × {formatPrice(produto.price)}
                </DetalheItemQty>
              </DetalheItemInfo>
              <DetalheItemSubtotal>{formatPrice(produto.qty * produto.price)}</DetalheItemSubtotal>
            </DetalheItemRow>
          ))}

          <DetalheTotalRow>
            <DetalheTotalLabel>Total</DetalheTotalLabel>
            <DetalheTotalValue>{formatPrice(venda.total)}</DetalheTotalValue>
          </DetalheTotalRow>
        </DetalheContent>
      </DetalheOverlay>
    </Modal>
  );
}