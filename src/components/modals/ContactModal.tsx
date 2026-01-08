"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalProps } from "@/types";

export function ContactModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Get in touch — we&apos;re here to help.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            For general inquiries, please email <strong>support@eclipse-shop.example</strong>.
            For partnership or press, reach out to <strong>partners@eclipse-shop.example</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Support Hours</h4>
              <p className="text-sm text-muted-foreground">Mon — Fri: 09:00 — 18:00 (UTC)</p>
            </div>
            <div>
              <h4 className="font-medium">Phone</h4>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
