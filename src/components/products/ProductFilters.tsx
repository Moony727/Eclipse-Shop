"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, Filter } from "lucide-react";
import { Category } from "@/types";
import { CategoryFilter } from "./CategoryFilter";

interface ProductFiltersProps {
  categories?: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onSearchChange: (query: string) => void;
}

export function ProductFilters({
  categories: customCategories,
  selectedCategory,
  selectedSubcategory,
  searchQuery,
  onCategoryChange,
  onSubcategoryChange,
  onSearchChange,
}: ProductFiltersProps) {
  const { t } = useLanguage();

  const categories = customCategories || [];

  const clearFilters = () => {
    onCategoryChange('all');
    onSubcategoryChange('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('products.search', 'Search products...')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Category Filter Component */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-80">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={onCategoryChange}
            onSubcategoryChange={onSubcategoryChange}
            onClear={clearFilters}
          />
        </div>

        {/* Info Section */}
        {categories.length > 0 && (
          <div className="flex-1 p-4 bg-muted rounded-lg border text-sm text-muted-foreground">
            <p className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" />
              <strong>Filter Guide:</strong>
            </p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Select a category to see its subcategories</li>
              <li>Categories are organized hierarchically</li>
              <li>Subcategories help narrow down your search</li>
              <li>Click the category button to expand/collapse</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}