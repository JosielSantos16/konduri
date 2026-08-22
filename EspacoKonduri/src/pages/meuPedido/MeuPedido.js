import React, { useState, useEffect } from "react";
import { Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ocultarPedido } from "../../services/queries/pedidosQueries";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import {
  subscribeToPedidosDoCliente,
  atualizarStatusPedido,
  criarPedido,
  apagarPedido,
} from "../../services/queries/pedidosQueries";
import { criarNotificacaoPorPerfil } from "../../services/queries/notificacoesQueries";
import { formatPrice } from "../../utils/formatPrice";
import { formatDataHoraComprovante } from "../../utils/formatDateTime";
import NavBarCliente from "../../components/cliente/navBar/NavBarCliente";
import {
  Container,
  HeaderRow,
  Title,
  Subtitle,
  ClearAllButton,
  ClearAllButtonText,
  List,
  PedidoCard,
  PedidoHeader,
  PedidoData,
  StatusBadge,
  StatusBadgeText,
  ItemRow,
  ItemName,
  ItemQtyPrice,
  TotalRow,
  TotalLabel,
  TotalValue,
  EmptyState,
  EmptyStateText,
  CancelButton,
  CancelButtonText,
  PagamentoBadge,
  PagamentoBadgeText,
  ItemImage,
  ItemImagePlaceholder,
  RefazerButton,
  RefazerButtonText,
  SwipeDeleteContainer,
  SwipeDeleteText,
} from "./meuPedidoStyle";

