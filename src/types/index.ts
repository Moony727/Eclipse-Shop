import { User as FirebaseUser } from 'firebase/auth';

// User types
export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: {
    en: string;
    ru: string;
    az: string;
  };
  description: {
    en: string;
    ru: string;
    az: string;
  };
  price: number;
  discountPrice?: number;
  category: string;
  subcategory: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  productId: string;
  contactId: string; // WhatsApp or Telegram ID/Number
  contactType: 'whatsapp' | 'telegram';
  customerName?: string;
  status: 'requested' | 'process' | 'completed' | 'cancelled';
  totalAmount: number;
  userEmail: string;
  userName: string;
  createdAt: Date;
  productName: {
    en: string;
    ru: string;
    az: string;
  };
  product?: Product;
}

// Category types
export interface Category {
  id: string;
  name: {
    en: string;
    ru: string;
    az: string;
  };
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: {
    en: string;
    ru: string;
    az: string;
  };
}

// Language types
export type Language = 'en' | 'ru' | 'az';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Auth context types
export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Language context types
export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PurchaseFormData {
  whatsappPhone: string;
}

export interface ProductFormData {
  name: {
    en: string;
    ru: string;
    az: string;
  };
  description: {
    en: string;
    ru: string;
    az: string;
  };
  price: number;
  discountPrice?: number;
  category: string;
  subcategory: string;
  image?: File;
}

// Filter types
export interface ProductFilters {
  category: string;
  subcategory: string;
  search: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Telegram types
export interface TelegramNotification {
  chatId: string;
  message: string;
  parseMode?: 'HTML' | 'Markdown';
}

// Firebase types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Component prop types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
}

export interface NavbarProps {
  user: User | null;
  onProfileClick: (tab?: "info" | "history") => void;
  onLoginClick: () => void;
}