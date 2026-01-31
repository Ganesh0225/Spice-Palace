import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMenuItems = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let menuItems = await ctx.db.query("menu_items").collect();

    // Filter by category if provided
    if (args.category && args.category !== "All") {
      menuItems = menuItems.filter(item => item.category === args.category);
    }

    // Filter by search term if provided
    if (args.search) {
      const searchTerm = args.search.toLowerCase();
      menuItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    return menuItems;
  },
});

export const getMenuItemById = query({
  args: { id: v.id("menu_items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createMenuItem = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image_url: v.string(),
    category: v.union(
      v.literal("Veg"),
      v.literal("Non-Veg"),
      v.literal("Rice Items"),
      v.literal("Fast Food"),
      v.literal("Andhra Specials"),
      v.literal("Chef's Special")
    ),
    is_available: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menu_items", args);
  },
});

export const updateMenuItem = mutation({
  args: {
    id: v.id("menu_items"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image_url: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("Veg"),
      v.literal("Non-Veg"),
      v.literal("Rice Items"),
      v.literal("Fast Food"),
      v.literal("Andhra Specials"),
      v.literal("Chef's Special")
    )),
    is_available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteMenuItem = mutation({
  args: { id: v.id("menu_items") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});