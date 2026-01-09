"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-0 bg-card rounded-2xl shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Content Skeleton */}
      <CardContent className="flex-1 p-5 space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-1/4" />
            <span className="opacity-30">→</span>
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="pt-2 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        
        <div className="pt-2">
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
      
      {/* Footer Skeleton */}
      <CardFooter className="p-5 pt-0">
        <Skeleton className="h-11 w-full rounded-xl" />
      </CardFooter>
    </Card>
  );
}