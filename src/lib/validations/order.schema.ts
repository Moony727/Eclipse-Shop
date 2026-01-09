import { z } from "zod";

// Order item schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive("Original price must be positive"),
  productName: z.object({
    en: z.string(),
    ru: z.string(),
    az: z.string(),
  }),
});

// Order creation schema (supports multiple items)
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  contactId: z.string().min(1, "WhatsApp or Telegram ID is required"),
  contactType: z.enum(["whatsapp", "telegram"]),
  customerName: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  userEmail: z.string().email("Invalid email address"),
  userName: z.string().min(1, "User name is required"),
  totalAmount: z.number().positive("Total amount must be positive"),
  // Legacy fields for backward compatibility
  productId: z.string().optional(),
  productName: z.object({
    en: z.string(),
    ru: z.string(),
    az: z.string(),
  }).optional(),
});

// Order update schema
export const updateOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.enum(["requested", "process", "completed", "cancelled"], {
    errorMap: () => ({ message: "Invalid order status" }),
  }),
});

// Order filter schema
export const orderFilterSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(["requested", "process", "completed", "cancelled"]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderFilter = z.infer<typeof orderFilterSchema>;
