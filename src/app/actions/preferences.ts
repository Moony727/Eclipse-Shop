"use server";

import { adminAuth, adminDb, isAdminInitialized } from "@/lib/firebase/admin";

/**
 * Update user preferences (theme and language)
 */
export async function updateUserPreferences(
  preferences: { theme?: 'light' | 'dark' | 'system'; language?: 'en' | 'ru' | 'az' },
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const updateData: Record<string, any> = {};
    if (preferences.theme !== undefined) {
      updateData.theme = preferences.theme;
    }
    if (preferences.language !== undefined) {
      updateData.language = preferences.language;
    }

    await adminDb.collection("users").doc(userId).update(updateData);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update user preferences";
    console.error("Error in updateUserPreferences:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(
  token: string
): Promise<{ success: boolean; data?: { theme?: 'light' | 'dark' | 'system'; language?: 'en' | 'ru' | 'az' }; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }

    const userData = userDoc.data();
    const preferences = {
      theme: userData?.theme,
      language: userData?.language,
    };

    return { success: true, data: preferences };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch user preferences";
    console.error("Error in getUserPreferences:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
