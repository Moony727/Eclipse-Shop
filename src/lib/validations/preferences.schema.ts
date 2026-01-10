import { z } from "zod";

// User preferences schema
export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.enum(['en', 'ru', 'az']).optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
