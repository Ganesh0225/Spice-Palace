import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Truck, UtensilsCrossed } from 'lucide-react';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import { DATA_KEYS } from '../../lib/dataManager';

interface Order {
  id: string;
  userId?: string;
  items: any[];
  total: number;
  orderType: string;
  deliveryAddress?: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
}

export default function OrderManagement() {
  const { data: orders, updateItem: updateOrder } = useRealtimeData<Order>(DATA_KEYS.ORDERS, []);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Add some mock orders for demo if none exist
  useEffect(() => {
    if (orders.length === 0) {
      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          userId: 'user1',
          items: [
            { name: 'Hyderabadi Biryani', quantity: 2, price: 350 },
            { name: 'Andhra Chicken Curry', quantity: 1, price: 280 }
          ],
          total: 980,
          orderType: 'dine-in',
          status: 'pending',
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
          customerName: 'John Doe',
          customerPhone: '+91 98765 43210'
        },
        {
          id: 'ORD002',
          userId: 'user1',
          items: [
            { name: 'Paneer Butter Masala', quantity: 1, price: 220 },
            { name: 'Jeera Rice', quantity: 2, price: 120 }
          ],
          total: 460,
          orderType: 'delivery',
          deliveryAddress: '123 Main Street, Hyderabad',
          status: 'preparing',
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          customerName: 'John Doe',
          customerPhone: '+91 98765 43210'
        },
        {
          id: 'ORD003',
          userId: 'user1',
          items: [
            { name: 'Mutton Biryani', quantity: 1, price: 450 },
            { name: 'Raita', quantity: 1, price: 80 },
            { name: 'Gulab Jamun', quantity: 2, price: 60 }
          ],
          total: 590,
          orderType: 'delivery',
          deliveryAddress: '123 Main Street, Hyderabad',
          status: 'delivered',
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
          customerName: 'John Doe',
          customerPhone: '+91 98765 43210'
        },
        {
          id: 'ORD004',
          userId: 'user1',
          items: [
            { name: 'Chicken 65', quantity: 1, price: 280 },
            { name: 'Naan', quantity: 2, price: 40 }
          ],
          total: 360,
          orderType: 'dine-in',
          status: 'served',
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(), // 1 week ago
          customerName: 'John Doe',
          customerPhone: '+91 98765 43210'
        }
      ];
      
      // Only add mock orders if no real orders exist
      mockOrders.forEach(() => {
        // Use a timeout to avoid conflicts with real orders
        setTimeout(() => {
          const currentOrders = JSON.parse(localStorage.getItem(DATA_KEYS.ORDERS) || '[]');
          if (currentOrders.length === 0) {
            localStorage.setItem(DATA_KEYS.ORDERS, JSON.stringify(mockOrders));
            window.dispatchEvent(new CustomEvent('dataUpdate', {
              detail: { key: DATA_KEYS.ORDERS, data: mockOrders }
            }));
          }
        }, 100);
      });
    }
  }, [orders.length]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    updateOrder(orderId, (order: Order) => ({
      ...order,
      status: newStatus
    }), 'id');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'served': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <UtensilsCrossed className="w-4 h-4" />;
      case 'served': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="served">Served</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{order.id}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </span>
            </div>

            {/* Customer Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.customerPhone}</p>
              <div className="flex items-center mt-1">
                {order.orderType === 'delivery' ? (
                  <Truck className="w-4 h-4 text-blue-600 mr-1" />
                ) : (
                  <UtensilsCrossed className="w-4 h-4 text-green-600 mr-1" />
                )}
                <span className="text-sm capitalize">{order.orderType}</span>
              </div>
              {order.deliveryAddress && (
                <p className="text-xs text-gray-500 mt-1">{order.deliveryAddress}</p>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
              <div className="space-y-1">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-4 pt-2 border-t">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary-600">₹{order.total.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Accept
                </button>
              )}
              
              {order.status === 'preparing' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'served')}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Mark Served
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400">Orders will appear here when customers place them</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Order Details - {selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedOrder.orderType}</p>
                  {selectedOrder.deliveryAddress && (
                    <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}