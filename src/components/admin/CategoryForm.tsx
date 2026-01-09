"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  nameEn: z.string().min(1, "English name is required"),
  nameRu: z.string().min(1, "Russian name is required"),
  nameAz: z.string().min(1, "Azerbaijani name is required"),
  subcategories: z.array(z.object({
    id: z.string().min(1, "Subcategory ID is required"),
    nameEn: z.string().min(1, "English name is required"),
    nameRu: z.string().min(1, "Russian name is required"),
    nameAz: z.string().min(1, "Azerbaijani name is required"),
  })).min(1, "At least one subcategory is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Category) => Promise<void>;
  category?: Category;
  isLoading?: boolean;
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: "",
      nameEn: "",
      nameRu: "",
      nameAz: "",
      subcategories: [{ id: "", nameEn: "", nameRu: "", nameAz: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
  });

  const onFormSubmit = async (data: CategoryFormValues) => {
    try {
      const categoryData: Category = {
        id: data.id,
        name: {
          en: data.nameEn,
          ru: data.nameRu,
          az: data.nameAz,
        },
        subcategories: data.subcategories.map(sub => ({
          id: sub.id,
          name: {
            en: sub.nameEn,
            ru: sub.nameRu,
            az: sub.nameAz,
          },
        })),
      };

      await onSubmit(categoryData);
      onClose();
      reset();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const addSubcategory = () => {
    append({ id: "", nameEn: "", nameRu: "", nameAz: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category details below." : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Category ID */}
          <div>
            <Label htmlFor="id">Category ID</Label>
            <Input id="id" {...register("id")} placeholder="e.g., software, templates" />
            {errors.id && <p className="text-sm text-destructive">{errors.id.message}</p>}
          </div>

          {/* Category Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input id="nameEn" {...register("nameEn")} />
              {errors.nameEn && <p className="text-sm text-destructive">{errors.nameEn.message}</p>}
            </div>
            <div>
              <Label htmlFor="nameRu">Name (RU)</Label>
              <Input id="nameRu" {...register("nameRu")} />
              {errors.nameRu && <p className="text-sm text-destructive">{errors.nameRu.message}</p>}
            </div>
            <div>
              <Label htmlFor="nameAz">Name (AZ)</Label>
              <Input id="nameAz" {...register("nameAz")} />
              {errors.nameAz && <p className="text-sm text-destructive">{errors.nameAz.message}</p>}
            </div>
          </div>

          {/* Subcategories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Subcategories</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubcategory}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subcategory
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Subcategory {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Subcategory ID */}
                <div>
                  <Label htmlFor={`subcategories.${index}.id`}>Subcategory ID</Label>
                  <Input
                    id={`subcategories.${index}.id`}
                    {...register(`subcategories.${index}.id`)}
                    placeholder="e.g., tools, themes"
                  />
                  {errors.subcategories?.[index]?.id && (
                    <p className="text-sm text-destructive">{errors.subcategories[index]?.id?.message}</p>
                  )}
                </div>

                {/* Subcategory Names */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`subcategories.${index}.nameEn`}>Name (EN)</Label>
                    <Input id={`subcategories.${index}.nameEn`} {...register(`subcategories.${index}.nameEn`)} />
                    {errors.subcategories?.[index]?.nameEn && (
                      <p className="text-sm text-destructive">{errors.subcategories[index]?.nameEn?.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`subcategories.${index}.nameRu`}>Name (RU)</Label>
                    <Input id={`subcategories.${index}.nameRu`} {...register(`subcategories.${index}.nameRu`)} />
                    {errors.subcategories?.[index]?.nameRu && (
                      <p className="text-sm text-destructive">{errors.subcategories[index]?.nameRu?.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`subcategories.${index}.nameAz`}>Name (AZ)</Label>
                    <Input id={`subcategories.${index}.nameAz`} {...register(`subcategories.${index}.nameAz`)} />
                    {errors.subcategories?.[index]?.nameAz && (
                      <p className="text-sm text-destructive">{errors.subcategories[index]?.nameAz?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
