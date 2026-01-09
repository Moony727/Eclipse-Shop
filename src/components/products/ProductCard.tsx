"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { ProductCardProps } from "@/types";
import { ShoppingCart, ExternalLink, ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: Omit<ProductCardProps, 'onPurchase'>) {
  const { language, t } = useLanguage();
  const { addItem } = useCart();

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-0 bg-card hover:bg-card/50 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1" style={{ containerType: 'inline-size' }}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name[language]}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full font-semibold shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300"
            onClick={() => {
              addItem(product);
              toast.success(t("cart.added", "Added to cart"));
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("cart.add", "Add to Cart")}
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive font-bold shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}
          <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-0 shadow-lg">
            {t(`categories.${product.category}`, product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="flex-1 space-y-3" style={{ padding: 'var(--space-fluid-lg)' }}>
        <div className="space-y-1">
          <h3 className="font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors" style={{ fontSize: 'var(--text-fluid-xl)' }}>
            {product.name[language]}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t(`categories.${product.category}`, product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}</span>
            <span>→</span>
            <span>{t(`subcategories.${product.subcategory}`, product.subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {product.description[language]}
          </p>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="font-black text-primary" style={{ fontSize: 'var(--text-fluid-2xl)' }}>
                {product.discountPrice?.toFixed(2)} AZN
              </span>
              <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                {product.price.toFixed(2)} AZN
              </span>
            </div>
          ) : (
            <span className="font-black text-primary" style={{ fontSize: 'var(--text-fluid-2xl)' }}>
              {product.price.toFixed(2)} AZN
            </span>
          )}
        </div>
      </CardContent>
      
      {/* Footer */}
      <CardFooter className="pt-0" style={{ padding: 'var(--space-fluid-lg)', paddingTop: 0 }}>
        <Button
          onClick={() => {
            addItem(product);
            toast.success(t("cart.added", "Added to cart"));
          }}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] transition-all duration-300 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("cart.add", "Add to Cart")}
          <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </Button>
      </CardFooter>
    </Card>
  );
}
