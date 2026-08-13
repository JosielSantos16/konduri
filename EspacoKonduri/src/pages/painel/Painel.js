import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  BottomNavBar,
  NavItem,
  NavText,
} from "./painelStyles";

export default function Painel() {
  const router = useRouter();

  return (
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <GreetingContainer>
            <GreetingTitle>Olá, Bosco!</GreetingTitle>
            <GreetingSubtitle>Quinta, 11 de Agosto</GreetingSubtitle>
          </GreetingContainer>

          <HeaderActions>
            <NotificationButton onPress={() => alert("Sem novas notificações")}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#3D2C22"
              />
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
          <RevenueValue>R$ 3.450,00</RevenueValue>
        </MainRevenueCard>

        <StatsRow>
          <StatCard bg="#E8F8F5">
            <StatLabel color="#16A085">TOTAL EM PIX</StatLabel>
            <StatValue valueColor="#16A085">R$ 2.100,00</StatValue>
          </StatCard>

          <StatCard bg="#E9F7EF">
            <StatLabel color="#27AE60">TOTAL EM DINHEIRO</StatLabel>
            <StatValue valueColor="#27AE60">R$ 1.350,00</StatValue>
          </StatCard>
        </StatsRow>

        <SectionHeader>
          <SectionTitle>Mais Vendidos Hoje</SectionTitle>
          <SectionLink
            onPress={() => alert("Abrindo lista completa de vendas...")}
          >
            Ver Lista Completa
          </SectionLink>
        </SectionHeader>

        <RankingCard>
          <RankingLeft>
            <RankBadge>
              <RankBadgeText>1</RankBadgeText>
            </RankBadge>
            <RankInfo>
              <RankItemTitle>Cerveja Trincando</RankItemTitle>
              <RankItemSubtitle>85 unidades</RankItemSubtitle>
            </RankInfo>
          </RankingLeft>
          <Ionicons name="bar-chart-outline" size={20} color="#8C7355" />
        </RankingCard>

        <RankingCard>
          <RankingLeft>
            <RankBadge style={{ backgroundColor: "#E67E22" }}>
              <RankBadgeText>2</RankBadgeText>
            </RankBadge>
            <RankInfo>
              <RankItemTitle>Galinha Caipira</RankItemTitle>
              <RankItemSubtitle>32 pratos</RankItemSubtitle>
            </RankInfo>
          </RankingLeft>
          <Ionicons name="bar-chart-outline" size={20} color="#8C7355" />
        </RankingCard>

        <RankingCard style={{ marginBottom: 30 }}>
          <RankingLeft>
            <RankBadge style={{ backgroundColor: "#27AE60" }}>
              <RankBadgeText>3</RankBadgeText>
            </RankBadge>
            <RankInfo>
              <RankItemTitle>Refrigerante Gelado</RankItemTitle>
              <RankItemSubtitle>28 unidades</RankItemSubtitle>
            </RankInfo>
          </RankingLeft>
          <Ionicons name="bar-chart-outline" size={20} color="#8C7355" />
        </RankingCard>
      </ScrollContainer>

      <BottomNavBar>
        <NavItem active={true}>
          <Ionicons name="grid-outline" size={22} color="#E67E22" />
          <NavText active={true}>Painel</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/vendas")}>
          <Ionicons name="receipt-outline" size={22} color="#8C7355" />
          <NavText active={false}>Vendas</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/estoque")}>
          <Ionicons name="cube-outline" size={22} color="#8C7355" />
          <NavText active={false}>Estoque</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/vendas")}>
          <Ionicons name="receipt-outline" size={22} color="#8C7355" />
          <NavText active={false}>Vendas</NavText>
        </NavItem>
      </BottomNavBar>
    </Container>
  );
}
