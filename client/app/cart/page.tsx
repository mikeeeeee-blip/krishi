'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, ArrowLeft, CreditCard, Banknote, Smartphone, X, CheckCircle, Truck, MapPin, User, Phone, Mail, Package } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/lib/api/orders';
import { getAddresses, type Address } from '@/lib/api/addresses';

type PaymentMethod = 'cod' | 'online' | 'upi';

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Redirect to login if not authenticated when trying to checkout
  useEffect(() => {
    if (!authLoading && !isAuthenticated && showCheckout) {
      router.push('/login?redirect=/cart');
    }
  }, [isAuthenticated, authLoading, showCheckout, router]);

  // Redirect admins away from cart page
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'ADMIN') {
      router.push('/admin/orders');
    }
  }, [isAuthenticated, authLoading, user, router]);

  // Update email when user is loaded
  useEffect(() => {
    if (user?.email && !shippingAddress.email) {
      setShippingAddress(prev => ({ ...prev, email: user.email }));
    }
    if (user?.firstName && !shippingAddress.fullName) {
      setShippingAddress(prev => ({ 
        ...prev, 
        fullName: `${user.firstName} ${user.lastName || ''}`.trim() 
      }));
    }
  }, [user]);

  // Load saved addresses when checkout is shown
  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (showCheckout && isAuthenticated && !orderPlaced) {
        try {
          setLoadingAddresses(true);
          const response = await getAddresses();
          if (response.success && response.data) {
            setSavedAddresses(response.data);
            
            // Auto-select default address
            const defaultAddress = response.data.find((addr: Address) => addr.isDefault);
            if (defaultAddress && defaultAddress._id) {
              setSelectedAddressId(defaultAddress._id);
              setUseNewAddress(false);
              // Auto-fill the form with default address
              setShippingAddress({
                fullName: defaultAddress.fullName,
                phone: defaultAddress.phone,
                email: user?.email || '',
                address: defaultAddress.addressLine1 + (defaultAddress.addressLine2 ? ', ' + defaultAddress.addressLine2 : ''),
                city: defaultAddress.city,
                state: defaultAddress.state,
                pincode: defaultAddress.pincode
              });
            } else if (response.data.length === 0) {
              // No saved addresses, show new address form
              setUseNewAddress(true);
            }
          }
        } catch (err) {
          console.error('Error loading addresses:', err);
          setUseNewAddress(true); // Fallback to new address form
        } finally {
          setLoadingAddresses(false);
        }
      }
    };

    loadSavedAddresses();
  }, [showCheckout, isAuthenticated, orderPlaced, user?.email]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }
    setShowCheckout(true);
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddr = savedAddresses.find(addr => addr._id === addressId);
    if (selectedAddr) {
      setShippingAddress({
        fullName: selectedAddr.fullName,
        phone: selectedAddr.phone,
        email: user?.email || '',
        address: selectedAddr.addressLine1 + (selectedAddr.addressLine2 ? ', ' + selectedAddr.addressLine2 : ''),
        city: selectedAddr.city,
        state: selectedAddr.state,
        pincode: selectedAddr.pincode
      });
    }
  };

  const handleNewAddressToggle = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    // Clear form for new address
    setShippingAddress({
      fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
      phone: '',
      email: user?.email || '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.productId,
        variantId: undefined, // Variants don't have IDs in current data structure
        quantity: item.count,
      }));

      // Prepare shipping address
      const shippingAddr = {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: 'India',
      };

      // Map payment method
      let paymentMethodValue = 'COD';
      if (paymentMethod === 'upi') {
        paymentMethodValue = 'UPI';
      } else if (paymentMethod === 'online') {
        paymentMethodValue = 'CREDIT_CARD'; // or 'DEBIT_CARD', 'NET_BANKING'
      }

      // Create order via API
      const response = await createOrder({
        items: orderItems,
        shippingAddress: shippingAddr,
        billingAddress: shippingAddr,
        paymentMethod: paymentMethodValue,
        customerNotes: `Payment via ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Online Payment'}`,
      });

      if (response.success) {
        setOrderData(response.data);
        setOrderPlaced(true);
        clearCart();
        // Clear shipping address form after successful order
        setShippingAddress({
          fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
          phone: '',
          email: user?.email || '',
          address: '',
          city: '',
          state: '',
          pincode: ''
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseOrderSuccess = () => {
    setOrderPlaced(false);
    setShowCheckout(false);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
        <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
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
  const codCharges = paymentMethod === 'cod' ? 0 : 0; // Can add COD charges if needed
  const onlineDiscount = paymentMethod === 'online' ? 30 : paymentMethod === 'upi' ? 30 : 0;
  const finalTotal = totalPrice + deliveryCharges + codCharges - onlineDiscount;

  // Order Success Modal
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <TopBar />
        <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
        <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
        
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Success Header with Gradient */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                    <CheckCircle size={56} className="text-green-600" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-green-50 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                    {paymentMethod === 'cod' 
                      ? 'Your order has been placed. Please keep the exact amount ready for payment upon delivery.'
                      : 'Your order has been placed and payment received. Thank you for shopping with us!'}
                  </p>
                </div>
              </div>

              {/* Order Details Section */}
              <div className="px-6 md:px-10 py-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package size={24} className="text-green-600" />
                    Order Details
                  </h3>
                  {orderData && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">Order Number</span>
                        <span className="text-base font-bold text-gray-900 font-mono tracking-tight break-all">
                          {orderData.orderNumber}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">Payment Method</span>
                        <span className="text-base font-semibold text-gray-900 inline-flex items-center gap-2">
                          {orderData.paymentMethod === 'COD' ? (
                            <>
                              <Banknote size={18} className="text-orange-600" />
                              <span>Cash on Delivery</span>
                            </>
                          ) : (
                            <>
                              <CreditCard size={18} className="text-blue-600" />
                              <span>{orderData.paymentMethod}</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{Number(orderData.totalAmount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 pt-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <Truck size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Expected Delivery</p>
                          <p className="text-base font-bold text-blue-700">5-7 Business Days</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/my-orders"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 text-center shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    onClick={handleCloseOrderSuccess}
                  >
                    <Package size={20} />
                    View My Orders
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 text-center border-2 border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    onClick={handleCloseOrderSuccess}
                  >
                    <ShoppingCart size={20} />
                    Continue Shopping
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    We&apos;ve sent a confirmation email to <span className="font-semibold text-gray-700">{user?.email}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Need help? Contact our support team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

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
            <span className="text-gray-900 font-medium">{showCheckout ? 'Checkout' : 'Shopping Cart'}</span>
          </div>
        </div>

        {!showCheckout ? (
          // Cart View
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
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/"
                  className="block w-full text-center text-gray-600 hover:text-green-600 font-medium py-2"
                >
                  Continue Shopping
                </Link>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-green-600" /> Secure checkout</p>
                  <p className="flex items-center gap-2"><Truck size={14} className="text-green-600" /> Free delivery on all orders</p>
                  <p className="flex items-center gap-2"><Banknote size={14} className="text-green-600" /> Cash on Delivery available</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Checkout View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <form onSubmit={handlePlaceOrder}>
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 md:p-8 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                    </div>
                    {savedAddresses.length > 0 && !useNewAddress && (
                      <button
                        type="button"
                        onClick={handleNewAddressToggle}
                        className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add New Address
                      </button>
                    )}
                  </div>

                  {/* Saved Addresses Selection */}
                  {loadingAddresses ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <p className="mt-2 text-gray-600">Loading addresses...</p>
                    </div>
                  ) : savedAddresses.length > 0 && !useNewAddress ? (
                    <div className="mb-6">
                      <div className="space-y-3 mb-4">
                        {savedAddresses.map((address) => (
                          <div
                            key={address._id}
                            onClick={() => handleAddressSelection(address._id!)}
                            className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                              selectedAddressId === address._id
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-green-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="savedAddress"
                                checked={selectedAddressId === address._id}
                                onChange={() => handleAddressSelection(address._id!)}
                                className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900">{address.fullName}</span>
                                  {address.isDefault && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleNewAddressToggle}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Use a Different Address
                      </button>
                    </div>
                  ) : null}

                  {/* Address Form (shown when using new address or no saved addresses) */}
                  {(useNewAddress || savedAddresses.length === 0) && (
                    <>
                      {savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setUseNewAddress(false);
                            // Re-select default address if available
                            const defaultAddr = savedAddresses.find(addr => addr.isDefault);
                            if (defaultAddr && defaultAddr._id) {
                              handleAddressSelection(defaultAddr._id);
                            }
                          }}
                          className="mb-4 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                        >
                          <ArrowLeft size={16} />
                          Back to Saved Addresses
                        </button>
                      )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="tel"
                          required
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          required
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Complete Address *</label>
                      <textarea
                        required
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm resize-none"
                        placeholder="House No., Building, Street, Area"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">State *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900 font-medium placeholder:text-gray-400 transition-all shadow-sm"
                        placeholder="Enter PIN code"
                      />
                    </div>
                  </div>
                    </>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Banknote className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Cash on Delivery (COD)</h3>
                            <p className="text-sm text-gray-600">Pay when you receive your order</p>
                          </div>
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Note:</strong> Please keep the exact amount (₹{totalPrice.toFixed(2)}) ready for payment upon delivery.
                            </p>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* UPI Payment */}
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                            <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm, etc.</p>
                            <span className="inline-block mt-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">Save ₹30</span>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Online Payment */}
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'online' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                            <p className="text-sm text-gray-600">Visa, MasterCard, RuPay</p>
                            <span className="inline-block mt-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">Save ₹30</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Mobile Place Order Button */}
                <div className="lg:hidden mt-6">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>Place Order - ₹{finalTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary (Checkout) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${item.variant}-${index}`} className="flex gap-3 text-sm">
                      <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-gray-600">Qty: {item.count} × ₹{item.price}</p>
                      </div>
                      <p className="font-semibold">₹{item.price * item.count}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  {onlineDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Online Discount</span>
                      <span className="font-semibold">-₹{onlineDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Desktop Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="hidden lg:flex w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay & Place Order'}
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-green-600" /> 100% Secure checkout</p>
                  <p className="flex items-center gap-2"><Truck size={14} className="text-green-600" /> Delivery in 5-7 days</p>
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-green-600" /> 48 hours returnable</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
