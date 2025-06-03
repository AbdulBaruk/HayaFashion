import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProductApi } from '../api-endpoints/products';
import { useQuery } from '@tanstack/react-query';
interface ProductsContextType {
  products: any[] | null;  // fixed here
  isAuthenticated: boolean;
}

interface ProviderProps {
  children: ReactNode;
  vendorId: number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children,vendorId }: ProviderProps) {
  const { data }: any = useQuery({
    queryKey: ['getProductData',vendorId],
    queryFn: () => getProductApi(`?vendor_id=${vendorId}`),
  });

  const [products, setProducts] = useState<any[]>([]);

  React.useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isAuthenticated: !!products.length,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
