"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { NavbarProps } from "@/types";
import { Menu, X, User as UserIcon, LogOut, Clock, ShieldCheck, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AboutModal } from "@/components/modals/AboutModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar({ user, onProfileClick, onLoginClick }: NavbarProps) {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t("auth.logoutSuccess"));
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error(t("auth.logoutError") || "Failed to sign out");
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg'
        : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-12 md:h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm md:text-base">E</span>
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-primary transition-all duration-300">
              Eclipse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                scrollTo("home");
              }}
              className="relative text-xs font-medium text-foreground/80 hover:text-foreground transition-all duration-300"
            >
              {t("nav.home")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                scrollTo("products");
              }}
              className="relative text-xs font-medium text-foreground/80 hover:text-foreground transition-all duration-300"
            >
              {t("nav.products")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsAboutOpen(true);
              }}
              className="relative text-xs font-medium text-foreground/80 hover:text-foreground transition-all duration-300"
            >
              {t("nav.about")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsContactOpen(true);
              }}
              className="relative text-xs font-medium text-foreground/80 hover:text-foreground transition-all duration-300"
            >
              {t("nav.contact")}
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Cart Icon */}
            <CartDrawer>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative hover:scale-105 transition-transform duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            {/* Language Switcher */}
            <div className="transition-transform duration-200 hover:scale-105 scale-90">
              <LanguageSwitcher />
            </div>

            {/* Theme Switcher */}
            <div className="transition-transform duration-200 hover:scale-105 scale-90">
              <ThemeSwitcher />
            </div>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-1">
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 px-2"
                    >
                      <Avatar className="w-6 h-6 ring-2 ring-primary/20">
                        <AvatarFallback className="text-[10px] bg-gradient-to-r from-primary to-purple-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-xs font-semibold">{user.name.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onProfileClick()} className="cursor-pointer">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {t("profile.title")}
                    </DropdownMenuItem>
                    {/* Admin Link - In production, you should check for admin role/email */}
                    {(() => {
                      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
                      const isAdmin = adminEmails.includes(user.email || '');
                      return isAdmin ? (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/admin" className="flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      ) : null;
                    })()}
                    <DropdownMenuItem 
                      onClick={() => {
                        onProfileClick("history");
                      }} 
                      className="cursor-pointer"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {t("profile.tabs.history")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={onLoginClick}
                size="sm"
                className="hover:scale-105 transition-transform duration-200"
              >
                {t("nav.login")}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:scale-105 transition-transform duration-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* About & Contact Modals */}
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="/" 
                className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link 
                href="#products" 
                className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.products")}
              </Link>
              <Link 
                href="#about" 
                className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <Link 
                href="#contact" 
                className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </Link>
              {user && (
                <>
                  <Link 
                    href="/admin" 
                    className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button 
                    className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => {
                      onProfileClick("history");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t("profile.tabs.history")}
                  </button>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}