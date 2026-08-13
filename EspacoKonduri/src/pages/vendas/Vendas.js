import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  BottomNavBar,
  NavItem,
  NavText,
} from './vendasStyles';

const SALES_DATA = [
  { id: '1', code: 'Venda #0042', time: '14:32', operator: 'Maria Silva', type: 'dinheiro', price: 'R$ 47,00' },
  { id: '2', code: 'Venda #0041', time: '14:15', operator: 'Maria Silva', type: 'pix', price: 'R$ 32,00' },
  { id: '3', code: 'Venda #0040', time: '13:58', operator: 'Maria Silva', type: 'pix', price: 'R$ 120,00' },
  { id: '4', code: 'Venda #0039', time: '13:40', operator: 'Maria Silva', type: 'dinheiro', price: 'R$ 18,00' },
  { id: '5', code: 'Venda #0038', time: '13:12', operator: 'Maria Silva', type: 'pix', price: 'R$ 250,00' },
];

export default function Vendas() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <SaleCard onPress={() => alert(`Detalhes da ${item.code}`)}>
      <SaleLeft>
        <SaleIconContainer type={item.type}>
          <Ionicons 
            name={item.type === 'pix' ? 'qr-code-outline' : 'cash-outline'} 
            size={20} 
            color={item.type === 'pix' ? '#16A085' : '#27AE60'} 
          />
        </SaleIconContainer>
        <SaleInfo>
          <SaleTitle>{item.code}  •  {item.time}</SaleTitle>
          <SaleDetails>Caixa: {item.operator}</SaleDetails>
        </SaleInfo>
      </SaleLeft>

      <SaleRight>
        <SalePrice>{item.price}</SalePrice>
        <Ionicons name="chevron-forward" size={16} color="#8C7355" />
      </SaleRight>
    </SaleCard>
  );

  return (
    <Container>
      <Header>
        <Title>Vendas do Dia</Title>
        <Subtitle>Histórico de transações</Subtitle>

        <FilterRow>
          <DateFilterButton>
            <Ionicons name="calendar-outline" size={16} color="#3D2C22" />
            <DateFilterText>Hoje, 11 Ago 2026</DateFilterText>
            <Ionicons name="chevron-down" size={14} color="#3D2C22" />
          </DateFilterButton>

          <TotalRecordsText>48 Vendas registradas</TotalRecordsText>
        </FilterRow>
      </Header>

      <SalesList
        data={SALES_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <SummaryBar>
        <SummaryLabel>SOMA TOTAL PERÍODO:</SummaryLabel>
        <SummaryValue>48 Vendas — R$ 3.450,00</SummaryValue>
      </SummaryBar>

      <BottomNavBar>
        <NavItem active={false} onPress={() => router.push('/painel')}>
          <Ionicons name="grid-outline" size={22} color="#8C7355" />
          <NavText active={false}>Painel</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push('/vendas')}>
  <Ionicons name="receipt-outline" size={22} color="#8C7355" />
  <NavText active={false}>Vendas</NavText>
</NavItem>

        <NavItem active={false} onPress={() => alert('Indo para aba Estoque...')}>
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