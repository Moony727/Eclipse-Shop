"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-purple-600">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Eclipse
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("hero.subtitle", "Discover premium digital products, software, and services designed to elevate your business and creativity.")}
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("nav.products", "Products")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("categories.software", "Software")}
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("categories.templates", "Templates")}
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("categories.education", "Education")}
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("categories.design", "Design")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("nav.support", "Support")}</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.about", "About Us")}
                </button>
              </li>
              <li>
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.contact", "Contact")}
                </button>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.privacy", "Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.terms", "Terms of Service")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("nav.contactInfo", "Contact Info")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">123 Digital Way, Tech City, 10101</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">support@eclipseshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Eclipse Shop. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
