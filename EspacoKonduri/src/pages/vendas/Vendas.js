import React, { useState } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../../components/painel/navBar/NavBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDataFiltro } from "../../utils/formatDateTime";
import { useVendasDoDia } from "../../hooks/useVendasDoDia";
import Calendario from "../../components/painel/calendario/Calendario";
import ComissaoModal from "../../components/vendas/comissaoAtendente/ComissaoModal";
import DetalheVendaModal from "../../components/vendas/detalheVenda/DetalheVendaModal";
import BottomSheetResumo from "../../components/vendas/bottomSheetResumo/BottomSheetResumo";
import SaleListItem from "../../components/vendas/saleListItem/SaleListItem";
import { ehAdmin } from "../../utils/permissoes";
import {
  Container,
  Header,
  HeaderTopRow,
  Title,
  Subtitle,
  SearchIconButton,
  InlineSearchInput,
  FilterRow,
  DateFilterButton,
  DateFilterText,
  TotalRecordsText,
  TodayButton,
  TodayButtonText,
  OrderToggleButton,
  OrderToggleText,
  PaymentFilterRow,
  PaymentChip,
  PaymentChipText,
  ClosedOperationBanner,
  ClosedOperationText,
  SalesList,
  EmptyState,
  EmptyStateText,
  ComissaoButton,
  ComissaoButtonText,
  ComissaoBadge,
  ComissaoBadgeText,
} from "./vendasStyles";

const FILTROS_METODO = [
  { key: "todos", label: "Todos" },
  { key: "pix", label: "Pix" },
  { key: "cartao", label: "Cartão" },
  { key: "dinheiro", label: "Dinheiro" },
];

