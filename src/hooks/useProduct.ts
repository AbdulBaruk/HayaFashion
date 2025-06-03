import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products } from '../data/products';

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = () => {
      setIsLoading(true);
      try {
        const found = products.find(p => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
}