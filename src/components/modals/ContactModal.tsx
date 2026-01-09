"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalProps } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";

export function ContactModal({ isOpen, onClose }: ModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("contact.title")}</DialogTitle>
          <DialogDescription>
            {t("contact.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            {t("contact.general")} <strong>xmoony609@gmail.com</strong>.
            {" "}{t("contact.partnership")} <strong>xmoony609@gmail.com</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">{t("contact.supportHours")}</h4>
              <p className="text-sm text-muted-foreground">{t("contact.supportHoursText")}</p>
            </div>
            <div>
              <h4 className="font-medium">{t("contact.phone")}</h4>
              <p className="text-sm text-muted-foreground">+994 051 334 73 02</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>{t("common.close")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
