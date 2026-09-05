import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "../../utils/formatPrice";
import { getSaudacaoData } from "../../utils/formatDateTime";
import { useVendas } from "../../contexts/VendasContext";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useAuth } from "../../hooks/useAuth";
import NotificacoesBell from "../../components/notificacoes/NotificacoesBell";
import {
  Container,
  ScrollContainer,
  Header,
  GreetingContainer,
  GreetingTitle,
  GreetingSubtitle,
  HeaderActions,
  UserAvatar,
  UserAvatarImage,
  MainRevenueCard,
  RevenueCardHeader,
  RevenueTitle,
  RevenueValue,
  StatsRow,
  StatCard,
  StatLabel,
  StatValue,
  LowStockBanner,
  LowStockIconCircle,
  LowStockTextGroup,
  LowStockTitle,
  LowStockSubtitle,
  SectionHeader,
  SectionTitle,
  SectionLink,
  RankingCard,
  RankingLeft,
  RankBadge,
  RankBadgeText,
  RankInfo,
  RankItemTitle,
  RankItemSubtitle,
  RankImage,
  RankImagePlaceholder,
} from "./painelStyles";
import NavBar from "../../components/painel/navBar/NavBar";

const RANK_COLORS = ["#F39C12", "#E67E22", "#27AE60"];

export default function Painel() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const { faturamentoDia, totalPix, totalDinheiro, maisVendidos } = useVendas();
  const { produtos } = useProdutos();
  const [atualizando, setAtualizando] = useState(false);

  const top3 = maisVendidos.slice(0, 3);
  const primeiroNome = usuario?.nome ? usuario.nome.split(" ")[0] : "Admin";

  const produtosComEstoqueBaixo = produtos.filter((produto) => {
    if (produto.category !== "produtos") return false;
    const estoque = produto.estoque ?? 0;
    const limite = produto.limiteEstoqueBaixo ?? 5;
    return estoque <= limite;
  });

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setAtualizando(false);
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={handleRefresh}
            colors={["#F39C12"]}
            tintColor="#F39C12"
          />
        }
      >
        <Header>
          <GreetingContainer style={{ flex: 1, marginRight: 16 }}>
            <GreetingTitle numberOfLines={1} ellipsizeMode="tail">Olá, {primeiroNome}!</GreetingTitle>
            <GreetingSubtitle>{getSaudacaoData()}</GreetingSubtitle>
          </GreetingContainer>

          <HeaderActions>
            <NotificacoesBell />
            <UserAvatar onPress={() => router.push("/perfil-admin")}>
              {usuario?.foto ? (
                <UserAvatarImage
                  source={{ uri: usuario.foto }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person-outline" size={20} color="#3D2C22" />
              )}
            </UserAvatar>
          </HeaderActions>
        </Header>

        <MainRevenueCard>
          <RevenueCardHeader>
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <RevenueTitle>FATURAMENTO DO DIA</RevenueTitle>
          </RevenueCardHeader>
          <RevenueValue>{formatPrice(faturamentoDia)}</RevenueValue>
        </MainRevenueCard>

        <StatsRow>
          <StatCard bg="#E8F8F5">
            <StatLabel color="#16A085">TOTAL EM PIX</StatLabel>
            <StatValue valueColor="#16A085">{formatPrice(totalPix)}</StatValue>
          </StatCard>

          <StatCard bg="#E9F7EF">
            <StatLabel color="#27AE60">TOTAL EM DINHEIRO</StatLabel>
            <StatValue valueColor="#27AE60">
              {formatPrice(totalDinheiro)}
            </StatValue>
          </StatCard>
        </StatsRow>

        {produtosComEstoqueBaixo.length > 0 && (
          <LowStockBanner onPress={() => router.push("/controle")}>
            <LowStockIconCircle>
              <Ionicons name="alert-circle-outline" size={20} color="#B85D00" />
            </LowStockIconCircle>
            <LowStockTextGroup>
              <LowStockTitle>
                {produtosComEstoqueBaixo.length}{" "}
                {produtosComEstoqueBaixo.length === 1
                  ? "produto com estoque baixo"
                  : "produtos com estoque baixo"}
              </LowStockTitle>
              <LowStockSubtitle>
                Toque para ver o controle de estoque
              </LowStockSubtitle>
            </LowStockTextGroup>
            <Ionicons name="chevron-forward" size={18} color="#B85D00" />
          </LowStockBanner>
        )}

        <SectionHeader>
          <SectionTitle>Mais Vendidos Hoje</SectionTitle>
          <SectionLink onPress={() => router.push("/vendas")}>
            Ver Lista Completa
          </SectionLink>
        </SectionHeader>

        {top3.length === 0 ? (
          <RankingCard style={{ marginBottom: 30 }}>
            <RankItemSubtitle>
              Nenhuma venda registrada hoje ainda.
            </RankItemSubtitle>
          </RankingCard>
        ) : (
          top3.map((produto, index) => (
            <RankingCard
              key={produto.title}
              style={
                index === top3.length - 1 ? { marginBottom: 30 } : undefined
              }
            >
              <RankingLeft>
                <RankBadge style={{ backgroundColor: RANK_COLORS[index] }}>
                  <RankBadgeText>{index + 1}</RankBadgeText>
                </RankBadge>

                {produto.image ? (
                  <RankImage
                    source={{ uri: produto.image }}
                    resizeMode="cover"
                  />
                ) : (
                  <RankImagePlaceholder>
                    <Ionicons name="cube-outline" size={18} color="#C9BBA8" />
                  </RankImagePlaceholder>
                )}

                <RankInfo>
                  <RankItemTitle>{produto.title}</RankItemTitle>
                  <RankItemSubtitle>{produto.qty} unidades</RankItemSubtitle>
                </RankInfo>
              </RankingLeft>
              <Ionicons name="bar-chart-outline" size={20} color="#8C7355" />
            </RankingCard>
          ))
        )}
      </ScrollContainer>
      <NavBar />
    </Container>
  );
}
