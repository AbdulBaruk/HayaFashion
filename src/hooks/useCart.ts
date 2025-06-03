import { useState } from 'react';
import { CartItem } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(items => {
      const existingItem = items.find(item => 
        item.id === newItem.id && 
        item.variantId === newItem.variantId && 
        item.sizeId === newItem.sizeId
      );

      if (existingItem) {
        return items.map(item =>
          item.id === newItem.id &&
          item.variantId === newItem.variantId &&
          item.sizeId === newItem.sizeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, newItem];
    });
  };

  const updateQuantity = (id: number, variantId: string, sizeId: string, change: number) => {
    setCartItems(items =>
      items
        .map(item =>
          item.id === id &&
          item.variantId === variantId &&
          item.sizeId === sizeId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    clearCart
  };
}