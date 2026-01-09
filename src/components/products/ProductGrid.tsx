"use client";

import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { Product } from "@/types";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const { t } = useLanguage();

  // Sort products by category then subcategory
  const sortedProducts = [...products].sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;
    return a.subcategory.localeCompare(b.subcategory);
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[var(--space-12)] md:py-[var(--space-16)] px-[var(--space-4)] text-center bg-muted/30 rounded-2xl md:rounded-3xl border-2 border-dashed mx-4 md:mx-0">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-background rounded-full flex items-center justify-center shadow-lg mb-[var(--space-4)] md:mb-[var(--space-6)]">
          <PackageSearch className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-[var(--text-xl)] md:text-[var(--text-2xl)] font-bold mb-2">
          {t("products.noProducts", "No Products Found")}
        </h3>
        <p className="text-[var(--text-base)] text-muted-foreground max-w-xs md:max-w-sm mx-auto mb-[var(--space-8)]">
          {t("products.noProductsDesc", "Try adjusting your filters or search terms to find what you're looking for.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--space-8)] animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--text-3xl)] md:text-[var(--text-4xl)] font-black tracking-tight flex items-center gap-3">
          <span className="w-10 h-1.5 bg-primary rounded-full"></span>
          {t("products.title", "Our Collection")}
          <span className="text-base font-normal text-muted-foreground ml-2">({products.length})</span>
        </h2>
      </div>

      <div
        key={products.map(p => p.id).join(',')}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in zoom-in-95 duration-500"
      >
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
