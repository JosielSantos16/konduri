import React, { useState } from "react";
import { useRouter } from "expo-router";
import SafeContainer from "../../styles/SafeContainer";
import { Container, ProductList } from "./pdvStyles";
import { useCart } from "../../hooks/useCart";
import CardProd from "../../components/PDV/cardsProdutos/CardProdutos";
import PdvHeader from "../../components/PDV/pdvHeader/PdvHeader";
import TabSelector from "../../components/PDV/tabSelector/TabSelector";
import CartBar from "../../components/PDV/cartBar/CartBar";

const PRODUCTS = [
  {
    id: "1",
    title: "Cerveja Gelada",
    price: 8.0,
    image: "https://via.placeholder.com/150",
    category: "produtos",
  },
  {
    id: "2",
    title: "Refrigerante",
    price: 6.0,
    image: "https://via.placeholder.com/150",
    category: "produtos",
  },
  {
    id: "3",
    title: "Água Mineral",
    price: 4.0,
    image: "https://via.placeholder.com/150",
    category: "produtos",
  },
  {
    id: "4",
    title: "Galinha Caipira",
    price: 25.0,
    image: "https://via.placeholder.com/150",
    category: "produtos",
  },
  {
    id: "5",
    title: "Porção de Batata",
    price: 20.0,
    image: "https://via.placeholder.com/150",
    category: "produtos",
  },
  {
    id: "6",
    title: "Espetinho Misto",
    price: 10.0,
    image: "https://via.placeholder.com/150",
    category: "produtos",
  },
  {
    id: "7",
    title: "Ingresso Inteira",
    price: 15.0,
    image: "https://via.placeholder.com/150",
    category: "ingressos",
  },
  {
    id: "8",
    title: "Ingresso Meia",
    price: 7.5,
    image: "https://via.placeholder.com/150",
    category: "ingressos",
  },
  {
    id: "9",
    title: "Ingresso VIP",
    price: 30.0,
    image: "https://via.placeholder.com/150",
    category: "ingressos",
  },
];

export default function PDV() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("produtos");
  const { cart, handleIncrease, handleDecrease, totalItems, totalPrice } =
    useCart(PRODUCTS);

  const filteredProducts = PRODUCTS.filter(
    (item) => item.category === activeTab,
  );

  return (
    <SafeContainer>
      <Container>
        <PdvHeader
          name="Maria Silva"
          role="PDV Operacional"
          statusLabel="Caixa Aberto"
          avatarUri="https://via.placeholder.com/40"
        />

        <TabSelector activeTab={activeTab} onChange={setActiveTab} />

        <ProductList
          data={filteredProducts}
          renderItem={({ item }) => (
            <CardProd
              item={item}
              qty={cart[item.id] || 0}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <CartBar
          totalItems={totalItems}
          totalPrice={totalPrice}
         onFinalize={() => {
  const itens = Object.entries(cart).map(([id, qty]) => {
    const produto = PRODUCTS.find(p => p.id === id);
    return { title: produto.title, qty, price: produto.price };
  });

  router.push({
    pathname: '/pagamento',
    params: {
      total: totalPrice.toFixed(2),
      itens: JSON.stringify(itens),
    },
  });
}}
        />
      </Container>
    </SafeContainer>
  );
}
