import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { Footer } from './components/Footer';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Cart } from './components/Cart';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
// import { ProductFilters } from './components/ProductFilters';
import { LoginPage } from './pages/LoginPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OfferBanner } from './components/OfferBanner';
import { AuthProvider } from './context/AuthContext';
import { DialogProvider } from './context/DialogContext';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { getCategories } from './utils/filters';
import { CategoriesProvider } from './context/CategoriesContext';
import { ProductsProvider } from './context/ProductsContext';
import PrivacyPilicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import OrderSingleView from './components/OrderSingleView';
import CategoriesProducts from './pages/CategoriesProducts';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/UserContext';
import { PolicyProvider } from './context/PolicyContext';
import { logEvent } from 'firebase/analytics';
import { analytics } from './components/firebase-Analytics/firebaseAnalytics';
import 'react-toastify/dist/ReactToastify.css';
import { VendorProvider } from './context/VendorContext';
import Shop from './pages/Shop';

export default function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [showBanner, setShowBanner] = React.useState(true);
  // const [showFilters, setShowFilters] = React.useState(false);
  // const [filters, setFilters] = React.useState({
  //   brands: [],
  //   colors: [],
  //   sizes: [],
  //   priceRange: [0, 1000] as [number, number]
  // });


  const { products } = useProducts();
  const { cartItems, addToCart,
    //  updateQuantity
  } = useCart();
  const categories = getCategories(products);
  const vendorId = 60;
  let debounceTimer: ReturnType<typeof setTimeout>;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  logEvent(analytics, 'screen_view' as any, {
    screen_name: 'HomePage'
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);


    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (query.trim() !== '') {
        logEvent(analytics, 'search', {
          search_products: query,
        });
      }
    }, 500);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const finalQuery = (e.target as HTMLInputElement).value.trim();
      if (finalQuery !== '') {
        logEvent(analytics, 'search', {
          search_products: finalQuery,
        });
      }
    }
  };

  return (
    <HelmetProvider>
      <AuthProvider>
        <VendorProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <CategoriesProvider vendorId={vendorId}>
            <ProductsProvider vendorId={vendorId}>
              <PolicyProvider vendorId={vendorId}>
                <UserProvider>
                  <DialogProvider>
                    <BrowserRouter>
                      <div className="min-h-screen bg-gray-100 flex flex-col">
                        {/* {showBanner && <OfferBanner onClose={() => setShowBanner(false)} />} */}
                        <Navbar
                          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                          onCartClick={() => setIsCartOpen(true)}
                        />

                        <Routes>
                          <Route path="/login" element={<LoginPage vendorId={vendorId} />} />
                          <Route path="/register" element={<CreateAccountPage vendorId={vendorId} />} />
                          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                          <Route path="/profile" element={<ProfilePage vendorId={vendorId} />} />
                          <Route path="/categories" element={<CategoriesPage />} />
                          <Route path="/shop" element={<Shop
                            onAddToCart={addToCart}
                            cartItems={cartItems}
                            // onUpdateQuantity={updateQuantity}
                            selectedCategory={selectedCategory}
                            searchQuery={searchQuery}
                            vendorId={vendorId} />} />
                          <Route path="/privacy-policy" element={<PrivacyPilicy />} />
                          <Route path="/terms-conditions" element={<TermsAndConditions />} />
                          <Route path="/refund-policy" element={<RefundPolicy />} />
                          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                          <Route path="/shipping-policy" element={<ShippingPolicy />} />
                          <Route path="/order-view/:id" element={<OrderSingleView vendorId={vendorId} />} />
                          <Route path="/categories-product/:id" element={<CategoriesProducts vendorId={vendorId} />} />

                          <Route
                            path="/product/:id"
                            element={
                              <ProductDetailsPage
                                cartItems={cartItems}
                                onAddToCart={addToCart}
                                vendorId={vendorId}
                              />
                            }
                          />
                          <Route
                            path="/"
                            element={
                              <>
                                <Banner />
                                <main className="flex-1">


                                 

                                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                    <div className="space-y-8">
                                      <div className="space-y-6">
                                        <SearchBar value={searchQuery} onChange={handleSearch} onKeyDown={handleSearchKeyDown} />

                                        <CategoryFilter
                                          categories={categories}
                                          selectedCategory={selectedCategory}
                                          onSelect={handleCategorySelect}
                                        />

                                        {/* <ProductFilters
                                      products={products}
                                      onSort={''}
                                      onFiltersChange={setFilters}
                                      showFilters={showFilters}
                                      onToggleFilters={() => setShowFilters(!showFilters)}
                                    /> */}
                                      </div>

                                      <FeaturedProducts
                                        onAddToCart={addToCart}
                                        cartItems={cartItems}
                                        // onUpdateQuantity={updateQuantity}
                                        selectedCategory={selectedCategory}
                                        searchQuery={searchQuery}
                                        vendorId={vendorId}
                                      />

                                    </div>
                                  </div>
                                </main>
                              </>
                            }
                          />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>

                        <Footer />

                        {isCartOpen && (
                          <>
                            <div
                              className="fixed inset-0 bg-black bg-opacity-50"
                              onClick={() => setIsCartOpen(false)}
                            />
                            <Cart
                              items={cartItems}
                              onClose={() => setIsCartOpen(false)}
                              vendorId={vendorId}
                            />
                          </>
                        )}
                      </div>
                    </BrowserRouter>
                  </DialogProvider>
                </UserProvider>
              </PolicyProvider>
            </ProductsProvider>
          </CategoriesProvider>
        </VendorProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}