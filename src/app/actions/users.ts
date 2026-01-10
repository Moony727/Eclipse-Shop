"use server";

import { adminAuth, adminDb, isAdminInitialized } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/utils/admin";
import { User } from "@/types";

/**
 * Admin: Get all users
 */
export async function getUsersForAdmin(
  token: string
): Promise<{ success: boolean; data?: User[]; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    await verifyAdmin(token);

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.get();

    const users: User[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as User;
    });

    return { success: true, data: users };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized or failed to fetch users";
    console.error("Error in getUsersForAdmin:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Admin: Toggle admin status for a user
 */
export async function toggleUserAdminStatus(
  userId: string,
  isAdmin: boolean,
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    await verifyAdmin(token);

    await adminDb.collection("users").doc(userId).update({
      isAdmin,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized or failed to update user status";
    console.error("Error in toggleUserAdminStatus:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
