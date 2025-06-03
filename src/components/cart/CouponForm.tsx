import React, { useState } from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { validateCoupon, calculateDiscount } from '../../utils/coupon';
import { coupons } from '../../data/coupons';
import { CartItem } from '../../types';
import { AppliedCoupon } from '../../types/coupon';
import { postApplyCouponApi } from '../../api-endpoints/CartsApi';
import { toast } from 'react-toastify';

interface CouponFormProps {
  items: CartItem[];
  onApply: (coupon: AppliedCoupon) => void;
  appliedCoupon?: AppliedCoupon;
}

export function CouponForm({ items, onApply, appliedCoupon }: any) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const getCartId = localStorage.getItem('cartId');
  const getUserName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId')
  // postApplyCouponApi 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    // try {
    //   await new Promise(resolve => setTimeout(resolve, 500));

    //   const coupon = validateCoupon(code, coupons);
    //   if (!coupon) {
    //     setError('Invalid coupon code');
    //     return;
    //   }

    //   const appliedDiscount = calculateDiscount(coupon, items);
    //   if (!appliedDiscount) {
    //     setError(`Minimum purchase of $${coupon.minAmount} required`);
    //     return;
    //   }

    //   onApply(appliedDiscount);
    //   setCode('');
    // } finally {
    //   setIsChecking(false);
    // }
const payload={
  user_id: Number(userId),
  coupon_id: code,
  vendor_id: 27,
  updated_by: getUserName ? getUserName:'user'

}
    // try {
    //   const updateApi=await postApplyCouponApi('',payload)
    //   console.log(updateApi)
    //   if(updateApi?.status === 400){
    //     setError('Invalid coupon code');
    //     setIsChecking(false);
    //     return;
    //   }
    // } catch (error) {
      
    // }

    try {
      const updateApi = await postApplyCouponApi("", payload);
      console.log(updateApi);
    
      // Check the response status properly
      if (updateApi?.status === 400) {
        setError("Invalid coupon code");
      } else if (updateApi?.status === 200) {
        toast.success("Coupon applied successfully!");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setError("Failed to apply coupon. Please try again.");
    } finally {
      setIsChecking(false);
    }
    
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Coupon applied: {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-600">
              You saved ${appliedCoupon.discountAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onApply('')}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={!code || isChecking}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}