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
import { ShoppingCart, Phone, CreditCard, Send, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

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
      toast.error(t("purchase.contactRequired"));
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
        toast.error(result.error || t("purchase.failedOrder"));
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(t("purchase.failedOrder"));
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

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success(t("purchase.orderIdCopied"));
    }
  };



  if (orderId) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] sm:max-w-md p-0 overflow-y-auto max-h-[95vh] border-0 bg-transparent shadow-none scrollbar-none">
          <div className="bg-card border-2 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="bg-primary/5 p-6 sm:p-8 text-center space-y-4">
              <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative bg-green-500 rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <DialogTitle className="text-lg sm:text-[calc(1.25rem*var(--ui-scale))] md:text-[calc(1.5rem*var(--ui-scale))] font-black tracking-tight">
                  {t("purchase.orderReceived", "Order Received!")}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] text-muted-foreground font-medium">
                  {t("purchase.orderThanks", "Thank you for your purchase. Your order has been registered and is being processed.")}
                </DialogDescription>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-muted/50 border-2 border-border/50 p-4 sm:p-6 rounded-2xl flex flex-col items-center gap-2">
                  <p className="text-[10px] sm:text-[calc(0.625rem*var(--ui-scale))] font-black uppercase tracking-[0.2em] text-muted-foreground">Reference ID</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl sm:text-[calc(1.5rem*var(--ui-scale))] md:text-[calc(1.75rem*var(--ui-scale))] font-mono font-black text-primary tracking-tighter">{orderId}</p>
                    <Button variant="ghost" size="icon" onClick={copyOrderId} className="h-8 w-8 rounded-full hover:bg-primary/10">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-2xl p-4 flex gap-3 sm:gap-4 items-start">
                <div className="p-2 rounded-lg bg-amber-500 text-white flex-shrink-0">
                  {contactType === 'whatsapp' ? <Phone className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] font-bold text-amber-700 dark:text-amber-400">{t("purchase.nextSteps")}</p>
                  <p className="text-[10px] sm:text-[calc(0.625rem*var(--ui-scale))] md:text-[calc(0.75rem*var(--ui-scale))] text-amber-600/80 dark:text-amber-500/80 font-medium leading-relaxed">
                    {t("purchase.keepId", "Please keep this ID. Our team will contact you via {contactType} shortly to deliver your product.").replace("{contactType}", contactType.toUpperCase())}
                  </p>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full h-12 sm:h-12 md:h-14 rounded-2xl text-base md:text-lg font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
                {t("common.backToShop", "Continue Shopping")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-y-auto max-h-[95vh] border-2 rounded-[1.5rem] sm:rounded-[2rem] bg-card shadow-2xl scrollbar-none">
        <DialogHeader className="p-5 sm:p-8 pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 text-primary">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <Badge variant="outline" className="rounded-full border-2 px-2 sm:px-3 py-0.5 sm:py-1 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>
          <DialogTitle className="text-lg sm:text-[calc(1.25rem*var(--ui-scale))] md:text-[calc(1.5rem*var(--ui-scale))] font-black tracking-tight">
            {t("purchase.title")}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] font-medium">
            {t("purchase.completeOrderDetails")}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
          {/* Order Summary - More compact & fire */}
          <div className="bg-muted/30 border-2 border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[10px] sm:text-sm uppercase tracking-widest text-muted-foreground/70">{t("purchase.orderSummary", "Summary")}</h3>
              <span className="text-[9px] sm:text-xs font-bold text-primary px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary/5 rounded-lg border border-primary/10">{t("purchase.secureCheckout")}</span>
            </div>

            <div className="space-y-3 max-h-32 sm:max-h-40 overflow-y-auto pr-2 scrollbar-none">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 sm:gap-4 items-center">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 border-background shadow-sm">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name[language]}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm line-clamp-1">
                      {item.product.name[language]}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                      {(item.product.discountPrice || item.product.price).toFixed(2)} AZN × {item.quantity}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm font-black">
                    {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t-2 border-dashed border-border/50">
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-muted-foreground/70">{t("purchase.total", "Total Amount")}</span>
              <div className="text-base sm:text-[calc(1.125rem*var(--ui-scale))] md:text-[calc(1.25rem*var(--ui-scale))] font-black text-primary">
                {items.reduce((sum, item) =>
                  sum + (item.product.discountPrice || item.product.price) * item.quantity, 0
                ).toFixed(2)} <span className="text-[10px] sm:text-xs">AZN</span>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <form onSubmit={handlePurchase} className="space-y-4 sm:space-y-5">
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="customer-name" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">
                  {t("purchase.fullName")}
                </Label>
                <Input
                  id="customer-name"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-10 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-2 focus-visible:ring-primary/20 bg-muted/20"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">{t("purchase.contactMethod")}</Label>
                <RadioGroup 
                  value={contactType} 
                  onValueChange={(v) => setContactType(v as 'whatsapp' | 'telegram')}
                  className="flex h-10 sm:h-10 md:h-12 gap-1.5 sm:gap-2 p-1 bg-muted/30 rounded-lg sm:rounded-xl border-2"
                >
                  <div className="flex-1">
                    <RadioGroupItem value="whatsapp" id="whatsapp" className="sr-only" />
                    <Label 
                      htmlFor="whatsapp" 
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 h-full rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 ${
                        contactType === 'whatsapp' ? 'bg-card text-primary shadow-sm font-black' : 'text-muted-foreground font-bold hover:bg-card/50'
                      }`}
                    >
                      <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> <span className="text-[10px] sm:text-xs">WhatsApp</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="telegram" id="telegram" className="sr-only" />
                    <Label 
                      htmlFor="telegram" 
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 h-full rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 ${
                        contactType === 'telegram' ? 'bg-card text-primary shadow-sm font-black' : 'text-muted-foreground font-bold hover:bg-card/50'
                      }`}
                    >
                      <Send className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> <span className="text-[10px] sm:text-xs">Telegram</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="contact-id" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">
                {contactType === 'whatsapp' ? t("purchase.whatsapp") : t("purchase.telegramId")}
              </Label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {contactType === 'whatsapp' ? <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Send className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
                </div>
                <Input
                  id="contact-id"
                  placeholder={contactType === 'whatsapp' ? t("purchase.placeholderWhatsapp") : t("purchase.placeholderTelegram")}
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  required
                  className="h-10 sm:h-10 md:h-12 pl-10 sm:pl-11 rounded-lg sm:rounded-xl border-2 focus-visible:ring-primary/20 bg-muted/20"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium ml-1">
                {t("purchase.requiredContact")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10 sm:h-12 md:h-14 flex-1 rounded-xl sm:rounded-2xl font-bold border-2 active:scale-95 transition-all text-xs sm:text-sm"
                disabled={isProcessing}
              >
                {t("purchase.cancel")}
              </Button>
              
              <Button
                type="submit"
                className="h-10 sm:h-12 md:h-14 flex-1 rounded-xl sm:rounded-2xl font-black shadow-xl shadow-primary/20 active:scale-95 transition-all text-xs sm:text-sm"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-2 border-current border-t-transparent" />
                    {t("purchase.processing")}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CreditCard className="w-4 sm:w-5 h-4 sm:h-5" />
                    {t("purchase.confirm")}
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            <CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
            {t("purchase.instantDelivery")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}