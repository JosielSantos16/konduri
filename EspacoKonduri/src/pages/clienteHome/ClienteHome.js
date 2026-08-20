import React, { useState, useEffect } from "react";
import { Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import NotificacoesBell from "../../components/notificacoes/NotificacoesBell";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useCart } from "../../hooks/useCart";
import NavBarCliente from "../../components/cliente/navBar/NavBarCliente";
import CardProd from "../../components/PDV/cardsProdutos/CardProdutos";
import CartBar from "../../components/PDV/cartBar/CartBar";
import ObservacaoModal from "../../components/cliente/observacaoModal/ObservacaoModal";
import {
  Container,
  Header,
  HeaderTop,
  Greeting,
  Subtitle,
  SearchContainer,
  SearchInput,
  ProductGrid,
  EmptyState,
  EmptyStateText,
} from "./clienteHomeStyle";
import {
  criarPedido,
  subscribeToPedidosAtivos,
} from "../../services/queries/pedidosQueries";

export default function ClienteHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const { produtos, carregandoProdutos } = useProdutos();
  const [busca, setBusca] = useState("");
  const [modalRevisaoVisivel, setModalRevisaoVisivel] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [observacaoModalVisivel, setObservacaoModalVisivel] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [pedidosAtivosGeral, setPedidosAtivosGeral] = useState([]);

  const {
    cart,
    handleIncrease,
    handleDecrease,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart(produtos);

  useEffect(() => {
    const unsubscribe = subscribeToPedidosAtivos((lista) => {
      setPedidosAtivosGeral(lista);
    });
    return unsubscribe;
  }, []);

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
    .filter((item) => item.estoque > 0);

  const produtosFiltrados = produtosDisponiveis.filter((item) =>
    item.title.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  const primeiroNome = usuario?.nome ? usuario.nome.split(" ")[0] : "Cliente";

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setAtualizando(false);
  };

  const handleEnviarPedido = async () => {
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

    try {
      await criarPedido({
        clienteUid: usuario.uid,
        clienteNome: usuario.nome,
        itens,
        total: totalPrice,
        observacoes: observacoes.trim(),
      });

      clearCart();
      setObservacoes("");
      setModalRevisaoVisivel(false);
      Alert.alert(
        "Pedido enviado!",
        "Seu pedido foi enviado e já está sendo preparado.",
      );
      router.push("/meu-pedido");
    } catch (erro) {
      console.error("Erro ao enviar pedido:", erro);
      Alert.alert(
        "Erro",
        "Não foi possível enviar seu pedido. Tente novamente.",
      );
    }
  };

  const itensCarrinhoDetalhados = Object.entries(cart).map(([id, qty]) => {
    const produto =
      produtosDisponiveis.find((p) => p.id === id) ||
      produtos.find((p) => p.id === id);
    return { ...produto, qty };
  });

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <HeaderTop>
          <Greeting>Olá, {primeiroNome}!</Greeting>
             <NotificacoesBell />
        </HeaderTop>
        <Subtitle>O que você quer pedir hoje?</Subtitle>

        <SearchContainer>
          <Ionicons name="search-outline" size={18} color="#8C7355" />
          <SearchInput
            placeholder="Buscar produto..."
            placeholderTextColor="#A99B8F"
            value={busca}
            onChangeText={setBusca}
          />
        </SearchContainer>
      </Header>

      <ProductGrid
        data={produtosFiltrados}
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
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={handleRefresh}
            colors={["#E67E22"]}
            tintColor="#E67E22"
          />
        }
        ListEmptyComponent={
          <EmptyState>
            <Ionicons name="cube-outline" size={40} color="#C9BBA8" />
            <EmptyStateText>
              {busca
                ? `Nenhum produto encontrado para "${busca}".`
                : "Nenhum produto disponível no momento."}
            </EmptyStateText>
          </EmptyState>
        }
      />

      <CartBar
        totalItems={totalItems}
        totalPrice={totalPrice}
        onFinalize={handleEnviarPedido}
        onReview={() => setModalRevisaoVisivel(true)}
        onClear={clearCart}
        finalizeLabel="ENVIAR PEDIDO"
        observacoes={observacoes}
        onPressObservacao={() => setObservacaoModalVisivel(true)}
      />

      <ObservacaoModal
        visible={observacaoModalVisivel}
        onClose={() => setObservacaoModalVisivel(false)}
        value={observacoes}
        onChangeText={setObservacoes}
      />
      <NavBarCliente />
    </Container>
  );
}
