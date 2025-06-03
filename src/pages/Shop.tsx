import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { getProductApi } from '../api-endpoints/products';
import { getCartitemsApi } from '../api-endpoints/CartsApi';
import { Pagination } from '../components/Pagination';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';

function Shop({
    onAddToCart,
    cartItems,
    searchQuery,
    vendorId,
}: any) {
    const navigate = useNavigate();

    const { data: products, isLoading }: any = useQuery({
        queryKey: ['getProductData'],
        queryFn: () => getProductApi(`?vendor_id=${vendorId}`)
    });

    const { categories }: any = useCategories();
    console.log(categories?.data, "categories");
    console.log(products, "categories");


    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;
    const [selectedCategory, setSelectedCategory] = useState('');

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, searchQuery]);

    const getCartId = localStorage.getItem('cartId');

    const getCartitemsData = useQuery({
        queryKey: ['getCartitemsData', getCartId],
        queryFn: () => getCartitemsApi(`/${getCartId}`),
        enabled: !!getCartId
    });


    const filtered = products?.data?.filter((item: any) => {
        return (
            (!selectedCategory || item?.category === selectedCategory) &&
            (!searchQuery || item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const totalPages = Math.ceil(filtered?.length / ITEMS_PER_PAGE);
    const paginatedItems = filtered?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const matchingProductsArray = paginatedItems?.map((product: any, index: number) => {
        const matchingCartItem = getCartitemsData?.data?.data?.find(
            (item: any) => item.product === product.id
        );

        return matchingCartItem
            ? { ...product, Aid: index, cartId: matchingCartItem.id, cartQty: matchingCartItem.quantity }
            : product;
    });

    const handleCheckboxChange = (categoryId: any) => {
        setSelectedCategory((prev: any) =>
            prev === categoryId ? '' : categoryId
        );
    };

    return (
        <div className="m-4 p-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                Back
            </button>

            {/* Mobile Filter Toggle */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-1 text-sm text-blue-600"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Sidebar */}
                <div
                    className={`bg-white border rounded p-4 w-full lg:w-1/4 transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden'
                        } lg:block`}
                >
                    <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
                    <ul className="space-y-2">
                        {categories?.data?.map((category: any) => (
                            <li key={category} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={category?.id}
                                    checked={selectedCategory === category.id}
                                    onChange={() => handleCheckboxChange(category.id)}
                                    className="form-checkbox text-blue-600"
                                />
                                <label htmlFor={category?.name} className="text-sm">
                                    {category?.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="text-center text-gray-500 py-8">Loading...</div>
                    ) : filtered?.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No products found. Try adjusting your search or category filter.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {matchingProductsArray?.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={onAddToCart}
                                        cartItems={cartItems}
                                        vendorId={vendorId}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-center mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;



