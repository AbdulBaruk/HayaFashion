import React from 'react';
import { ProductGrid } from './ProductGrid';
import { Product, CartItem } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onAddToCart: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: () => void;
  isLoading?: boolean;
  itemsPerPage?: number;
}

export function ProductList({
  products,
  onAddToCart,
  cartItems,
  onUpdateQuantity,
  isLoading,
  itemsPerPage = 8
}: ProductListProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when products change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No products found. Try adjusting your search or category filter.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <ProductGrid
        products={paginatedProducts}
        onAddToCart={onAddToCart}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}