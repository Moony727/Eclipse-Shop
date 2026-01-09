import { Product, ProductFormData } from "@/types";

interface DbProduct {
  name?: {
    en?: string;
    ru?: string;
    az?: string;
  } | string;
  description?: {
    en?: string;
    ru?: string;
    az?: string;
  } | string;
  price?: number;
  discountPrice?: number;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

/**
 * Creates a template product from database product data
 * This can be used to transform existing product data into a new format
 */
export function createProductTemplate(dbProduct: DbProduct): ProductFormData {
  const getName = () => {
    if (typeof dbProduct.name === 'object' && dbProduct.name) {
      return dbProduct.name as Record<string, string>;
    }
    return { en: typeof dbProduct.name === 'string' ? dbProduct.name : '' };
  };

  const getDescription = () => {
    if (typeof dbProduct.description === 'object' && dbProduct.description) {
      return dbProduct.description as Record<string, string>;
    }
    return { en: typeof dbProduct.description === 'string' ? dbProduct.description : '' };
  };

  const name = getName();
  const description = getDescription();

  return {
    name: {
      en: name.en || "",
      ru: name.ru || "",
      az: name.az || "",
    },
    description: {
      en: description.en || "",
      ru: description.ru || "",
      az: description.az || "",
    },
    price: dbProduct.price || 0,
    discountPrice: dbProduct.discountPrice || undefined,
    category: dbProduct.category || "",
    subcategory: dbProduct.subcategory || "",
    image: undefined, // Images need to be handled separately
  };
}

/**
 * Sample template product data for testing
 */
export const sampleProductTemplate: ProductFormData = {
  name: {
    en: "Sample Product",
    ru: "Образец продукта",
    az: "Nümunə məhsul",
  },
  description: {
    en: "This is a sample product description in English.",
    ru: "Это описание образца продукта на русском языке.",
    az: "Bu Azərbaycan dilində nümunə məhsul təsviridir.",
  },
  price: 99.99,
  discountPrice: 79.99,
  category: "software",
  subcategory: "tools",
  image: undefined,
};

/**
 * Transforms a product object into form data for editing
 */
export function productToFormData(product: Product): ProductFormData {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice,
    category: product.category,
    subcategory: product.subcategory,
    image: undefined, // Can't convert URL back to File
  };
}
