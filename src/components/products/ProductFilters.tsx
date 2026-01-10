"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";

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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
    <div className="space-y-8 mb-12 w-full max-w-4xl mx-auto px-4">
      {/* Search Bar */}
      <div className="relative w-full group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder={t('products.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 h-14 rounded-2xl w-full text-lg shadow-sm border-2 focus-visible:ring-primary/20 transition-all bg-card/50 backdrop-blur-sm"
        />
      </div>

      {/* Unified Collapsible Filters - "Fire style" for all screens */}
      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="border-2 rounded-3xl overflow-hidden bg-card/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-primary/30"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-6 h-auto font-black text-lg md:text-xl group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Filter className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="tracking-tight">{t('products.filter')}</span>
              {selectedCategory !== 'all' && (
                <Badge className="ml-2 bg-primary text-primary-foreground font-bold px-3 py-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {isFiltersOpen ? t('common.close', 'Close') : t('common.open', 'Browse')}
              </span>
              {isFiltersOpen ? (
                <ChevronUp className="w-6 h-6 text-primary transition-transform" />
              ) : (
                <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-transform" />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-8 pt-0 space-y-8 animate-in slide-in-from-top-4 duration-500">
          <div className="h-px bg-border/50 mb-6" />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Main Categories</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs font-bold rounded-full h-8 px-4 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
              >
                {t('common.clear')}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 -translate-y-1"
                      : "bg-background border-2 hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {selectedCategory !== 'all' && (
              <div className="space-y-6 pt-6 border-t-2 border-dashed animate-in fade-in slide-in-from-top-2 duration-400">
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">{t('products.subcategory')}</h4>
                <div className="flex flex-wrap gap-3">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => onSubcategoryChange(subcategory.id)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                        selectedSubcategory === subcategory.id
                          ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 -translate-y-0.5"
                          : "bg-background border-2 hover:border-primary/30 hover:bg-muted"
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

      {/* Active Filter Pill Bar */}
      {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery) && (
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active:</span>
          {selectedCategory !== 'all' && (
            <Badge variant="outline" className="pl-3 pr-1 py-1 gap-2 rounded-full border-2 border-primary/20 bg-primary/5 text-primary font-bold">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => onCategoryChange('all')} className="hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedSubcategory !== 'all' && (
            <Badge variant="outline" className="pl-3 pr-1 py-1 gap-2 rounded-full border-2 border-primary/20 bg-primary/5 text-primary font-bold">
              {subcategories.find(s => s.id === selectedSubcategory)?.name}
              <button onClick={() => onSubcategoryChange('all')} className="hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="outline" className="pl-3 pr-1 py-1 gap-2 rounded-full border-2 border-primary/20 bg-primary/5 text-primary font-bold">
              &quot;{searchQuery}&quot;
              <button onClick={() => onSearchChange('')} className="hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
