import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { SizeProvider } from "@/contexts/SizeContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eclipse-shop.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "Eclipse Shop - Premium Digital Marketplace",
    template: "%s | Eclipse Shop"
  },
  description: "Discover premium digital products, software, and services designed to elevate your business and creativity. Shop templates, software, courses, and more.",
  keywords: ["digital products", "software", "templates", "education", "design", "marketplace", "premium", "professional"],
  authors: [{ name: "Eclipse Shop Team" }],
  creator: "Eclipse Shop",
  publisher: "Eclipse Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Eclipse Shop - Premium Digital Marketplace',
    description: 'Discover premium digital products, software, and services designed to elevate your business and creativity.',
    siteName: 'Eclipse Shop',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Eclipse Shop - Premium Digital Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eclipse Shop - Premium Digital Marketplace',
    description: 'Discover premium digital products, software, and services designed to elevate your business and creativity.',
    images: ['/og-image.jpg'],
    creator: '@eclipse_shop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#000000" />
        {/* SEO & safety meta tags: description & robots ensure indexing and clear intent.
            The `referrer` and security-related meta values further help browsers
            behave safely. For legal/trust signals we provide links to /privacy-policy and /terms. */}
        <meta name="description" content="Discover premium digital products, software, and services designed to elevate your business and creativity. Secure shopping and clear privacy practices." />
        <meta name="robots" content="index,follow" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Non-standard, human-readable flag for quick scanners — not relied upon by search engines
            but useful for site verbiage crawlers. */}
        <meta name="data-collection" content="no-personal-data-collected-except-account-and-order-info" />
      </head>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        {/* Load safe initialization script: preloads resources, registers service worker, handles theme */}
        <script src="/init-app.js" defer></script>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="eclipse-theme"
          >
            <SizeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <CartProvider>
                    <div id="root">
                      {children}
                    </div>
                    <Toaster key="main-toaster" position="bottom-right" expand={true} richColors />
                  </CartProvider>
                </AuthProvider>
              </LanguageProvider>
            </SizeProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
