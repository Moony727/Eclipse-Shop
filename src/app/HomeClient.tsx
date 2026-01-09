"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { Navbar } from "@/components/navigation/Navbar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { LoginModal } from "@/components/auth/LoginModal";
import { UserProfile } from "@/components/auth/UserProfile";
import { Footer } from "@/components/navigation/Footer";

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
      } catch {
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
      } catch {
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

  const handleProfileClick = (tab: "info" | "history" = "info") => {
    setProfileTab(tab);
    setShowProfileModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onProfileClick={handleProfileClick}
        onLoginClick={handleLoginClick}
      />

      <main id="home" className="container mx-auto px-4 py-6 md:py-10">
        {/* Hero Section */}
        <section className="text-center py-10 md:py-14 mb-6 md:mb-10 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-tight">
            {t("hero.title", "Welcome to Eclipse Shop")}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4 font-medium">
            {t("hero.subtitle", "Discover premium digital products, software, and services designed to elevate your business and creativity.")}
          </p>
          <div className="flex justify-center px-4">
            <div className="relative rounded-3xl shadow-2xl max-w-full w-full h-48 md:h-64 lg:h-96 overflow-hidden border-4 border-background group">
              {loading ? (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              ) : (
                <NextImage
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e41ede49-48db-4084-b71d-39297b6eda42.png"
                  alt="Eclipse Shop - Premium Digital Marketplace"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-12 w-full max-w-4xl mx-auto">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSubcategoryChange={setSelectedSubcategory}
            onSearchChange={setSearchQuery}
          />
        </section>

        {/* Products Grid */}
        <section id="products" className="min-h-[400px]">
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading || loading}
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

      <Footer />
    </div>
  );
}