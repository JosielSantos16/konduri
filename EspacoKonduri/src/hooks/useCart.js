import { useState } from 'react';

export function useCart(products) {
  const [cart, setCart] = useState({});

  const handleIncrease = (id) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Diminui a quantidade do item; remove a chave quando chega a 0
  const handleDecrease = (id) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      if (currentQty <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return {
        ...prev,
        [id]: currentQty - 1,
      };
    });
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const totalPrice = products.reduce((sum, item) => {
    const qty = cart[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  return { cart, handleIncrease, handleDecrease, totalItems, totalPrice };
}