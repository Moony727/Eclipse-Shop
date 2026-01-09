import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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

  // Set up reCAPTCHA container for Firebase Auth and App Check
  // This prevents the "placeholder element must be an element or id" error
  if (!document.getElementById('recaptcha-container')) {
    const container = document.createElement('div');
    container.id = 'recaptcha-container';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  // App Check removed as per user request
  // // Initialize App Check with reCAPTCHA v3
  // // Only initialize if Site Key is available
  // const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  // const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;

  // if ((siteKey && siteKey !== 'demo-key') || debugToken) {
  //   try {
  //     // In development with debug token
  //     if (debugToken) {
  //       (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  //       console.debug('App Check debug token set');
  //     }

  //     // Only initialize if we have a real site key (not debug mode)
  //     if (siteKey && siteKey !== 'demo-key') {
  //       initializeAppCheck(app, {
  //         provider: new ReCaptchaV3Provider(siteKey),
  //         isTokenAutoRefreshEnabled: true,
  //       });
  //       console.debug('App Check initialized with reCAPTCHA V3');
  //     }
  //   } catch (error) {
  //     // App Check may already be initialized or fail due to browser restrictions
  //     console.debug('App Check initialization:', error instanceof Error ? error.message : 'unknown error');
  //   }
  // }
}

// Initialize Firebase services only on client
export const auth = (typeof window !== 'undefined' && app) ? getAuth(app) : null as unknown as Auth;
export const db = (typeof window !== 'undefined' && app) ? getFirestore(app) : null as unknown as Firestore;
export const storage = (typeof window !== 'undefined' && app) ? getStorage(app) : null as unknown as FirebaseStorage;

export default app;


