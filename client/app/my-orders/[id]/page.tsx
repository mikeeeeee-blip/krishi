'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import PaymentStatusBadge from '@/components/orders/PaymentStatusBadge';
import OrderTrackingTimeline from '@/components/orders/OrderTrackingTimeline';
import { getUserOrderById, cancelOrder, updateCustomerOrderAddress } from '@/lib/api/orders';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  IndianRupee,
  XCircle,
  Edit,
  X,
  Save,
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getUserOrderById(orderId);
        setOrder(response.data);
        
        // Initialize address form with current shipping address
        if (response.data.shippingAddress) {
          const addr = response.data.shippingAddress;
          setAddressForm({
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            addressLine1: addr.addressLine1 || '',
            addressLine2: addr.addressLine2 || '',
            landmark: addr.landmark || '',
            city: addr.city || '',
            state: addr.state || '',
            pincode: addr.pincode || '',
            country: addr.country || 'India',
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    try {
      setCancelling(true);
      await cancelOrder(orderId, cancelReason);
      setShowCancelModal(false);
      // Refresh order data
      const response = await getUserOrderById(orderId);
      setOrder(response.data);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Can only cancel before shipping
  const canCancel = order && ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) && 
    !['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status);

  // Can only edit address before shipping
  const canEditAddress = order && ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) && 
    !['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status);

  const handleSaveAddress = async () => {
    // Validate required fields
    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 ||
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(addressForm.phone.replace(/\s/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    // Validate pincode (6 digits for India)
    if (addressForm.pincode.length !== 6 || !/^\d+$/.test(addressForm.pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      setSavingAddress(true);
      await updateCustomerOrderAddress(orderId, addressForm);
      setShowEditAddress(false);
      alert('Address updated successfully');
      
      // Refresh order data
      const response = await getUserOrderById(orderId);
      setOrder(response.data);
    } catch (err: any) {
      alert(err.message || 'Failed to update address');
    } finally {
      setSavingAddress(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50">
        <TopBar />
        <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
        <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50">
        <TopBar />
        <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
        <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error || 'Order not found'}</p>
            <Link
              href="/my-orders"
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Back to Orders
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};
  const billingAddress = order.billingAddress || shippingAddress;

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50">
      <TopBar />
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/my-orders"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.status} size="lg" />
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    {item.productImage ? (
                      <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-600 mb-2">Variant: {item.variantName}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {formatPrice(Number(item.totalPrice))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
                {canEditAddress && (
                  <button
                    onClick={() => setShowEditAddress(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Address
                  </button>
                )}
              </div>
              {!showEditAddress ? (
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                  {shippingAddress.landmark && <p>Landmark: {shippingAddress.landmark}</p>}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                  </p>
                  <p>{shippingAddress.country || 'India'}</p>
                  {shippingAddress.phone && <p className="mt-2 font-medium">Phone: {shippingAddress.phone}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Near City Mall"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowEditAddress(false);
                        // Reset form to original values
                        if (order?.shippingAddress) {
                          const addr = order.shippingAddress;
                          setAddressForm({
                            fullName: addr.fullName || '',
                            phone: addr.phone || '',
                            addressLine1: addr.addressLine1 || '',
                            addressLine2: addr.addressLine2 || '',
                            landmark: addr.landmark || '',
                            city: addr.city || '',
                            state: addr.state || '',
                            pincode: addr.pincode || '',
                            country: addr.country || 'India',
                          });
                        }
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                      disabled={savingAddress}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {savingAddress ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Address
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Tracking Timeline */}
            <OrderTrackingTimeline order={order} />

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                  </p>
                  {order.carrierName && (
                    <p className="text-gray-600">
                      <span className="font-medium">Carrier:</span> {order.carrierName}
                    </p>
                  )}
                  {order.shippedAt && (
                    <p className="text-gray-600">
                      <span className="font-medium">Shipped on:</span>{' '}
                      {format(new Date(order.shippedAt), 'MMMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(Number(order.discountAmount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST)</span>
                  <span>{formatPrice(Number(order.taxAmount))}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.shippingAmount > 0
                      ? formatPrice(Number(order.shippingAmount))
                      : 'Free'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    {formatPrice(Number(order.totalAmount))}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                </div>
                {order.paidAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Paid on</p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(order.paidAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                {order.shippedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipped</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(order.shippedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                {order.deliveredAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivered</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(order.deliveredAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? Please provide a reason.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 min-h-[100px]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

