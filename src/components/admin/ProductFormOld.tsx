"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product, ProductFormData } from "@/types";
import { sampleProductTemplate } from "@/lib/utils/productTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import NextImage from "next/image";

const productSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameRu: z.string().min(1, "Russian name is required"),
  nameAz: z.string().min(1, "Azerbaijani name is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionRu: z.string().min(1, "Russian description is required"),
  descriptionAz: z.string().min(1, "Azerbaijani description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  image: z.instanceof(File).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product;
  isLoading?: boolean;
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameEn: "",
      nameRu: "",
      nameAz: "",
      descriptionEn: "",
      descriptionRu: "",
      descriptionAz: "",
      price: 0,
      discountPrice: undefined,
      category: "",
      subcategory: "",
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (product) {
      setValue("nameEn", product.name.en);
      setValue("nameRu", product.name.ru);
      setValue("nameAz", product.name.az);
      setValue("descriptionEn", product.description.en);
      setValue("descriptionRu", product.description.ru);
      setValue("descriptionAz", product.description.az);
      setValue("price", product.price);
      setValue("discountPrice", product.discountPrice);
      setValue("category", product.category);
      setValue("subcategory", product.subcategory);
      setImagePreview(product.imageUrl);
    } else {
      reset();
      setImagePreview(null);
    }
  }, [product, setValue, reset]);

  useEffect(() => {
    if (watchedImage && watchedImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(watchedImage);
    }
  }, [watchedImage]);

  const loadTemplate = () => {
    setValue("nameEn", sampleProductTemplate.name.en);
    setValue("nameRu", sampleProductTemplate.name.ru);
    setValue("nameAz", sampleProductTemplate.name.az);
    setValue("descriptionEn", sampleProductTemplate.description.en);
    setValue("descriptionRu", sampleProductTemplate.description.ru);
    setValue("descriptionAz", sampleProductTemplate.description.az);
    setValue("price", sampleProductTemplate.price);
    setValue("discountPrice", sampleProductTemplate.discountPrice);
    setValue("category", sampleProductTemplate.category);
    setValue("subcategory", sampleProductTemplate.subcategory);
    setImagePreview(null);
    toast.success("Template loaded successfully");
  };

  const onFormSubmit = async (data: ProductFormValues) => {
    try {
      const formData: ProductFormData = {
        name: {
          en: data.nameEn,
          ru: data.nameRu,
          az: data.nameAz,
        },
        description: {
          en: data.descriptionEn,
          ru: data.descriptionRu,
          az: data.descriptionAz,
        },
        price: data.price,
        discountPrice: data.discountPrice,
        category: data.category,
        subcategory: data.subcategory,
        image: data.image,
      };

      await onSubmit(formData);
      onClose();
      reset();
      setImagePreview(null);
    } catch {
      toast.error("Failed to save product");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {product ? "Update the product details below." : "Fill in the details to create a new product."}
              </DialogDescription>
            </div>
            {!product && (
              <Button type="button" variant="outline" size="sm" onClick={loadTemplate}>
                <FileText className="w-4 h-4 mr-2" />
                Load Template
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Names */}
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

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="descriptionEn">Description (EN)</Label>
              <Textarea id="descriptionEn" {...register("descriptionEn")} rows={3} />
              {errors.descriptionEn && <p className="text-sm text-destructive">{errors.descriptionEn.message}</p>}
            </div>
            <div>
              <Label htmlFor="descriptionRu">Description (RU)</Label>
              <Textarea id="descriptionRu" {...register("descriptionRu")} rows={3} />
              {errors.descriptionRu && <p className="text-sm text-destructive">{errors.descriptionRu.message}</p>}
            </div>
            <div>
              <Label htmlFor="descriptionAz">Description (AZ)</Label>
              <Textarea id="descriptionAz" {...register("descriptionAz")} rows={3} />
              {errors.descriptionAz && <p className="text-sm text-destructive">{errors.descriptionAz.message}</p>}
            </div>
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="graphics">Graphics</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input id="subcategory" {...register("subcategory")} />
              {errors.subcategory && <p className="text-sm text-destructive">{errors.subcategory.message}</p>}
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (AZN)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="discountPrice">Discount Price (AZN) - Optional</Label>
              <Input
                id="discountPrice"
                type="number"
                step="0.01"
                {...register("discountPrice", {
                  valueAsNumber: true,
                  setValueAs: (value) => value === "" ? undefined : parseFloat(value)
                })}
              />
              {errors.discountPrice && <p className="text-sm text-destructive">{errors.discountPrice.message}</p>}
            </div>
          </div>

          {/* Image */}
          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="mt-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("image", file);
                  }
                }}
                className="hidden"
              />
              <Label htmlFor="image" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <NextImage src={imagePreview} alt="Preview" width={200} height={128} className="max-w-full h-32 object-cover mx-auto rounded" />
                      <p className="text-sm text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                  )}
                </div>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
