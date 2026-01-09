# Firebase App Check Configuration Guide

## What is Firebase App Check?

Firebase App Check helps protect your backend resources (Firestore, Cloud Functions, etc.) from abuse by verifying that requests come from a legitimate app.

## Setup Steps

### 1. Create reCAPTCHA v3 Keys

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **App Check** in the left sidebar
4. Click **Create Key** or use existing reCAPTCHA v3 key
5. If you don't have one, create a new reCAPTCHA v3 site at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)

### 2. Add Environment Variables

Add these to your `.env.local` file:

```env
# Firebase App Check - reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### 3. Register App with App Check

In Firebase Console:

1. Go to App Check
2. Click on **Apps** tab
3. Select your web app
4. Click the "Choose provider" button
5. Select "reCAPTCHA v3"
6. Enter your reCAPTCHA site key
7. Enable enforcement (this will enforce App Check on your backend)

### 4. Update Firestore Rules (if needed)

The rules have been updated to:
- Allow public read on products and categories
- Require authentication for user-specific operations
- Accept requests with valid App Check tokens

### 5. Test the Setup

1. Build and deploy: `npm run build`
2. Start development: `npm run dev`
3. Try to:
   - View products (should work - public read)
   - Sign in (should work)
   - Create an order (should work - authenticated + App Check)

### Troubleshooting

**"unverified" or "permission-denied" errors:**

1. Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in `.env.local`
2. Verify the key matches your Firebase project's App Check configuration
3. Check browser console for App Check errors
4. Ensure Firestore rules allow your operation

**Development/Testing:**

During development, you can:
- Disable App Check enforcement in Firebase Console (for testing)
- Or use the debug token approach by setting `window.FIREBASE_APPCHECK_DEBUG_TOKEN`

**In production:**

Always enable App Check enforcement in Firebase Console for maximum security.

## Files Modified

- `src/lib/firebase/config.ts` - Added App Check initialization
- `src/lib/firebase/appcheck-client.ts` - Client-side token management
- `src/lib/firebase/appcheck-server.ts` - Server-side token utilities
- `firestore.rules` - Updated rules for App Check

## Related Documentation

- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
