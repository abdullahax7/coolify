'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => boolean;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('property_trader_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setItems(parsed);
          setLoaded(true);
        }, 0);
      } catch (e) {
        console.error('Failed to load cart', e);
        setTimeout(() => setLoaded(true), 0);
      }
    } else {
      setTimeout(() => setLoaded(true), 0);
    }
  }, []);

  // Save cart to localStorage on change (only after initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('property_trader_cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = (item: CartItem): boolean => {
    if (items.find(i => i.id === item.id)) return false;
    setItems(prev => [...prev, item]);
    return true;
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.numericPrice, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
