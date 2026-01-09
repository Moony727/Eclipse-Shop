"use client";

import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";
import { Product, Category } from "@/types";
import { getPublicProducts } from "@/app/actions/products";

interface ShopSectionProps {
  initialProducts: Product[];
  categories: Category[];
  defaultCategory?: string;
  title?: string;
}

type FilterState = {
  category: string;
  subcategory: string;
  search: string;
};

/**
 * A reusable shop section template that includes:
 * - Dynamic Title
 * - Category/Subcategory Filters
 * - Dynamic Responsive Grid
 * - Product Cards
 */
export function ShopSection({ 
  initialProducts, 
  categories, 
  defaultCategory = "all",
  title = "Our Products" 
}: ShopSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: defaultCategory,
    subcategory: "all",
    search: "",
  });

  const handleFilterChange = async (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    const result = await getPublicProducts({
      category: newFilters.category,
      subcategory: newFilters.subcategory,
    });

    if (result.success && result.data) {
      // Apply client-side search if needed
      let filtered = result.data;
      if (newFilters.search) {
        const searchLower = newFilters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.en.toLowerCase().includes(searchLower) ||
          p.name.ru.toLowerCase().includes(searchLower) ||
          p.name.az.toLowerCase().includes(searchLower)
        );
      }
      setProducts(filtered);
    }
    setIsLoading(false);
  };

  // Removed handlePurchase as products now use cart

  return (
    <section className="space-y-[var(--space-8)]">
      <div className="flex flex-col gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-[var(--text-3xl)] md:text-[var(--text-4xl)] font-black tracking-tight">{title}</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Explore our curated selection of high-quality digital products.
          </p>
        </div>
        
        <div className="w-full">
          <ProductFilters 
            categories={categories}
            selectedCategory={filters.category}
            selectedSubcategory={filters.subcategory}
            searchQuery={filters.search}
            onCategoryChange={(c) => handleFilterChange({...filters, category: c})}
            onSubcategoryChange={(s) => handleFilterChange({...filters, subcategory: s})}
            onSearchChange={(q) => handleFilterChange({...filters, search: q})}
          />
        </div>
      </div>

      <ProductGrid
        products={products}
        isLoading={isLoading}
      />
    </section>
  );
}
