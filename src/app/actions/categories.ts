"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { Category } from "@/types";

/**
 * Get all categories
 */
export async function getCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
  try {
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
    await adminAuth.verifyIdToken(token);
    if (!category.id) throw new Error("Category ID is required");
    await adminDb.collection("categories").doc(category.id).set(category);
    return { success: true };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false, error: "Failed to add category" };
  }
}

/**
 * Admin: Delete category
 */
export async function deleteCategory(categoryId: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    await adminAuth.verifyIdToken(token);
    await adminDb.collection("categories").doc(categoryId).delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
