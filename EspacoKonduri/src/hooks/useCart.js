import { useState } from 'react';

export function useCart(allProducts) {
  const [cart, setCart] = useState({});

  const handleIncrease = (id) => {
    const produto = allProducts.find((p) => p.id === id);
    const estoqueDisponivel = produto?.estoque ?? 0;

    setCart((prev) => {
      const qtyAtual = prev[id] || 0;
      if (qtyAtual >= estoqueDisponivel) return prev;
      return { ...prev, [id]: qtyAtual + 1 };
    });
  };

  const handleDecrease = (id) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      if (currentQty <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: currentQty - 1 };
    });
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const totalPrice = allProducts.reduce((sum, item) => {
    const qty = cart[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  const getQty = (id) => cart[id] || 0;

  return {
    cart,
    setCart,
    getQty,
    handleIncrease,
    handleDecrease,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };
}