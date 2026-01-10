import { adminAuth, adminDb, isAdminInitialized } from "@/lib/firebase/admin";

export async function verifyAdmin(token: string): Promise<void> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    throw new Error("Server configuration error");
  }

  const decodedToken = await adminAuth.verifyIdToken(token);
  const userId = decodedToken.uid;

  const userDoc = await adminDb.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  if (!userData?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
}
