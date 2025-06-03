import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { LoadingButton } from '../components/LoadingButton';
import { CartItem } from '../types';
import { useLoadingState } from '../hooks/useLoadingState';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductVariantCartItemUpdate, getProductWithVariantSizeApi } from '../api-endpoints/products';
import { VariantSelector } from '../components/product/VariantSelector';
import LoginModal from '../components/dialogs/LoginModal';
import { deleteCartitemsApi, getCartitemsApi, updateCartitemsApi } from '../api-endpoints/CartsApi';
import { useProducts } from '../context/ProductsContext';
interface ProductDetailsProps {
  cartItems: CartItem[];
  onAddToCart: (cartItem: CartItem) => void;
  vendorId: any;
}

export function ProductDetailsPage({ cartItems, onAddToCart, vendorId }: ProductDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>();
  const [selectedSize, setSelectedSize] = useState<any>('');
  const getUserId = localStorage.getItem('userId');
  const getCartId = localStorage.getItem('cartId');
  const getUserName = localStorage.getItem('userName');
  const queryClient = useQueryClient();
  const { withLoading } = useLoadingState();
  const [signInmodal, setSignInModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productData: any = useQuery({
    queryKey: ['getProductData', id],
    queryFn: () => getProductWithVariantSizeApi(`${id}`)
  });


  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId
  })

  const matchingData = getCartitemsData?.data?.data?.map((item: any, index: number) => {
    const product = productData?.data?.data;
    const isProductMatch = product?.id === item?.product;

    const matchedProduct = isProductMatch ? product : null;
    const matchingVariant = product
      ? product?.variants?.find((variant: any) => variant?.id === item?.product_variant)
      : null;
    const matchingSize = product
      ? product?.variants?.map((variant: any) =>
        variant?.sizes?.find((size: any) => size?.id === item?.product_size)
      )
      : null;

    return {
      Aid: index,
      cartId: item?.id,
      cartQty: item?.quantity,
      ...matchedProduct,
      ...(matchingVariant || {}),
      ...(matchingSize?.find(Boolean) || {}),
    };
  });


  const totalQty = matchingData?.reduce((sum: number, item: any) => sum + (item?.cartQty || 0), 0);

  useEffect(() => {
    if (!selectedVariant) {
      const firstVariant = productData?.data?.data;
      setSelectedVariant(firstVariant);
    }
  }, [selectedVariant, productData?.data?.data]);


  const cartItem: any = cartItems.find(
    (item) =>
      item.id === product?.id &&
      item.variantId === product?.id &&
      item.sizeId === product?.id
  );

  if (productData.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-baseline gap-4">
              <div className="h-8 bg-gray-300 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="pt-6 border-t">
              <div className="h-12 bg-gray-300 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user',
      ...(selectedVariant?.product_variant_title ? { product_variant: selectedVariant?.id } : selectedVariant?.product_size ? { product_size: selectedVariant?.id }
        : selectedVariant?.id ? { product: selectedVariant?.id } : ''),
    };

    try {
      // const response = await postCartitemApi(``, payload)
      const response = await getProductVariantCartItemUpdate('', payload)
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSize) return;

    const newCartItem: CartItem = {
      id: product?.id,
      variantId: selectedVariant?.id,
      sizeId: selectedSize?.id,
      name: product?.name,
      variantName: selectedVariant?.name,
      sizeName: selectedSize?.name,
      price: selectedSize?.price,
      image: selectedVariant?.image,
      quantity: 1
    };
    onAddToCart(newCartItem);
  };

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        if (!selectedVariant) {
          const response = await updateCartitemsApi(`${id}/${type}/`)
          if (response) {
            queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
          }
        } else {
          handleAddCart(id, 1)
        }
      }
    } catch (error) {

    }
  }
  const deleteCartItem = async (id: any) => {
    try {
      const updateApi = await deleteCartitemsApi(`${id}`)
      if (updateApi) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }
  const { products }: any = useProducts();

  const relatedProducts = products?.data?.filter((product: any) => product?.category === productData?.data?.data?.category)
    ?.slice(0, 4)

    console.log(productData?.data?.data,"logging");
    

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => {
            navigate(-1),
              cartItem()
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-lg overflow-hidden">
            {/* <img
              src={productData?.data?.data?.image_urls[0] ? productData?.data?.data?.image_urls[0] : 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE='}
              className="w-full h-full object-cover"
            /> */}
            {productData?.data?.data?.image_urls?.length === 1 ? (
              <img
                src={productData.data.data.image_urls[0]}
                alt="Product"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={productData.data.data.image_urls[currentImageIndex]}
                  alt={`Product ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Prev Button */}
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0
                        ? productData.data.data.image_urls.length - 1
                        : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-2 py-1 rounded-full"
                >
                  ‹
                </button>
                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === productData.data.data.image_urls.length - 1
                        ? 0
                        : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-2 py-1 rounded-full"
                >
                  ›
                </button>
              </div>
            )}

          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{productData?.data?.data?.name}</h1>
              <p className="text-lg text-gray-500 mt-2">
                {/* {productData?.data?.data?.weight} g */}
                {productData?.data?.data?.brand_name}

              </p>
            </div>

            <p className="text-gray-700">{productData?.data?.data?.description}</p>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{selectedVariant?.price ? selectedVariant?.price : selectedVariant?.product_variant_price ? selectedVariant?.product_variant_price : selectedVariant?.product_size_price ? selectedVariant?.product_size_price : ''}
              </span>
              {productData?.data?.data?.discount && (
                <span className="text-lg text-gray-500 line-through"> ₹{productData?.data?.data?.discount}</span>
              )}
            </div>

            {/* Variant Selector */}

            <VariantSelector
              variants={productData?.data?.data?.variants}
              selectedVariantId={selectedVariant}
              onSelect={setSelectedVariant}
              sizekey={setSelectedSize}
              selectedSizeId={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <div>
              <div className="flex space-x-4">
                {matchingData?.map((item: any) => (
                  <div key={item?.id} className="relative bg-white p-3 rounded-lg shadow-sm ">
                    <div className="absolute top-1 right-1 text-gray-600 hover:text-gray-800 cursor-pointer"
                      // onClick={()=>deleteCartItem(item?.cartId)}

                      onClick={() => {
                        console.log('Deleting:', item?.cartId); // Check this in console
                        deleteCartItem(item?.cartId);
                      }}

                    >
                      <X size={12} />
                    </div>
                    <div className="w-12 h-12 overflow-hidden ">
                      <img
                        className="w-full h-full object-cover"
                        src={item?.image_urls ? item?.image_urls[0] : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="}
                        // src="https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                        alt="Image"
                      />
                    </div>
                    <h1 className="text-xs font-semibold text-gray-800">
                      {item?.name || item?.product_variant_title || item?.product_size || 'No Name'}
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                      ₹{item?.product_variant_price || item?.price || item?.product_size_price || 'N/A'} X {item?.cartQty}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              {matchingData?.length && matchingData[0]?.cartQty > 0 ? (
                <div
                  className="flex items-center gap-2 mt-2"
                  onClick={(e) => e.stopPropagation()} // 🛑 Prevents navigation
                >
                  <button
                    onClick={() =>
                      handleUpdateCart(matchingData[0]?.cartId, 'decrease', matchingData[0]?.cartQty)
                    }
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span>{totalQty ? totalQty : ''}</span>

                  <button
                    onClick={() => handleUpdateCart(matchingData[0]?.cartId, 'increase', '')}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <LoadingButton
                  disabled={!productData?.data?.data?.stock_quantity || productData?.data?.data?.stock_quantity === 0}
                  className="px-8 py-3"
                  onClick={(e) => {
                    handleAddToCart(),
                      e.stopPropagation();
                    if (getUserId) {
                      withLoading(() => {
                        onAddToCart({
                          id: productData?.data?.data?.id,
                          variantId: productData?.data?.data?.id,
                          sizeId: productData?.data?.data?.id,
                          name: productData?.data?.data?.name,
                          variantName: productData?.data?.data?.name,
                          sizeName: productData?.data?.data?.name,
                          price: productData?.data?.data?.price,
                          image: '',
                          quantity: 1,
                        });
                        handleAddCart(productData?.data?.data?.id, 1);
                      });
                    } else {
                      setSignInModal(true);
                    }
                  }}
                >
                  <Plus className="h-5 w-5" />
                  {product?.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </LoadingButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-border pt-12 m-4">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts?.map((product: any) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={
                      product?.image_urls[0]
                        ? product?.image_urls[0]
                        : 'https://semantic-ui.com/images/wireframe/image.png'
                    }
                    alt={product?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={300}
                    height={300}
                  />
                </Link>
              </div>

              <div className="p-4">
                <Link to={`/products/${product?.id}`}>
                  <h3 className="font-medium text-lg mb-1 transition-colors group-hover:text-[#4D8B31]">
                    {product?.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold">₹{product?.price}</span>

                  {product?.cartId ? (
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


                    // <button
                    //   disabled={product?.stock_quantity === 0 || product?.status === false}
                    //   onClick={(e) => {
                    //     e.stopPropagation();
                    //     if (getUserId) {
                    //       handleAddCart(product.id, 1);
                    //     } else {
                    //       setSignInModal(true);
                    //     }
                    //   }}
                    //   className={`bg-[#4D8B31] hover:bg-[#3e7026] p-0 ${
                    //     product?.stock_quantity === 0 || product?.status === false
                    //       ? ''
                    //       : 'rounded-full h-8 w-8'
                    //   }`}
                    //   aria-label={`Add ${product.name} to cart`}
                    // >
                    //   <span className="sm:inline">
                    //     {product?.stock_quantity === 0 || product?.status === false ? (
                    //       'Out of Stock'
                    //     ) : (
                    //       <ShoppingBag className="h-4 w-4" />
                    //     )}
                    //   </span>
                    // </button>

                    <button
                      disabled={product?.stock_quantity === 0 || product?.status === false}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (getUserId) {
                          handleAddCart(product.id, 1);
                        } else {
                          setSignInModal(true);
                        }
                      }
                      }
                      className="bg-blue-600 text-white p-2 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition-colors text-xs sm:text-sm disabled:opacity-50"
                    >
                      <span className="sm:inline">
                        {product?.stock_quantity === 0 || product?.status === false ? (
                          'Out of Stock'
                        ) : (
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />

    </>
  );
}
