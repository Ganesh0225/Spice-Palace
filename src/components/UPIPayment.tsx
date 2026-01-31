import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Smartphone, Clock } from 'lucide-react';

interface UPIPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  orderDetails: {
    items: any[];
    orderType: string;
    deliveryAddress?: string;
  };
}

export default function UPIPayment({ amount, onSuccess, onCancel, orderDetails }: UPIPaymentProps) {
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'selecting' | 'processing' | 'success' | 'failed'>('selecting');
  const [countdown, setCountdown] = useState(0);

  const upiApps = [
    { id: 'googlepay', name: 'Google Pay', icon: '🟢', color: 'bg-green-100 border-green-300' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'bg-purple-100 border-purple-300' },
    { id: 'paytm', name: 'Paytm', icon: '🔵', color: 'bg-blue-100 border-blue-300' },
    { id: 'bhim', name: 'BHIM UPI', icon: '🟠', color: 'bg-orange-100 border-orange-300' },
  ];

  useEffect(() => {
    if (paymentStatus === 'processing' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentStatus === 'processing' && countdown === 0) {
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      setPaymentStatus(success ? 'success' : 'failed');
      if (success) {
        setTimeout(onSuccess, 2000);
      }
    }
  }, [paymentStatus, countdown, onSuccess]);

  const handlePayment = (appId: string) => {
    setSelectedApp(appId);
    setPaymentStatus('processing');
    setCountdown(5); // 5 second countdown for demo
  };

  const handleRetry = () => {
    setPaymentStatus('selecting');
    setSelectedApp('');
    setCountdown(0);
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600 mb-6">
              Please complete the payment in your {upiApps.find(app => app.id === selectedApp)?.name} app
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-lg font-mono">{countdown}s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Amount: ₹{amount.toFixed(2)}</p>
              <p>Merchant: Spice Palace</p>
            </div>

            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been confirmed and will be processed shortly.
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">₹{amount.toFixed(2)} paid successfully</p>
              <p className="text-green-600 text-sm">Transaction ID: TXN{Date.now()}</p>
            </div>

            <div className="animate-pulse text-gray-600">
              Redirecting to confirmation page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">Payment of ₹{amount.toFixed(2)} failed</p>
              <p className="text-red-600 text-sm">Please check your UPI app and try again</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleRetry}
                className="flex-1 btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Default selecting state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={onCancel}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">UPI Payment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Payment Amount */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary-600">₹{amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">to Spice Palace</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-3">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{orderDetails.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Type</span>
              <span className="capitalize">{orderDetails.orderType}</span>
            </div>
            {orderDetails.deliveryAddress && (
              <div className="pt-2 border-t">
                <p className="text-gray-600">Delivery to:</p>
                <p className="text-xs">{orderDetails.deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* UPI Apps */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Choose Payment App</h3>
          <div className="grid grid-cols-2 gap-3">
            {upiApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handlePayment(app.id)}
                className={`p-4 rounded-lg border-2 transition-colors hover:shadow-md ${app.color}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{app.icon}</div>
                  <p className="font-medium text-sm">{app.name}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm font-medium mb-1">Demo Mode</p>
            <p className="text-blue-600 text-xs">
              This is a mock payment interface. In production, this would integrate with actual UPI payment gateways.
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
        </div>
      </div>
    </div>
  );
}