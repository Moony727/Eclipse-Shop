"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, Filter } from "lucide-react";

import { Category } from "@/types";

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
  const { t, language } = useLanguage();

  const categories = [
    { id: 'all', name: t('products.all') },
    ...(customCategories?.map(c => ({ id: c.id, name: c.name[language] })) || [
      { id: 'software', name: t('categories.software') },
      { id: 'templates', name: t('categories.templates') },
      { id: 'education', name: t('categories.education') },
      { id: 'design', name: t('categories.design') },
      { id: 'media', name: t('categories.media') },
    ])
  ];

  const currentCategory = customCategories?.find(c => c.id === selectedCategory);
  const subcategories = [
    { id: 'all', name: t('products.all') },
    ...(currentCategory?.subcategories.map(s => ({ id: s.id, name: s.name[language] })) || [
      { id: 'productivity', name: t('subcategories.productivity') },
      { id: 'marketing', name: t('subcategories.marketing') },
      { id: 'courses', name: t('subcategories.courses') },
      { id: 'ui-kits', name: t('subcategories.ui-kits') },
      { id: 'photos', name: t('subcategories.photos') },
      { id: 'wordpress', name: t('subcategories.wordpress') },
    ])
  ];

  const clearFilters = () => {
    onCategoryChange('all');
    onSubcategoryChange('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-6 mb-8" style={{ gap: 'var(--space-fluid-xl)' }}>
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('products.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Category Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {t('products.category')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-sm"
          >
            {t('common.clear')}
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-max min-w-full gap-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-shrink-0"
                  style={{ fontSize: 'var(--text-fluid-sm)' }}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Subcategory Filters */}
        {selectedCategory !== 'all' && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">{t('products.subcategory')}</h4>
            <Tabs value={selectedSubcategory} onValueChange={onSubcategoryChange}>
              <div className="overflow-x-auto pb-2">
                <TabsList className="inline-flex w-max min-w-full gap-1">
                  {subcategories.map((subcategory) => (
                  <TabsTrigger
                    key={subcategory.id}
                    value={subcategory.id}
                    className="flex-shrink-0"
                    style={{ fontSize: 'var(--text-fluid-sm)' }}
                  >
                      {subcategory.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery) && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          )}
          {selectedSubcategory !== 'all' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
              {subcategories.find(s => s.id === selectedSubcategory)?.name}
            </span>
          )}
          {searchQuery && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
              &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      )}
    </div>
  );
}