export const mockTables = [
  // Front area tables (near entrance)
  { _id: 'table1', table_number: 'T1', status: 'Available' as const, seats: 2, position_x: 150, position_y: 320 },
  { _id: 'table2', table_number: 'T2', status: 'Available' as const, seats: 2, position_x: 250, position_y: 320 },
  { _id: 'table3', table_number: 'T3', status: 'Occupied' as const, seats: 4, position_x: 350, position_y: 320 },
  { _id: 'table4', table_number: 'T4', status: 'Available' as const, seats: 4, position_x: 450, position_y: 320 },

  // Middle area tables
  { _id: 'table5', table_number: 'T5', status: 'Reserved' as const, seats: 6, position_x: 150, position_y: 220 },
  { _id: 'table6', table_number: 'T6', status: 'Available' as const, seats: 4, position_x: 300, position_y: 220 },
  { _id: 'table7', table_number: 'T7', status: 'Available' as const, seats: 4, position_x: 450, position_y: 220 },

  // Back area tables (quieter section)
  { _id: 'table8', table_number: 'T8', status: 'Available' as const, seats: 2, position_x: 120, position_y: 140 },
  { _id: 'table9', table_number: 'T9', status: 'Occupied' as const, seats: 8, position_x: 300, position_y: 140 },
  { _id: 'table10', table_number: 'T10', status: 'Available' as const, seats: 6, position_x: 480, position_y: 140 },

  // VIP corner tables
  { _id: 'table11', table_number: 'VIP1', status: 'Available' as const, seats: 4, position_x: 550, position_y: 180 },
  { _id: 'table12', table_number: 'VIP2', status: 'Reserved' as const, seats: 6, position_x: 550, position_y: 260 },
];

export const timeSlots = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
];

export const guestOptions = [
  { value: 1, label: '1 Guest' },
  { value: 2, label: '2 Guests' },
  { value: 3, label: '3 Guests' },
  { value: 4, label: '4 Guests' },
  { value: 5, label: '5 Guests' },
  { value: 6, label: '6 Guests' },
  { value: 7, label: '7 Guests' },
  { value: 8, label: '8+ Guests' },
];