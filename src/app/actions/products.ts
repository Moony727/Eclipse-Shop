"use server";

import { adminDb } from "@/lib/firebase/admin";
import { productIdSchema } from "@/lib/validations/product.schema";
import { Product, ProductFormData } from "@/types";
import { verifyAdmin } from "@/lib/utils/admin";
import { typeError } from "@/lib/errorTyper";

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown;
}

type CloudinaryResponse = CloudinaryUploadResult | undefined;

/**
 * Get a single product by ID
 */
export async function getProductById(
  productId: string
): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    const validation = productIdSchema.safeParse(productId);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const productRef = adminDb.collection("products").doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return { success: false, error: "Product not found" };
    }

    const product: Product = {
      id: productSnap.id,
      ...productSnap.data(),
      createdAt: productSnap.data()?.createdAt?.toDate() || new Date(),
    } as Product;

    return { success: true, data: product };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product"
      };
    }
}

/**
 * Get all public products (no auth required)
 */
export async function getPublicProducts(filters?: {
  category?: string;
  subcategory?: string;
  isActive?: boolean;
}): Promise<{ success: boolean; data?: Product[]; error?: string }> {
  try {
    const productsRef = adminDb.collection("products");
    let query = productsRef.orderBy("createdAt", "desc");

    // Apply filters
    if (filters?.category && filters.category !== "all") {
      query = query.where("category", "==", filters.category);
    }
    if (filters?.subcategory && filters.subcategory !== "all") {
      query = query.where("subcategory", "==", filters.subcategory);
    }

    const snapshot = await query.get();
    const products: Product[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];

    return { success: true, data: products };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch products"
    };
  }
}

/**
 * Admin: Get all products
 */
export async function getProductsForAdmin(token: string): Promise<{ success: boolean; data?: Product[]; error?: string }> {
  try {
    await verifyAdmin(token);

    const productsRef = adminDb.collection("products");
    const snapshot = await productsRef.orderBy("createdAt", "desc").get();

    const products: Product[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];

    return { success: true, data: products };
  } catch {
    return { success: false, error: "Unauthorized or failed to fetch products" };
  }
}

/**
 * Admin: Toggle product status
 */
export async function toggleProductStatus(productId: string, isActive: boolean, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin(token);

    await adminDb.collection("products").doc(productId).update({
      isActive,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Unauthorized or failed to update product status" };
  }
}

/**
 * Admin: Create a new product
 */
export async function createProduct(formData: ProductFormData, token: string): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    await verifyAdmin(token);

    let imageUrl = '';
    if (formData.image) {
      try {
        imageUrl = await uploadImage(formData.image);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
      }
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      discountPrice: formData.discountPrice || undefined,
      category: formData.category,
      subcategory: formData.subcategory,
      imageUrl,
      isActive: true,
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection("products").add(productData);
    const product: Product = {
      id: docRef.id,
      ...productData,
    };

    return { success: true, data: product };
  } catch (error) {
    console.error('Product creation error:', error);
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to create product" };
  }
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(productId: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin(token);

    const validation = productIdSchema.safeParse(productId);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    await adminDb.collection("products").doc(productId).delete();
    return { success: true };
  } catch {
    return { success: false, error: "Unauthorized or failed to delete product" };
  }
}

/**
 * Admin: Update a product
 */
export async function updateProduct(productId: string, formData: ProductFormData, token: string): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    await verifyAdmin(token);

    const updateData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      discountPrice: formData.discountPrice || undefined,
      category: formData.category,
      subcategory: formData.subcategory,
    };

    if (formData.image) {
      try {
        updateData.imageUrl = await uploadImage(formData.image);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error occurred';
        return { success: false, error: errorMessage };
      }
    }

    await adminDb.collection("products").doc(productId).update(updateData);

    const updatedProduct = await getProductById(productId);
    if (updatedProduct.success && updatedProduct.data) {
      return { success: true, data: updatedProduct.data };
    } else {
      return { success: false, error: "Failed to fetch updated product" };
    }
  } catch (error) {
    console.error('Product update error:', error);
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to update product" };
  }
}

/**
 * Validate image content by checking magic bytes
 */
function validateImageContent(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytes.length >= 8 &&
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
      bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) {
    return true;
  }

  // GIF: 47 49 46 38 (GIF87a or GIF89a)
  if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return true;
  }

  // WebP: 52 49 46 46 (RIFF) followed by WEBP
  if (bytes.length >= 12 &&
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return true;
  }

  return false;
}

/**
 * Helper function to upload image to Cloudinary using SDK
 */
async function uploadImage(file: File): Promise<string> {
  try {
    // Validate file
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for free tier
      throw new Error('File size too large (max 10MB)');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate image content by checking magic bytes
    const buffer = await file.arrayBuffer();
    if (!validateImageContent(buffer)) {
      throw new Error('Invalid image file content');
    }

    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (!cloudinaryUrl) {
      throw new Error('Cloudinary URL not configured. Please set CLOUDINARY_URL environment variable (format: cloudinary://<api_key>:<api_secret>@<cloud_name>)');
    }

    // Import Cloudinary SDK dynamically to avoid issues in server actions
    const { v2: cloudinary } = await import('cloudinary');

    // Configure Cloudinary using the URL
    cloudinary.config({
      CLOUDINARY_URL: cloudinaryUrl,
    });

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'eclipse-shop/products',
          public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          quality: 'auto',
          eager: [
            { width: 800, height: 600, crop: 'limit', quality: 'auto' }
          ],
          eager_async: true
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult | undefined);
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

    if (!result?.secure_url) {
      throw new Error('Upload failed - no URL returned from Cloudinary');
    }

    return result.secure_url;
  } catch (error) {
    await typeError(error, 'Cloudinary upload failed');
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }
}
