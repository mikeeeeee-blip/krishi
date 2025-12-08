'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  variant: string;
  quantity: string;
  price: number;
  originalPrice: number;
  count: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'count'>) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, count: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount using setTimeout to avoid sync setState in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
          }
        }
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'count'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item.productId && i.variant === item.variant
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId && i.variant === item.variant
            ? { ...i, count: i.count + 1 }
            : i
        );
      }

      return [...prevItems, { ...item, count: 1 }];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (i) => !(i.productId === productId && i.variant === variant)
      )
    );
  };

  const updateQuantity = (productId: string, variant: string, count: number) => {
    if (count <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) =>
        i.productId === productId && i.variant === variant
          ? { ...i, count }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.count, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.count, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
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

