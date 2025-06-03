import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext";
import { useProducts } from "../context/ProductsContext";
import { ArrowLeft, FolderX, Loader2, Minus, Plus } from "lucide-react";
import { InvalidateQueryFilters, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCartitemsApi, getCartitemsApi, postCartitemApi, updateCartitemsApi } from "../api-endpoints/CartsApi";
import { useState } from "react";
import LoginModal from "../components/dialogs/LoginModal";

function CategoriesProducts({ vendorId }: any) {

    const { id } = useParams();
    const { categories } = useCategories();
    const { products }: any = useProducts();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const getUserId = localStorage.getItem('userId');
    const getCartId = localStorage.getItem('cartId');
    const getUserName = localStorage.getItem('userName');
    const [signInmodal, setSignInModal] = useState(false);

    const findCategory = categories?.data?.find((item: any) => item?.id === Number(id));
    const filteredProducts = products?.data?.filter((item: any) => item?.category === Number(id)) || [];

    const [selectedVariant] = useState<any>(filteredProducts);
    const [selectedSize] = useState(selectedVariant?.discount);

    const discountPercentage = selectedVariant?.discount
        ? Math.round(((parseFloat(selectedVariant.discount) - parseFloat(selectedVariant.price)) / parseFloat(selectedVariant.discount)) * 100)
        : 0;

    const getCartitemsData = useQuery({
        queryKey: ['getCartitemsData', getCartId],
        queryFn: () => getCartitemsApi(`/${getCartId}`),
        enabled: !!getCartId
    })


    const matchingProductsArray = filteredProducts?.map((product: any, index: number) => {
        const matchingCartItem = getCartitemsData?.data?.data?.find(
            (item: any) => item.product === product.id
        );

        if (matchingCartItem) {
            return {
                ...product,
                Aid: index,
                cartId: matchingCartItem.id,
                cartQty: matchingCartItem.quantity,
            };
        }
        return product;
    });
    console.log(matchingProductsArray)

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


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => {
                    navigate(-1)
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {findCategory?.name || "Category Not Found"}
            </h1>

            {matchingProductsArray.length === 0 ? (
                <div className="flex gap-2 text-2xl">
                    <FolderX size={30} className="" />
                    <p className="text-gray-600 text-center">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {/* {matchingProductsArray.map((product: any) => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="aspect-square overflow-hidden relative">
                                <img
                                    src={product?.image_urls[0] || "https://semantic-ui.com/images/wireframe/image.png"}
                                    alt={product?.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                                    {product.name}
                                </h2>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm sm:text-lg font-bold text-gray-900">
                                        ₹{product.price || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))} */}
                    {matchingProductsArray.map((product: any) => (
                        <div
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="aspect-square overflow-hidden relative group">
                                <img
                                    src={product?.image_urls[0] ? product?.image_urls[0] : "https://semantic-ui.com/images/wireframe/image.png"}
                                    className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 ease-in-out group-hover:-translate-x-full"
                                    alt="Product Image"
                                />
                                {product?.image_urls[1] && (
                                    <img
                                        src={product?.image_urls[1]}
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
                                    {product?.description?.slice(0, 80)}..
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm sm:text-lg font-bold text-gray-900">
                                            ₹{product?.price}
                                        </span>
                                        {product?.discount && (
                                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                                                ₹{product?.discount}
                                            </span>
                                        )}
                                    </div>

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
                                            // disabled={product?.cartQty <= 1}
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
                                            disabled={selectedVariant?.stock === 0 || selectedVariant?.status === false}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (getUserId) {
                                                    handleAddCart(product.id, 1);
                                                } else {
                                                    setSignInModal(true);
                                                }
                                            }}
                                            className="bg-blue-600 text-white p-2 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition-colors text-xs sm:text-sm disabled:opacity-50"
                                        >
                                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">
                                                {selectedVariant?.stock === 0 || selectedVariant?.status === false ? 'Out of Stock' : 'Add'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />

        </div>
    );
}

export default CategoriesProducts;
