'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Order placed successfully!');
      clearCart();
      setIsProcessing(false);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
        <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const deliveryCharges = 0; // Free delivery
  const finalTotal = totalPrice + deliveryCharges;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.variant}-${index}`}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                  >
                    {/* Product Image */}
                    <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="128px"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-semibold text-gray-900 mb-1 hover:text-green-600 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-1">Brand: {item.brand}</p>
                      <p className="text-sm text-gray-600 mb-2">{item.variant} - {item.quantity}</p>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{item.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Total: ₹{item.price * item.count}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variant, item.count - 1)}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.count}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variant, item.count + 1)}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variant)}
                            className="ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link
                href="/"
                className="block w-full text-center text-gray-600 hover:text-green-600 font-medium py-2"
              >
                Continue Shopping
              </Link>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <p>✓ Secure checkout</p>
                <p>✓ Free delivery on all orders</p>
                <p>✓ 48 hours returnable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

