"use client";

import React from 'react'
import { useLanguage } from '@/hooks/useLanguage';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{t("pages.terms.title")}</h1>

      <p className="mb-4">
        {t("pages.terms.intro")}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.terms.permitted")}</h2>
      <p className="mb-4">
        {t("pages.terms.permittedText")}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.terms.refunds")}</h2>
      <p className="mb-4">
        {t("pages.terms.refundsText")}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.terms.contact")}</h2>
      <p>
        {t("pages.terms.contactText")} <a href="mailto:legal@eclipse-shop.example">legal@eclipse-shop.example</a>.
      </p>
    </main>
  )
}
