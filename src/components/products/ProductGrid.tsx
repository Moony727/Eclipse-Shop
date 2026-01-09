"use client";

import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { Product } from "@/types";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onPurchase?: (product: Product) => void; // Optional for backward compatibility
  isLoading: boolean;
}

export function ProductGrid({ products, onPurchase, isLoading }: ProductGridProps) {
  const { t } = useLanguage();

  // Sort products by category then subcategory
  const sortedProducts = [...products].sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;
    return a.subcategory.localeCompare(b.subcategory);
  });

  if (isLoading) {
    return (
      <div className="grid gap-4" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--gap-fluid-md)'
      }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 text-center bg-muted/30 rounded-2xl md:rounded-3xl border-2 border-dashed mx-4 md:mx-0">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-background rounded-full flex items-center justify-center shadow-lg mb-4 md:mb-6">
          <PackageSearch className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          {t("products.noProducts", "No Products Found")}
        </h3>
        <p className="text-sm md:text-base text-muted-foreground max-w-xs md:max-w-sm mx-auto mb-6 md:mb-8">
          {t("products.noProductsDesc", "Try adjusting your filters or search terms to find what you're looking for.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <span className="w-8 h-1 bg-primary rounded-full"></span>
          {t("products.title", "Our Collection")}
          <span className="text-sm font-normal text-muted-foreground ml-2">({products.length})</span>
        </h2>
      </div>

      <div className="grid animate-stagger" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--gap-fluid-md)'
      }}>
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
