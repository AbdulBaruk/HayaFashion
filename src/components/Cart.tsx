import { useState } from 'react';
import { X, Minus, Plus, Loader2 } from 'lucide-react';
import { CartItem } from '../types';
import { AppliedCoupon } from '../types/coupon';
import { useCheckout } from '../hooks/useCheckout';
import { AddressSelector } from './cart/AddressSelector';
import { CouponForm } from './cart/CouponForm';
import { DeliverySelector } from './cart/DeliverySelector';
// import { getAvailableDeliveryOptions } from '../utils/delivery';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCartitemsApi, getAddressApi, getCartitemsApi, postPaymentApi, updateCartitemsApi } from '../api-endpoints/CartsApi';
import { useProducts } from '../context/ProductsContext';
import { useUser } from '../context/UserContext';
import { getSizesApi, getVariantsProductApi } from '../api-endpoints/products';
import { AddressForm } from './profile/AddressForm';
import { toast } from 'react-toastify';
import { getVendorDeliveryDetailsApi } from '../api-endpoints/authendication';


interface CartProps {
  items: CartItem[];
  onClose: () => void;
  vendorId: any

}

export function Cart({ items, onClose, vendorId

}: CartProps) {
  const { isProcessing } = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon>();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<any>('free');
  const { user }: any = useUser();
  const [loading, setLoading] = useState(false)

  const userId = localStorage.getItem('userId')
  const [openModal, setOpenMoadl] = useState(false)
  const discount = appliedCoupon?.discountAmount || 0;
  const getCartId = localStorage.getItem('cartId')
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<any>()

  const options = [
    {
      id: 'free',
      name: 'Free Shipping',
      price: 0,
      estimatedDays: '5-7',
      description: 'Free standard shipping for orders over'
    }
  ]

  const { data }: any = useQuery({
    queryKey: ['getAddressData'],
    queryFn: () => getAddressApi(`user/${userId}`)
  })

  const getVendorDeliveryDetailsData: any = useQuery({
    queryKey: ['getVendorDeliveryDetailsData'],
    queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`)
  })
  console.log(getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.own_delivery_charge)



  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId
  })

  // deleteCartitemsApi

  const { products }: any = useProducts();

  const VariantData: any = useQuery({
    queryKey: ['VariantData'],
    queryFn: () => getVariantsProductApi(`/vendor/${vendorId}`),
  });

  const sizesData: any = useQuery({
    queryKey: ['getSizesData'],
    queryFn: () => getSizesApi(`/vendor/${vendorId}`),
  });

  const matchingProductsArray = getCartitemsData?.data?.data?.map((item: any, index: number) => {
    const matchingProduct = products?.data?.find((product: any) => product.id === item.product);
    const matchingVariant = VariantData?.data?.data?.find((variant: any) => variant.id === item.product_variant);
    const matchingSize = sizesData?.data?.data?.find((size: any) => size?.id === item?.product_size);
 

    return {
      Aid: index,
      cartId: item?.id,
      cartQty: item?.quantity,
      ...matchingProduct,
      ...matchingVariant,
      ...matchingSize,
    };
  });
  console.log(getCartitemsData?.data?.data,"getCartitemsData");
  
   
  console.log(matchingProductsArray)
  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`)
        if (response) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      }

    } catch (error) {

    }
  }


  const handleCheckout = async () => {

    setLoading(true);
    setErrorMessage('')
    try {
      // If needed: build payload here

      const paymentAPi = await postPaymentApi('', {
        customer_phone: user?.data?.contact_number,
        vendor_id: vendorId,
        user_id: user?.data?.id,
      });

      if (paymentAPi) {
        const { payment_order_id, final_price } = paymentAPi.data;

        const options = {
          key: "rzp_live_vPf7ymd4ScF3Nz",
          amount: final_price * 100,
          currency: "INR",
          name: "Haya Fashion",
          description: "Order Payment",
          order_id: payment_order_id,
          handler: function (response: any) {
            console.log("Payment Success:", response);
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          },
          prefill: {
            name: user?.data?.name,
            email: user?.data?.email,
            contact: user?.data?.contact_number,
          },
          notes: {
            address: "Selected Address",
          },
          theme: {
            color: "#2563eb",
          },
        };
        toast.success("created successfully!");
        const razor = new (window as any).Razorpay(options);
        razor.open();
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.error)
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = matchingProductsArray?.reduce((acc: number, item: any) => {
    const price =
      item.cost ??
      item?.product_variant_price ??
      item?.product_size_price ??
      0;
    return acc + price * (item.cartQty || 1);
  }, 0);


  if (matchingProductsArray?.length === 0) {
    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl p-6 z-30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col z-30">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>
      {matchingProductsArray?.length ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-4">

              {[...matchingProductsArray]
                ?.map((item: any) => ({
                  ...item,
                  sortName: (item?.name || item?.product_variant_title || item?.product_size || "").toLowerCase(),
                }))
                ?.sort((a, b) => a.sortName.localeCompare(b.sortName))
                ?.map((item: any) => (
                  <div
                    key={item?.Aid}
                    className="flex justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className='flex items-center gap-4'>
                      <img
                        src={
                          item?.image_urls?.[0] ??
                          item?.product_variant_image_urls?.[0] ??
                          "https://semantic-ui.com/images/wireframe/image.png"
                        }
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item?.name || item?.product_variant_title || item?.product_name || ''}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item?.product_variant_title || ''} {item?.product_name || ''}
                        </p>
                        <p className="text-gray-600 py-1 font-bold">
                          ₹{item?.price || item?.product_variant_price || item?.product_size_price || ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateCart(item?.cartId, 'decrease', item?.cartQty)}
                            className="p-1 rounded-full hover:bg-gray-200"
                            // disabled={item?.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span>{item?.cartQty}</span>
                          <button
                            onClick={() => handleUpdateCart(item?.cartId, 'increase', '')}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

            </div>

            <div className="border-t pt-6">
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
                data={data}
                onClose={onClose}
              />
            </div>

            {/* <div className="border-t pt-6">
              <DeliverySelector
                options={options}
                selectedOptionId={selectedDeliveryId}
                onSelect={setSelectedDeliveryId}
              />
            </div> */}

            <div className="border-t pt-6">
              <CouponForm
                items={items}
                onApply={setAppliedCoupon}
                appliedCoupon={appliedCoupon}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl p-6 z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-500 text-center">Your cart is empty</p>
        </div>
      )}


      <div className="p-6 border-t bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>₹{totalAmount ? totalAmount : '0'}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Delivery:</span>
            <span>₹{getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.own_delivery_charge ? getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.own_delivery_charge : '0'}</span>
            {/* <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span> */}
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total:</span>
            {/* <span>₹{totalAmount ? totalAmount:'' + selectedDeliveryId?.price ? selectedDeliveryId?.price :''}</span> */}
            <span>
              ₹{totalAmount
                ? selectedDeliveryId?.price
                  ? Number(totalAmount) +
                  Number(selectedDeliveryId.price) +
                  Number(getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.own_delivery_charge)
                  : totalAmount + Number(getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.own_delivery_charge)
                : selectedDeliveryId?.price || ''}
            </span>

          </div>
        </div>
        {data?.data?.length ? (
          <>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !selectedAddressId}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setOpenMoadl(!openModal)}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Add Address
          </button>
        )}

      </div>

      <AddressForm
        openModal={openModal}
        handleClose={() => setOpenMoadl(!openModal)}
        editData={''}
      />
    </div>
  );
}