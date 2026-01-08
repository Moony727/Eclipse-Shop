# Data Addition Template Guide

This guide provides templates for adding Categories, Subcategories, and Products to the Eclipse Shop.

## 1. Data Structure Templates

### Category & Subcategories
To add a new category with subcategories, use this format:

```json
{
  "id": "electronics", // Unique identifier (lowercase, no spaces)
  "name": {
    "en": "Electronics",
    "ru": "Электроника",
    "az": "Elektronika"
  },
  "subcategories": [
    {
      "id": "phones",
      "name": {
        "en": "Smartphones",
        "ru": "Смартфоны",
        "az": "Smartfonlar"
      }
    },
    {
      "id": "laptops",
      "name": {
        "en": "Laptops",
        "ru": "Ноутбуки",
        "az": "Noutbuklar"
      }
    }
  ]
}
```

### Product
To add a new product, use this format:

```json
{
  "name": {
    "en": "Product Name",
    "ru": "Название продукта",
    "az": "Məhsul adı"
  },
  "description": {
    "en": "Full description here...",
    "ru": "Полное описание здесь...",
    "az": "Tam təsviri burada..."
  },
  "price": 99.99,
  "discountPrice": 79.99, // Optional
  "category": "electronics", // Must match Category ID
  "subcategory": "phones", // Must match Subcategory ID
  "imageUrl": "https://images.unsplash.com/photo-...",
  "isActive": true,
  "createdAt": "timestamp" // Handled by Firebase
}
```

## 2. Dynamic Grid Template

The `ProductGrid` component is already designed to be dynamic and responsive. Here is how to use it in any new page:

```tsx
import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/types";

export function CustomSection({ products, isLoading }: { products: Product[], isLoading: boolean }) {
  const handlePurchase = (product: Product) => {
    // Implement purchase logic
  };

  return (
    <div className="py-10">
      <ProductGrid 
        products={products} 
        onPurchase={handlePurchase} 
        isLoading={isLoading} 
      />
    </div>
  );
}
```

### Grid Responsive Breakdown:
- **Mobile**: 1 column (`grid-cols-1`)
- **Tablet**: 2 columns (`sm:grid-cols-2`)
- **Laptop**: 3 columns (`lg:grid-cols-3`)
- **Desktop**: 4 columns (`xl:grid-cols-4`)

## 3. Normal Product Card Template

The standard `ProductCard` (found in `src/components/products/ProductCard.tsx`) is the recommended "normal" card. It includes:
- Hover effects (scale, shadow)
- Discount badges
- Category labels
- Multi-language support
- Image optimization

To create a **New Variant** of a product card, you can use this simplified template:

```tsx
"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Product } from "@/types";

export function SimpleProductCard({ product, onPurchase }: { product: Product, onPurchase: (p: Product) => void }) {
  const { language, t } = useLanguage();

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image src={product.imageUrl} alt={product.name[language]} fill className="object-cover" />
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-bold text-lg">{product.name[language]}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description[language]}</p>
        <p className="mt-2 text-xl font-black">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onPurchase(product)} className="w-full">
          {t("products.buy", "Buy Now")}
        </Button>
      </CardFooter>
    </Card>
  );
}
```


## 4. Bulk Import Script (`import-data.js`)

You can modify the existing `import-data.js` in the root directory to add your items. Ensure you have your `serviceAccountKey.json` from Firebase.
