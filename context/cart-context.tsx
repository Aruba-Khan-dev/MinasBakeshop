'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  size: string;
  flavour: string;
  cakeFlavour?: string;
  cupcakeFlavour?: string;
  shape?: string;
  addOns: string[];
  theme?: string;
  colorPreferences?: string;
  referenceImage?: string;
  messageOnCake?: string;
  specialInstructions?: string;
  quantity: number;
  pricePerItem: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, flavour: string, message?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('minas_bakeshop_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('minas_bakeshop_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (newItem: CartItem) => {
    setCart(prevCart => {
      // Check if item with same options already exists
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        item.flavour === newItem.flavour &&
        item.messageOnCake === newItem.messageOnCake
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }

      return [...prevCart, newItem];
    });
  };

  const removeItem = (id: string, size: string, flavour: string, message?: string) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === id && item.size === size && item.flavour === flavour && item.messageOnCake === message)
    ));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.pricePerItem * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
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
