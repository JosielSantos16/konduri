import React, { useState, useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { useCaixa } from "../../contexts/CaixaContext";
import { useVendas } from "../../contexts/VendasContext";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useCart } from "../../hooks/useCart";
import NotificacoesBell from "../../components/notificacoes/NotificacoesBell";
import NavBarCliente from "../../components/cliente/navBar/NavBarCliente";
import CardProd from "../../components/PDV/cardsProdutos/CardProdutos";
import CartBar from "../../components/PDV/cartBar/CartBar";
import CartReviewModal from "../../components/PDV/cartReview/cartReviewModal";
import ObservacaoModal from "../../components/cliente/observacaoModal/ObservacaoModal";
import {
  Container,
  Header,
  HeaderTop,
  Greeting,
  Subtitle,
  SearchContainer,
  SearchInput,
  ClosedOperationBanner,
  ClosedOperationText,
  PedidoAtivoBanner,
  PedidoAtivoText,
  SectionHeader,
  SectionTitle,
  SortRow,
  SortChip,
  SortChipText,
  ProductGrid,
  EmptyState,
  EmptyStateText,
} from "./clienteHomeStyle";
import {
  criarPedido,
  subscribeToPedidosAtivos,
  subscribeToPedidosDoCliente,
} from "../../services/queries/pedidosQueries";

const OPCOES_ORDENACAO = [
  { key: "padrao", label: "Padrão", icon: "list-outline" },
  { key: "preco-asc", label: "Menor preço", icon: "arrow-up-outline" },
  { key: "preco-desc", label: "Maior preço", icon: "arrow-down-outline" },
];

export default function ClienteHome() {
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const { caixaAberto } = useCaixa();
  const { maisVendidos } = useVendas();
  const { produtos } = useProdutos();

  const [busca, setBusca] = useState("");
  const [modalRevisaoVisivel, setModalRevisaoVisivel] = useState(false);
  const [observacaoModalVisivel, setObservacaoModalVisivel] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [pedidosAtivosGeral, setPedidosAtivosGeral] = useState([]);
  const [meusPedidosAtivos, setMeusPedidosAtivos] = useState([]);
  const [ordenacao, setOrdenacao] = useState("padrao");

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

  useEffect(() => {
    if (!usuario?.uid) return;
    const unsubscribe = subscribeToPedidosDoCliente(usuario.uid, (lista) => {
      const ativos = lista.filter((p) =>
        ["pendente", "aceito", "preparando", "pronto"].includes(p.status),
      );
      setMeusPedidosAtivos(ativos);
    });
    return unsubscribe;
  }, [usuario?.uid]);

  useFocusEffect(
    React.useCallback(() => {
      const handler = () => {
        if (totalItems > 0) {
          Alert.alert(
            "Sair sem finalizar?",
            "Você tem itens no carrinho. Se sair agora, eles serão perdidos.",
            [
              { text: "Continuar", style: "cancel" },
              {
                text: "Sair mesmo assim",
                style: "destructive",
                onPress: () => {
                  clearCart();
                  BackHandler.exitApp();
                },
              },
            ],
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handler,
      );
      return () => subscription.remove();
    }, [totalItems]),
  );

  const quantidadeReservadaPorProduto = pedidosAtivosGeral.reduce(
    (acc, pedido) => {
      (pedido.itens || []).forEach((item) => {
        acc[item.id] = (acc[item.id] || 0) + item.qty;
      });
      return acc;
    },
    {},
  );

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setAtualizando(false);
  };

  const titulosMaisVendidos = new Set(
    (maisVendidos || []).slice(0, 3).map((v) => v.title),
  );

  let produtosDisponiveis = produtos
    .filter((item) => item.category === "produtos")
    .map((item) => {
      const reservado = quantidadeReservadaPorProduto[item.id] || 0;
      const estoqueAjustado = Math.max(0, (item.estoque ?? 0) - reservado);
      return { ...item, estoque: estoqueAjustado };
    })
    .filter((item) => item.estoque > 0);

  if (ordenacao === "preco-asc") {
    produtosDisponiveis = [...produtosDisponiveis].sort(
      (a, b) => a.price - b.price,
    );
  } else if (ordenacao === "preco-desc") {
    produtosDisponiveis = [...produtosDisponiveis].sort(
      (a, b) => b.price - a.price,
    );
  }

  const produtosFiltrados = produtosDisponiveis.filter((item) =>
    item.title.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  const primeiroNome = usuario?.nome ? usuario.nome.split(" ")[0] : "Cliente";

  const handleAdicionarComFeedback = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleIncrease(id);
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

      {!caixaAberto && (
        <ClosedOperationBanner>
          <Ionicons name="lock-closed-outline" size={16} color="#B85D00" />
          <ClosedOperationText>
            Caixa fechado no momento — seu pedido pode demorar mais pra ser
            aceito.
          </ClosedOperationText>
        </ClosedOperationBanner>
      )}

      {meusPedidosAtivos.length > 0 && (
        <PedidoAtivoBanner onPress={() => router.push("/meu-pedido")}>
          <Ionicons name="receipt-outline" size={16} color="#1A73C0" />
          <PedidoAtivoText>
            Você já tem {meusPedidosAtivos.length}{" "}
            {meusPedidosAtivos.length === 1
              ? "pedido em andamento"
              : "pedidos em andamento"}{" "}
            — toque para ver
          </PedidoAtivoText>
          <Ionicons name="chevron-forward" size={16} color="#1A73C0" />
        </PedidoAtivoBanner>
      )}

      <SectionHeader>
        <SectionTitle>PRODUTOS DISPONÍVEIS</SectionTitle>
      </SectionHeader>

      <SortRow>
        {OPCOES_ORDENACAO.map((opcao) => (
          <SortChip
            key={opcao.key}
            active={ordenacao === opcao.key}
            onPress={() => setOrdenacao(opcao.key)}
          >
            <Ionicons
              name={opcao.icon}
              size={12}
              color={ordenacao === opcao.key ? "#FFFFFF" : "#8C7355"}
            />
            <SortChipText active={ordenacao === opcao.key}>
              {opcao.label}
            </SortChipText>
          </SortChip>
        ))}
      </SortRow>

      <ProductGrid
        data={produtosFiltrados}
        renderItem={({ item }) => (
          <CardProd
            item={item}
            qty={cart[item.id] || 0}
            onIncrease={() => handleAdicionarComFeedback(item.id)}
            onDecrease={() => handleDecrease(item.id)}
            destaque={titulosMaisVendidos.has(item.title)}
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

      <CartReviewModal
        visible={modalRevisaoVisivel}
        onClose={() => setModalRevisaoVisivel(false)}
        itensCarrinho={itensCarrinhoDetalhados}
        totalPrice={totalPrice}
        onIncrease={(id) => handleIncrease(id)}
        onDecrease={handleDecrease}
        onRemove={removeItem}
        onProceed={handleEnviarPedido}
        proceedLabel="Fazer Pedido"
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
