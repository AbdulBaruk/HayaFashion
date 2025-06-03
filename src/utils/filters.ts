import { Product } from '../types';
import { SortOption } from '../components/ProductFilters';

interface FilterState {
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

export function filterProducts(
  products: Product[],
  search: string,
  category: string,
  filters: FilterState
): Product[] {
  return products.filter((product) => {
    const matchesSearch = search === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'All' || product.category === category;

    const matchesBrand = filters.brands.length === 0 ||
      filters.brands.includes(product.name.split(' ')[0]);

    const matchesColor = filters.colors.length === 0 ||
      product.variants.some(variant =>
        filters.colors.includes(variant.name)
      );

    const matchesSize = filters.sizes.length === 0 ||
      product.variants.some(variant =>
        variant.sizes.some(size =>
          filters.sizes.includes(size.name)
        )
      );

    const matchesPrice = product.variants.some(variant =>
      variant.sizes.some(size =>
        size.price >= filters.priceRange[0] &&
        size.price <= filters.priceRange[1]
      )
    );

    return matchesSearch && matchesCategory && matchesBrand && 
           matchesColor && matchesSize && matchesPrice;
  });
}

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products];
  
  switch (sortOption) {
    case 'trending':
      // Simulate trending by random sort
      return sorted.sort(() => Math.random() - 0.5);
    case 'newest':
      // Simulate newest by reverse ID (assuming higher ID = newer)
      return sorted.sort((a, b) => b.id - a.id);
    case 'price-asc':
      return sorted.sort((a, b) => {
        const minPriceA = Math.min(...a.variants.flatMap(v => v.sizes.map(s => s.price)));
        const minPriceB = Math.min(...b.variants.flatMap(v => v.sizes.map(s => s.price)));
        return minPriceA - minPriceB;
      });
    case 'price-desc':
      return sorted.sort((a, b) => {
        const maxPriceA = Math.max(...a.variants.flatMap(v => v.sizes.map(s => s.price)));
        const maxPriceB = Math.max(...b.variants.flatMap(v => v.sizes.map(s => s.price)));
        return maxPriceB - maxPriceA;
      });
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

export function getCategories(products: Product[]): string[] {
  const categories = new Set(products.map(product => product.category));
  return ['All', ...Array.from(categories)];
}