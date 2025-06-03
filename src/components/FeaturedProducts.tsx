import { ProductGrid } from './ProductGrid';
import { useQuery } from '@tanstack/react-query';
import { getProductApi } from '../api-endpoints/products';

// interface FeaturedProductsProps {
//   products: any[];
//   onAddToCart:any;
//   cartItems: any[];
//   selectedCategory:any;
//   searchQuery:any;
//   onUpdateQuantity:any;
// }

export function FeaturedProducts({ 
  onAddToCart,
  cartItems,
  selectedCategory,
  searchQuery,
  vendorId,
}: any) {
    const { data,isLoading }:any =useQuery({
      queryKey:['getProductData'],
      queryFn:()=>getProductApi(`?vendor_id=${vendorId}`)
    });

  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
      </div>
      <ProductGrid
        products={data}
        onAddToCart={onAddToCart}
        cartItems={cartItems}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        vendorId={vendorId}
      />
    </div>
  );
}