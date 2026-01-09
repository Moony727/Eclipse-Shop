"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {t("cart.title", "Shopping Cart")}
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? t("cart.empty", "Your cart is empty")
              : t("cart.description", "Review your items and proceed to checkout")
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("cart.emptyTitle", "Your cart is empty")}
                </h3>
                <p className="text-muted-foreground">
                  {t("cart.emptyDescription", "Add some products to get started")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name.en}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium line-clamp-2">
                        {item.product.name.en}
                      </h4>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.success(t("cart.removed", "Item removed"));
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {(item.product.discountPrice || item.product.price).toFixed(2)} AZN each
                        </span>
                        <span className="font-semibold">
                          {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)} AZN
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t("cart.total", "Total")}:</span>
                <span>{totalPrice.toFixed(2)} AZN</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || !user}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t("cart.processing", "Processing...")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {t("cart.checkout", "Checkout")}
                    </div>
                  )}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    {t("cart.loginRequired", "Please log in to checkout")}
                  </p>
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
