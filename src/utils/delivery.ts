import { DeliveryOption } from '../types/delivery';
import { CartItem } from '../types';
import { deliveryZones } from '../data/delivery';

export function getAvailableDeliveryOptions(items: CartItem[]): DeliveryOption[] {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const domesticZone = deliveryZones.find(zone => zone.id === 'domestic');
  
  if (!domesticZone) return [];
  
  return domesticZone.options.filter(option => {
    // Show free shipping only for orders over $100
    if (option.id === 'free') {
      return subtotal >= 100;
    }
    return true;
  });
}