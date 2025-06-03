import { Coupon } from '../types/coupon';

export const coupons: Coupon[] = [
  {
    code: 'SUMMER20',
    discount: 20,
    minAmount: 100,
    maxDiscount: 50
  },
  {
    code: 'WELCOME10',
    discount: 10,
    minAmount: 50
  }
];