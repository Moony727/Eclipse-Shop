import React from 'react'

export const metadata = {
  title: 'Terms of Service — Eclipse Shop',
  description: 'Terms and conditions for using Eclipse Shop.',
}

export default function TermsPage() {
  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

      <p className="mb-4">
        By using Eclipse Shop you agree to these terms. This document outlines permitted
        use, intellectual property, and liabilities. It is a short summary — consult the
        full legal document where required.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Permitted Use</h2>
      <p className="mb-4">
        You may use content for personal or commercial projects as described on each product page.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Refunds and Purchases</h2>
      <p className="mb-4">
        Purchases are handled by third-party processors. Refunds are managed according to
        the vendor policy listed on product pages.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        For questions about terms contact <a href="mailto:legal@eclipse-shop.example">legal@eclipse-shop.example</a>.
      </p>
    </main>
  )
}
