import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Container,
  Header,
  Title,
  Subtitle,
  SearchContainer,
  SearchInput,
  StockList,
  StockCard,
  StockInfo,
  StockItemTitle,
  StockDetailsRow,
  StockQuantityText,
  StatusBadge,
  StatusText,
  StockActions,
  ActionButtonMinus,
  ActionButtonPlus,
  BottomNavBar,
  NavItem,
  NavText,
} from './estoqueStyle';

const INITIAL_STOCK = [
  { id: '1', title: 'Cerveja Gelada (Garrafa)', qty: 'Qtd: 45 un.', status: 'ok', statusText: 'OK' },
  { id: '2', title: 'Refrigerante Can', qty: 'Qtd: 12 un.', status: 'baixo', statusText: 'Baixo' },
  { id: '3', title: 'Água Mineral 500ml', qty: 'Qtd: 30 un.', status: 'ok', statusText: 'OK' },
  { id: '4', title: 'Galinha Caipira', qty: 'Qtd: 5 porções', status: 'critico', statusText: 'Crítico' },
  { id: '5', title: 'Ingresso Entrada Box', qty: 'Qtd: 200 un.', status: 'ok', statusText: 'OK' },
];

export default function Estoque() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const renderItem = ({ item }) => (
    <StockCard>
      <StockInfo>
        <StockItemTitle>{item.title}</StockItemTitle>
        <StockDetailsRow>
          <StockQuantityText>{item.qty}</StockQuantityText>
          <StatusBadge status={item.status}>
            <StatusText status={item.status}>{item.statusText}</StatusText>
          </StatusBadge>
        </StockDetailsRow>
      </StockInfo>

      <StockActions>
        <ActionButtonMinus onPress={() => alert(`Remover unidade de ${item.title}`)}>
          <Ionicons name="remove" size={18} color="#3D2C22" />
        </ActionButtonMinus>
        <ActionButtonPlus onPress={() => alert(`Adicionar unidade de ${item.title}`)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </ActionButtonPlus>
      </StockActions>
    </StockCard>
  );

  return (
    <Container>
      <Header>
        <Title>Controle de Estoque</Title>
        <Subtitle>Gerenciamento físico do Boteco</Subtitle>

        <SearchContainer>
          <Ionicons name="search-outline" size={20} color="#8C7355" />
          <SearchInput
            placeholder="Buscar item no estoque..."
            placeholderTextColor="#A99B8F"
            value={search}
            onChangeText={setSearch}
          />
        </SearchContainer>
      </Header>

      <StockList
        data={INITIAL_STOCK}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <BottomNavBar>
        <NavItem active={false} onPress={() => router.push('/painel')}>
          <Ionicons name="grid-outline" size={22} color="#8C7355" />
          <NavText active={false}>Painel</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push('/vendas')}>
          <Ionicons name="receipt-outline" size={22} color="#8C7355" />
          <NavText active={false}>Vendas</NavText>
        </NavItem>

        <NavItem active={true}>
          <Ionicons name="cube-outline" size={22} color="#E67E22" />
          <NavText active={true}>Estoque</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => alert('Indo para aba Perfil...')}>
          <Ionicons name="person-outline" size={22} color="#8C7355" />
          <NavText active={false}>Perfil</NavText>
        </NavItem>
      </BottomNavBar>
    </Container>
  );
}