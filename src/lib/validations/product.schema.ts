import { z } from "zod";
import xss from "xss";

// Helper to sanitize strings for XSS protection
const sanitizeString = (str: string) => xss(str.trim());

// Product creation/update schema
export const productSchema = z.object({
  name: z.object({
    en: z.string().min(3, "English name must be at least 3 characters").transform(sanitizeString),
    ru: z.string().min(3, "Russian name must be at least 3 characters").transform(sanitizeString),
    az: z.string().min(3, "Azerbaijani name must be at least 3 characters").transform(sanitizeString),
  }),
  description: z.object({
    en: z.string().min(10, "English description must be at least 10 characters").transform(sanitizeString),
    ru: z.string().min(10, "Russian description must be at least 10 characters").transform(sanitizeString),
    az: z.string().min(10, "Azerbaijani description must be at least 10 characters").transform(sanitizeString),
  }),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive("Discount price must be positive").optional(),
  category: z.enum(["software", "templates", "courses", "graphics"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  subcategory: z.string().min(1, "Subcategory is required").transform(sanitizeString),
  imageUrl: z.string().url("Invalid image URL"),
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    if (data.discountPrice) {
      return data.discountPrice < data.price;
    }
    return true;
  },
  {
    message: "Discount price must be less than regular price",
    path: ["discountPrice"],
  }
);

// Product ID validation
export const productIdSchema = z.string().min(1, "Product ID is required");

// Product filter schema
export const productFilterSchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
