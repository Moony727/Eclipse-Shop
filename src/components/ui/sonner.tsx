"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // Success - Green
          "--success-bg": "#22c55e",
          "--success-border": "#16a34a",
          "--success-text": "#ffffff",
          
          // Error - Red
          "--error-bg": "#ef4444",
          "--error-border": "#dc2626",
          "--error-text": "#ffffff",
          
          // Warning - Yellow
          "--warning-bg": "#f59e0b",
          "--warning-border": "#d97706",
          "--warning-text": "#ffffff",
          
          // Info - Blue
          "--info-bg": "#3b82f6",
          "--info-border": "#2563eb",
          "--info-text": "#ffffff",
          
          // Normal - Blue as default
          "--normal-bg": "#3b82f6",
          "--normal-text": "#ffffff",
          "--normal-border": "#2563eb",
          
          // Responsive width
          "--width": "clamp(300px, 90vw, 420px)",
          "--border-radius": "8px",
          "--font-size": "14px",
          "--font-weight": "500",
        } as React.CSSProperties
      }
      position="top-center"
      richColors
      {...props}
    />
  )
}

export { Toaster }