const STATUS_LABEL = {
  pendente: "Aguardando confirmação",
  aceito: "Pedido aceito",
  preparando: "Preparando",
  pronto: "Pronto para retirar",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const STATUS_CANCELAVEIS = ["pendente", "aceito"];
const STATUS_APAGAVEIS = ["cancelado", "entregue"];

export default function MeuPedido() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [refazendoId, setRefazendoId] = useState(null);

  useEffect(() => {
    if (!usuario?.uid) return;

    const unsubscribe = subscribeToPedidosDoCliente(usuario.uid, (lista) => {
      setPedidos(lista);
      setCarregando(false);
    });

    return unsubscribe;
  }, [usuario?.uid]);

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAtualizando(false);
  };

  const handleCancelar = (pedido) => {
    Alert.alert(
      "Cancelar pedido",
      "Tem certeza que deseja cancelar esse pedido?",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Cancelar pedido",
          style: "destructive",
          onPress: async () => {
            setCancelandoId(pedido.id);
            try {
              await atualizarStatusPedido(pedido.id, "cancelado");

              const resumoItens = (pedido.itens || [])
                .map((item) => `${item.qty}x ${item.title}`)
                .join(", ");

              await criarNotificacaoPorPerfil({
                paraPerfis: ["atendente", "adm"],
                tipo: "pedido_cancelado",
                titulo: "Pedido cancelado pelo cliente",
                mensagem: `${usuario.nome}: ${resumoItens}`,
                pedidoId: pedido.id,
                imagens: (pedido.itens || [])
                  .slice(0, 3)
                  .map((i) => i.image)
                  .filter(Boolean),
                total: pedido.total,
                clienteNome: usuario.nome,
                rota: "/pedido",
              });
            } catch (erro) {
              console.error("Erro ao cancelar pedido:", erro);
              Alert.alert(
                "Erro",
                "Não foi possível cancelar o pedido. Tente novamente.",
              );
            } finally {
              setCancelandoId(null);
            }
          },
        },
      ],
    );
  };

  const handleRefazerPedido = (pedido) => {
    Alert.alert(
      "Refazer pedido",
      "Deseja enviar um novo pedido com os mesmos itens?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Refazer Pedido",
          onPress: async () => {
            setRefazendoId(pedido.id);
            try {
              await criarPedido({
  clienteUid: usuario.uid,
  clienteNome: usuario.nome,
  clienteFoto: usuario.foto || null, // ← adiciona essa linha
  itens: pedido.itens,
  total: pedido.total,
  observacoes: pedido.observacoes || '',
});
              Alert.alert(
                "Pedido reenviado!",
                "Seu pedido foi enviado novamente.",
              );
            } catch (erro) {
              console.error("Erro ao refazer pedido:", erro);
              Alert.alert(
                "Erro",
                "Não foi possível refazer o pedido. Tente novamente.",
              );
            } finally {
              setRefazendoId(null);
            }
          },
        },
      ],
    );
  };

  const handleApagar = (pedido) => {
    if (!STATUS_APAGAVEIS.includes(pedido.status)) {
      Alert.alert(
        "Não é possível apagar",
        "Só é possível remover pedidos já cancelados ou entregues.",
      );
      return;
    }

    Alert.alert(
      "Apagar pedido",
      "Deseja remover esse pedido do seu histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => ocultarPedido(pedido.id, usuario.uid), // ← muda aqui
        },
      ],
    );
  };

  const handleLimparTudo = () => {
    const apagaveis = pedidos.filter((p) =>
      STATUS_APAGAVEIS.includes(p.status),
    );

    if (apagaveis.length === 0) {
      Alert.alert(
        "Nada para limpar",
        "Só é possível remover pedidos já cancelados ou entregues.",
      );
      return;
    }

    Alert.alert(
      "Limpar histórico",
      `Deseja remover ${apagaveis.length} ${apagaveis.length === 1 ? "pedido" : "pedidos"} (cancelados/entregues)?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
  await Promise.all(apagaveis.map((p) => ocultarPedido(p.id, usuario.uid))); // ← muda aqui
},
        },
      ],
    );
  };

  const renderSwipeDelete = (pedido) => {
    if (!STATUS_APAGAVEIS.includes(pedido.status)) return null;

    return (
      <SwipeDeleteContainer>
        <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
        <SwipeDeleteText>Apagar</SwipeDeleteText>
      </SwipeDeleteContainer>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Container style={{ paddingTop: insets.top }}>
        <HeaderRow>
          <Title>Meus Pedidos</Title>
          {pedidos.some((p) => STATUS_APAGAVEIS.includes(p.status)) && (
            <ClearAllButton onPress={handleLimparTudo}>
              <ClearAllButtonText>Limpar histórico</ClearAllButtonText>
            </ClearAllButton>
          )}
        </HeaderRow>
        <Subtitle
          style={{ paddingHorizontal: 20, marginTop: -6, marginBottom: 10 }}
        >
          Acompanhe o status em tempo real
        </Subtitle>

        {!carregando && pedidos.length === 0 ? (
          <EmptyState>
            <Ionicons name="receipt-outline" size={40} color="#C9BBA8" />
            <EmptyStateText>Você ainda não fez nenhum pedido.</EmptyStateText>
          </EmptyState>
        ) : (
          <List
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={handleRefresh}
                colors={["#E67E22"]}
                tintColor="#E67E22"
              />
            }
          >
            {pedidos.map((pedido) => {
              const podeCancel = STATUS_CANCELAVEIS.includes(pedido.status);
              const foiCancelado = pedido.status === "cancelado";
              const podeApagar = STATUS_APAGAVEIS.includes(pedido.status);

              const cardContent = (
                <PedidoCard>
                  <PedidoHeader>
                    <PedidoData>
                      {formatDataHoraComprovante(pedido.criadoEm)}
                    </PedidoData>
                    <StatusBadge status={pedido.status}>
                      <StatusBadgeText status={pedido.status}>
                        {STATUS_LABEL[pedido.status] || pedido.status}
                      </StatusBadgeText>
                    </StatusBadge>
                  </PedidoHeader>

                  {(pedido.itens || []).map((item, index) => (
                    <ItemRow key={`${item.id || item.title}-${index}`}>
                      {item.image ? (
                        <ItemImage
                          source={{ uri: item.image }}
                          resizeMode="cover"
                        />
                      ) : (
                        <ItemImagePlaceholder>
                          <Ionicons
                            name="cube-outline"
                            size={16}
                            color="#C9BBA8"
                          />
                        </ItemImagePlaceholder>
                      )}
                      <ItemName numberOfLines={1}>
                        {item.qty}x {item.title}
                      </ItemName>
                      <ItemQtyPrice>
                        {formatPrice(item.qty * item.price)}
                      </ItemQtyPrice>
                    </ItemRow>
                  ))}

                  <TotalRow>
                    <TotalLabel>Total</TotalLabel>
                    <TotalValue>{formatPrice(pedido.total)}</TotalValue>
                  </TotalRow>

                  {!foiCancelado && (
                    <PagamentoBadge pago={pedido.pago}>
                      <Ionicons
                        name={pedido.pago ? "checkmark-circle" : "time-outline"}
                        size={12}
                        color={pedido.pago ? "#2E5A1E" : "#C0392B"}
                      />
                      <PagamentoBadgeText pago={pedido.pago}>
                        {pedido.pago ? "Pago" : "Aguardando pagamento"}
                      </PagamentoBadgeText>
                    </PagamentoBadge>
                  )}

                  {podeCancel && (
                    <>
                      <CancelButton
                        onPress={() =>
                          router.push({
                            pathname: "/editar-pedido",
                            params: { pedidoId: pedido.id },
                          })
                        }
                        style={{ borderColor: "#E67E22", marginBottom: 8 }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#E67E22"
                        />
                        <CancelButtonText style={{ color: "#E67E22" }}>
                          Editar Pedido
                        </CancelButtonText>
                      </CancelButton>

                      <CancelButton
                        onPress={() => handleCancelar(pedido)}
                        disabled={cancelandoId === pedido.id}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={16}
                          color="#C0392B"
                        />
                        <CancelButtonText>
                          {cancelandoId === pedido.id
                            ? "Cancelando..."
                            : "Cancelar Pedido"}
                        </CancelButtonText>
                      </CancelButton>
                    </>
                  )}

                  {foiCancelado && (
                    <RefazerButton
                      onPress={() => handleRefazerPedido(pedido)}
                      disabled={refazendoId === pedido.id}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={16}
                        color="#FFFFFF"
                      />
                      <RefazerButtonText>
                        {refazendoId === pedido.id
                          ? "Enviando..."
                          : "Refazer Pedido"}
                      </RefazerButtonText>
                    </RefazerButton>
                  )}
                </PedidoCard>
              );

              if (!podeApagar)
                return (
                  <React.Fragment key={pedido.id}>{cardContent}</React.Fragment>
                );

              return (
                <Swipeable
                  key={pedido.id}
                  renderRightActions={() => renderSwipeDelete(pedido)}
                  onSwipeableOpen={() => handleApagar(pedido)}
                  overshootRight={false}
                >
                  {cardContent}
                </Swipeable>
              );
            })}
          </List>
        )}

        <NavBarCliente />
      </Container>
    </GestureHandlerRootView>
  );
}
