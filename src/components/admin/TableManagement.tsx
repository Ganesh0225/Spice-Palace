import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';
import TableLayout from '../TableLayout';
import { mockTables } from '../../lib/mockTableData';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import { DATA_KEYS } from '../../lib/dataManager';

interface Reservation {
  id: string;
  tableId: string;
  tableName: string;
  userId: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  name: string;
  phone: string;
  specialRequests: string;
  status: string;
  createdAt: string;
}

export default function TableManagement() {
  const { data: tables, updateItem: updateTable } = useRealtimeData(DATA_KEYS.TABLES, mockTables);
  const { data: reservations, updateItem: updateReservation, addItem: addReservation } = useRealtimeData<Reservation>(DATA_KEYS.RESERVATIONS, []);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showReservations, setShowReservations] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeReservationTab, setActiveReservationTab] = useState<'today' | 'all'>('today');

  // Add some mock reservations for demo if none exist
  useEffect(() => {
    if (reservations.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const mockReservations: Reservation[] = [
        {
          id: 'RES001',
          tableId: 'table1',
          tableName: 'Table 1',
          userId: 'user1',
          date: today,
          timeSlot: '7:00 PM',
          guestCount: 4,
          name: 'John Doe',
          phone: '+91 98765 43210',
          specialRequests: 'Window seat preferred',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'RES002',
          tableId: 'table3',
          tableName: 'Table 3',
          userId: 'user2',
          date: today,
          timeSlot: '8:30 PM',
          guestCount: 2,
          name: 'Jane Smith',
          phone: '+91 87654 32109',
          specialRequests: '',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'RES003',
          tableId: 'table5',
          tableName: 'Table 5',
          userId: 'user3',
          date: tomorrow,
          timeSlot: '6:00 PM',
          guestCount: 6,
          name: 'Rajesh Kumar',
          phone: '+91 99887 76655',
          specialRequests: 'Birthday celebration - need cake arrangement',
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      ];

      // Add mock reservations
      mockReservations.forEach(reservation => {
        addReservation(reservation);
      });
    }
  }, [reservations.length, addReservation]);

  // Mock reservations for demo - use real-time reservations
  const todayReservations = reservations.filter((res: Reservation) => {
    const today = new Date().toISOString().split('T')[0];
    return res.date === today;
  });

  const allReservations = reservations;

  const confirmReservation = (reservationId: string) => {
    updateReservation(reservationId, (reservation: Reservation) => ({
      ...reservation,
      status: 'confirmed'
    }), 'id');
    setStatusMessage('Reservation confirmed successfully');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const cancelReservation = (reservationId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      updateReservation(reservationId, (reservation: Reservation) => ({
        ...reservation,
        status: 'cancelled'
      }), 'id');
      
      // Also free up the table if it was reserved
      const reservation = reservations.find((r: Reservation) => r.id === reservationId);
      if (reservation) {
        updateTable(reservation.tableId, (table: any) => ({
          ...table,
          status: 'Available'
        }));
      }
      
      setStatusMessage('Reservation cancelled successfully');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };
  const updateTableStatus = (tableId: string, newStatus: 'Available' | 'Occupied' | 'Reserved') => {
    const table = tables.find(t => t._id === tableId);
    if (table) {
      updateTable(tableId, (table: any) => ({
        ...table,
        status: newStatus
      }));
      
      // Show success message
      setStatusMessage(`${table.table_number} marked as ${newStatus}`);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const getStatusStats = () => {
    const available = tables.filter(t => t.status === 'Available').length;
    const occupied = tables.filter(t => t.status === 'Occupied').length;
    const reserved = tables.filter(t => t.status === 'Reserved').length;
    return { available, occupied, reserved, total: tables.length };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {statusMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          ✅ {statusMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Table Management</h2>
        <button
          onClick={() => setShowReservations(!showReservations)}
          className="btn-primary"
        >
          {showReservations ? 'View Tables' : 'View Reservations'}
        </button>
      </div>

      {!showReservations ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Reserved</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.reserved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Tables</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Layout */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Restaurant Floor Plan</h3>
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
                💡 Admin Mode: Click any table to manage its status
              </div>
            </div>
            <TableLayout
              tables={tables}
              onTableSelect={setSelectedTable}
              selectedTableId={selectedTable?._id}
              isInteractive={true}
              adminMode={true}
            />
          </div>

          {/* Selected Table Actions */}
          {selectedTable && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Manage {selectedTable.table_number}
                </h3>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ✕ Close
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Table Information</h4>
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                    <p><strong>Table:</strong> {selectedTable.table_number}</p>
                    <p><strong>Seats:</strong> {selectedTable.seats}</p>
                    <p><strong>Current Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedTable.status === 'Available' ? 'bg-green-100 text-green-800' :
                        selectedTable.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedTable.status}
                      </span>
                    </p>
                    <p><strong>Position:</strong> ({selectedTable.position_x}, {selectedTable.position_y})</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Change Status</h4>
                  <div className="space-y-3">
                    <div className="text-xs text-gray-600 mb-2 bg-blue-50 p-2 rounded">
                      💡 As admin, you can override any table status
                    </div>
                    <button
                      onClick={() => updateTableStatus(selectedTable._id, 'Available')}
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        selectedTable.status === 'Available'
                          ? 'bg-green-200 text-green-800 cursor-default'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {selectedTable.status === 'Available' ? '✓ Currently Available' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => updateTableStatus(selectedTable._id, 'Occupied')}
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        selectedTable.status === 'Occupied'
                          ? 'bg-red-200 text-red-800 cursor-default'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {selectedTable.status === 'Occupied' ? '✓ Currently Occupied' : 'Mark Occupied'}
                    </button>
                    <button
                      onClick={() => updateTableStatus(selectedTable._id, 'Reserved')}
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        selectedTable.status === 'Reserved'
                          ? 'bg-yellow-200 text-yellow-800 cursor-default'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {selectedTable.status === 'Reserved' ? '✓ Currently Reserved' : 'Mark Reserved'}
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-medium text-sm mb-2">Quick Actions</h5>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // Clear table and make available
                          updateTableStatus(selectedTable._id, 'Available');
                          setSelectedTable(null);
                        }}
                        className="flex-1 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
                      >
                        Clear & Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Reservations View */
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Reservations Management</h3>
            <div className="text-sm text-gray-600">
              Total: {allReservations.length} | Today: {todayReservations.length}
            </div>
          </div>
          
          {/* Reservation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button 
                  onClick={() => setActiveReservationTab('today')}
                  className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                    activeReservationTab === 'today'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Today ({todayReservations.length})
                </button>
                <button 
                  onClick={() => setActiveReservationTab('all')}
                  className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                    activeReservationTab === 'all'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Reservations ({allReservations.length})
                </button>
              </nav>
            </div>
          </div>
          
          {/* Reservations Content */}
          {(() => {
            const displayReservations = activeReservationTab === 'today' ? todayReservations : allReservations;
            const emptyMessage = activeReservationTab === 'today' 
              ? 'No reservations for today' 
              : 'No reservations found';
            
            return displayReservations.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{emptyMessage}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Reservations will appear here when customers make bookings
                </p>
                <button
                  onClick={() => setShowReservations(false)}
                  className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Back to Tables
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayReservations.map((reservation: Reservation) => (
                  <div key={reservation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-lg">{reservation.name}</h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Table:</strong> {reservation.tableName}</p>
                            <p><strong>Time:</strong> {reservation.timeSlot}</p>
                            <p><strong>Guests:</strong> {reservation.guestCount}</p>
                          </div>
                          <div>
                            <p><strong>Phone:</strong> {reservation.phone}</p>
                            <p><strong>Date:</strong> {reservation.date}</p>
                            <p><strong>ID:</strong> {reservation.id}</p>
                          </div>
                        </div>
                        
                        {reservation.specialRequests && (
                          <div className="mt-3 p-2 bg-blue-50 rounded">
                            <p className="text-sm"><strong>Special Requests:</strong> {reservation.specialRequests}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {reservation.status === 'pending' && (
                          <button 
                            onClick={() => confirmReservation(reservation.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {reservation.status !== 'cancelled' && (
                          <button 
                            onClick={() => cancelReservation(reservation.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}