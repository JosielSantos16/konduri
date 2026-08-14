import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatPrice } from '../../utils/formatPrice';
import { formatHora, formatDataFiltro, isMesmoDia } from '../../utils/formatDateTime';
import { useVendas } from '../../contexts/VendasContext';
import Calendario from '../../components/painel/calendario/Calendario';
import {
  Container,
  Header,
  Title,
  Subtitle,
  FilterRow,
  DateFilterButton,
  DateFilterText,
  TotalRecordsText,
  SalesList,
  SaleCard,
  SaleLeft,
  SaleIconContainer,
  SaleInfo,
  SaleTitle,
  SaleDetails,
  SaleRight,
  SalePrice,
  SummaryBar,
  SummaryLabel,
  SummaryValue,
  EmptyState,
  EmptyStateText,
  BottomNavBar,
  NavItem,
  NavText,
} from './vendasStyles';

export default function Vendas() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { vendas } = useVendas();
  const [filtroData, setFiltroData] = useState(new Date());

  const vendasFiltradas = vendas.filter(v => isMesmoDia(v.data, filtroData));
  const vendasOrdenadas = [...vendasFiltradas].reverse();
  const totalPeriodo = vendasFiltradas.reduce((sum, v) => sum + v.total, 0);

  const numeroDaVenda = (venda) => {
    const idx = vendas.findIndex(v => v.id === venda.id);
    return String(idx + 1).padStart(4, '0');
  };

  const renderItem = ({ item }) => (
    <SaleCard onPress={() => alert(`Detalhes da Venda #${numeroDaVenda(item)}`)}>
      <SaleLeft>
        <SaleIconContainer type={item.metodo}>
          <Ionicons
            name={item.metodo === 'pix' ? 'qr-code-outline' : 'cash-outline'}
            size={20}
            color={item.metodo === 'pix' ? '#16A085' : '#27AE60'}
          />
        </SaleIconContainer>
        <SaleInfo>
          <SaleTitle>Venda #{numeroDaVenda(item)}  •  {formatHora(item.data)}</SaleTitle>
          <SaleDetails>Caixa: Maria Silva</SaleDetails>
        </SaleInfo>
      </SaleLeft>

      <SaleRight>
        <SalePrice>{formatPrice(item.total)}</SalePrice>
        <Ionicons name="chevron-forward" size={16} color="#8C7355" />
      </SaleRight>
    </SaleCard>
  );

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <Title>Vendas do Dia</Title>
        <Subtitle>Histórico de transações</Subtitle>

        <FilterRow>
          <Calendario
            value={filtroData}
            onChange={setFiltroData}
            renderTrigger={({ onPress }) => (
              <DateFilterButton onPress={onPress}>
                <Ionicons name="calendar-outline" size={16} color="#3D2C22" />
                <DateFilterText>{formatDataFiltro(filtroData)}</DateFilterText>
                <Ionicons name="chevron-down" size={14} color="#3D2C22" />
              </DateFilterButton>
            )}
          />

          <TotalRecordsText>{vendasFiltradas.length} Vendas registradas</TotalRecordsText>
        </FilterRow>
      </Header>

      {vendasFiltradas.length === 0 ? (
        <EmptyState>
          <Ionicons name="receipt-outline" size={40} color="#C9BBAC" />
          <EmptyStateText>Nenhuma venda registrada nessa data.</EmptyStateText>
        </EmptyState>
      ) : (
        <SalesList
          data={vendasOrdenadas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      {vendasFiltradas.length > 0 && (
        <SummaryBar>
          <SummaryLabel>SOMA TOTAL PERÍODO:</SummaryLabel>
          <SummaryValue>{vendasFiltradas.length} Vendas — {formatPrice(totalPeriodo)}</SummaryValue>
        </SummaryBar>
      )}

      <BottomNavBar style={{ paddingBottom: 10 + insets.bottom }}>
        <NavItem active={false} onPress={() => router.push('/painel')}>
          <Ionicons name="grid-outline" size={22} color="#8C7355" />
          <NavText active={false}>Painel</NavText>
        </NavItem>

        <NavItem active={true}>
          <Ionicons name="receipt-outline" size={22} color="#E67E22" />
          <NavText active={true}>Vendas</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push('/estoque')}>
          <Ionicons name="cube-outline" size={22} color="#8C7355" />
          <NavText active={false}>Estoque</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => alert('Indo para aba Perfil...')}>
          <Ionicons name="person-outline" size={22} color="#8C7355" />
          <NavText active={false}>Perfil</NavText>
        </NavItem>
      </BottomNavBar>
    </Container>
  );
}