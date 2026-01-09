"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalProps } from "@/types";

export function ContactModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader className="space-y-[calc(0.5rem*var(--ui-scale))]">
          <DialogTitle className="text-[var(--text-2xl)] font-bold">Contact Us</DialogTitle>
          <DialogDescription className="text-[calc(0.875rem*var(--ui-scale))]">
            Get in touch — we&apos;re here to help.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-[calc(1rem*var(--ui-scale))] mt-[calc(1rem*var(--ui-scale))]">
          <p className="text-[calc(1rem*var(--ui-scale))] leading-relaxed">
            For general inquiries, please email <strong className="text-primary">support@eclipse-shop.example</strong>.
            For partnership or press, reach out to <strong className="text-primary">partners@eclipse-shop.example</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[calc(1rem*var(--ui-scale))]">
            <div className="p-[calc(0.75rem*var(--ui-scale))] rounded-xl bg-muted/50">
              <h4 className="font-bold text-[calc(0.875rem*var(--ui-scale))] mb-1">Support Hours</h4>
              <p className="text-[calc(0.75rem*var(--ui-scale))] text-muted-foreground">Mon — Fri: 09:00 — 18:00 (UTC)</p>
            </div>
            <div className="p-[calc(0.75rem*var(--ui-scale))] rounded-xl bg-muted/50">
              <h4 className="font-bold text-[calc(0.875rem*var(--ui-scale))] mb-1">Phone</h4>
              <p className="text-[calc(0.75rem*var(--ui-scale))] text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex justify-end pt-[calc(0.5rem*var(--ui-scale))]">
            <Button onClick={onClose} className="h-[calc(2.5rem*var(--ui-scale))] px-[calc(1.25rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))]">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
