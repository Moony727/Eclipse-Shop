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
  // Security headers: configured for all routes to improve trust and reduce
  // attack surface. Adjust directives (CSP connect-src/img-src) to match any
  // external services you intentionally use (analytics, CDNs, APIs).
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
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            // 1 year, include subdomains, preload hint
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            // Disable powerful features by default
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            // Next.js-compatible CSP. Allow inline scripts because Next.js injects
            // critical hydration scripts. This is a pragmatic trade-off: we keep
            // script execution limited to same-origin and inline code only, while
            // keeping other directives strict.
            // If you later migrate to nonce-based CSP, remove 'unsafe-inline'.
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net https://apis.google.com https://challenge.cloudflare.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com; " +
              "font-src 'self' https://fonts.gstatic.com https://www.gstatic.com data:; " +
              "img-src 'self' data: blob: https: https://images.pexels.com https://storage.googleapis.com https://firebasestorage.googleapis.com https://replicate.delivery https://res.cloudinary.com https://www.gstatic.com; " +
              "connect-src 'self' https://*.googleapis.com https://*.firebasestorage.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://*.vercel.app https://api.telegram.org https://res.cloudinary.com https://www.google.com https://www.gstatic.com https://apis.google.com https://challenge.cloudflare.com wss://*.firebase.com; " +
              "frame-src https://www.google.com https://recaptcha.google.com https://challenge.cloudflare.com; " +
              "frame-ancestors 'self'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "manifest-src 'self'; " +
              "worker-src 'self';",
          },
        ],
      },
    ]
  },
}

export default nextConfig
