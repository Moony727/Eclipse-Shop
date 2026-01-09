"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
    <div className="space-y-[var(--space-6)] mb-[var(--space-8)] w-full">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('products.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-11 rounded-xl w-full"
        />
      </div>

      {/* Collapsible Filters for Mobile */}
      <Collapsible
        open={isMobileFiltersOpen}
        onOpenChange={setIsMobileFiltersOpen}
        className="block md:hidden border rounded-2xl overflow-hidden bg-muted/20"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 h-auto font-bold">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              {t('products.category')}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </Badge>
              )}
            </div>
            {isMobileFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Select Category</span>
              <Button
                variant="link"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-auto p-0 h-6"
              >
                {t('common.clear')}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-background border hover:bg-muted"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {selectedCategory !== 'all' && (
              <div className="space-y-3 pt-2 border-t animate-in fade-in slide-in-from-top-1 duration-300">
                <span className="text-sm font-medium text-muted-foreground">{t('products.subcategory')}</span>
                <div className="flex flex-wrap gap-2">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => onSubcategoryChange(subcategory.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        selectedSubcategory === subcategory.id
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-background border hover:bg-muted"
                      }`}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Standard Filters for Desktop */}
      <div className="hidden md:block space-y-[var(--space-4)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[var(--text-lg)] font-semibold flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {t('products.category')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-sm rounded-lg px-4"
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
                  className="text-xs sm:text-sm flex-shrink-0"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Subcategory Filters */}
        {selectedCategory !== 'all' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-400">
            <h4 className="text-md font-medium">{t('products.subcategory')}</h4>
            <Tabs value={selectedSubcategory} onValueChange={onSubcategoryChange}>
              <div className="overflow-x-auto pb-2">
                <TabsList className="inline-flex w-max min-w-full gap-1">
                  {subcategories.map((subcategory) => (
                    <TabsTrigger
                      key={subcategory.id}
                      value={subcategory.id}
                      className="text-xs sm:text-sm flex-shrink-0"
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

      {/* Active Filters Display - Desktop Only */}
      <div className="hidden md:block">
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
    </div>
  );
}