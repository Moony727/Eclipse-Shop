import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/workspace-*/image/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Security headers: configured for highest security. CSP is strict without unsafe directives.
  // Note: Removing 'unsafe-inline' may break Next.js hydration; if so, implement nonce-based CSP.
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Content-Security-Policy',
            // Strict CSP without unsafe directives for highest security
            value:
              "default-src 'self'; " +
              "script-src 'self' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net https://apis.google.com https://challenge.cloudflare.com; " +
              "style-src 'self' https://fonts.googleapis.com https://www.gstatic.com; " +
              "font-src 'self' https://fonts.gstatic.com data:; " +
              "img-src 'self' data: blob: https: https://images.pexels.com https://storage.googleapis.com https://firebasestorage.googleapis.com https://replicate.delivery https://res.cloudinary.com; " +
              "connect-src 'self' https://*.googleapis.com https://*.firebasestorage.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://*.vercel.app https://api.telegram.org https://res.cloudinary.com https://www.google.com https://www.gstatic.com https://apis.google.com wss://*.firebase.com; " +
              "frame-src https://www.google.com https://recaptcha.google.com https://challenge.cloudflare.com; " +
              "frame-ancestors 'self'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "manifest-src 'self'; " +
              "worker-src 'self'; " +
              "upgrade-insecure-requests;",
          },
          // CORS restricted to your domain
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://eclipseshop.xyz',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Cache control for sensitive routes
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        // Additional restrictions for admin routes
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
}

export default nextConfig
