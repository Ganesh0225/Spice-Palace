import { useState } from 'react';
import { Users, CheckCircle } from 'lucide-react';

interface Table {
  _id: string;
  table_number: string;
  status: 'Available' | 'Occupied' | 'Reserved';
  seats: number;
  position_x: number;
  position_y: number;
}

interface TableLayoutProps {
  tables: Table[];
  onTableSelect?: (table: Table) => void;
  selectedTableId?: string;
  isInteractive?: boolean;
  adminMode?: boolean; // Allow interaction with all tables regardless of status
}

export default function TableLayout({ 
  tables, 
  onTableSelect, 
  selectedTableId, 
  isInteractive = true,
  adminMode = false
}: TableLayoutProps) {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const getTableColor = (table: Table) => {
    if (selectedTableId === table._id) {
      return 'bg-primary-600 border-primary-700 text-white';
    }
    
    switch (table.status) {
      case 'Available':
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'Occupied':
        return adminMode 
          ? 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200 cursor-pointer'
          : 'bg-red-100 border-red-300 text-red-800 cursor-not-allowed';
      case 'Reserved':
        return adminMode 
          ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200 cursor-pointer'
          : 'bg-yellow-100 border-yellow-300 text-yellow-800 cursor-not-allowed';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTableSize = (seats: number) => {
    if (seats <= 2) return 'w-16 h-16';
    if (seats <= 4) return 'w-20 h-20';
    if (seats <= 6) return 'w-24 h-24';
    return 'w-28 h-28';
  };

  const handleTableClick = (table: Table) => {
    if (!isInteractive) return;
    
    // In admin mode, allow clicking on all tables
    // In customer mode, only allow clicking on available tables
    if (!adminMode && table.status !== 'Available') return;
    
    onTableSelect?.(table);
  };

  return (
    <div className="relative bg-gray-50 rounded-lg p-8 min-h-96">
      {/* Restaurant Layout Background */}
      <div className="absolute inset-4 bg-white rounded-lg border-2 border-gray-200">
        {/* Kitchen Area */}
        <div className="absolute top-4 left-4 right-4 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
          <span className="text-gray-600 font-medium">🍳 Kitchen</span>
        </div>

        {/* Entrance */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-300">
          <span className="text-blue-600 text-sm font-medium">🚪 Entry</span>
        </div>

        {/* Tables */}
        {tables.map((table) => (
          <div
            key={table._id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getTableSize(table.seats)} 
              ${getTableColor(table)} border-2 rounded-lg flex flex-col items-center justify-center
              transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md`}
            style={{
              left: `${table.position_x}px`,
              top: `${table.position_y}px`,
            }}
            onClick={() => handleTableClick(table)}
            onMouseEnter={() => setHoveredTable(table._id)}
            onMouseLeave={() => setHoveredTable(null)}
          >
            <span className="font-bold text-sm">{table.table_number}</span>
            <div className="flex items-center text-xs mt-1">
              <Users className="w-3 h-3 mr-1" />
              <span>{table.seats}</span>
            </div>
            
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1">
              {table.status === 'Available' && (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              )}
              {table.status === 'Occupied' && (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              {table.status === 'Reserved' && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}

        {/* Hover tooltip */}
        {hoveredTable && (
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-2 rounded-lg text-sm z-10">
            {(() => {
              const table = tables.find(t => t._id === hoveredTable);
              if (!table) return null;
              return (
                <div>
                  <p className="font-medium">{table.table_number}</p>
                  <p className="text-xs opacity-90">{table.seats} seats • {table.status}</p>
                  {((table.status === 'Available' && isInteractive) || (adminMode && isInteractive)) && (
                    <p className="text-xs text-green-300 mt-1">
                      {adminMode ? 'Click to manage' : 'Click to select'}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border">
        <h4 className="font-medium text-sm mb-2">Table Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Reserved</span>
          </div>
        </div>
      </div>

      {/* Selected Table Info */}
      {selectedTableId && (
        <div className="absolute top-4 right-4 bg-primary-600 text-white rounded-lg p-3 shadow-md">
          {(() => {
            const selectedTable = tables.find(t => t._id === selectedTableId);
            if (!selectedTable) return null;
            return (
              <div className="text-sm">
                <div className="flex items-center mb-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Selected</span>
                </div>
                <p>{selectedTable.table_number}</p>
                <p className="text-xs opacity-90">{selectedTable.seats} seats</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}