; import { ProductCard } from './ProductCard';
import { CartItem } from '../types';
import { FolderX, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Pagination } from './Pagination';
import { useQuery } from '@tanstack/react-query';
import { getCartitemsApi } from '../api-endpoints/CartsApi';

interface ProductGridProps {
  products: any;
  onAddToCart: () => void;
  cartItems: CartItem[];
  isLoading?: boolean;
  selectedCategory: any;
  searchQuery: any;
  vendorId: any;
}

export function ProductGrid({
  products,
  onAddToCart,
  cartItems,
  isLoading,
  selectedCategory,
  searchQuery,
  vendorId,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  if (products?.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No products found. Try adjusting your search or category filter.
      </p>
    );
  }

  const filter = products?.data?.filter((item: any) => {
    return (
      (!selectedCategory || item?.category === selectedCategory) &&
      (!searchQuery || item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });


  const totalPages = Math.ceil(filter?.length / ITEMS_PER_PAGE);
  const paginatedItems = filter?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const getCartId = localStorage.getItem('cartId');
  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId
  })


  const matchingProductsArray = paginatedItems?.map((product: any, index: number) => {
    const matchingCartItem = getCartitemsData?.data?.data?.find(
      (item: any) => item.product === product.id
    );

    if (matchingCartItem) {
      return {
        ...product,
        Aid: index,
        cartId: matchingCartItem.id,
        cartQty: matchingCartItem.quantity,
      };
    }
    return product;
  });


  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {filter?.length ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">

                {matchingProductsArray?.map((product: any) => (
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    cartItems={cartItems}
                    vendorId={vendorId}
                  />
                ))}

              </div>
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <>
              <div className='flex justify-center mr-auto ml-auto'>
                <div className="flex gap-2 text-2xl">
                  <FolderX size={30} className="" />
                  <p className="text-gray-600 text-center">No products found {selectedCategory ? "in this category" : ''}</p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>

    

  );
}