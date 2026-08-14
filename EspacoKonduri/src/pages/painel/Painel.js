import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "../../utils/formatPrice";
import { getSaudacaoData } from "../../utils/formatDateTime";
import { useVendas } from "../../contexts/VendasContext";
import {
  Container,
  ScrollContainer,
  Header,
  GreetingContainer,
  GreetingTitle,
  GreetingSubtitle,
  HeaderActions,
  NotificationButton,
  NotificationBadgeDot,
  UserAvatar,
  MainRevenueCard,
  RevenueCardHeader,
  RevenueTitle,
  RevenueValue,
  StatsRow,
  StatCard,
  StatLabel,
  StatValue,
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
} from "./painelStyles";
import NavBar from "../../components/painel/navBar/NavBar";

const RANK_COLORS = ["#F39C12", "#E67E22", "#27AE60"];

export default function Painel() {
  const insets = useSafeAreaInsets();
  const { faturamentoDia, totalPix, totalDinheiro, maisVendidos } = useVendas();

  const top3 = maisVendidos.slice(0, 3);

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <GreetingContainer>
            <GreetingTitle>Olá, Bosco!</GreetingTitle>
            <GreetingSubtitle>{getSaudacaoData()}</GreetingSubtitle>
          </GreetingContainer>

          <HeaderActions>
            <NotificationButton onPress={() => alert("Sem novas notificações")}>
              <Ionicons name="notifications-outline" size={20} color="#3D2C22" />
              <NotificationBadgeDot />
            </NotificationButton>
            <UserAvatar source={{ uri: "https://via.placeholder.com/42" }} />
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
            <StatValue valueColor="#27AE60">{formatPrice(totalDinheiro)}</StatValue>
          </StatCard>
        </StatsRow>

        <SectionHeader>
          <SectionTitle>Mais Vendidos Hoje</SectionTitle>
          <SectionLink onPress={() => alert("Abrindo lista completa de vendas...")}>
            Ver Lista Completa
          </SectionLink>
        </SectionHeader>

        {top3.length === 0 ? (
          <RankingCard style={{ marginBottom: 30 }}>
            <RankItemSubtitle>Nenhuma venda registrada hoje ainda.</RankItemSubtitle>
          </RankingCard>
        ) : (
          top3.map((produto, index) => (
            <RankingCard
              key={produto.title}
              style={index === top3.length - 1 ? { marginBottom: 30 } : undefined}
            >
              <RankingLeft>
                <RankBadge style={{ backgroundColor: RANK_COLORS[index] }}>
                  <RankBadgeText>{index + 1}</RankBadgeText>
                </RankBadge>
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
      <NavBar/>
    </Container>
  );
}