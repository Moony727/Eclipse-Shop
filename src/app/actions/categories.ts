"use server";

import { adminAuth, adminDb, isAdminInitialized } from "@/lib/firebase/admin";
import { Category } from "@/types";
import { verifyAdmin } from "@/lib/utils/admin";
import { categorySchema, categoryIdSchema } from "@/lib/validations/category.schema";

/**
 * Get all categories
 */
export async function getCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
  try {
    if (!isAdminInitialized || !adminDb) {
      return { success: false, error: "Admin SDK not initialized" };
    }

    const categoriesRef = adminDb.collection("categories");
    const snapshot = await categoriesRef.get();

    const categories: Category[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

/**
 * Admin: Add category
 */
export async function addCategory(category: Partial<Category>, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAdminInitialized || !adminDb) {
      return { success: false, error: "Admin SDK not initialized" };
    }

    await verifyAdmin(token);

    const validation = categorySchema.safeParse(category);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    await adminDb.collection("categories").doc(validation.data.id).set(validation.data);
    return { success: true };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add category" };
  }
}

/**
 * Admin: Delete category
 */
export async function deleteCategory(categoryId: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAdminInitialized || !adminDb) {
      return { success: false, error: "Admin SDK not initialized" };
    }

    await verifyAdmin(token);

    const validation = categoryIdSchema.safeParse(categoryId);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    await adminDb.collection("categories").doc(validation.data).delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete category" };
  }
}
