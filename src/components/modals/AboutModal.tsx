"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalProps } from "@/types";

export function AboutModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>About Eclipse Shop</DialogTitle>
          <DialogDescription>
            Learn more about our mission and the team behind Eclipse Shop.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Eclipse Shop is a curated marketplace for premium digital goods — memberships,
            software, ingame value and accounts. Our mission is to
            make high-quality digital products accessible to creators and gamers worldwide.
          </p>

          <p>
            Founded in 2025, our team focuses on product quality, secure checkout,
            and excellent support. We work with creators to showcase their best
            work and help customers find the tools they need.
          </p>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
