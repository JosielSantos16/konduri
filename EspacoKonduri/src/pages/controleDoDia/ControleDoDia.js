import React, { useState, useCallback } from "react";
import { RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import SafeContainer from "../../styles/SafeContainer";
import { useCaixa } from "../../contexts/CaixaContext";
import { Alert } from "react-native";
import { listarProdutosDaOperacao } from "../../services/queries/operacoesQueries";
import ProdutoControleCard from "../../components/controleDoDia/ProdutoControleCard";
import {
  Container,
  Header,
  HeaderLeft,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderDate,
  UserBadge,
  UserBadgeText,
  SectionHeader,
  SectionTitle,
  ProductsList,
  EmptyState,
  EmptyStateText,
  FecharCaixaButton,
  FecharCaixaButtonText,
  FAB,
  FABLabel,
} from "./controleDoDiaStyle";

function formatarDataHoje() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${dia} ${meses[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

export default function ControleDoDia() {
  const router = useRouter();
  const { operacaoId, responsavel } = useCaixa();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregarProdutos = useCallback(async () => {
    if (!operacaoId) {
      setProdutos([]);
      return;
    }
    try {
      const lista = await listarProdutosDaOperacao(operacaoId);
      setProdutos(lista);
    } catch (erro) {
      console.error("Erro ao carregar produtos da operação:", erro);
    }
  }, [operacaoId]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarInicial() {
        setCarregando(true);
        await carregarProdutos();
        if (ativo) setCarregando(false);
      }

      carregarInicial();

      return () => {
        ativo = false;
      };
    }, [carregarProdutos]),
  );

  const handleRefresh = async () => {
    console.log("🔄 Pull-to-refresh disparado!");
    setAtualizando(true);
    await carregarProdutos();
    setAtualizando(false);
  };

  const primeiroNome = responsavel
    ? responsavel.split(" ")[0] +
      (responsavel.split(" ")[1]
        ? " " + responsavel.split(" ")[1][0] + "."
        : "")
    : "";

  const handleEditarProduto = (produto) => {
    router.push({
      pathname: "/controle-do-dia/editar-produto",
      params: { operacaoId, produtoId: produto.id },
    });
  };

  const handleAdicionarProduto = () => {
    router.push({
      pathname: "/novo-produto",
      params: { operacaoId },
    });
  };

  const handleFecharCaixa = () => {
  Alert.alert(
    'Fechar Caixa do Dia',
    'Tem certeza que deseja fechar o caixa? Essa ação encerra a operação atual.',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Fechar Caixa',
        style: 'destructive',
        onPress: () => {
          router.push({
            pathname: '/fechamento',
            params: { operacaoId, data: formatarDataHoje() },
          });
        },
      },
    ]
  );
};

  return (
    <SafeContainer>
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
            </BackButton>
            <HeaderTitles>
              <HeaderTitle>Controle do Dia</HeaderTitle>
              <HeaderDate>{formatarDataHoje()}</HeaderDate>
            </HeaderTitles>
          </HeaderLeft>

          <UserBadge>
            <Ionicons name="person" size={14} color="#2E5A1E" />
            <UserBadgeText>{primeiroNome}</UserBadgeText>
          </UserBadge>
        </Header>

        <SectionHeader>
          <SectionTitle>PRODUTOS ATIVOS ({produtos.length})</SectionTitle>
        </SectionHeader>

        <ProductsList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={handleRefresh}
              colors={["#2E5A1E"]}
              tintColor="#2E5A1E"
            />
          }
        >
          {!carregando && produtos.length === 0 && (
            <EmptyState>
              <Ionicons name="cube-outline" size={40} color="#C9BBA8" />
              <EmptyStateText>
                Nenhum produto na operação ainda.{"\n"}Toque no botão + para
                adicionar.
              </EmptyStateText>
            </EmptyState>
          )}

          {produtos.map((produto) => (
            <ProdutoControleCard
              key={produto.id}
              produto={produto}
              onEdit={() => handleEditarProduto(produto)}
            />
          ))}
        </ProductsList>

        {produtos.length === 0 && <FABLabel>Adicionar produto</FABLabel>}

        <FAB onPress={handleAdicionarProduto} activeOpacity={0.8}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </FAB>

        <FecharCaixaButton onPress={handleFecharCaixa}>
          <Ionicons name="lock-closed-outline" size={18} color="#FFFFFF" />
          <FecharCaixaButtonText>Fechar Caixa do Dia</FecharCaixaButtonText>
        </FecharCaixaButton>
      </Container>
    </SafeContainer>
  );
}
