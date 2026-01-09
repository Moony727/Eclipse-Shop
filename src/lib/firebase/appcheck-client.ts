import { getToken } from 'firebase/app-check';
import app from '@/lib/firebase/config';

let cachedAppCheckToken: string | null = null;
let tokenExpiration: number | null = null;

/**
 * Get valid App Check token from Firebase
 * Tokens are cached and automatically refreshed when they expire
 */
export async function getAppCheckToken(): Promise<string | null> {
  try {
    // Check if we have a cached token that's still valid
    if (cachedAppCheckToken && tokenExpiration && Date.now() < tokenExpiration) {
      return cachedAppCheckToken;
    }

    if (!app) {
      console.warn('Firebase app not initialized');
      return null;
    }

    // Note: getToken requires App Check to be initialized first
    // This is done in config.ts
    const tokenResult = await getToken(app as any, true); // Force refresh
    
    if (tokenResult && (tokenResult as any).token) {
      cachedAppCheckToken = (tokenResult as any).token;
      // App Check tokens typically expire in 1 hour (3600000ms)
      // Cache for 55 minutes to refresh before expiration
      tokenExpiration = Date.now() + (55 * 60 * 1000);
      return cachedAppCheckToken;
    }

    return null;
  } catch (error) {
    // App Check might not be initialized or available
    console.debug('App Check token unavailable:', error);
    return null;
  }
}

/**
 * Make a fetch request with App Check token in headers
 */
export async function fetchWithAppCheck(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const token = await getAppCheckToken();

  const headers = {
    ...options?.headers,
    ...(token && { 'X-Firebase-AppCheck': token }),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

