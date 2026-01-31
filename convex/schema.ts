import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  menu_items: defineTable({
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
  }),

  tables: defineTable({
    table_number: v.string(),
    status: v.union(
      v.literal("Available"),
      v.literal("Occupied"),
      v.literal("Reserved")
    ),
    seats: v.number(),
    position_x: v.number(),
    position_y: v.number(),
  }),

  bookings: defineTable({
    user_id: v.id("users"),
    table_id: v.id("tables"),
    date: v.string(),
    time_slot: v.string(),
    guest_count: v.number(),
    status: v.union(
      v.literal("Pending"),
      v.literal("Confirmed"),
      v.literal("Cancelled"),
      v.literal("Completed")
    ),
  }),

  orders: defineTable({
    user_id: v.id("users"),
    items: v.array(v.object({
      item_id: v.id("menu_items"),
      quantity: v.number(),
      price: v.number(),
    })),
    total_amount: v.number(),
    status: v.union(
      v.literal("Pending"),
      v.literal("Preparing"),
      v.literal("Served"),
      v.literal("Cancelled")
    ),
    payment_status: v.union(
      v.literal("Pending"),
      v.literal("Paid"),
      v.literal("Failed")
    ),
    order_type: v.union(
      v.literal("Dine-in"),
      v.literal("Delivery")
    ),
    delivery_address: v.optional(v.string()),
  }),

  reviews: defineTable({
    user_id: v.id("users"),
    rating: v.number(),
    comment: v.string(),
    is_visible: v.boolean(),
  }),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
  }).index("by_email", ["email"]),
});