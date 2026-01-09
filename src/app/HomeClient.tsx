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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

      <main id="home" className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-purple-600/10 py-16 md:py-24 lg:py-32 mb-12 md:mb-20 px-6 text-center border border-primary/10 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-[var(--text-4xl)] md:text-[var(--text-5xl)] font-black tracking-tight leading-tight mb-4 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              {t("hero.title", "Welcome to Eclipse Shop")}
            </h1>
            <p className="text-[var(--text-lg)] md:text-[var(--text-xl)] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle", "Discover premium digital products, software, and services designed to elevate your business and creativity.")}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => scrollTo("products")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
              >
                {t("nav.products", "Shop Now")}
              </button>
              <button 
                className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors border border-border"
              >
                {t("nav.about", "Learn More")}
              </button>
            </div>
          </div>

          <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video group">
              <NextImage
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e41ede49-48db-4084-b71d-39297b6eda42.png"
                alt="Eclipse Shop - Premium Digital Marketplace"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -z-10"></div>
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

      <Footer />
    </div>
  );
}