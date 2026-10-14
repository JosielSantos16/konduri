import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEstoque } from '../../contexts/EstoqueContext';
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
  EmptyState,
  EmptyStateText,
  BottomNavBar,
  NavItem,
  NavText,
} from './estoqueStyle';
import NavBar from '../../components/painel/navBar/NavBar';
import RegistrarEntradaModal from '../../components/estoque/registrarEntrada/RegistrarEntradaModal';
import RegistrarAjusteModal from '../../components/estoque/registrarAjuste/RegistrarAjusteModal';

export default function Estoque() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const { stock } = useEstoque();
  const [produtoEntradaId, setProdutoEntradaId] = useState(null);
  const [produtoAjusteId, setProdutoAjusteId] = useState(null);

  const filteredStock = stock.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <StockCard>
      <StockInfo>
        <StockItemTitle>{item.title}</StockItemTitle>
        <StockDetailsRow>
          <StockQuantityText>Qtd: {item.qty} {item.unit}</StockQuantityText>
          <StatusBadge status={item.status}>
            <StatusText status={item.status}>{item.statusText}</StatusText>
          </StatusBadge>
        </StockDetailsRow>
      </StockInfo>

      <StockActions>
        <ActionButtonMinus
          disabled={item.qty === 0}
          style={{ opacity: item.qty === 0 ? 0.4 : 1 }}
          onPress={() => setProdutoAjusteId(item.id)}
        >
          <Ionicons name="remove" size={18} color="#1A1A1A" />
        </ActionButtonMinus>
        <ActionButtonPlus onPress={() => setProdutoEntradaId(item.id)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </ActionButtonPlus>
      </StockActions>
    </StockCard>
  );

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <Title>Controle de Estoque</Title>
        <Subtitle>Gerenciamento físico do Boteco</Subtitle>

        <SearchContainer>
          <Ionicons name="search-outline" size={20} color="#6B6B6B" />
          <SearchInput
            placeholder="Buscar item no estoque..."
            placeholderTextColor="#9E9E9E"
            value={search}
            onChangeText={setSearch}
          />
        </SearchContainer>
      </Header>

      {filteredStock.length === 0 ? (
        <EmptyState>
          <Ionicons name="cube-outline" size={40} color="#C4C4BE" />
          <EmptyStateText>
            {search ? 'Nenhum item encontrado.' : 'Nenhum item cadastrado no estoque.'}
          </EmptyStateText>
        </EmptyState>
      ) : (
        <StockList
          data={filteredStock}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <NavBar/>

      <RegistrarEntradaModal
        produtoId={produtoEntradaId}
        onClose={() => setProdutoEntradaId(null)}
      />

      <RegistrarAjusteModal
        produtoId={produtoAjusteId}
        onClose={() => setProdutoAjusteId(null)}
      />
    </Container>
  );
}