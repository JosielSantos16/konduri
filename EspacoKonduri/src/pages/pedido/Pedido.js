import React, { useState, useEffect } from "react";
import { Alert, RefreshControl, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import {
  subscribeToPedidosDoAtendente,
  atualizarStatusPedido,
  atualizarPagamentoPedido,
  ocultarPedido,
} from "../../services/queries/pedidosQueries";
import { formatPrice } from "../../utils/formatPrice";
import { formatHora } from "../../utils/formatDateTime";
import NavBarAtendente from "../../components/PDV/navBar/navBarAtendente";
import FotoAmpliadaModal from "../../components/shared/FotoAmpliadaModal";
import {
  Container,
  Header,
  Title,
  Subtitle,
  List,
  PedidoCard,
  PedidoHeader,
  ClienteNome,
  PedidoHora,
  StatusBadge,
  StatusBadgeText,
  ItemRow,
  ItemImage,
  ItemImagePlaceholder,
  ItemName,
  ItemQtyPrice,
  ObservacaoBox,
  ObservacaoText,
  TotalRow,
  TotalLabel,
  TotalValue,
  PagamentoRow,
  PagamentoText,
  ActionsRow,
  ActionButton,
  ActionButtonText,
  Content,
  EmptyTitle,
  EmptySubtitle,
  ClearAllButton,
  ClearAllButtonText,
  SwipeDeleteContainer,
  SwipeDeleteText,
  ClienteAvatar,
  ClienteAvatarPlaceholder,
  ClienteInfoRow,
} from "./pedidoStyle";

const STATUS_LABEL = {
  pendente: "Novo pedido",
  aceito: "Aceito",
  preparando: "Preparando",
  pronto: "Pronto",
  cancelado: "Cancelado pelo cliente",
};

const PROXIMO_STATUS = {
  pendente: { status: "aceito", label: "Aceitar Pedido", icon: "checkmark-circle-outline" },
  aceito: { status: "preparando", label: "Iniciar Preparo", icon: "flame-outline" },
  preparando: { status: "pronto", label: "Marcar como Pronto", icon: "checkmark-done-outline" },
  pronto: { status: "entregue", label: "Marcar como Entregue", icon: "bag-check-outline" },
};

export default function Pedido() {
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [processandoId, setProcessandoId] = useState(null);
  const [atualizando, setAtualizando] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToPedidosDoAtendente(setPedidos, usuario?.uid);
    return unsubscribe;
  }, [usuario?.uid]);

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAtualizando(false);
  };

  const handleAvancarStatus = async (pedido) => {
    const proximo = PROXIMO_STATUS[pedido.status];
    if (!proximo) return;

    setProcessandoId(pedido.id);
    try {
      await atualizarStatusPedido(pedido.id, proximo.status, pedido.clienteUid);
    } catch (erro) {
      console.error("Erro ao avançar status do pedido:", erro);
      Alert.alert("Erro", "Não foi possível atualizar o pedido. Tente novamente.");
    } finally {
      setProcessandoId(null);
    }
  };

  const handleTogglePagamento = async (pedido) => {
    try {
      await atualizarPagamentoPedido(pedido.id, !pedido.pago);
    } catch (erro) {
      console.error("Erro ao atualizar pagamento:", erro);
      Alert.alert("Erro", "Não foi possível atualizar o status de pagamento.");
    }
  };

  const handleOcultar = (pedido) => {
    if (pedido.status !== "cancelado") return;

    Alert.alert("Remover da lista", "Deseja remover esse pedido cancelado da sua lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => ocultarPedido(pedido.id, usuario.uid),
      },
    ]);
  };

  const handleLimparCancelados = () => {
    const cancelados = pedidos.filter((p) => p.status === "cancelado");

    if (cancelados.length === 0) {
      Alert.alert("Nada para limpar", "Não há pedidos cancelados na lista.");
      return;
    }

    Alert.alert(
      "Limpar cancelados",
      `Deseja remover ${cancelados.length} pedidos cancelados da lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            await Promise.all(cancelados.map((p) => ocultarPedido(p.id, usuario.uid)));
          },
        },
      ]
    );
  };

  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    if (a.status === "pendente" && b.status !== "pendente") return -1;
    if (b.status === "pendente" && a.status !== "pendente") return 1;
    return new Date(a.criadoEm) - new Date(b.criadoEm);
  });

  const temCancelados = pedidos.some((p) => p.status === "cancelado");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Container style={{ paddingTop: insets.top }}>
        <Header style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Title>Pedidos</Title>
            <Subtitle>
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
            </Subtitle>
          </View>
          {temCancelados && (
            <ClearAllButton onPress={handleLimparCancelados}>
              <ClearAllButtonText>Limpar cancelados</ClearAllButtonText>
            </ClearAllButton>
          )}
        </Header>

        {pedidos.length === 0 ? (
          <Content>
            <Ionicons name="receipt-outline" size={48} color="#C9BBA8" />
            <EmptyTitle>Nenhum pedido no momento</EmptyTitle>
            <EmptySubtitle>Assim que um cliente enviar um pedido, ele aparece aqui automaticamente.</EmptySubtitle>
          </Content>
        ) : (
          <List
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={atualizando} onRefresh={handleRefresh} colors={["#2E5A1E"]} tintColor="#2E5A1E" />
            }
          >
            {pedidosOrdenados.map((pedido) => {
              const proximo = PROXIMO_STATUS[pedido.status];
              const processando = processandoId === pedido.id;
              const podeOcultar = pedido.status === "cancelado";

              const cardContent = (
                <PedidoCard status={pedido.status}>
                  <PedidoHeader>
                    <ClienteInfoRow>
                      {pedido.clienteFoto ? (
                        <TouchableOpacity onPress={() => setFotoAmpliada(pedido.clienteFoto)}>
                          <ClienteAvatar source={{ uri: pedido.clienteFoto }} resizeMode="cover" />
                        </TouchableOpacity>
                      ) : (
                        <ClienteAvatarPlaceholder>
                          <Ionicons name="person" size={16} color="#8C7355" />
                        </ClienteAvatarPlaceholder>
                      )}
                      <View>
                        <ClienteNome>{pedido.clienteNome || "Cliente"}</ClienteNome>
                        <PedidoHora>{formatHora(pedido.criadoEm)}</PedidoHora>
                      </View>
                    </ClienteInfoRow>

                    <StatusBadge status={pedido.status}>
                      <StatusBadgeText status={pedido.status}>
                        {STATUS_LABEL[pedido.status] || pedido.status}
                      </StatusBadgeText>
                    </StatusBadge>
                  </PedidoHeader>

                  {(pedido.itens || []).map((item, index) => (
                    <ItemRow key={`${item.id || item.title}-${index}`}>
                      {item.image ? (
                        <ItemImage source={{ uri: item.image }} resizeMode="cover" />
                      ) : (
                        <ItemImagePlaceholder>
                          <Ionicons name="cube-outline" size={16} color="#C9BBA8" />
                        </ItemImagePlaceholder>
                      )}
                      <ItemName numberOfLines={1}>
                        {item.qty}x {item.title}
                      </ItemName>
                      <ItemQtyPrice>{formatPrice(item.qty * item.price)}</ItemQtyPrice>
                    </ItemRow>
                  ))}

                  {!!pedido.observacoes && (
                    <ObservacaoBox>
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color="#8C5A2E" />
                      <ObservacaoText>Mensagem: {pedido.observacoes}</ObservacaoText>
                    </ObservacaoBox>
                  )}

                  <TotalRow>
                    <TotalLabel>Total</TotalLabel>
                    <TotalValue>{formatPrice(pedido.total)}</TotalValue>
                  </TotalRow>

                  {pedido.status !== "cancelado" && (
                    <PagamentoRow pago={pedido.pago} onPress={() => handleTogglePagamento(pedido)}>
                      <Ionicons
                        name={pedido.pago ? "checkmark-circle" : "time-outline"}
                        size={16}
                        color={pedido.pago ? "#2E5A1E" : "#C0392B"}
                      />
                      <PagamentoText pago={pedido.pago}>
                        {pedido.pago ? "Pago — toque para desmarcar" : "Aguardando pagamento — toque para marcar como pago"}
                      </PagamentoText>
                    </PagamentoRow>
                  )}

                  {proximo && (
                    <ActionsRow>
                      <ActionButton onPress={() => handleAvancarStatus(pedido)} disabled={processando}>
                        <Ionicons name={proximo.icon} size={16} color="#FFFFFF" />
                        <ActionButtonText>{processando ? "Atualizando..." : proximo.label}</ActionButtonText>
                      </ActionButton>
                    </ActionsRow>
                  )}
                </PedidoCard>
              );

              if (!podeOcultar) return <React.Fragment key={pedido.id}>{cardContent}</React.Fragment>;

              return (
                <Swipeable
                  key={pedido.id}
                  overshootRight={false}
                  onSwipeableOpen={() => handleOcultar(pedido)}
                  renderRightActions={() => (
                    <SwipeDeleteContainer>
                      <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
                      <SwipeDeleteText>Remover</SwipeDeleteText>
                    </SwipeDeleteContainer>
                  )}
                >
                  {cardContent}
                </Swipeable>
              );
            })}
          </List>
        )}

        <NavBarAtendente />
      </Container>

      <FotoAmpliadaModal uri={fotoAmpliada} onClose={() => setFotoAmpliada(null)} />
    </GestureHandlerRootView>
  );
}