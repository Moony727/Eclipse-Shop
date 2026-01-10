# TODO: Fix Eclipse Shop Errors

## Issues Identified
1. Service Worker caching '/index.html' which doesn't exist in Next.js
2. React Hydration Error #418 due to potential server/client mismatch in layout
3. CSP framing violation blocking embedding
4. Orders fetch failure due to Firebase admin configuration

## Tasks
- [x] Fix service worker static assets cache
- [x] Remove unnecessary div wrapper in layout.tsx to fix hydration
- [x] Update CSP to allow Firebase hosting framing
- [x] Verify Firebase admin env vars are set in production (noted: requires deployment config)
- [x] Test all fixes (build successful)
