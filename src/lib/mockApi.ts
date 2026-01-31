// Mock data for development when Convex is not set up
export const mockMenuItems = [
  {
    _id: "1",
    name: "Hyderabadi Biryani",
    description: "Aromatic basmati rice cooked with tender mutton and traditional spices",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400",
    category: "Andhra Specials",
    is_available: true,
  },
  {
    _id: "2",
    name: "Andhra Chicken Curry",
    description: "Spicy chicken curry with traditional Andhra spices and curry leaves",
    price: 280,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    category: "Andhra Specials",
    is_available: true,
  },
  {
    _id: "3",
    name: "Gongura Mutton",
    description: "Tender mutton cooked with tangy gongura leaves",
    price: 420,
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
    category: "Andhra Specials",
    is_available: true,
  },
  {
    _id: "4",
    name: "Pesarattu",
    description: "Green gram dosa served with ginger chutney",
    price: 120,
    image_url: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
    category: "Andhra Specials",
    is_available: true,
  },
  {
    _id: "5",
    name: "Signature Tandoori Platter",
    description: "Mixed tandoori platter with chicken, mutton, and prawns",
    price: 650,
    image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
    category: "Chef's Special",
    is_available: true,
  },
  {
    _id: "6",
    name: "Royal Thali",
    description: "Complete meal with variety of curries, rice, bread, and dessert",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    category: "Chef's Special",
    is_available: true,
  },
  {
    _id: "7",
    name: "Paneer Butter Masala",
    description: "Creamy tomato-based curry with soft paneer cubes",
    price: 220,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    category: "Veg",
    is_available: true,
  },
  {
    _id: "8",
    name: "Dal Tadka",
    description: "Yellow lentils tempered with cumin and spices",
    price: 150,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    category: "Veg",
    is_available: true,
  },
  {
    _id: "9",
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry",
    price: 320,
    image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
    category: "Non-Veg",
    is_available: true,
  },
  {
    _id: "10",
    name: "Jeera Rice",
    description: "Basmati rice flavored with cumin seeds",
    price: 120,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    category: "Rice Items",
    is_available: true,
  },
  {
    _id: "11",
    name: "Chicken Burger",
    description: "Grilled chicken patty with lettuce and mayo",
    price: 250,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Fast Food",
    is_available: true,
  },
  {
    _id: "12",
    name: "French Fries",
    description: "Crispy golden potato fries",
    price: 120,
    image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
    category: "Fast Food",
    is_available: true,
  },
];

export function getMockMenuItems(category?: string, search?: string) {
  let items = mockMenuItems;

  // Filter by category
  if (category && category !== "All") {
    items = items.filter(item => item.category === category);
  }

  // Filter by search
  if (search) {
    const searchTerm = search.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
    );
  }

  return items;
}