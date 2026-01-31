import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Clear existing data
    const existingItems = await ctx.db.query("menu_items").collect();
    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    const existingTables = await ctx.db.query("tables").collect();
    for (const table of existingTables) {
      await ctx.db.delete(table._id);
    }

    // Seed menu items
    const menuItems = [
      // Andhra Specials
      {
        name: "Hyderabadi Biryani",
        description: "Aromatic basmati rice cooked with tender mutton and traditional spices",
        price: 350,
        image_url: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400",
        category: "Andhra Specials" as const,
        is_available: true,
      },
      {
        name: "Andhra Chicken Curry",
        description: "Spicy chicken curry with traditional Andhra spices and curry leaves",
        price: 280,
        image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
        category: "Andhra Specials" as const,
        is_available: true,
      },
      {
        name: "Gongura Mutton",
        description: "Tender mutton cooked with tangy gongura leaves",
        price: 420,
        image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
        category: "Andhra Specials" as const,
        is_available: true,
      },
      {
        name: "Pesarattu",
        description: "Green gram dosa served with ginger chutney",
        price: 120,
        image_url: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
        category: "Andhra Specials" as const,
        is_available: true,
      },

      // Chef's Special
      {
        name: "Signature Tandoori Platter",
        description: "Mixed tandoori platter with chicken, mutton, and prawns",
        price: 650,
        image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
        category: "Chef's Special" as const,
        is_available: true,
      },
      {
        name: "Royal Thali",
        description: "Complete meal with variety of curries, rice, bread, and dessert",
        price: 450,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        category: "Chef's Special" as const,
        is_available: true,
      },

      // Veg Items
      {
        name: "Paneer Butter Masala",
        description: "Creamy tomato-based curry with soft paneer cubes",
        price: 220,
        image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
        category: "Veg" as const,
        is_available: true,
      },
      {
        name: "Dal Tadka",
        description: "Yellow lentils tempered with cumin and spices",
        price: 150,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        category: "Veg" as const,
        is_available: true,
      },
      {
        name: "Aloo Gobi",
        description: "Dry curry with potatoes and cauliflower",
        price: 180,
        image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        category: "Veg" as const,
        is_available: true,
      },

      // Non-Veg Items
      {
        name: "Butter Chicken",
        description: "Creamy tomato-based chicken curry",
        price: 320,
        image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
        category: "Non-Veg" as const,
        is_available: true,
      },
      {
        name: "Fish Curry",
        description: "Fresh fish cooked in coconut-based curry",
        price: 380,
        image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        category: "Non-Veg" as const,
        is_available: true,
      },

      // Rice Items
      {
        name: "Jeera Rice",
        description: "Basmati rice flavored with cumin seeds",
        price: 120,
        image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        category: "Rice Items" as const,
        is_available: true,
      },
      {
        name: "Veg Fried Rice",
        description: "Stir-fried rice with mixed vegetables",
        price: 180,
        image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        category: "Rice Items" as const,
        is_available: true,
      },

      // Fast Food
      {
        name: "Chicken Burger",
        description: "Grilled chicken patty with lettuce and mayo",
        price: 250,
        image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        category: "Fast Food" as const,
        is_available: true,
      },
      {
        name: "French Fries",
        description: "Crispy golden potato fries",
        price: 120,
        image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
        category: "Fast Food" as const,
        is_available: true,
      },
    ];

    for (const item of menuItems) {
      await ctx.db.insert("menu_items", item);
    }

    // Seed tables
    const tables = [
      { table_number: "T1", status: "Available" as const, seats: 2, position_x: 100, position_y: 100 },
      { table_number: "T2", status: "Available" as const, seats: 4, position_x: 250, position_y: 100 },
      { table_number: "T3", status: "Occupied" as const, seats: 6, position_x: 400, position_y: 100 },
      { table_number: "T4", status: "Available" as const, seats: 2, position_x: 100, position_y: 250 },
      { table_number: "T5", status: "Reserved" as const, seats: 4, position_x: 250, position_y: 250 },
      { table_number: "T6", status: "Available" as const, seats: 8, position_x: 400, position_y: 250 },
      { table_number: "T7", status: "Available" as const, seats: 2, position_x: 100, position_y: 400 },
      { table_number: "T8", status: "Available" as const, seats: 4, position_x: 250, position_y: 400 },
    ];

    for (const table of tables) {
      await ctx.db.insert("tables", table);
    }

    return { message: "Database seeded successfully!" };
  },
});