import React from 'react';
import { Skeleton } from './Skeleton';

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-8 w-24 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          
          <Skeleton className="h-8 w-32" />
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          <div className="pt-6 border-t">
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}