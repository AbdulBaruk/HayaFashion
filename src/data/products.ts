import { Product } from '../types';

const categories = [
  'Clothing',
  'Footwear',
  'Accessories',
  'Electronics',
  'Home & Living',
  'Sports Equipment',
  'Beauty & Care',
  'Books',
  'Toys & Games',
  'Jewelry',
  'Kitchen & Dining',
  'Garden & Outdoor',
  'Pet Supplies',
  'Art & Craft',
  'Music Instruments',
  'Office Supplies',
  'Automotive',
  'Health & Wellness',
  'Travel Gear',
  'Party Supplies'
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const colorVariants = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#A52A2A' }
  ];

  const sizes = [
    { name: 'XS', price: 29.99, originalPrice: 34.99 },
    { name: 'S', price: 29.99, originalPrice: 34.99 },
    { name: 'M', price: 29.99, originalPrice: 34.99 },
    { name: 'L', price: 29.99, originalPrice: 34.99 },
    { name: 'XL', price: 32.99, originalPrice: 37.99 },
    { name: 'XXL', price: 32.99, originalPrice: 37.99 }
  ];

  const shoeSizes = [
    { name: 'UK 6', price: 89.99, originalPrice: 99.99 },
    { name: 'UK 7', price: 89.99, originalPrice: 99.99 },
    { name: 'UK 8', price: 89.99, originalPrice: 99.99 },
    { name: 'UK 9', price: 89.99, originalPrice: 99.99 },
    { name: 'UK 10', price: 89.99, originalPrice: 99.99 },
    { name: 'UK 11', price: 89.99, originalPrice: 99.99 }
  ];

  const productTypes = [
    { name: 'T-Shirt', usesSizes: true },
    { name: 'Sneakers', usesShoeSize: true },
    { name: 'Watch', price: 199.99, originalPrice: 249.99 },
    { name: 'Backpack', price: 59.99, originalPrice: 69.99 },
    { name: 'Sunglasses', price: 79.99, originalPrice: 99.99 }
  ];

  // Generate 1000 products
  for (let i = 1; i <= 1000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const basePrice = Math.floor(Math.random() * 200) + 20; // Random price between 20 and 220
    const selectedColors = colorVariants.slice(0, Math.floor(Math.random() * 4) + 2);
    const mainColor = selectedColors[0]; // Use the first color as the main color for the product name

    const variants = selectedColors.map(color => {
      let productSizes;
      if (productType.usesSizes) {
        productSizes = sizes.map(size => ({
          id: size.name.toLowerCase(),
          name: size.name,
          price: basePrice,
          originalPrice: Math.round(basePrice * 1.2),
          stock: Math.floor(Math.random() * 20)
        }));
      } else if (productType.usesShoeSize) {
        productSizes = shoeSizes.map(size => ({
          id: size.name.toLowerCase().replace(' ', ''),
          name: size.name,
          price: basePrice,
          originalPrice: Math.round(basePrice * 1.2),
          stock: Math.floor(Math.random() * 20)
        }));
      } else {
        productSizes = [{
          id: 'one-size',
          name: 'One Size',
          price: basePrice,
          originalPrice: Math.round(basePrice * 1.2),
          stock: Math.floor(Math.random() * 20)
        }];
      }

      return {
        id: color.name.toLowerCase(),
        name: color.name,
        colorHex: color.hex,
        image: `https://source.unsplash.com/featured/800x600?${encodeURIComponent(productType.name + ' ' + color.name)}`,
        sizes: productSizes
      };
    });

    products.push({
      id: i,
      name: `${mainColor.name} ${productType.name}`,
      description: `Premium quality ${productType.name.toLowerCase()} perfect for any occasion.`,
      category,
      variants
    });
  }

  return products;
};

export const products = generateProducts();