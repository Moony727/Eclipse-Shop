"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { Navbar } from "@/components/navigation/Navbar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { LoginModal } from "@/components/auth/LoginModal";
import { UserProfile } from "@/components/auth/UserProfile";
import { PurchaseModal } from "@/components/products/PurchaseModal";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Product, Category } from "@/types";
import { getPublicProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState<"info" | "history">("info");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await getPublicProducts({ isActive: true });
        
        if (result.success && result.data) {
          setProducts(result.data);
          setFilteredProducts(result.data);
        } else {
          // Fallback to empty array if fetch fails
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Filter products based on category, subcategory, and search
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedSubcategory !== "all") {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        (product.name?.en?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (product.name?.ru?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (product.name?.az?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, searchQuery]);

  const handlePurchase = (product: Product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleProfileClick = (tab: "info" | "history" = "info") => {
    setProfileTab(tab);
    setShowProfileModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onProfileClick={handleProfileClick}
        onLoginClick={handleLoginClick}
      />

      <main id="home" className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16 mb-8 md:mb-12 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {t("hero.title", "Welcome to Eclipse Shop")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            {t("hero.subtitle", "Discover premium digital products, software, and services designed to elevate your business and creativity.")}
          </p>
          <div className="flex justify-center px-4">
            <div className="relative rounded-lg shadow-2xl max-w-full w-full h-48 md:h-64 lg:h-96">
              <NextImage
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e41ede49-48db-4084-b71d-39297b6eda42.png"
                alt="Eclipse Shop - Premium Digital Marketplace"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSubcategoryChange={setSelectedSubcategory}
          onSearchChange={setSearchQuery}
        />

        {/* Products Grid */}
        <section id="products">
          <ProductGrid
          products={filteredProducts}
          onPurchase={handlePurchase}
          isLoading={isLoading}
          />
        </section>
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <UserProfile
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        initialTab={profileTab}
      />

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={selectedProduct}
        user={user}
      />
    </div>
  );
}