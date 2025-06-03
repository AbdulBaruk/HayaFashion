import React, { useState } from 'react';
import { Plus, Loader2, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { useLoadingState } from '../hooks/useLoadingState';
import LoginModal from './dialogs/LoginModal';
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '../api-endpoints/CartsApi';
import { Cart } from './Cart';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase-Analytics/firebaseAnalytics';


interface ProductCardProps {
  product: any;
  onAddToCart: (cartItem: CartItem) => void;
  cartItems: CartItem[];
  vendorId: any;
}

export function ProductCard({ product, onAddToCart, cartItems, vendorId }: ProductCardProps) {
  const navigate = useNavigate();
  const [selectedVariant] = useState<any>(product);
  const [selectedSize] = useState(selectedVariant?.discount);
  const getUserId = localStorage.getItem('userId');
  const getCartId = localStorage.getItem('cartId');
  const getUserName = localStorage.getItem('userName');
  const [signInmodal, setSignInModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const cartItem = cartItems.find(item =>
    item.id === product?.id &&
    item.variantId === selectedVariant.id &&
    item.sizeId === selectedSize.id
  );

  const { isLoading: isAddLoading, withLoading } = useLoadingState();



  const discountPercentage = selectedVariant?.discount
    ? Math.round(((parseFloat(selectedVariant.discount) - parseFloat(selectedVariant.price)) / parseFloat(selectedVariant.discount)) * 100)
    : 0;


  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      product: id,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user'
    }
    try {
      const response = await postCartitemApi(``, payload)
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }


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

  const handleAddCartAnalytics = (product: any) => {
    logEvent(analytics, 'add_to_cart', {
      item_id: product.id,
      item_name: product.name,
    });
  }

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="aspect-square overflow-hidden relative group">
          <img
            src={selectedVariant.image_urls[0] || "https://semantic-ui.com/images/wireframe/image.png"}
            className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 ease-in-out group-hover:-translate-x-full"
            alt="Product Image"
          />
          {selectedVariant.image_urls[1] && (
            <img
              src={selectedVariant.image_urls[1]}
              className="w-full h-full object-cover absolute top-0 left-full transition-transform duration-500 ease-in-out group-hover:translate-x-[-100%]"
              alt="Hover Image"
            />
          )}
          {discountPercentage !== 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-10">
              {Math.abs(discountPercentage)}%
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
            {product?.name}
          </h2>
          <h2 className="text-sm sm:text-base font-semibold text-gray-600 line-clamp-1">
            {/* {product?.weight} g */}
            {product?.brand_name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedVariant?.description?.slice(0, 80)}..
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-bold text-gray-900">
                ₹{selectedVariant?.price}
              </span>
              {selectedVariant?.discount && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{selectedVariant?.discount}
                </span>
              )}
            </div>

            {cartItem ? (
              <div
                className="flex items-center gap-2 mt-2"
                onClick={(e) => e.stopPropagation()} // 🛑 Prevents navigation
              >
                <button
                  onClick={() =>
                    handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                  }
                  className="p-1 rounded-full hover:bg-gray-200"
                  disabled={product?.cartQty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span>{product?.cartQty}</span>

                <button
                  onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                disabled={isAddLoading || selectedVariant?.stock === 0 || selectedVariant?.status === false}
                onClick={(e) => {
                  e.stopPropagation();
                  if (getUserId) {
                    withLoading(() => {
                      onAddToCart({
                        id: product.id,
                        variantId: selectedVariant.id,
                        sizeId: selectedSize.id,
                        name: product.name,
                        variantName: selectedVariant.name,
                        sizeName: selectedSize.name,
                        price: selectedSize.price,
                        image: selectedVariant.image_urls[0],
                        quantity: 1,
                      });
                      handleAddCart(product.id, 1);
                      handleAddCartAnalytics(product)
                    });
                  } else {
                    setSignInModal(true);
                  }
                }}
                className="bg-blue-600 text-white p-2 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition-colors text-xs sm:text-sm disabled:opacity-50"
              >
                {isAddLoading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="hidden sm:inline">
                  {selectedVariant?.stock === 0 || selectedVariant?.status === false ? 'Out of Stock' : 'Add'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>


      <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
    </>
  );
}