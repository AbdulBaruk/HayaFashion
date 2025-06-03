export interface Coupon {
  code: string;
  discount: number; // Percentage discount
  minAmount?: number; // Minimum cart amount required
  maxDiscount?: number; // Maximum discount amount
}

export interface AppliedCoupon extends Coupon {
  discountAmount: number; // Actual discount amount applied
}