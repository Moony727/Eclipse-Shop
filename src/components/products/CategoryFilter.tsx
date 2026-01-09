"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { Category } from "@/types";
import { ChevronDown, X } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onClear: () => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  onClear,
}: CategoryFilterProps) {
  const { language } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(selectedCategory || null);

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          📁 Filter by Category
        </h3>
        {(selectedCategory !== 'all' || selectedSubcategory !== 'all') && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Parent Categories */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Categories</p>
        <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-2">
          {/* All Categories Button */}
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onCategoryChange('all');
              onSubcategoryChange('all');
              setExpandedCategory(null);
            }}
            className="justify-start text-xs h-8"
          >
            <span className="truncate">All Categories</span>
          </Button>

          {/* Individual Categories */}
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onCategoryChange(category.id);
                onSubcategoryChange('all');
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                );
              }}
              className="justify-between text-xs h-8 gap-1"
            >
              <span className="truncate">{category.name[language]}</span>
              {category.subcategories.length > 0 && (
                <ChevronDown
                  className={`w-3 h-3 flex-shrink-0 transition-transform ${
                    expandedCategory === category.id ? 'rotate-180' : ''
                  }`}
                />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {currentCategory && currentCategory.subcategories.length > 0 && expandedCategory === selectedCategory && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Subcategories
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
            {/* All Subcategories Button */}
            <Button
              variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSubcategoryChange('all')}
              className="justify-start text-xs h-8 col-span-2"
            >
              <span className="truncate">All Subcategories</span>
            </Button>

            {/* Individual Subcategories */}
            {currentCategory.subcategories.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant={selectedSubcategory === subcategory.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSubcategoryChange(subcategory.id)}
                className="justify-start text-xs h-8"
              >
                <span className="truncate">{subcategory.name[language]}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Filters Summary */}
      {(selectedCategory !== 'all' || selectedSubcategory !== 'all') && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {currentCategory?.name[language]}
                <button
                  onClick={() => {
                    onCategoryChange('all');
                    onSubcategoryChange('all');
                  }}
                  className="ml-1 hover:opacity-70"
                >
                  ✕
                </button>
              </Badge>
            )}
            {selectedSubcategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {currentCategory?.subcategories.find(s => s.id === selectedSubcategory)?.name[language]}
                <button
                  onClick={() => onSubcategoryChange('all')}
                  className="ml-1 hover:opacity-70"
                >
                  ✕
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
