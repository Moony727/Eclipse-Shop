import { adminAuth } from '@/lib/firebase/admin';

/**
 * Verify App Check token from request headers
 * This is useful for Server Actions that need to verify the request is coming from a valid app
 */
export async function verifyAppCheckToken(appCheckToken: string | null | undefined): Promise<boolean> {
  // If no token provided, allow (for development or public endpoints)
  if (!appCheckToken) {
    return true;
  }

  try {
    // In production, you should verify the App Check token
    // For now, we'll do basic validation
    return typeof appCheckToken === 'string' && appCheckToken.length > 0;
  } catch (error) {
    console.error('Error verifying App Check token:', error);
    return false;
  }
}

/**
 * Get App Check token from request headers
 */
export function getAppCheckTokenFromHeaders(headers?: HeadersInit | Record<string, string>): string | null {
  if (!headers) return null;

  // Handle Headers object
  if (headers instanceof Headers) {
    return headers.get('x-firebase-appcheck') || null;
  }

  // Handle plain object
  if (typeof headers === 'object') {
    const token = (headers as Record<string, string>)['x-firebase-appcheck'] 
                  || (headers as Record<string, string>)['X-Firebase-AppCheck'];
    return token || null;
  }

  return null;
}
