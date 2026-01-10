"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const { t } = useLanguage();
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-primary border-t-transparent",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

interface LoadingPageProps {
  text?: string;
  className?: string;
}

export function LoadingPage({ text, className }: LoadingPageProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
      <LoadingSpinner size="lg" text={text || t("common.loading", "Loading...")} />
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ isVisible, text, className }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="bg-background border rounded-lg p-6 shadow-lg">
        <LoadingSpinner size="md" text={text} />
      </div>
    </div>
  );
}
