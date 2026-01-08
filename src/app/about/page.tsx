import React from 'react'

export const metadata = {
  title: 'About — Eclipse Shop',
  description: 'About Eclipse Shop — who we are, mission, and contact information.',
}

export default function AboutPage() {
  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">About Eclipse Shop</h1>
      <p className="mb-4">
        Eclipse Shop is a curated marketplace for premium digital products — templates,
        plugins, courses, and other developer/designer tools. Our mission is to provide
        high-quality digital goods and a secure shopping experience.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Security & Trust</h2>
      <p className="mb-3">
        We prioritize user safety. All payments are processed by trusted third-party
        providers (Stripe, PayPal, etc.) and we never collect payment card data on our servers.
        We use HTTPS everywhere and follow best practices for data protection.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Contact</h2>
      <p>
        If you believe content on this site is harmful or noticed any security issue,
        contact us at <a href="mailto:security@eclipse-shop.example">security@eclipse-shop.example</a>.
      </p>
    </main>
  )
}
