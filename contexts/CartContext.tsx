'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const hasSyncedRef = useRef(false); // Prevent multiple syncs on login

  // Helper function to check if a string is a valid MongoDB ObjectId
  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Load cart from localStorage (for both guest and authenticated users as backup)
  const loadCartFromLocalStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  };

  // Save cart to localStorage (always save as backup)
  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Load cart on mount and when auth state changes
  useEffect(() => {
    const loadCart = async () => {
      if (typeof window === 'undefined') return;
      
      // Wait for auth to finish loading
      if (authLoading) return;

      try {
        // Always load from localStorage first (as backup)
        const localCart = loadCartFromLocalStorage();

        // If authenticated, load from backend and merge with localStorage
        if (isAuthenticated) {
          setLoading(true);
          try {
            const response = await getCart();
            if (response.success && response.data?.items && response.data.items.length > 0) {
              // Convert backend cart items to frontend format
              const backendCartItems: CartItem[] = response.data.items
                .filter((item: any) => item.product) // Filter out items with deleted products
                .map((item: any) => {
                  const product = item.product;
                  const productId = product?._id?.toString() || product?.toString() || '';
                  
                  // Find variant name if variantId exists
                  let variantName = '';
                  if (item.variantId && product?.variants) {
                    const variant = product.variants.find((v: any) => 
                      v._id?.toString() === item.variantId || v._id === item.variantId
                    );
                    variantName = variant?.name || '';
                  }

                  return {
                    productId,
                    name: product?.name || '',
                    brand: product?.brand?.name || '',
                    image: product?.images?.[0] || '',
                    variant: variantName,
                    quantity: item.quantity?.toString() || '1',
                    price: Number(item.unitPrice) || 0,
                    originalPrice: Number(item.unitPrice) || 0,
                    count: item.quantity || 1,
                  };
                })
                .filter((item: CartItem) => item.productId); // Filter out invalid items

              // Merge backend cart with localStorage cart (backend takes priority)
              // Keep localStorage items that aren't in backend (for mock data)
              const mergedCart = [...backendCartItems];
              localCart.forEach((localItem: CartItem) => {
                const existsInBackend = backendCartItems.some(
                  (backendItem: CartItem) => 
                    backendItem.productId === localItem.productId && 
                    backendItem.variant === localItem.variant
                );
                // Only add local items if they're not in backend (mock data support)
                if (!existsInBackend) {
                  mergedCart.push(localItem);
                }
              });

              setItems(mergedCart);
              saveCartToLocalStorage(mergedCart);
            } else {
              // Backend cart is empty, use localStorage cart if available
              if (localCart.length > 0) {
                setItems(localCart);
                saveCartToLocalStorage(localCart); // Ensure it's saved
              } else {
                setItems([]);
                saveCartToLocalStorage([]); // Clear localStorage if both are empty
              }
            }
          } catch (error) {
            console.error('Error loading cart from backend:', error);
            // Fallback to localStorage if backend fails
            if (localCart.length > 0) {
              setItems(localCart);
              saveCartToLocalStorage(localCart); // Ensure it's saved
            } else {
              setItems([]);
            }
          }
          setLoading(false);
        } else {
          // Guest user - load from localStorage only
          if (localCart.length > 0) {
            setItems(localCart);
            saveCartToLocalStorage(localCart); // Ensure it's saved
          } else {
            setItems([]);
          }
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading cart:', error);
        // Final fallback to localStorage
        const localCart = loadCartFromLocalStorage();
        setItems(localCart);
        setIsLoaded(true);
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, authLoading]);

  // Save cart to localStorage whenever it changes (for both guest and authenticated users as backup)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      saveCartToLocalStorage(items);
    }
  }, [items, isLoaded]);

  // Sync cart to backend when user logs in (only once)
  useEffect(() => {
    if (isAuthenticated && isLoaded && items.length > 0 && !authLoading && !hasSyncedRef.current) {
      // Only sync if we have items and user just logged in (prevent multiple syncs)
      hasSyncedRef.current = true;
      const syncOnce = async () => {
        await syncCartToBackend();
      };
      syncOnce();
    }
    
    // Reset sync flag when user logs out
    if (!isAuthenticated) {
      hasSyncedRef.current = false;
    }
  }, [isAuthenticated, isLoaded, items.length, authLoading]);

  const syncCartToBackend = async () => {
    if (!isAuthenticated) return;

    try {
      // Sync each item to backend (only if productId is a valid ObjectId)
      for (const item of items) {
        // Skip items with invalid ObjectIds (mock data)
        if (!isValidObjectId(item.productId)) {
          console.warn(`Skipping sync for product ${item.productId} - not a valid MongoDB ObjectId`);
          continue;
        }
        try {
          await addToCartApi(item.productId, null, item.count, item.variant || undefined);
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
      if (response.success && response.data?.items && response.data.items.length > 0) {
        const cartItems: CartItem[] = response.data.items
          .filter((item: any) => item.product) // Filter out items with deleted products
          .map((item: any) => {
            const product = item.product;
            const productId = product?._id?.toString() || product?.toString() || '';
            
            // Find variant name if variantId exists
            let variantName = '';
            if (item.variantId && product?.variants) {
              const variant = product.variants.find((v: any) => 
                v._id?.toString() === item.variantId || v._id === item.variantId
              );
              variantName = variant?.name || '';
            }

            return {
              productId,
              name: product?.name || '',
              brand: product?.brand?.name || '',
              image: product?.images?.[0] || '',
              variant: variantName,
              quantity: item.quantity?.toString() || '1',
              price: Number(item.unitPrice) || 0,
              originalPrice: Number(item.unitPrice) || 0,
              count: item.quantity || 1,
            };
          })
          .filter((item: CartItem) => item.productId); // Filter out invalid items
        
        setItems(cartItems);
        saveCartToLocalStorage(cartItems); // Save to localStorage as backup
      } else {
        // Backend cart is empty, try localStorage
        const localCart = loadCartFromLocalStorage();
        if (localCart.length > 0) {
          setItems(localCart);
        } else {
          setItems([]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error syncing cart:', error);
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'count'>) => {
    // If authenticated and productId is valid, add to backend first
    if (isAuthenticated && isValidObjectId(item.productId)) {
      try {
        setLoading(true);
        // Add to backend first
        await addToCartApi(item.productId, null, 1, item.variant || undefined);
        
        // After successful backend add, reload cart from backend to ensure sync
        const response = await getCart();
        if (response.success && response.data?.items) {
          const backendCartItems: CartItem[] = response.data.items
            .filter((item: any) => item.product)
            .map((item: any) => {
              const product = item.product;
              const productId = product?._id?.toString() || product?.toString() || '';
              
              let variantName = '';
              if (item.variantId && product?.variants) {
                const variant = product.variants.find((v: any) => 
                  v._id?.toString() === item.variantId || v._id === item.variantId
                );
                variantName = variant?.name || '';
              }

              return {
                productId,
                name: product?.name || '',
                brand: product?.brand?.name || '',
                image: product?.images?.[0] || '',
                variant: variantName,
                quantity: item.quantity?.toString() || '1',
                price: Number(item.unitPrice) || 0,
                originalPrice: Number(item.unitPrice) || 0,
                count: item.quantity || 1,
              };
            })
            .filter((item: CartItem) => item.productId);

          setItems(backendCartItems);
          saveCartToLocalStorage(backendCartItems);
        }
        setLoading(false);
      } catch (error: any) {
        console.error('Error adding to cart:', error);
        setLoading(false);
        // Show error to user
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add item to cart';
        alert(errorMessage);
        throw error; // Re-throw so calling code can handle it
      }
    } else {
      // For guest users or mock data, update local state and localStorage
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (i) => i.productId === item.productId && i.variant === item.variant
        );

        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = prevItems.map((i) =>
            i.productId === item.productId && i.variant === item.variant
              ? { ...i, count: i.count + 1 }
              : i
          );
        } else {
          updatedItems = [...prevItems, { ...item, count: 1 }];
        }
        
        saveCartToLocalStorage(updatedItems);
        return updatedItems;
      });
    }
  };

  const removeFromCart = async (productId: string, variant: string) => {
    // If authenticated and productId is valid, remove from backend first
    if (isAuthenticated && isValidObjectId(productId)) {
      try {
        setLoading(true);
        // Remove from backend first
        await removeFromCartApi(productId, variant || undefined);
        
        // After successful backend removal, reload cart from backend to ensure sync
        const response = await getCart();
        if (response.success && response.data?.items) {
          const backendCartItems: CartItem[] = response.data.items
            .filter((item: any) => item.product)
            .map((item: any) => {
              const product = item.product;
              const productId = product?._id?.toString() || product?.toString() || '';
              
              let variantName = '';
              if (item.variantId && product?.variants) {
                const variant = product.variants.find((v: any) => 
                  v._id?.toString() === item.variantId || v._id === item.variantId
                );
                variantName = variant?.name || '';
              }

              return {
                productId,
                name: product?.name || '',
                brand: product?.brand?.name || '',
                image: product?.images?.[0] || '',
                variant: variantName,
                quantity: item.quantity?.toString() || '1',
                price: Number(item.unitPrice) || 0,
                originalPrice: Number(item.unitPrice) || 0,
                count: item.quantity || 1,
              };
            })
            .filter((item: CartItem) => item.productId);

          setItems(backendCartItems);
          saveCartToLocalStorage(backendCartItems);
        } else {
          // Backend cart is empty
          setItems([]);
          saveCartToLocalStorage([]);
        }
        setLoading(false);
      } catch (error: any) {
        console.error('Error removing from cart:', error);
        setLoading(false);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to remove item from cart';
        alert(errorMessage);
        throw error;
      }
    } else {
      // For guest users or mock data, update local state
      setItems((prevItems) => {
        const updatedItems = prevItems.filter(
          (i) => !(i.productId === productId && i.variant === variant)
        );
        saveCartToLocalStorage(updatedItems);
        return updatedItems;
      });
    }
  };

  const updateQuantity = async (productId: string, variant: string, count: number) => {
    if (count <= 0) {
      await removeFromCart(productId, variant);
      return;
    }

    // If authenticated and productId is valid, update backend first
    if (isAuthenticated && isValidObjectId(productId)) {
      try {
        setLoading(true);
        // Update backend first
        await updateCartItem(productId, count, variant || undefined);
        
        // After successful backend update, reload cart from backend to ensure sync
        const response = await getCart();
        if (response.success && response.data?.items) {
          const backendCartItems: CartItem[] = response.data.items
            .filter((item: any) => item.product)
            .map((item: any) => {
              const product = item.product;
              const productId = product?._id?.toString() || product?.toString() || '';
              
              let variantName = '';
              if (item.variantId && product?.variants) {
                const variant = product.variants.find((v: any) => 
                  v._id?.toString() === item.variantId || v._id === item.variantId
                );
                variantName = variant?.name || '';
              }

              return {
                productId,
                name: product?.name || '',
                brand: product?.brand?.name || '',
                image: product?.images?.[0] || '',
                variant: variantName,
                quantity: item.quantity?.toString() || '1',
                price: Number(item.unitPrice) || 0,
                originalPrice: Number(item.unitPrice) || 0,
                count: item.quantity || 1,
              };
            })
            .filter((item: CartItem) => item.productId);

          setItems(backendCartItems);
          saveCartToLocalStorage(backendCartItems);
        }
        setLoading(false);
      } catch (error: any) {
        console.error('Error updating cart:', error);
        setLoading(false);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update cart';
        alert(errorMessage);
        throw error;
      }
    } else {
      // For guest users or mock data, update local state
      setItems((prevItems) => {
        const updatedItems = prevItems.map((i) =>
          i.productId === productId && i.variant === variant
            ? { ...i, count }
            : i
        );
        saveCartToLocalStorage(updatedItems);
        return updatedItems;
      });
    }
  };

  const clearCart = async () => {
    // Update local state immediately
    setItems([]);
    saveCartToLocalStorage([]);

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

