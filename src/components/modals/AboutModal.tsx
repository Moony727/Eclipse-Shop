"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalProps } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";

export function AboutModal({ isOpen, onClose }: ModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden">
        <DialogHeader className="space-y-[calc(0.5rem*var(--ui-scale))]">
          <DialogTitle className="text-[var(--text-2xl)] font-bold">{t("modals.aboutTitle", "About Eclipse Shop")}</DialogTitle>
          <DialogDescription className="text-[calc(0.875rem*var(--ui-scale))]">
            {t("modals.aboutDescription", "Learn more about our mission and the team behind Eclipse Shop.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-[calc(1rem*var(--ui-scale))] mt-[calc(1rem*var(--ui-scale))]">
          <p className="text-[calc(1rem*var(--ui-scale))] leading-relaxed">
            {t("modals.aboutContent1", "Eclipse Shop is a curated marketplace for premium digital goods — templates, software, creative assets and educational products. Our mission is to make high-quality digital products accessible to creators and businesses worldwide.")}
          </p>

          <p className="text-[calc(1rem*var(--ui-scale))] leading-relaxed">
            {t("modals.aboutContent2", "Founded in 2024, our team focuses on product quality, secure checkout, and excellent support. We work with creators to showcase their best work and help customers find the tools they need.")}
          </p>

          <div className="flex justify-end pt-[calc(0.5rem*var(--ui-scale))]">
            <Button onClick={onClose} className="h-[calc(2.5rem*var(--ui-scale))] px-[calc(1.25rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))]">{t("modals.close", "Close")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
