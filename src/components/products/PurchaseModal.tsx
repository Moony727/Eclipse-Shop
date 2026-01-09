"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { User, CartItem } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Phone, CreditCard, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  user: User | null;
}

export function PurchaseModal({ isOpen, onClose, items = [], user }: PurchaseModalProps) {
  const { language, t } = useLanguage();
  const { clearCart } = useCart();
  const [contactId, setContactId] = useState("");
  const [contactType, setContactType] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 || !user) return;

    if (!contactId.trim()) {
      toast.error("Please enter your WhatsApp number or Telegram ID");
      return;
    }

    setIsProcessing(true);

    try {
      const { createOrder } = await import("@/app/actions/orders");

      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
        originalPrice: item.product.price,
        productName: item.product.name,
      }));

      const totalAmount = items.reduce((sum, item) =>
        sum + (item.product.discountPrice || item.product.price) * item.quantity, 0
      );

      const result = await createOrder({
        items: orderItems,
        contactId: contactId.trim(),
        contactType,
        customerName: customerName.trim(),
        userId: user.uid,
        userEmail: user.email,
        userName: user.name,
        totalAmount,
      });

      if (result.success && result.data) {
        setOrderId(result.data.orderId);
        clearCart(); // Clear cart after successful order
        toast.success(t("purchase.success"));
      } else {
        toast.error(result.error || "Failed to process order. Please try again.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOrderId(null);
    setContactId("");
    setCustomerName("");
    onClose();
  };



  if (orderId) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center py-10">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />
            <DialogTitle className="text-2xl font-bold">Order Received!</DialogTitle>
            <DialogDescription className="text-lg">
              Thank you for your purchase. Your order has been registered.
            </DialogDescription>
            <div className="bg-muted p-4 rounded-lg w-full mt-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Order ID</p>
              <p className="text-2xl font-mono font-black text-primary">{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please save this ID. We will contact you via {contactType} shortly.
            </p>
            <Button onClick={handleClose} className="w-full mt-6">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            {t("purchase.title")}
          </DialogTitle>
          <DialogDescription className="text-center">
            Complete your purchase to get instant access to this digital product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">{t("purchase.orderSummary", "Order Summary")}</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name[language]}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {item.product.name[language]}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {(item.product.discountPrice || item.product.price).toFixed(2)} AZN × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)} AZN
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t text-lg font-bold">
              <span>{t("purchase.total", "Total")}:</span>
              <span className="text-primary">
                {items.reduce((sum, item) =>
                  sum + (item.product.discountPrice || item.product.price) * item.quantity, 0
                ).toFixed(2)} AZN
              </span>
            </div>
          </div>

          {/* Purchase Form */}
          <form onSubmit={handlePurchase} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name" className="flex items-center">
                Your Name (Optional)
              </Label>
              <Input
                id="customer-name"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Contact Method</Label>
              <RadioGroup 
                value={contactType} 
                onValueChange={(v) => setContactType(v as 'whatsapp' | 'telegram')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="w-4 h-4 text-green-500" /> WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telegram" id="telegram" />
                  <Label htmlFor="telegram" className="flex items-center gap-2 cursor-pointer">
                    <Send className="w-4 h-4 text-blue-500" /> Telegram
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-id" className="flex items-center">
                {contactType === 'whatsapp' ? 'WhatsApp Number' : 'Telegram ID / Username'}
              </Label>
              <Input
                id="contact-id"
                placeholder={contactType === 'whatsapp' ? '+994 XX XXX XX XX' : '@username or ID'}
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll contact you via {contactType} to deliver your product.
              </p>
            </div>

            {/* Customer Info */}
            {user && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Customer Information</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                {t("purchase.cancel")}
              </Button>
              
              <Button
                type="submit"
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("purchase.processing")}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t("purchase.confirm")}
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="text-xs text-muted-foreground text-center border-t pt-4">
            Your payment is secure and encrypted. You&apos;ll receive instant access after purchase.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}