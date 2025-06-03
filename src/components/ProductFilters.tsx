import React from 'react';
import { Filter, X } from 'lucide-react';
import { Product } from '../types';
// import { useQuery } from '@tanstack/react-query';
// import { getVariantsProductApi } from '../api-endpoints/products';

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'trending' | 'newest';

interface FilterState {
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

interface ProductFiltersProps {
  products: Product[];
  onSort:any;
  onFiltersChange: any;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function ProductFilters({
  products,
  onSort,
  onFiltersChange,
  showFilters,
  onToggleFilters
}: ProductFiltersProps) {
  // Extract unique values from products
  const brands = React.useMemo(() => {
    const brandSet = new Set(products.map(p => p.name.split(' ')[0]));
    return Array.from(brandSet);
  }, [products]);

  const colors = React.useMemo(() => {
    const colorSet = new Set(
      products.flatMap(p => p.variants.map(v => v.name))
    );
    return Array.from(colorSet);
  }, [products]);

  const sizes = React.useMemo(() => {
    const sizeSet = new Set(
      products.flatMap(p => 
        p.variants.flatMap(v => 
          v.sizes.map(s => s.name)
        )
      )
    );
    return Array.from(sizeSet);
  }, [products]);

  const priceRange = React.useMemo(() => {
    const prices = products.flatMap(p => 
      p.variants.flatMap(v => 
        v.sizes.map(s => s.price)
      )
    );
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [products]);

  const [filters, setFilters] = React.useState<FilterState>({
    brands: [],
    colors: [],
    sizes: [],
    priceRange: priceRange
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // const { data,isLoading }:any =useQuery({
  //   queryKey:['getVariantsProductData'],
  //   queryFn:()=>getVariantsProductApi(``)
  // });

  // console.log(data)

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filters</span>
          {(filters.brands.length > 0 || filters.colors.length > 0 || filters.sizes.length > 0) && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filters.brands.length + filters.colors.length + filters.sizes.length}
            </span>
          )}
        </button>

        <select
          onChange={(e) => onSort(e.target.value as SortOption)}
          className="border-0 bg-gray-50 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 p-2.5"
        >
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Brands */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Variants</h3>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand:any) => (
                <label key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...filters.brands, brand]
                        : filters.brands.filter(b => b !== brand);
                      handleFilterChange('brands', newBrands);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    const newColors = filters.colors.includes(color)
                      ? filters.colors.filter(c => c !== color)
                      : [...filters.colors, color];
                    handleFilterChange('colors', newColors);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${filters.colors.includes(color)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => {
                    const newSizes = filters.sizes.includes(size)
                      ? filters.sizes.filter(s => s !== size)
                      : [...filters.sizes, size];
                    handleFilterChange('sizes', newSizes);
                  }}
                  className={`min-w-[48px] h-[48px] flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                    ${filters.sizes.includes(size)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  ${filters.priceRange[0]}
                </span>
                <span className="text-sm text-gray-500">
                  ${filters.priceRange[1]}
                </span>
              </div>
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const newRange: [number, number] = [
                    filters.priceRange[0],
                    Number(e.target.value)
                  ];
                  handleFilterChange('priceRange', newRange);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.brands.length > 0 || filters.colors.length > 0 || filters.sizes.length > 0) && (
            <button
              onClick={() => {
                setFilters({
                  brands: [],
                  colors: [],
                  sizes: [],
                  priceRange
                });
              }}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}