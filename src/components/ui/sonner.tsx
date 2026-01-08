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
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(var(--success))",
          "--success-border": "hsl(var(--success))",
          "--success-text": "hsl(var(--success-foreground))",
          "--error-bg": "hsl(var(--destructive))",
          "--error-border": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--destructive-foreground))",
          "--warning-bg": "hsl(var(--warning))",
          "--warning-border": "hsl(var(--warning))",
          "--warning-text": "hsl(var(--warning-foreground))",
          "--info-bg": "hsl(var(--warning))",
          "--info-border": "hsl(var(--warning))",
          "--info-text": "hsl(var(--warning-foreground))",
          "--width": "400px",
          "--border-radius": "8px",
          "--font-size": "14px",
          "--font-weight": "500",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
