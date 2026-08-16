import React, { useState } from "react";
import { useRouter } from "expo-router";
import SafeContainer from "../../styles/SafeContainer";
import { Container, ProductList } from "./pdvStyles";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useProdutos } from "../../contexts/ProdutosContext";
import { getStatusCaixa } from "../../utils/businessHours";
import CardProd from "../../components/PDV/cardsProdutos/CardProdutos";
import PdvHeader from "../../components/PDV/pdvHeader/PdvHeader";
import TabSelector from "../../components/PDV/tabSelector/TabSelector";
import CartBar from "../../components/PDV/cartBar/CartBar";

export default function PDV() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("produtos");
  const { produtos } = useProdutos();
  const { cart, handleIncrease, handleDecrease, totalItems, totalPrice } =
    useCart(produtos);
  const { usuario, carregando } = useAuth();

  const filteredProducts = produtos.filter(
    (item) => item.category === activeTab,
  );

  const statusCaixa = getStatusCaixa();

  const nomeExibido = carregando ? "Carregando..." : usuario?.nome || "Usuário";
  const cargoExibido =
    usuario?.perfil === "adm" ? "Administrador" : "PDV Operacional";

  return (
    <SafeContainer>
      <Container>
        <PdvHeader
          name={nomeExibido}
          role={cargoExibido}
          statusLabel={statusCaixa.label}
          aberto={statusCaixa.aberto}
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
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <CartBar
          totalItems={totalItems}
          totalPrice={totalPrice}
          onFinalize={() => {
            const itens = Object.entries(cart).map(([id, qty]) => {
              const produto = produtos.find((p) => p.id === id);
              return {
                id: produto.id,
                title: produto.title,
                qty,
                price: produto.price,
              };
            });

            router.push({
              pathname: "/pagamento",
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
