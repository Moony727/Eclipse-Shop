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
        <div className="flex h-[var(--nav-height)] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-[calc(1.75rem*var(--ui-scale))] h-[calc(1.75rem*var(--ui-scale))] md:w-[calc(2rem*var(--ui-scale))] md:h-[calc(2rem*var(--ui-scale))] rounded-lg bg-gradient-to-r from-primary to-purple-600 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-[calc(0.875rem*var(--ui-scale))] md:text-[calc(1rem*var(--ui-scale))]">E</span>
            </div>
            <span className="text-[calc(1.125rem*var(--ui-scale))] md:text-[calc(1.25rem*var(--ui-scale))] font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-primary transition-all duration-300">
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
              className="relative text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] lg:text-[calc(1rem*var(--ui-scale))] xl:text-[calc(1.125rem*var(--ui-scale))] font-medium text-foreground/80 hover:text-foreground transition-all duration-300 group"
            >
              {t("nav.home")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                scrollTo("products");
              }}
              className="relative text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] lg:text-[calc(1rem*var(--ui-scale))] xl:text-[calc(1.125rem*var(--ui-scale))] font-medium text-foreground/80 hover:text-foreground transition-all duration-300 group"
            >
              {t("nav.products")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsAboutOpen(true);
              }}
              className="relative text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] lg:text-[calc(1rem*var(--ui-scale))] xl:text-[calc(1.125rem*var(--ui-scale))] font-medium text-foreground/80 hover:text-foreground transition-all duration-300 group"
            >
              {t("nav.about")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsContactOpen(true);
              }}
              className="relative text-[calc(0.75rem*var(--ui-scale))] md:text-[calc(0.875rem*var(--ui-scale))] lg:text-[calc(1rem*var(--ui-scale))] xl:text-[calc(1.125rem*var(--ui-scale))] font-medium text-foreground/80 hover:text-foreground transition-all duration-300 group"
            >
              {t("nav.contact")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Cart Icon */}
            <CartDrawer>
              <Button
                variant="ghost"
                size="icon"
                className="h-[calc(2rem*var(--ui-scale))] w-[calc(2rem*var(--ui-scale))] relative hover:scale-105 transition-transform duration-200"
              >
                <ShoppingCart className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))]" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-[calc(1rem*var(--ui-scale))] w-[calc(1rem*var(--ui-scale))] min-w-0 flex items-center justify-center p-0 text-[calc(0.625rem*var(--ui-scale))]"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            {/* Language Switcher */}
            <div className="transition-transform duration-200 hover:scale-105" style={{ transform: 'scale(var(--ui-scale))' }}>
              <LanguageSwitcher />
            </div>

            {/* Theme Switcher */}
            <div className="transition-transform duration-200 hover:scale-105" style={{ transform: 'scale(var(--ui-scale))' }}>
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
                      className="h-[calc(2rem*var(--ui-scale))] flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 px-2"
                    >
                      <Avatar className="w-[calc(1.5rem*var(--ui-scale))] h-[calc(1.5rem*var(--ui-scale))] ring-2 ring-primary/20">
                        <AvatarFallback className="text-[calc(0.625rem*var(--ui-scale))] bg-gradient-to-r from-primary to-purple-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-[calc(0.75rem*var(--ui-scale))] font-semibold">{user.name.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[calc(14rem*var(--ui-scale))] p-[calc(0.5rem*var(--ui-scale))]" style={{ transform: 'scale(var(--ui-scale))', transformOrigin: 'top right' }}>
                    <DropdownMenuLabel className="flex items-center space-x-[calc(0.5rem*var(--ui-scale))] p-[calc(0.5rem*var(--ui-scale))]">
                      <UserIcon className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))]" />
                      <div className="overflow-hidden">
                        <div className="font-bold text-[calc(0.875rem*var(--ui-scale))] truncate">{user.name}</div>
                        <div className="text-[calc(0.75rem*var(--ui-scale))] text-muted-foreground truncate">{user.email}</div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-[calc(0.25rem*var(--ui-scale))]" />
                    <DropdownMenuItem onClick={() => onProfileClick()} className="cursor-pointer flex items-center p-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] rounded-[calc(var(--radius-sm))]">
                      <UserIcon className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))] mr-[calc(0.5rem*var(--ui-scale))]" />
                      {t("profile.title")}
                    </DropdownMenuItem>
                    {/* Admin Link - In production, you should check for admin role/email */}
                    {(() => {
                      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
                      const isAdmin = adminEmails.includes(user.email || '');
                      return isAdmin ? (
                        <DropdownMenuItem asChild className="cursor-pointer flex items-center p-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] rounded-[calc(var(--radius-sm))]">
                          <Link href="/admin" className="flex items-center w-full">
                            <ShieldCheck className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))] mr-[calc(0.5rem*var(--ui-scale))]" />
                            {t("nav.adminPanel")}
                          </Link>
                        </DropdownMenuItem>
                      ) : null;
                    })()}
                    <DropdownMenuItem 
                      onClick={() => {
                        onProfileClick("history");
                      }} 
                      className="cursor-pointer flex items-center p-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] rounded-[calc(var(--radius-sm))]"
                    >
                      <Clock className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))] mr-[calc(0.5rem*var(--ui-scale))]" />
                      {t("profile.tabs.history")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-[calc(0.25rem*var(--ui-scale))]" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 flex items-center p-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] rounded-[calc(var(--radius-sm))]">
                      <LogOut className="w-[calc(1rem*var(--ui-scale))] h-[calc(1rem*var(--ui-scale))] mr-[calc(0.5rem*var(--ui-scale))]" />
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
              size="icon"
              className="md:hidden h-[calc(2rem*var(--ui-scale))] w-[calc(2rem*var(--ui-scale))] hover:scale-105 transition-transform duration-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-[calc(1rem*var(--ui-scale))] w-[calc(1rem*var(--ui-scale))] transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-[calc(1rem*var(--ui-scale))] w-[calc(1rem*var(--ui-scale))] transition-transform duration-200" />
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
            <div className="px-4 py-[calc(1rem*var(--ui-scale))] space-y-[calc(1rem*var(--ui-scale))]">
              <Link 
                href="/" 
                className="block text-foreground/80 hover:text-foreground transition-colors py-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link 
                href="#products" 
                className="block text-foreground/80 hover:text-foreground transition-colors py-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.products")}
              </Link>
              <button 
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] font-medium"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAboutOpen(true);
                }}
              >
                {t("nav.about")}
              </button>
              <button 
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] font-medium"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactOpen(true);
                }}
              >
                {t("nav.contact")}
              </button>
              {user && (
                <>
                  {(() => {
                    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
                    const isAdmin = adminEmails.includes(user.email || '');
                    return isAdmin ? (
                      <Link
                        href="/admin"
                        className="block text-foreground/80 hover:text-foreground transition-colors py-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("nav.adminPanel")}
                      </Link>
                    ) : null;
                  })()}
                  <button
                    className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-[calc(0.5rem*var(--ui-scale))] text-[calc(0.875rem*var(--ui-scale))] font-medium"
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