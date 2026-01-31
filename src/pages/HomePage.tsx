import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-secondary-400">Spice Palace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience the authentic flavors of Andhra cuisine with our traditional recipes 
              and modern dining experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/menu" 
                className="btn-secondary text-lg px-8 py-3 inline-block"
              >
                View Menu
              </Link>
              <Link 
                to="/reservations" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Reserve Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Spice Palace?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring you the finest dining experience with authentic flavors and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Flavors</h3>
              <p className="text-gray-600">
                Traditional Andhra recipes passed down through generations, prepared with the finest spices
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
              <p className="text-gray-600">
                Fast and efficient service without compromising on quality and taste
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-600">
                Conveniently located in the heart of the city with easy parking and accessibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Dishes</h2>
            <p className="text-lg text-gray-600">
              Taste our most loved dishes that keep customers coming back
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400" 
                alt="Hyderabadi Biryani"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Hyderabadi Biryani</h3>
              <p className="text-gray-600 mb-4">
                Aromatic basmati rice cooked with tender mutton and traditional spices
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">₹350</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">4.8</span>
                </div>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" 
                alt="Andhra Chicken Curry"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Andhra Chicken Curry</h3>
              <p className="text-gray-600 mb-4">
                Spicy chicken curry with traditional Andhra spices and curry leaves
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">₹280</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">4.7</span>
                </div>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" 
                alt="Signature Tandoori Platter"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Signature Tandoori Platter</h3>
              <p className="text-gray-600 mb-4">
                Mixed tandoori platter with chicken, mutton, and prawns
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">₹650</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">4.9</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/menu" className="btn-primary text-lg px-8 py-3">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Us Today</h2>
            <p className="text-lg opacity-90">
              Experience the taste of authentic Andhra cuisine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="opacity-90">
                123 Spice Street<br />
                Hyderabad, Telangana 500001
              </p>
            </div>
            
            <div>
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="opacity-90">
                +91 98765 43210<br />
                +91 87654 32109
              </p>
            </div>
            
            <div>
              <Clock className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="opacity-90">
                Mon - Sun: 11:00 AM - 11:00 PM<br />
                Kitchen closes at 10:30 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}