export default function Vendas() {
  const insets = useSafeAreaInsets();
  const [comissaoModalVisivel, setComissaoModalVisivel] = useState(false);

  const {
    usuario,
    filtroData,
    setFiltroData,
    dataISO,
    isHoje,
    vendasFiltradas,
    vendasExibidas,
    carregando,
    atualizando,
    handleRefresh,
    diasComVenda,
    diasComComissao,
    carregarDadosDoMes,
    vendaSelecionada,
    setVendaSelecionada,
    ordemAscendente,
    setOrdemAscendente,
    buscaVisivel,
    busca,
    setBusca,
    handleToggleBusca,
    filtroMetodo,
    setFiltroMetodo,
    operacaoDoDia,
    totalPeriodo,
    qtdVendasValidas,
    totalPix,
    totalCartao,
    totalDinheiro,
    listaAtendentes,
    listaResumoGeral,
    numeroDaVenda,
  } = useVendasDoDia();

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <HeaderTopRow>
          {buscaVisivel ? (
            <InlineSearchInput
              placeholder="Buscar por produto ou atendente..."
              placeholderTextColor="#9E9E9E"
              value={busca}
              onChangeText={setBusca}
              autoFocus
              style={{ flex: 1, marginRight: 10 }}
            />
          ) : (
            <Title>Vendas do Dia</Title>
          )}

          <SearchIconButton onPress={handleToggleBusca}>
            <Ionicons name={buscaVisivel ? "close" : "search-outline"} size={18} color="#1A1A1A" />
          </SearchIconButton>
        </HeaderTopRow>

        {!buscaVisivel && <Subtitle>Histórico de transações</Subtitle>}

        <FilterRow>
          <Calendario
            value={filtroData}
            onChange={setFiltroData}
            diasComVenda={diasComVenda}
            diasComComissao={diasComComissao}
            onMonthChange={carregarDadosDoMes}
            renderTrigger={({ onPress }) => (
              <DateFilterButton onPress={onPress}>
                <Ionicons name="calendar-outline" size={16} color="#1A1A1A" />
                <DateFilterText>{formatDataFiltro(filtroData)}</DateFilterText>
                <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
              </DateFilterButton>
            )}
          />

          {!isHoje && (
            <TodayButton onPress={() => setFiltroData(new Date())}>
              <Ionicons name="today-outline" size={16} color="#FFFFFF" />
              <TodayButtonText>Ir para hoje</TodayButtonText>
            </TodayButton>
          )}
        </FilterRow>

        <FilterRow>
          <TotalRecordsText>{vendasFiltradas.length} Vendas registradas</TotalRecordsText>

          <OrderToggleButton
            onPress={() => setOrdemAscendente((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={ordemAscendente ? "arrow-up-outline" : "arrow-down-outline"}
              size={14}
              color="#6B6B6B"
            />
            <OrderToggleText>{ordemAscendente ? "Mais antigas" : "Mais recentes"}</OrderToggleText>
          </OrderToggleButton>
        </FilterRow>

        <FilterRow>
          <ComissaoButton onPress={() => setComissaoModalVisivel(true)}>
            <Ionicons name="cash-outline" size={16} color="#FFFFFF" />
            <ComissaoButtonText>Comissão</ComissaoButtonText>
            {listaAtendentes.length > 0 && (
              <ComissaoBadge>
                <ComissaoBadgeText>{listaAtendentes.length}</ComissaoBadgeText>
              </ComissaoBadge>
            )}
          </ComissaoButton>
        </FilterRow>

        <PaymentFilterRow>
          {FILTROS_METODO.map((f) => (
            <PaymentChip key={f.key} active={filtroMetodo === f.key} onPress={() => setFiltroMetodo(f.key)}>
              <PaymentChipText active={filtroMetodo === f.key}>{f.label}</PaymentChipText>
            </PaymentChip>
          ))}
        </PaymentFilterRow>
      </Header>

      {operacaoDoDia?.status === "fechada" && (
        <ClosedOperationBanner>
          <Ionicons name="lock-closed-outline" size={16} color="#6B5300" />
          <ClosedOperationText>O caixa desse dia já foi fechado.</ClosedOperationText>
        </ClosedOperationBanner>
      )}

      {carregando ? (
        <EmptyState>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </EmptyState>
      ) : vendasExibidas.length === 0 ? (
        <EmptyState>
          <Ionicons name="receipt-outline" size={40} color="#C4C4BE" />
          <EmptyStateText>
            {vendasFiltradas.length === 0
              ? "Nenhuma venda registrada nessa data."
              : "Nenhuma venda encontrada com esses filtros."}
          </EmptyStateText>
        </EmptyState>
      ) : (
        <SalesList
          data={vendasExibidas}
          renderItem={({ item }) => (
            <SaleListItem
              venda={item}
              numero={numeroDaVenda(item)}
              onPress={() => setVendaSelecionada(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={handleRefresh}
              colors={["#1A1A1A"]}
              tintColor="#1A1A1A"
            />
          }
        />
      )}

      <NavBar />

      {vendasFiltradas.length > 0 && (
        <BottomSheetResumo
          totalPeriodo={totalPeriodo}
          qtdVendas={qtdVendasValidas}
          totalPix={totalPix}
          totalCartao={totalCartao}
          totalDinheiro={totalDinheiro}
          listaResumoGeral={listaResumoGeral}
        />
      )}

      <DetalheVendaModal
        // Versão atual da venda (o snapshot atualiza depois do cancelamento)
        venda={vendasFiltradas.find((v) => v.id === vendaSelecionada?.id) || vendaSelecionada}
        onClose={() => setVendaSelecionada(null)}
        podeCancelar={ehAdmin(usuario)}
        usuario={usuario}
      />

      <ComissaoModal
        visible={comissaoModalVisivel}
        onClose={() => setComissaoModalVisivel(false)}
        listaAtendentes={listaAtendentes}
        dataISO={dataISO}
        adminUid={usuario?.uid}
        onSalvo={() => carregarDadosDoMes(dataISO.slice(0, 7))}
      />
    </Container>
  );
}