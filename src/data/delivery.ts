import { DeliveryZone } from '../types/delivery';

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'domestic',
    name: 'Domestic',
    options: [
      {
        id: 'standard',
        name: 'Standard Delivery',
        price: 5.99,
        estimatedDays: '3-5',
        description: 'Delivery within 3-5 business days'
      },
      {
        id: 'express',
        name: 'Express Delivery',
        price: 12.99,
        estimatedDays: '1-2',
        description: 'Next day delivery for orders placed before 2 PM'
      },
      {
        id: 'free',
        name: 'Free Shipping',
        price: 0,
        estimatedDays: '5-7',
        description: 'Free standard shipping for orders over $100'
      }
    ]
  }
];