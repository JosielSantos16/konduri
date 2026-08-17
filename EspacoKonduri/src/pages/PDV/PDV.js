import React, { useState } from "react";
import { Alert, ActivityIndicator, RefreshControl, BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavBarAtendente from "../../components/PDV/navBar/navBarAtendente";
import {
  Container,
  ProductList,
  SearchContainer,
  SearchInput,
  ClearSearchButton,
  EmptyState,
  EmptyStateText,
  LoadingContainer,
  ClosedBanner,
  ClosedBannerText,
} from "./pdvStyles";

import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useCaixa } from "../../contexts/CaixaContext";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useVendas } from "../../contexts/VendasContext";
import CardProd from "../../components/PDV/cardsProdutos/CardProdutos";
import PdvHeader from "../../components/PDV/pdvHeader/PdvHeader";
import TabSelector from "../../components/PDV/tabSelector/TabSelector";
import CartBar from "../../components/PDV/cartBar/CartBar";
import CartReviewModal from "../../components/PDV/cartReview/cartReviewModal";

export default function PDV() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("produtos");
  const [busca, setBusca] = useState("");
  const [atualizando, setAtualizando] = useState(false);
  const [modalRevisaoVisivel, setModalRevisaoVisivel] = useState(false);

  const { produtos, carregandoProdutos } = useProdutos();
  const {
    cart,
    handleIncrease,
    handleDecrease,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart(produtos);
  const { usuario, carregando } = useAuth();
  const { caixaAberto } = useCaixa();
  const { maisVendidos } = useVendas();

  useKeepAwake();

  const titulosMaisVendidos = new Set(
    (maisVendidos || []).slice(0, 3).map((v) => v.title)
  );

  useFocusEffect(
    React.useCallback(() => {
      const handler = () => {
        if (totalItems > 0) {
          Alert.alert(
            "Sair sem finalizar?",
            "Você tem itens no carrinho. Se sair agora, eles serão perdidos.",
            [
              { text: "Continuar vendendo", style: "cancel" },
              {
                text: "Sair mesmo assim",
                style: "destructive",
                onPress: () => {
                  clearCart();
                  BackHandler.exitApp();
                },
              },
            ]
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", handler);
      return () => subscription.remove();
    }, [totalItems])
  );

  const insets = useSafeAreaInsets();
  
  const filteredProducts = produtos.filter((item) => {
    const pertenceCategoria = item.category === activeTab;
    const bateBusca = item.title.toLowerCase().includes(busca.trim().toLowerCase());
    return pertenceCategoria && bateBusca;
  });

  const contagemPorCategoria = produtos.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const nomeExibido = carregando ? "Carregando..." : usuario?.nome || "Usuário";
  const cargoExibido = usuario?.perfil === "adm" ? "Administrador" : "PDV Operacional";
  const statusLabel = caixaAberto ? "Caixa Aberto" : "Caixa Fechado";

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAtualizando(false);
  };

  const handleAdicionarComFeedback = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleIncrease(id);
  };

  const validarEstoqueAtual = () => {
    const itensSemEstoqueSuficiente = [];

    const itens = Object.entries(cart).map(([id, qty]) => {
      const produto = produtos.find((p) => p.id === id);
      const estoqueAtual = produto?.estoque ?? 0;

      if (qty > estoqueAtual) {
        itensSemEstoqueSuficiente.push({ title: produto?.title, qty, estoqueAtual });
      }

      return { id: produto.id, title: produto.title, qty, price: produto.price, image: produto.image };
    });

    if (itensSemEstoqueSuficiente.length > 0) {
      const mensagem = itensSemEstoqueSuficiente
        .map((i) => `• ${i.title}: pediu ${i.qty}, restam ${i.estoqueAtual}`)
        .join("\n");

      Alert.alert(
        "Estoque insuficiente",
        `Alguns itens do carrinho não têm mais estoque suficiente (pode ter sido vendido em outro aparelho):\n\n${mensagem}\n\nAjuste as quantidades e tente novamente.`
      );
      return null;
    }

    return itens;
  };

  const handleFinalizar = () => {
    if (!caixaAberto) {
      Alert.alert(
        "Caixa fechado",
        "Não é possível finalizar uma venda sem um caixa aberto. Abra uma operação primeiro."
      );
      return;
    }

    const itens = validarEstoqueAtual();
    if (!itens) return;

    setModalRevisaoVisivel(false);

    router.push({
      pathname: "/pagamento",
      params: {
        total: totalPrice.toFixed(2),
        itens: JSON.stringify(itens),
      },
    });
  };

  const itensCarrinhoDetalhados = Object.entries(cart).map(([id, qty]) => {
    const produto = produtos.find((p) => p.id === id);
    return { ...produto, qty };
  });

  return (

      <Container style={{ paddingTop: insets.top }}>
        <PdvHeader
          name={nomeExibido}
          role={cargoExibido}
          statusLabel={statusLabel}
          aberto={caixaAberto}
          avatarUri="https://via.placeholder.com/40"
        />

        {!caixaAberto && (
          <ClosedBanner>
            <Ionicons name="lock-closed-outline" size={16} color="#C0392B" />
            <ClosedBannerText>
              Caixa fechado — abra uma operação para começar a vender.
            </ClosedBannerText>
          </ClosedBanner>
        )}

        <TabSelector
          activeTab={activeTab}
          onChange={setActiveTab}
          contagemPorCategoria={contagemPorCategoria}
        />

        <SearchContainer>
          <Ionicons name="search-outline" size={18} color="#8C7355" />
          <SearchInput
            placeholder="Buscar produto..."
            placeholderTextColor="#A99B8F"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <ClearSearchButton onPress={() => setBusca("")}>
              <Ionicons name="close-circle" size={18} color="#A99B8F" />
            </ClearSearchButton>
          )}
        </SearchContainer>

        {carregandoProdutos ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#2E5A1E" />
          </LoadingContainer>
        ) : (
          <ProductList
            data={filteredProducts}
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
                colors={["#2E5A1E"]}
                tintColor="#2E5A1E"
              />
            }
            ListEmptyComponent={
              <EmptyState>
                <Ionicons name="cube-outline" size={40} color="#C9BBA8" />
                <EmptyStateText>
                  {busca
                    ? `Nenhum produto encontrado para "${busca}".`
                    : "Nenhum produto cadastrado nessa categoria ainda."}
                </EmptyStateText>
              </EmptyState>
            }
          />
        )}

        <CartBar
          totalItems={totalItems}
          totalPrice={totalPrice}
          onFinalize={handleFinalizar}
          onReview={() => setModalRevisaoVisivel(true)}
          onClear={clearCart}
        />

        <CartReviewModal
          visible={modalRevisaoVisivel}
          onClose={() => setModalRevisaoVisivel(false)}
          itensCarrinho={itensCarrinhoDetalhados}
          totalPrice={totalPrice}
          onIncrease={handleAdicionarComFeedback}
          onDecrease={handleDecrease}
          onRemove={removeItem}
          onProceed={handleFinalizar}
        />

  <NavBarAtendente />

      </Container>
     
    
  );
}