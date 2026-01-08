import { adminAuth } from "@/lib/firebase/admin";

export async function verifyAdmin(token: string): Promise<void> {
  const decodedToken = await adminAuth.verifyIdToken(token);
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.includes(decodedToken.email || '')) {
    throw new Error("Unauthorized: Admin access required");
  }
}
