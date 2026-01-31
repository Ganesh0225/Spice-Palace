import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationsPage from './pages/ReservationsPage'
import ReviewsPage from './pages/ReviewsPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import AdminDashboard from './pages/AdminDashboard'
import DebugSync from './components/DebugSync'
import CartProvider from './context/CartContext'
import AuthProvider from './context/AuthContext'
import './App.css'

// Create Convex client with fallback
const convexUrl = import.meta.env.VITE_CONVEX_URL;
let convex: ConvexReactClient | null = null;

try {
  if (convexUrl && convexUrl !== "https://your-deployment-url.convex.cloud") {
    convex = new ConvexReactClient(convexUrl);
  }
} catch (error) {
  console.warn("Convex not configured, using mock data");
}

function AppContent() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <DebugSync />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  if (convex) {
    return (
      <ConvexProvider client={convex}>
        <AppContent />
      </ConvexProvider>
    );
  }

  // Fallback without Convex
  return <AppContent />;
}

export default App