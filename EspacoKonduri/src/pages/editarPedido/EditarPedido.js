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
  ERRO_PEDIDO_STATUS_MUDOU,
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

  // Estoque disponível = estoque menos o reservado nos outros pedidos ativos
  // (este pedido fica de fora). O carrinho usa esse número como limite.
  const quantidadeReservadaPorProduto = pedidosAtivosGeral.reduce(
    (acc, pedido) => {
      (pedido.itens || []).forEach((item) => {
        acc[item.id] = (acc[item.id] || 0) + item.qty;
      });
      return acc;
    },
    {},
  );
  const produtosComEstoqueDisponivel = produtos.map((item) => ({
    ...item,
    estoque: Math.max(0, (item.estoque ?? 0) - (quantidadeReservadaPorProduto[item.id] || 0)),
  }));

  const {
    cart,
    setCart,
    handleIncrease,
    handleDecrease,
    removeItem,
    totalItems,
    totalPrice,
  } = useCart(produtosComEstoqueDisponivel);

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

  const produtosDisponiveis = produtosComEstoqueDisponivel
    .filter((item) => item.category === "produtos")
    .filter((item) => item.estoque > 0 || cart[item.id] > 0);

  const handleSalvar = async () => {
    if (totalItems === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione pelo menos um item antes de salvar.",
      );
      return;
    }

    // Produto pode ter sido excluído do catálogo com ele ainda no pedido
    const itens = Object.entries(cart)
      .map(([id, qty]) => {
        const produto = produtos.find((p) => p.id === id);
        if (!produto) return null;
        return {
          id: produto.id,
          title: produto.title,
          qty,
          price: produto.price,
          image: produto.image,
        };
      })
      .filter(Boolean);
    if (itens.length === 0) {
      Alert.alert("Pedido vazio", "Os produtos do pedido não estão mais disponíveis.");
      return;
    }

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

      // A ação já foi gravada: se a notificação falhar, não pode virar erro na tela
      // (a pessoa tentaria de novo e duplicaria)
      criarNotificacaoPorPerfil({
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
      }).catch((erro) =>
        console.error("A ação foi salva, mas a notificação falhou:", erro),
      );

      Alert.alert("Pedido atualizado!", "Suas alterações foram salvas.");
      router.back();
    } catch (erro) {
      if (erro.message === ERRO_PEDIDO_STATUS_MUDOU) {
        Alert.alert(
          "Não é mais possível editar",
          "Seu pedido já entrou em preparo. Fale com o atendente para mudar algo.",
        );
        router.back();
        return;
      }
      console.error("Erro ao salvar edição do pedido:", erro);
      Alert.alert(
        "Erro",
        "Não foi possível salvar as alterações. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const itensCarrinhoDetalhados = Object.entries(cart)
    .map(([id, qty]) => {
      const produto = produtos.find((p) => p.id === id);
      return produto ? { ...produto, qty } : null;
    })
    .filter(Boolean);

  if (carregando) {
    return (
      <Container style={{ paddingTop: insets.top }}>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#8A6A00" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
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
