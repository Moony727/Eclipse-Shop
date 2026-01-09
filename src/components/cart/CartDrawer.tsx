"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { CartItem } from "@/types";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { PurchaseModal } from "@/components/products/PurchaseModal";

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 h-[100dvh]">
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2 text-[var(--text-xl)] font-black">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShoppingCart className="w-5 h-5" />
            </div>
            {t("cart.title", "Shopping Cart")}
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0.5">{totalItems}</Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-sm">
            {totalItems === 0
              ? t("cart.empty", "Your cart is empty")
              : t("cart.description", "Review your items and proceed to checkout")
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground" />
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
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name.en}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-1">
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
                        <p className="text-xs text-muted-foreground">
                          {t(`categories.${item.product.category}`, item.product.category)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-background rounded-full border shadow-sm p-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-full p-0 hover:bg-muted"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="w-8 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-full p-0 hover:bg-muted"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-muted-foreground line-through opacity-50">
                            {item.product.discountPrice && item.product.price !== item.product.discountPrice && `${item.product.price.toFixed(2)} AZN`}
                          </div>
                          <div className="font-black text-primary">
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
            <div className="p-6 border-t bg-background shrink-0 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal", "Subtotal")}:</span>
                  <span className="font-medium">{totalPrice.toFixed(2)} AZN</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-xl)] font-black">
                  <span>{t("cart.total", "Total")}:</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} AZN</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || !user}
                  className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t("cart.processing", "Processing...")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      {t("cart.checkout", "Checkout Now")}
                    </div>
                  )}
                </Button>

                {!user && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                    <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
                      {t("cart.loginRequired", "Please log in to checkout")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={handlePurchaseModalClose}
        items={items}
        user={user}
      />
    </Sheet>
  );
}
