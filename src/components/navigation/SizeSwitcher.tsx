"use client";

import { useSize } from "@/contexts/SizeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Type, Check } from "lucide-react";

export function SizeSwitcher() {
  const { sizeMode, setSizeMode } = useSize();

  const options = [
    { id: "compact", label: "Compact", scale: "90%" },
    { id: "normal", label: "Normal", scale: "100%" },
    { id: "large", label: "Large", scale: "110%" },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <Type className="h-4 w-4" />
          <span className="sr-only">Toggle UI Size</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => setSizeMode(option.id)}
            className="flex items-center justify-between"
          >
            <span className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-[10px] text-muted-foreground">{option.scale} Scale</span>
            </span>
            {sizeMode === option.id && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
