import  { createContext, useContext, ReactNode } from "react";
import { getProductcategoriesApi } from "../api-endpoints/products";
import { useQuery } from "@tanstack/react-query";

interface CategoriesContextType {
  categories: any; // Categories data
  isAuthenticated: boolean; // Authentication status
  isLoading: boolean; // Loading state
  error: any; // Error state
}
interface CategoriesProviderProps {
  children: ReactNode;
  vendorId: number;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children,vendorId }: CategoriesProviderProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getCategoriesData",vendorId],
    queryFn: () => getProductcategoriesApi(`?vendor_id=${vendorId}`),
  });


  return (
    <CategoriesContext.Provider
      value={{
        categories: data || [],
        isAuthenticated: !!data,
        isLoading,
        error,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
