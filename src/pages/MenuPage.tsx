import { useState } from 'react';
import { Search, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import { getMockMenuItems } from '../lib/mockApi';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { DATA_KEYS } from '../lib/dataManager';

// Try to import Convex, but handle if it's not available
let useQuery: any = null;
let api: any = null;

// Since Convex is not configured, we'll use mock data
console.warn("Convex not available, using real-time mock data");

const categories = [
  'All',
  'Andhra Specials',
  'Chef\'s Special',
  'Veg',
  'Non-Veg',
  'Rice Items',
  'Fast Food'
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [useMock, setUseMock] = useState(!useQuery || !api);
  const { addItem, openCart } = useCart();

  // Use real-time data for menu items
  const { data: realtimeMenuItems } = useRealtimeData(DATA_KEYS.MENU_ITEMS, getMockMenuItems());

  // Try to use Convex if available
  let menuItems: any = undefined;
  if (useQuery && api && !useMock) {
    try {
      menuItems = useQuery(api.menu.getMenuItems, {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchTerm || undefined,
      });
    } catch (error) {
      console.warn("Convex query failed, using real-time mock data");
      setUseMock(true);
    }
  }

  // Filter real-time data
  const getFilteredItems = () => {
    let items = realtimeMenuItems;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    return items;
  };

  const displayItems = useMock ? getFilteredItems() : menuItems;

  const handleAddToCart = (item: any) => {
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CartDrawer />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600">
            Discover our authentic Andhra cuisine and specialties
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories and Search */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Menu
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            {displayItems === undefined ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading menu items...</p>
              </div>
            ) : displayItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
              </div>
            ) : (
              <>
                {useMock && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Demo Mode:</strong> Using sample data. Set up Convex to use real database.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayItems.map((item: any) => (
                  <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.category === 'Veg' 
                            ? 'bg-green-100 text-green-800'
                            : item.category === 'Non-Veg'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-primary-600">₹{item.price}</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">4.5</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.is_available}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            item.is_available
                              ? 'bg-primary-600 hover:bg-primary-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>{item.is_available ? 'Add' : 'Unavailable'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}