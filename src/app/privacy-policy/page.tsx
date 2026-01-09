"use client";

import React from 'react'
import { useLanguage } from '@/hooks/useLanguage';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const collectItems = ["Account information you provide (email, display name)", "Order history and purchase receipts", "Minimal analytics data (if enabled) to improve our service"];

  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{t("pages.privacy.title")}</h1>

      <p className="mb-4">
        {t("pages.privacy.intro")}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.privacy.collect")}</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Account information you provide (email, display name)</li>
        <li>Order history and purchase receipts</li>
        <li>Minimal analytics data (if enabled) to improve our service</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.privacy.use")}</h2>
      <p className="mb-4">
        {t("pages.privacy.useText")}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.privacy.thirdParty")}</h2>
      <p className="mb-4">
        {t("pages.privacy.thirdPartyText")}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{t("pages.privacy.dataRemoval")}</h2>
      <p>
        {t("pages.privacy.dataRemovalText")}{' '}
        <a href="mailto:privacy@eclipse-shop.example">privacy@eclipse-shop.example</a>.
      </p>
    </main>
  )
}
