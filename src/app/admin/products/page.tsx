"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getProductsForAdmin, toggleProductStatus, createProduct, updateProduct } from "@/app/actions/products";
import { Product, ProductFormData } from "@/types";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import NextImage from "next/image";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsPage() {
  const { firebaseUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const result = await getProductsForAdmin(token);
      if (result.success && result.data) {
        setProducts(result.data);
        setFilteredProducts(result.data);
      } else {
        toast.error(result.error || "Failed to fetch products");
      }
    } catch {
      toast.error("An error occurred while fetching products");
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const result = await toggleProductStatus(productId, !currentStatus, token);
      if (result.success) {
        toast.success(`Product status updated`);
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: !currentStatus } : p));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (!firebaseUser) return;
    setIsSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      if (editingProduct) {
        const result = await updateProduct(editingProduct.id, formData, token);
        if (result.success && result.data) {
          toast.success("Product updated successfully");
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? result.data! : p));
        } else {
          toast.error(result.error || "Failed to update product");
        }
      } else {
        const result = await createProduct(formData, token);
        if (result.success && result.data) {
          toast.success("Product created successfully");
          setProducts(prev => [result.data!, ...prev]);
        } else {
          toast.error(result.error || "Failed to create product");
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Add, edit and manage your products</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-primary" onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10 h-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card overflow-hidden flex flex-col h-[600px]">
        <div className="overflow-y-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 z-10">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading products...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-10 h-10 rounded border overflow-hidden bg-muted">
                        {product.imageUrl ? (
                          <NextImage 
                            src={product.imageUrl} 
                            alt={product.name.en}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{product.name.en}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">ID: {product.id.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-green-600">
                          {product.discountPrice ? product.discountPrice : product.price} AZN
                        </div>
                        {product.discountPrice && (
                          <div className="text-[10px] text-muted-foreground relative inline-block">
                            {product.price} AZN
                            <span className="absolute inset-0 bg-gradient-to-br from-transparent via-muted-foreground to-transparent" style={{ transform: 'rotate(-45deg)', height: '1px', top: '50%' }}></span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "secondary" : "destructive"} className="text-[10px]">
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(product.id, product.isActive)}
                          title={product.isActive ? "Deactivate" : "Activate"}
                        >
                          {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-500"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        isLoading={isSubmitting}
      />
    </div>
  );
}
