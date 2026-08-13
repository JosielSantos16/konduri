import React, { useState } from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Container,
  Header,
  UserInfo,
  UserName,
  UserRole,
  HeaderRight,
  StatusBadge,
  StatusDot,
  StatusText,
  UserAvatar,
  TabContainer,
  TabButton,
  TabText,
  ProductList,
  ProductCard,
  ProductImage,
  ProductTitle,
  ProductFooter,
  ProductPrice,
  CartBadge,
  CartBadgeText,
  AddButton,
  CartBar,
  CartBarInfo,
  CartItemsText,
  CartTotalText,
  FinalizeButton,
  FinalizeButtonText,
} from './pdvStyles';
import SafeContainer from '../../styles/SafeContainer';

const PRODUCTS = [
  { id: '1', title: 'Cerveja Gelada', price: 'R$ 8.00', qty: 2, image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Refrigerante', price: 'R$ 6.00', qty: 1, image: 'https://via.placeholder.com/150' },
  { id: '3', title: 'Água Mineral', price: 'R$ 4.00', qty: 0, image: 'https://via.placeholder.com/150' },
  { id: '4', title: 'Galinha Caipira', price: 'R$ 25.00', qty: 0, image: 'https://via.placeholder.com/150' },
  { id: '5', title: 'Porção de Batata', price: 'R$ 20.00', qty: 0, image: 'https://via.placeholder.com/150' },
  { id: '6', title: 'Espetinho Misto', price: 'R$ 10.00', qty: 0, image: 'https://via.placeholder.com/150' },
];

export default function PDV() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('produtos');

  const renderItem = ({ item }) => (
    <ProductCard onPress={() => alert(`Adicionado: ${item.title}`)}>
      <ProductImage source={{ uri: item.image }} />
      <ProductTitle numberOfLines={1}>{item.title}</ProductTitle>
      <ProductFooter>
        <ProductPrice>{item.price}</ProductPrice>
        {item.qty > 0 ? (
          <CartBadge>
            <CartBadgeText>{item.qty}x</CartBadgeText>
          </CartBadge>
        ) : (
          <AddButton>
            <Ionicons name="add" size={16} color="#D35400" />
          </AddButton>
        )}
      </ProductFooter>
    </ProductCard>
  );

  return (
    <SafeContainer>
      <Container>
        <Header>
          <UserInfo>
            <UserName>Maria Silva</UserName>
            <UserRole>PDV Operacional</UserRole>
          </UserInfo>
          <HeaderRight>
            <StatusBadge>
              <StatusDot />
              <StatusText>Caixa Aberto</StatusText>
            </StatusBadge>
            <UserAvatar source={{ uri: 'https://via.placeholder.com/40' }} />
          </HeaderRight>
        </Header>

        <TabContainer>
          <TabButton
            active={activeTab === 'produtos'}
            onPress={() => setActiveTab('produtos')}
          >
            <Ionicons name="basket-outline" size={18} color={activeTab === 'produtos' ? '#FFF' : '#8C7355'} />
            <TabText active={activeTab === 'produtos'}>Produtos</TabText>
          </TabButton>

          <TabButton
            active={activeTab === 'ingressos'}
            onPress={() => setActiveTab('ingressos')}
          >
            <Ionicons name="ticket-outline" size={18} color={activeTab === 'ingressos' ? '#FFF' : '#8C7355'} />
            <TabText active={activeTab === 'ingressos'}>Entradas/Ingressos</TabText>
          </TabButton>
        </TabContainer>

        <ProductList
          data={PRODUCTS}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <CartBar>
          <CartBarInfo>
            <CartItemsText>
              Carrinho Atual{'\n'}
              <Text style={{ fontWeight: 'bold', color: '#3D2C22' }}>3 itens selecionados</Text>
            </CartItemsText>
            <CartTotalText>R$ 22,00</CartTotalText>
          </CartBarInfo>

          <FinalizeButton onPress={() => router.push('/pagamento')}>
            <FinalizeButtonText>FINALIZAR VENDA  →</FinalizeButtonText>
          </FinalizeButton>
        </CartBar>
      </Container>
    </SafeContainer>
  );
}