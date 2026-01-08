"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { ProductCardProps } from "@/types";
import { ShoppingCart, ExternalLink, ArrowRight } from "lucide-react";

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  const { language, t } = useLanguage();

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-0 bg-card hover:bg-card/50 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name[language]}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full font-semibold shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300"
            onClick={() => onPurchase(product)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t("products.quickView", "Quick View")}
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
            {t(`categories.${product.category}`)}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="flex-1 p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.name[language]}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {product.description[language]}
          </p>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-primary">
                ${product.discountPrice?.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-black text-primary">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      
      {/* Footer */}
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onPurchase(product)}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] transition-all duration-300 active:scale-95"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t("products.buy")}
          <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </Button>
      </CardFooter>
    </Card>
  );
}
