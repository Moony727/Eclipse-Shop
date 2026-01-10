import { z } from "zod";
import xss from "xss";

// Helper to sanitize strings for XSS protection
const sanitizeString = (str: string) => xss(str.trim());

// Category schema
export const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.object({
    en: z.string().min(1, "English name is required").transform(sanitizeString),
    ru: z.string().min(1, "Russian name is required").transform(sanitizeString),
    az: z.string().min(1, "Azerbaijani name is required").transform(sanitizeString),
  }),
  subcategories: z.array(z.object({
    id: z.string().min(1, "Subcategory ID is required"),
    name: z.object({
      en: z.string().min(1, "English name is required").transform(sanitizeString),
      ru: z.string().min(1, "Russian name is required").transform(sanitizeString),
      az: z.string().min(1, "Azerbaijani name is required").transform(sanitizeString),
    }),
  })).optional(),
});

// Category ID validation
export const categoryIdSchema = z.string().min(1, "Category ID is required");

export type CategoryInput = z.infer<typeof categorySchema>;
