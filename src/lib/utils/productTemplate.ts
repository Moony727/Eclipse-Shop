import { Product, ProductFormData } from "@/types";

/**
 * Creates a template product from database product data
 * This can be used to transform existing product data into a new format
 */
export function createProductTemplate(dbProduct: any): ProductFormData {
  return {
    name: {
      en: dbProduct.name?.en || dbProduct.name || "",
      ru: dbProduct.name?.ru || "",
      az: dbProduct.name?.az || "",
    },
    description: {
      en: dbProduct.description?.en || dbProduct.description || "",
      ru: dbProduct.description?.ru || "",
      az: dbProduct.description?.az || "",
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
