"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { CartItem } from "@/types";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { PurchaseModal } from "@/components/products/PurchaseModal";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const isMobile = useIsMobile();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      toast.success(t("cart.removed", "Item removed from cart"));
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsOpen(false);
    setShowPurchaseModal(true);
  };

  const handlePurchaseModalClose = () => {
    setShowPurchaseModal(false);
    // Clear cart after successful purchase (this will be handled by the modal)
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  const CartContent = () => (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className={`${isMobile ? 'p-[calc(1rem*var(--ui-scale))] border-b' : 'p-[calc(1.5rem*var(--ui-scale))] border-b'} shrink-0`}>
        <div className="flex items-center gap-[calc(0.5rem*var(--ui-scale))] text-[var(--text-xl)] font-black">
          <div className="p-[calc(0.5rem*var(--ui-scale))] rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="w-[calc(1.25rem*var(--ui-scale))] h-[calc(1.25rem*var(--ui-scale))]" />
          </div>
          {t("cart.title", "Shopping Cart")}
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-auto rounded-full px-[calc(0.5rem*var(--ui-scale))] py-[calc(0.125rem*var(--ui-scale))] text-[calc(0.75rem*var(--ui-scale))]">{totalItems}</Badge>
          )}
        </div>
        <p className="text-[calc(0.875rem*var(--ui-scale))] text-muted-foreground mt-[calc(0.25rem*var(--ui-scale))]">
          {totalItems === 0
            ? t("cart.empty", "Your cart is empty")
            : t("cart.description", "Review your items and proceed to checkout")
          }
        </p>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Cart Items */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-[calc(1rem*var(--ui-scale))]' : 'p-[calc(1.5rem*var(--ui-scale))]'} scrollbar-none`}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[var(--text-lg)] font-bold">
                  {t("cart.emptyTitle", "Your cart is empty")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("cart.emptyDescription", "Add some products to get started")}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-[var(--space-4)]">
              {items.map((item: CartItem) => (
                <div key={item.product.id} className="group flex gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-300">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name.en}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-[var(--text-base)] line-clamp-1">
                          {item.product.name[language] || item.product.name.en}
                        </h4>
                        <button
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.success(t("cart.removed", "Item removed"));
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {t(`categories.${item.product.category}`, item.product.category)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center bg-background rounded-full border shadow-sm p-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0 hover:bg-muted"
                        >
                          <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </Button>

                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold">
                          {item.quantity}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0 hover:bg-muted"
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-primary text-sm sm:text-base">
                          {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)} AZN
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <div className={`${isMobile ? 'p-[calc(1rem*var(--ui-scale))]' : 'p-[calc(1.5rem*var(--ui-scale))]'} border-t bg-background shrink-0 space-y-[calc(1rem*var(--ui-scale))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`}>
            <div className="space-y-[calc(0.25rem*var(--ui-scale))]">
              <div className="flex items-center justify-between text-[var(--text-xl)] font-black">
                <span>{t("cart.total", "Total")}:</span>
                <span className="text-primary">{totalPrice.toFixed(2)} AZN</span>
              </div>
            </div>

            <div className="space-y-[calc(0.75rem*var(--ui-scale))]">
              <Button
                onClick={handleCheckout}
                disabled={isProcessing || !user}
                className="w-full h-[calc(2.75rem*var(--ui-scale))] sm:h-[calc(3rem*var(--ui-scale))] rounded-xl text-[calc(0.875rem*var(--ui-scale))] sm:text-[calc(1rem*var(--ui-scale))] font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-[calc(0.5rem*var(--ui-scale))]">
                    <div className="animate-spin rounded-full h-[calc(1rem*var(--ui-scale))] w-[calc(1rem*var(--ui-scale))] border-b-2 border-white"></div>
                    {t("cart.processing", "Processing...")}
                  </div>
                ) : (
                  <div className="flex items-center gap-[calc(0.5rem*var(--ui-scale))]">
                    <CreditCard className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))] sm:w-[calc(1.25rem*var(--ui-scale))] h-[calc(1.25rem*var(--ui-scale))]" />
                    {t("cart.checkout", "Checkout Now")}
                  </div>
                )}
              </Button>

              {!user && (
                <div className="p-[calc(0.5rem*var(--ui-scale))] rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                  <p className="text-[calc(0.625rem*var(--ui-scale))] sm:text-[calc(0.75rem*var(--ui-scale))] text-amber-700 dark:text-amber-400 text-center font-medium">
                    {t("cart.loginRequired", "Please log in to checkout")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {children}
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col p-0">
            <CartContent />
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            {children}
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-hidden flex flex-col p-0">
            <CartContent />
          </SheetContent>
        </Sheet>
      )}

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={handlePurchaseModalClose}
        items={items}
        user={user}
      />
    </>
  );
}
