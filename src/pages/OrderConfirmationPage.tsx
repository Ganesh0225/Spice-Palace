import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone, Home, Receipt } from 'lucide-react';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/menu');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const estimatedTime = order.orderType === 'delivery' ? '30-45 minutes' : '15-20 minutes';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. We're preparing your delicious meal.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Confirmed
            </span>
          </div>

          {/* Estimated Time */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-primary-800">
                  Estimated {order.orderType === 'delivery' ? 'Delivery' : 'Preparation'} Time
                </p>
                <p className="text-primary-600">{estimatedTime}</p>
              </div>
            </div>
          </div>

          {/* Order Type & Address */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center mb-2">
              {order.orderType === 'delivery' ? (
                <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              ) : (
                <div className="w-5 h-5 mr-2">🍽️</div>
              )}
              <span className="font-medium capitalize">{order.orderType}</span>
            </div>
            {order.deliveryAddress && (
              <p className="text-gray-600 ml-7">{order.deliveryAddress}</p>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg mr-3"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-primary-600">₹{order.total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Payment Status: Paid ✅</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-4">Restaurant Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium">+91 98765 43210</p>
                <p className="text-sm text-gray-600">For order updates and support</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium">123 Spice Street</p>
                <p className="text-sm text-gray-600">Hyderabad, Telangana 500001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <Link
            to="/orders"
            className="flex-1 btn-primary py-3 px-6 text-center font-medium flex items-center justify-center"
          >
            <Receipt className="w-5 h-5 mr-2" />
            View All Orders
          </Link>
        </div>

        {/* Order Tracking Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>✅ Order confirmed and payment received</p>
            <p>🍳 Kitchen is preparing your order</p>
            <p>
              {order.orderType === 'delivery' 
                ? '🚚 We\'ll notify you when your order is out for delivery'
                : '🔔 We\'ll notify you when your order is ready for pickup'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}