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
      <div className="container mx-auto" style={{ paddingLeft: 'var(--space-fluid-sm)', paddingRight: 'var(--space-fluid-sm)' }}>
        <div className="flex items-center justify-between gap-2" style={{ height: 'clamp(3.5rem, 8vw, 4rem)' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0" style={{ gap: 'var(--space-fluid-xs)' }}>
            <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-purple-600 group-hover:scale-110 transition-transform duration-300" style={{ width: 'clamp(2rem, 5vw, 2.5rem)', height: 'clamp(2rem, 5vw, 2.5rem)' }}>
              <span className="text-white font-bold" style={{ fontSize: 'clamp(0.875rem, 3vw, 1.125rem)' }}>E</span>
            </div>
            <span className="hidden sm:inline font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-primary transition-all duration-300" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }}>
              Eclipse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                scrollTo("home");
              }}
              className="relative text-foreground/80 hover:text-foreground transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-300 hover:before:w-full"
            >
              {t("nav.home")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                scrollTo("products");
              }}
              className="relative text-foreground/80 hover:text-foreground transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-300 hover:before:w-full"
            >
              {t("nav.products")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsAboutOpen(true);
              }}
              className="relative text-foreground/80 hover:text-foreground transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-300 hover:before:w-full"
            >
              {t("nav.about")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsContactOpen(true);
              }}
              className="relative text-foreground/80 hover:text-foreground transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-300 hover:before:w-full"
            >
              {t("nav.contact")}
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* Cart Icon */}
            <CartDrawer>
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:scale-110 active:scale-95 transition-all duration-150"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            {/* Language Switcher */}
            <div className="transition-all duration-150 hover:scale-110 active:scale-95">
              <LanguageSwitcher />
            </div>

            {/* Theme Switcher */}
            <div className="transition-all duration-150 hover:scale-110 active:scale-95">
              <ThemeSwitcher />
            </div>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:scale-110 active:scale-95 transition-all duration-150"
                    >
                      <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-purple-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline font-medium">{user.name}</span>
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
            <div style={{ padding: 'var(--space-fluid-lg)', gap: 'var(--space-fluid-lg)' }} className="space-y-4">
              <button 
                onClick={() => scrollTo("home")}
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {t("nav.home")}
              </button>
              <button 
                onClick={() => scrollTo("products")}
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {t("nav.products")}
              </button>
              <button
                onClick={() => {
                  setIsAboutOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => {
                  setIsContactOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {t("nav.contact")}
              </button>

              {/* Mobile Controls Separator */}
              <div className="border-t pt-4 space-y-3">
                {/* Mobile Cart */}
                <CartDrawer>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative w-full justify-start hover:scale-105 transition-transform duration-200"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t("nav.cart")} ({getTotalItems()})
                  </Button>
                </CartDrawer>

                {/* Mobile Language Switcher */}
                <div className="px-2">
                  <LanguageSwitcher />
                </div>

                {/* Mobile Theme Switcher */}
                <div className="px-2 flex items-center space-x-2">
                  <span className="text-sm text-foreground/80">{t("theme.light")}/{t("theme.dark")}</span>
                  <ThemeSwitcher />
                </div>
              </div>

              {user && (
                <>
                  <div className="border-t pt-4 space-y-2">
                    <button 
                      className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
                      onClick={() => {
                        onProfileClick();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("profile.title")}
                    </button>
                    <button 
                      className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
                      onClick={() => {
                        onProfileClick("history");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("profile.tabs.history")}
                    </button>
                    {(() => {
                      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
                      const isAdmin = adminEmails.includes(user.email || '');
                      return isAdmin ? (
                        <Link 
                          href="/admin" 
                          className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      ) : null;
                    })()}
                    <button 
                      className="block w-full text-left text-red-600 hover:text-red-700 transition-colors py-2"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("nav.logout")}
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <Button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  {t("nav.login")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}