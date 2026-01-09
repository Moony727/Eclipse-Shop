"use client";

import React from 'react'
import { useLanguage } from '@/hooks/useLanguage';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{t("pages.about.title")}</h1>
      <p className="mb-4">
        {t("pages.about.intro")}
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t("pages.about.security")}</h2>
      <p className="mb-3">
        {t("pages.about.securityText")}
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t("pages.about.contact")}</h2>
      <p>
        {t("pages.about.contactText")} <a href="mailto:security@eclipse-shop.example">security@eclipse-shop.example</a>.
      </p>
    </main>
  )
}
