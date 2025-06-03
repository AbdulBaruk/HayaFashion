import { Coupon, AppliedCoupon } from '../types/coupon';
import { CartItem } from '../types';

export function validateCoupon(code: string, coupons: Coupon[]): Coupon | null {
  return coupons.find(coupon => coupon.code.toLowerCase() === code.toLowerCase()) || null;
}

export function calculateDiscount(coupon: Coupon, items: CartItem[]): AppliedCoupon | null {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  if (coupon.minAmount && subtotal < coupon.minAmount) {
    return null;
  }

  const rawDiscount = (subtotal * coupon.discount) / 100;
  const discountAmount = coupon.maxDiscount 
    ? Math.min(rawDiscount, coupon.maxDiscount)
    : rawDiscount;

  return {
    ...coupon,
    discountAmount
  };
}