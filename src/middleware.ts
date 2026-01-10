import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate nonce for CSP
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

  // Set CSP header with nonce
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net https://apis.google.com https://challenge.cloudflare.com",
    "style-src 'self' https://fonts.googleapis.com https://www.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: https://images.pexels.com https://storage.googleapis.com https://firebasestorage.googleapis.com https://replicate.delivery https://res.cloudinary.com",
    "connect-src 'self' https://*.googleapis.com https://*.firebasestorage.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://*.vercel.app https://api.telegram.org https://res.cloudinary.com https://www.google.com https://www.gstatic.com https://apis.google.com wss://*.firebase.com",
    "frame-src https://www.google.com https://recaptcha.google.com https://challenge.cloudflare.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  const response = NextResponse.next();

  // Set headers
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);

  // Only protect /api/* routes
  if (!pathname.startsWith('/api/')) {
    return response;
  }

  // Skip auth for certain routes if needed, but for now, require auth for all /api/*
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    await adminAuth?.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
