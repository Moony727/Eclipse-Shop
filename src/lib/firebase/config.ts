import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only on client side
let app: FirebaseApp | undefined;
if (typeof window !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-api-key') {
  app = initializeApp(firebaseConfig);

  // Initialize App Check with reCAPTCHA v3
  // Only initialize if Site Key is available and not in development mode
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (siteKey && siteKey !== 'demo-key') {
    try {
      // In development, you can set debug token for testing without reCAPTCHA
      if (isDevelopment && process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN) {
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
      }
      
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      console.debug('App Check initialized successfully');
    } catch (error) {
      // App Check may already be initialized or not configured
      console.debug('App Check initialization:', error instanceof Error ? error.message : 'unknown error');
    }
  } else {
    console.debug('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not set or is demo key - App Check disabled');
  }
}

// Initialize Firebase services only on client
export const auth = (typeof window !== 'undefined' && app) ? getAuth(app) : null as unknown as Auth;
export const db = (typeof window !== 'undefined' && app) ? getFirestore(app) : null as unknown as Firestore;
export const storage = (typeof window !== 'undefined' && app) ? getStorage(app) : null as unknown as FirebaseStorage;

export default app;


