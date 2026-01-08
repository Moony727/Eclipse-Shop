import React from 'react'

export const metadata = {
  title: 'Privacy Policy — Eclipse Shop',
  description: 'Privacy policy for Eclipse Shop. Explains what data we collect and how we process it.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        This privacy policy explains what personal data we collect from you and how we use it.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">What we collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Account information you provide (email, display name)</li>
        <li>Order history and purchase receipts</li>
        <li>Minimal analytics data (if enabled) to improve our service</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How we use data</h2>
      <p className="mb-4">
        Data is used to provide and improve services, process purchases, and comply with legal obligations.
        We do not sell your personal data to third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Third-party services</h2>
      <p className="mb-4">
        Payments and analytics may be handled by third parties (Stripe, PayPal, Google Analytics).
        Review their privacy policies before use. We limit what we send to these providers.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact & data removal</h2>
      <p>
        To request deletion or portability of your data, contact{' '}
        <a href="mailto:privacy@eclipse-shop.example">privacy@eclipse-shop.example</a>.
      </p>
    </main>
  )
}
