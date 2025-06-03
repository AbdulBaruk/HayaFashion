export interface ProductVariant {
  id: string;
  name: string;
  colorHex?: string;
  image: string;
  sizes: ProductSize[];
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  variants: ProductVariant[];
}

export interface CartItem {
  id: number;
  variantId: string;
  sizeId: string;
  name: string;
  variantName: string;
  sizeName: string;
  price: number;
  image: string;
  quantity: number;
}