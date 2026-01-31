import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { DATA_KEYS } from '../lib/dataManager';
import UPIPayment from '../components/UPIPayment';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state: cartState, getTotalPrice, clearCart } = useCart();
  const { state: authState } = useAuth();
  const { addItem: addOrder } = useRealtimeData<any>(DATA_KEYS.ORDERS, []);
  const [orderType, setOrderType] = useState<'dine-in' | 'delivery'>('dine-in');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [showPayment, setShowPayment] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05;
  const deliveryFee = orderType === 'delivery' && subtotal < 500 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = () => {
    if (!authState.isAuthenticated) {
      alert('Please sign in to place an order');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Create order object
    const order = {
      id: `ORD${Date.now()}`,
      userId: authState.user?._id,
      items: cartState.items,
      total,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      notes: orderNotes,
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      customerName: authState.user?.name || 'Guest',
      customerPhone: authState.user?.phone || 'N/A',
    };

    // Add to real-time orders
    addOrder(order);

    clearCart();
    navigate('/order-confirmation', { state: { order } });
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started</p>
          <button
            onClick={() => navigate('/menu')}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }
  if (showPayment) {
    return (
      <UPIPayment
        amount={total}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPayment(false)}
        orderDetails={{
          items: cartState.items,
          orderType,
          deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Type */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    orderType === 'dine-in'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 text-primary-600">
                      🍽️
                    </div>
                    <p className="font-medium">Dine In</p>
                    <p className="text-sm text-gray-600">Eat at restaurant</p>
                  </div>
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    orderType === 'delivery'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 text-primary-600">
                      🚚
                    </div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-600">Deliver to address</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Delivery Address
                </h2>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete delivery address..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Estimated delivery time: 30-45 minutes
                </p>
              </div>
            )}

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special requests or dietary restrictions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center ${
                    paymentMethod === 'upi'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mr-3 text-primary-600" />
                  <div className="text-left">
                    <p className="font-medium">UPI Payment</p>
                    <p className="text-sm text-gray-600">Pay with Google Pay, PhonePe, Paytm</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center ${
                    paymentMethod === 'card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mr-3 text-primary-600" />
                  <div className="text-left">
                    <p className="font-medium">Card Payment</p>
                    <p className="text-sm text-gray-600">Credit/Debit Card (Coming Soon)</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {cartState.items.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={paymentMethod === 'card'}
              className="w-full btn-primary text-lg py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentMethod === 'card' ? 'Coming Soon' : `Pay ₹${total.toFixed(2)}`}
            </button>

            {orderType === 'delivery' && deliveryFee === 0 && (
              <p className="text-sm text-green-600 text-center mt-2">
                🎉 Free delivery on orders above ₹500!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}