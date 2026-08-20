import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useCart } from "../../hooks/useCart";
import CardProd from "../../components/PDV/cardsProdutos/CardProdutos";
import CartBar from "../../components/PDV/cartBar/CartBar";
import { criarNotificacaoPorPerfil } from "../../services/queries/notificacoesQueries";
import { useAuth } from "../../hooks/useAuth";
import CartReviewModal from "../../components/PDV/cartReview/cartReviewModal";
import ObservacaoModal from "../../components/cliente/observacaoModal/ObservacaoModal";
import {
  Container,
  Header,
  BackButton,
  HeaderTexts,
  Title,
  Subtitle,
  ProductGrid,
  LoadingContainer,
} from "./editarPedidoStyle";

import {
  buscarPedidoPorId,
  atualizarItensPedido,
  subscribeToPedidosAtivos,
} from "../../services/queries/pedidosQueries";

export default function EditarPedido() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pedidoId } = useLocalSearchParams();
  const { produtos } = useProdutos();
  const { usuario } = useAuth();

  const [pedidoOriginal, setPedidoOriginal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pedidosAtivosGeral, setPedidosAtivosGeral] = useState([]);
  const [modalRevisaoVisivel, setModalRevisaoVisivel] = useState(false);
  const [observacaoModalVisivel, setObservacaoModalVisivel] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  const {
    cart,
    setCart,
    handleIncrease,
    handleDecrease,
    removeItem,
    totalItems,
    totalPrice,
  } = useCart(produtos);

  useEffect(() => {
    async function carregar() {
      const pedido = await buscarPedidoPorId(pedidoId);
      if (!pedido) {
        Alert.alert("Erro", "Pedido não encontrado.");
        router.back();
        return;
      }

      setPedidoOriginal(pedido);
      setObservacoes(pedido.observacoes || "");

      const cartInicial = {};
      (pedido.itens || []).forEach((item) => {
        cartInicial[item.id] = item.qty;
      });
      setCart(cartInicial);

      setCarregando(false);
    }

    if (pedidoId) carregar();
  }, [pedidoId]);

  useEffect(() => {
    const unsubscribe = subscribeToPedidosAtivos((lista) => {
      setPedidosAtivosGeral(lista.filter((p) => p.id !== pedidoId));
    });
    return unsubscribe;
  }, [pedidoId]);

  const quantidadeReservadaPorProduto = pedidosAtivosGeral.reduce(
    (acc, pedido) => {
      (pedido.itens || []).forEach((item) => {
        acc[item.id] = (acc[item.id] || 0) + item.qty;
      });
      return acc;
    },
    {},
  );

  const produtosDisponiveis = produtos
    .filter((item) => item.category === "produtos")
    .map((item) => {
      const reservado = quantidadeReservadaPorProduto[item.id] || 0;
      const estoqueAjustado = Math.max(0, (item.estoque ?? 0) - reservado);
      return { ...item, estoque: estoqueAjustado };
    })
    .filter((item) => item.estoque > 0 || cart[item.id] > 0);

  const handleSalvar = async () => {
    if (totalItems === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione pelo menos um item antes de salvar.",
      );
      return;
    }

    const itens = Object.entries(cart).map(([id, qty]) => {
      const produto = produtos.find((p) => p.id === id);
      return {
        id: produto.id,
        title: produto.title,
        qty,
        price: produto.price,
        image: produto.image,
      };
    });

    setSalvando(true);
    try {
      await atualizarItensPedido(
        pedidoId,
        itens,
        totalPrice,
        observacoes.trim(),
      );

      const resumoItens = itens
        .map((item) => `${item.qty}x ${item.title}`)
        .join(", ");

      await criarNotificacaoPorPerfil({
        paraPerfis: ["atendente", "adm"],
        tipo: "pedido_editado",
        titulo: "Pedido editado pelo cliente",
        mensagem: `${usuario?.nome}: ${resumoItens}`,
        pedidoId,
        imagens: itens
          .slice(0, 3)
          .map((i) => i.image)
          .filter(Boolean),
        total: totalPrice,
        clienteNome: usuario?.nome,
        rota: "/pedido",
      });

      Alert.alert("Pedido atualizado!", "Suas alterações foram salvas.");
      router.back();
    } catch (erro) {
      console.error("Erro ao salvar edição do pedido:", erro);
      Alert.alert(
        "Erro",
        "Não foi possível salvar as alterações. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const itensCarrinhoDetalhados = Object.entries(cart).map(([id, qty]) => {
    const produto = produtos.find((p) => p.id === id);
    return { ...produto, qty };
  });

  if (carregando) {
    return (
      <Container style={{ paddingTop: insets.top }}>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#E67E22" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#3D2C22" />
        </BackButton>
        <HeaderTexts>
          <Title>Editar Pedido</Title>
          <Subtitle>Ajuste as quantidades ou adicione itens</Subtitle>
        </HeaderTexts>
      </Header>

      <ProductGrid
        data={produtosDisponiveis}
        renderItem={({ item }) => (
          <CardProd
            item={item}
            qty={cart[item.id] || 0}
            onIncrease={() => handleIncrease(item.id)}
            onDecrease={() => handleDecrease(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <CartBar
        totalItems={totalItems}
        totalPrice={totalPrice}
        onFinalize={handleSalvar}
        onReview={() => setModalRevisaoVisivel(true)}
        onClear={() => setCart({})}
        finalizeLabel={salvando ? "Salvando..." : "Salvar Alterações"}
        observacoes={observacoes}
        onPressObservacao={() => setObservacaoModalVisivel(true)}
      />

      <CartReviewModal
        visible={modalRevisaoVisivel}
        onClose={() => setModalRevisaoVisivel(false)}
        itensCarrinho={itensCarrinhoDetalhados}
        totalPrice={totalPrice}
        onIncrease={(id) => handleIncrease(id)}
        onDecrease={handleDecrease}
        onRemove={removeItem}
        onProceed={handleSalvar}
        proceedLabel="Salvar Alterações"
      />

      <ObservacaoModal
        visible={observacaoModalVisivel}
        onClose={() => setObservacaoModalVisivel(false)}
        value={observacoes}
        onChangeText={setObservacoes}
      />
    </Container>
  );
}
