import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TableLayout from '../components/TableLayout';
import { mockTables, timeSlots, guestOptions } from '../lib/mockTableData';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { DATA_KEYS } from '../lib/dataManager';
import AuthModal from '../components/AuthModal';

export default function ReservationsPage() {
  const { state: authState } = useAuth();
  const { data: tables, updateItem: updateTable } = useRealtimeData(DATA_KEYS.TABLES, mockTables);
  const { addItem: addReservation } = useRealtimeData<any>(DATA_KEYS.RESERVATIONS, []);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: '',
    timeSlot: '',
    guestCount: 2,
    name: authState.user?.name || '',
    phone: '',
    specialRequests: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationId, setReservationId] = useState('');

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setReservationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedTable) {
      alert('Please select a table from the layout');
      return;
    }

    // Create reservation
    const reservation = {
      id: `RES${Date.now()}`,
      tableId: selectedTable._id,
      tableName: selectedTable.table_number,
      userId: authState.user?._id,
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Add reservation to real-time data
    addReservation(reservation);

    // Update table status to reserved
    updateTable(selectedTable._id, (table: any) => ({
      ...table,
      status: 'Reserved'
    }));

    setReservationId(reservation.id);
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your table has been reserved successfully.
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-green-800 mb-2">Reservation Details</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Reservation ID:</strong> {reservationId}</p>
                <p><strong>Table:</strong> {selectedTable?.table_number}</p>
                <p><strong>Date:</strong> {reservationData.date}</p>
                <p><strong>Time:</strong> {reservationData.timeSlot}</p>
                <p><strong>Guests:</strong> {reservationData.guestCount}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedTable(null);
                  setReservationData({
                    date: '',
                    timeSlot: '',
                    guestCount: 2,
                    name: authState.user?.name || '',
                    phone: '',
                    specialRequests: '',
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                New Reservation
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Table Reservations</h1>
          <p className="text-lg text-gray-600">
            Reserve your table for an unforgettable dining experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Table Layout - Takes up 2 columns */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Select Your Table</h2>
                {selectedTable && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Table {selectedTable.table_number} selected</span>
                  </div>
                )}
              </div>
              
              <TableLayout
                tables={tables}
                onTableSelect={handleTableSelect}
                selectedTableId={selectedTable?._id}
                isInteractive={true}
              />
              
              {!selectedTable && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium">How to reserve:</p>
                    <p>Click on any green (available) table above to select it, then fill out the reservation form.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reservation Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Reservation Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={reservationData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Time
                    </label>
                    <select 
                      name="timeSlot"
                      value={reservationData.timeSlot}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Number of Guests
                    </label>
                    <select
                      name="guestCount"
                      value={reservationData.guestCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {guestOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={reservationData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={reservationData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={reservationData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special requirements or dietary restrictions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!selectedTable}
                  className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!authState.isAuthenticated ? 'Sign In & Reserve Table' : 'Reserve Table'}
                </button>
                
                {!selectedTable && (
                  <p className="text-sm text-gray-500 text-center">
                    Please select a table from the layout above
                  </p>
                )}
              </form>
            </div>
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Restaurant Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">123 Spice Street, Hyderabad, Telangana 500001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-600">Mon - Sun: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Policies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Reservation Policies</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reservations can be made up to 30 days in advance</li>
                <li>• Please arrive within 15 minutes of your reservation time</li>
                <li>• Cancellations must be made at least 2 hours in advance</li>
                <li>• Large parties (8+) may require a deposit</li>
                <li>• We hold tables for 15 minutes past reservation time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}