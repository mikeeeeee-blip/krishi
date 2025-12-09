'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as addToCartApi, updateCartItem, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '@/lib/api/cart';

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
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'count'>) => Promise<void>;
  removeFromCart: (productId: string, variant: string) => Promise<void>;
  updateQuantity: (productId: string, variant: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      if (typeof window === 'undefined') return;

      try {
        // If authenticated, load from backend
        if (isAuthenticated) {
          setLoading(true);
          const response = await getCart();
          if (response.success && response.data?.items) {
            // Convert backend cart items to frontend format
            const cartItems: CartItem[] = response.data.items.map((item: any) => ({
              productId: item.productId,
              name: item.productName || item.product?.name || '',
              brand: item.product?.brand?.name || '',
              image: item.productImage || item.product?.images?.[0] || '',
              variant: item.variantName || item.variant?.name || '',
              quantity: item.quantity?.toString() || '1',
              price: Number(item.unitPrice) || 0,
              originalPrice: Number(item.unitPrice) || 0,
              count: item.quantity || 1,
            }));
            setItems(cartItems);
          }
          setLoading(false);
        } else {
          // Load from localStorage for guest users
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Error loading cart from localStorage:', error);
            }
          }
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to localStorage if backend fails
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (e) {
            console.error('Error loading cart from localStorage:', e);
          }
        }
        setIsLoaded(true);
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (isLoaded && !isAuthenticated && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded, isAuthenticated]);

  // Sync cart to backend when user logs in
  useEffect(() => {
    if (isAuthenticated && isLoaded && items.length > 0) {
      syncCartToBackend();
    }
  }, [isAuthenticated]);

  const syncCartToBackend = async () => {
    if (!isAuthenticated) return;

    try {
      // Sync each item to backend
      for (const item of items) {
        try {
          await addToCartApi(item.productId, item.variant || null, item.count);
        } catch (error) {
          console.error('Error syncing cart item:', error);
        }
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const syncCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await getCart();
      if (response.success && response.data?.items) {
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          productId: item.productId,
          name: item.productName || item.product?.name || '',
          brand: item.product?.brand?.name || '',
          image: item.productImage || item.product?.images?.[0] || '',
          variant: item.variantName || item.variant?.name || '',
          quantity: item.quantity?.toString() || '1',
          price: Number(item.unitPrice) || 0,
          originalPrice: Number(item.unitPrice) || 0,
          count: item.quantity || 1,
        }));
        setItems(cartItems);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error syncing cart:', error);
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'count'>) => {
    // Update local state immediately for better UX
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

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await addToCartApi(item.productId, item.variant || null, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Revert local state on error
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (i) => i.productId === item.productId && i.variant === item.variant
          );
          if (existingItem && existingItem.count > 1) {
            return prevItems.map((i) =>
              i.productId === item.productId && i.variant === item.variant
                ? { ...i, count: i.count - 1 }
                : i
            );
          }
          return prevItems.filter(
            (i) => !(i.productId === item.productId && i.variant === item.variant)
          );
        });
      }
    }
  };

  const removeFromCart = async (productId: string, variant: string) => {
    // Update local state immediately
    setItems((prevItems) =>
      prevItems.filter(
        (i) => !(i.productId === productId && i.variant === variant)
      )
    );

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await removeFromCartApi(productId, variant || undefined);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const updateQuantity = async (productId: string, variant: string, count: number) => {
    if (count <= 0) {
      await removeFromCart(productId, variant);
      return;
    }

    // Update local state immediately
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.productId === productId && i.variant === variant
          ? { ...i, count }
          : i
      )
    );

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await updateCartItem(productId, count, variant || undefined);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  const clearCart = async () => {
    // Update local state immediately
    setItems([]);

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await clearCartApi();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
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
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        syncCart,
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

