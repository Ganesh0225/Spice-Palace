import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import OrderManagement from '../components/admin/OrderManagement';
import MenuManagement from '../components/admin/MenuManagement';
import TableManagement from '../components/admin/TableManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import ReviewDebugger from '../components/ReviewDebugger';

type AdminTab = 'overview' | 'orders' | 'menu' | 'tables' | 'reviews' | 'debug';

export default function AdminDashboard() {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      navigate('/');
    }
  }, [authState, navigate]);

  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    return null;
  }

  // Mock statistics for demo
  const stats = {
    todayOrders: 24,
    todayRevenue: 12450,
    activeReservations: 8,
    availableTables: 7,
    pendingOrders: 5,
    completedOrders: 19,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'tables':
        return <TableManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'debug':
        return <ReviewDebugger />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.todayRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Reservations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeReservations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Tables</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.availableTables}/12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {[
                    { id: 'ORD001', time: '2 min ago', status: 'preparing', amount: 450 },
                    { id: 'ORD002', time: '5 min ago', status: 'served', amount: 320 },
                    { id: 'ORD003', time: '8 min ago', status: 'pending', amount: 680 },
                    { id: 'ORD004', time: '12 min ago', status: 'served', amount: 290 },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          order.status === 'served' ? 'bg-green-500' :
                          order.status === 'preparing' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.amount}</p>
                        <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full flex items-center justify-between p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="font-medium">Pending Orders</span>
                    </div>
                    <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-sm">
                      {stats.pendingOrders}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('tables')}
                    className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium">Manage Tables</span>
                    </div>
                    <span className="text-green-600 text-sm">
                      {stats.availableTables} available
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('menu')}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium">Update Menu</span>
                    </div>
                    <span className="text-blue-600 text-sm">
                      14 items
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="w-full flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="font-medium">Review Moderation</span>
                    </div>
                    <span className="text-yellow-600 text-sm">
                      2 pending
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {authState.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-xl font-bold text-green-600">₹{stats.todayRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'menu', label: 'Menu', icon: Users },
                { id: 'tables', label: 'Tables', icon: Calendar },
                { id: 'reviews', label: 'Reviews', icon: AlertCircle },
                { id: 'debug', label: 'Debug', icon: AlertCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}