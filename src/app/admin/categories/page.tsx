"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCategories, addCategory, deleteCategory } from "@/app/actions/categories";
import { Category } from "@/types";
import CategoryForm from "@/components/admin/CategoryForm";
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function CategoriesPage() {
  const { firebaseUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        toast.error(result.error || "Failed to fetch categories");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (categoryData: Category) => {
    if (!firebaseUser) return;
    setIsSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const result = await addCategory(categoryData, token);
      if (result.success) {
        toast.success("Category added successfully");
        setCategories(prev => [...prev, categoryData]);
        setIsFormOpen(false);
      } else {
        toast.error(result.error || "Failed to add category");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleUpdateCategory = async (categoryData: Category) => {
    if (!firebaseUser) return;
    setIsSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const result = await addCategory(categoryData, token); // Using add for update since Firestore set() can update
      if (result.success) {
        toast.success("Category updated successfully");
        setCategories(prev => prev.map(c => c.id === categoryData.id ? categoryData : c));
        setIsFormOpen(false);
        setEditingCategory(undefined);
      } else {
        toast.error(result.error || "Failed to update category");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (categoryData: Category) => {
    if (editingCategory) {
      await handleUpdateCategory(categoryData);
    } else {
      await handleAddCategory(categoryData);
    }
  };

  const openAddForm = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firebaseUser) return;
    if (!confirm("Are you sure? This may affect products in this category.")) return;
    try {
      const token = await firebaseUser.getIdToken();
      const result = await deleteCategory(id, token);
      if (result.success) {
        toast.success("Category deleted");
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchCategories} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-primary" onClick={openAddForm}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading categories...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{category.name.en}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {category.name.ru} / {category.name.az}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{category.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.map(sub => (
                        <Badge key={sub.id} variant="secondary" className="text-[10px] py-0">
                          {sub.name.en}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500" onClick={() => handleEditCategory(category)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(category.id)}>
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

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(undefined);
        }}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        isLoading={isSubmitting}
      />
    </div>
  );
}
