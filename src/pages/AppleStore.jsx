// src/pages/AppleStore.jsx
import React, { useState, useMemo } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiStar, FiCheck, FiTruck, FiShield, FiRepeat, FiGrid, FiList, FiFilter, FiSmartphone, FiTablet, FiMonitor, FiWatch, FiHeadphones, FiCpu, FiBattery, FiCamera, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { appleProducts } from '../dummyData/appleProductsData' 
import Footer from './Footer'

const AppleStore = () => {
  // Use CartContext instead of local cart state - matching NewArrivals pattern
  const { 
    cart, 
    cartItemCount, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    formatPrice,
    getCartSummary 
  } = useCart();
  
  const [filters, setFilters] = useState({
    sort: '',
    category: '',
    productType: '',
    priceRange: '',
    rating: '',
    storage: '',
    colour: '',
    discount: '',
    technology: '',
    chip: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productDetailMode, setProductDetailMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutType, setCheckoutType] = useState('single');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [trackingMode, setTrackingMode] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);

  // Dynamic filter options matching NewArrivals pattern
  const filterOptions = useMemo(() => {
    const categories = ['All', 'iPhone', 'Mac', 'iPad', 'Apple Watch', 'AirPods', 'Apple TV', 'HomePod', 'Accessories'];
    const productTypes = [...new Set(appleProducts.map(p => p.productType))];
    const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
    const colours = [...new Set(appleProducts.map(p => p.colour))];
    const technologies = [...new Set(appleProducts.map(p => p.technology))];
    const chips = [...new Set(appleProducts.map(p => p.chip))];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      category: categories,
      productType: productTypes.sort(),
      storage: storageOptions,
      colour: colours.sort(),
      technology: technologies.sort(),
      chip: chips.sort(),
      discount: ['10% and above', '15% and above', '20% and above', '25% and above', '30% and above'],
      priceRange: [
        'Under ₹5000',
        '₹5000 - ₹20000',
        '₹20000 - ₹50000',
        '₹50000 - ₹100000',
        '₹100000 - ₹150000',
        '₹150000 - ₹200000',
        'Above ₹200000'
      ],
      rating: ['4.0 and above', '4.5 and above', '4.7 and above', '4.8 and above']
    };
  }, [appleProducts]);

  // Cart functions using CartContext - matching NewArrivals pattern
  const addToCartWithDelay = async (product) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product);
  };

  const viewProductDetails = async (product) => {
    setSelectedProduct(product);
    setProductDetailMode(true);
    setNavigationHistory(prev => [...prev, 'products']);
  };

  const buyNow = async (product) => {
    const productForCheckout = {
      ...product,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      quantity: 1,
      size: product.size || '',
      storage: product.storage || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || ''
    };
    
    setCheckoutProduct(productForCheckout);
    setCheckoutType('single');
    setCheckoutMode(true);
    setNavigationHistory(prev => [...prev, 'products']);
  };

  const buyNowFromDetail = async (product) => {
    const productForCheckout = {
      ...product,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      quantity: 1,
      size: product.size || '',
      storage: product.storage || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || ''
    };
    
    setCheckoutProduct(productForCheckout);
    setCheckoutType('single');
    setProductDetailMode(false);
    setCheckoutMode(true);
    setNavigationHistory(prev => [...prev, 'productDetail']);
  };

  const addToCartFromDetail = async (product) => {
    await addToCartWithDelay(product);
  };

  const handleCartCheckout = () => {
    // Save cart to localStorage for CheckoutPage to access
    localStorage.setItem('checkout_products_guest', JSON.stringify(cart));
    setCheckoutType('cart');
    setCheckoutMode(true);
    setIsCartOpen(false);
    setNavigationHistory(prev => [...prev, 'cart']);
  };

  const handleCompletePurchase = (orderData) => {
    console.log('Apple purchase completed:', orderData);
    
    if (checkoutType === 'cart') {
      clearCart();
    }
    
    setCheckoutMode(false);
    setCheckoutProduct(null);
    setProductDetailMode(false);
    setNavigationHistory([]);
  };

  const trackOrder = (orderNumber) => {
    setTrackingOrderNumber(orderNumber);
    setTrackingMode(true);
    setNavigationHistory(prev => [...prev, 'checkout']);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setActiveDropdown(null);
    setMobileActiveDropdown(null);
    setShowMobileFilters(false);
  };

  const clearFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: ''
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      sort: '',
      category: '',
      productType: '',
      priceRange: '',
      rating: '',
      storage: '',
      colour: '',
      discount: '',
      technology: '',
      chip: ''
    });
    setActiveDropdown(null);
    setMobileActiveDropdown(null);
    setShowMobileFilters(false);
    setSearchQuery('');
  };

  const handleDropdownToggle = (type) => {
    setActiveDropdown(prev => (prev === type ? null : type));
  };

  const handleMobileDropdownToggle = (type) => {
    setMobileActiveDropdown(prev => (prev === type ? null : type));
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const lastPage = navigationHistory[navigationHistory.length - 1];
      
      if (checkoutMode) {
        if (lastPage === 'productDetail') {
          setCheckoutMode(false);
          setProductDetailMode(true);
        } else if (lastPage === 'cart') {
          setCheckoutMode(false);
          setIsCartOpen(true);
        } else {
          setCheckoutMode(false);
        }
      } else if (productDetailMode) {
        setProductDetailMode(false);
        setSelectedProduct(null);
      } else if (trackingMode) {
        setTrackingMode(false);
        setTrackingOrderNumber(null);
      }
      
      setNavigationHistory(prev => prev.slice(0, -1));
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...appleProducts];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.productType.toLowerCase().includes(query) ||
        p.colour.toLowerCase().includes(query) ||
        p.technology?.toLowerCase().includes(query) ||
        p.chip?.toLowerCase().includes(query)
      );
    }
   
    // Apply filters
    if (filters.category && filters.category !== 'All') filtered = filtered.filter(p => p.category === filters.category);
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => p.colour === filters.colour);
    if (filters.storage) filtered = filtered.filter(p => p.storage === filters.storage);
    if (filters.technology) filtered = filtered.filter(p => p.technology === filters.technology);
    if (filters.chip) filtered = filtered.filter(p => p.chip === filters.chip);
    
    if (filters.discount) {
      const minDiscount = parseInt(filters.discount, 10);
      filtered = filtered.filter(p => p.discount >= minDiscount);
    }
    
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(p => p.rating >= minRating);
    }
    
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'Under ₹5000': filtered = filtered.filter(p => p.price < 5000); break;
        case '₹5000 - ₹20000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 20000); break;
        case '₹20000 - ₹50000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 50000); break;
        case '₹50000 - ₹100000': filtered = filtered.filter(p => p.price >= 50000 && p.price <= 100000); break;
        case '₹100000 - ₹150000': filtered = filtered.filter(p => p.price >= 100000 && p.price <= 150000); break;
        case '₹150000 - ₹200000': filtered = filtered.filter(p => p.price >= 150000 && p.price <= 200000); break;
        case 'Above ₹200000': filtered = filtered.filter(p => p.price > 200000); break;
        default: break;
      }
    }
    
    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'Price: Low to High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'Newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'Popularity':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'Customer Rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }
    
    return filtered;
  }, [filters, appleProducts, searchQuery]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery;
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Count products by category
  const categoryCounts = useMemo(() => {
    const counts = { iPhone: 0, Mac: 0, iPad: 0, 'Apple Watch': 0, AirPods: 0, 'Apple TV': 0, HomePod: 0, Accessories: 0 };
    appleProducts.forEach(product => {
      if (counts[product.category] !== undefined) {
        counts[product.category]++;
      }
    });
    return counts;
  }, [appleProducts]);

  // If in product detail mode, show product detail page
  if (productDetailMode && selectedProduct) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Apple Store</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-black hover:bg-gray-900 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-600"
          aria-label="Open Cart"
        >
          <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </button>

        <ProductDetailPage
          product={selectedProduct}
          onBack={goBack}
          onAddToCart={addToCartFromDetail}
          onBuyNow={buyNowFromDetail}
        />
      </div>
    );
  }

  // If in checkout mode, show checkout page
  if (checkoutMode) {
    // Prepare products array for CheckoutPage
    let productsForCheckout = [];
    
    if (checkoutType === 'single' && checkoutProduct) {
      // Ensure checkoutProduct has all required properties
      productsForCheckout = [{
        ...checkoutProduct,
        id: checkoutProduct.id,
        name: checkoutProduct.name,
        price: checkoutProduct.price,
        image: checkoutProduct.image || checkoutProduct.images?.[0],
        quantity: checkoutProduct.quantity || 1,
        size: checkoutProduct.size || '',
        storage: checkoutProduct.storage || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || '',
        category: checkoutProduct.category || ''
      }];
    } else {
      productsForCheckout = cart;
    }
    
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">
            {checkoutType === 'single' ? 'Back to Product' : 'Back to Cart'}
          </span>
        </button>
        
        <CheckoutPage
          products={productsForCheckout}
          checkoutType={checkoutType}
          onBack={goBack}
          onCompletePurchase={handleCompletePurchase}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onTrackOrder={trackOrder}
        />
      </div>
    );
  }

  // If in tracking mode, show tracking page
  if (trackingMode) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={() => {
            setTrackingMode(false);
            setTrackingOrderNumber(null);
            goBack();
          }}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Apple Store</span>
        </button>
        
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Track Your Order</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">Tracking order: {trackingOrderNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
      <Header />
      <Navbar />
      
      {/* Mobile Cart Button - Positioned higher to avoid overlap */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-black hover:bg-gray-900 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-600"
        aria-label="Open Cart"
      >
        <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Button - Positioned higher to avoid overlap */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
        aria-label="Toggle Filters"
      >
        <FiFilter className="w-5 h-5" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Cart Sidebar - Matching NewArrivals pattern */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full xs:w-80 sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-bold">Shopping Cart ({cartItemCount})</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-300 text-5xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
                    <p className="text-gray-500 text-base sm:text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-400 text-sm sm:text-base">Add Apple products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.size || item.storage}-${index}`} 
                        className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0"
                      >
                        <img 
                          src={item.images?.[0] || item.image} 
                          alt={item.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-500">{item.brand}</p>
                              <p className="text-xs text-gray-500">
                                {item.colour && `${item.colour} • `}{item.size || item.storage}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size || item.storage)}
                              className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                            >
                              <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="font-medium w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                            </div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 sm:p-5 md:p-6">
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {cartSummary.formatted.total}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {cartSummary.formatted.shipping}
                      </span>
                    </div>
                    <div className="border-t pt-2 sm:pt-3">
                      <div className="flex justify-between font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span>
                          {cartSummary.formatted.totalWithShipping}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCartCheckout}
                    className="w-full bg-black hover:bg-gray-900 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Proceed to Checkout ({cartItemCount} items)
                  </button>
                  
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full mt-2 sm:mt-3 border border-gray-300 text-gray-700 py-3 sm:py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <>
          <div 
            className="fixed inset-0 backdrop-blur-sm z-30 sm:hidden"
            onClick={() => {
              setShowMobileFilters(false);
              setMobileActiveDropdown(null);
            }}
          />
          <div className="fixed inset-0 z-40 sm:hidden flex">
            <div className="flex-1" onClick={() => {
              setShowMobileFilters(false);
              setMobileActiveDropdown(null);
            }} />
            <div className="w-4/5 max-w-sm bg-white shadow-xl h-full overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button 
                  onClick={() => {
                    setShowMobileFilters(false);
                    setMobileActiveDropdown(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { key: 'category', label: 'Category' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'storage', label: 'Storage' },
                  { key: 'colour', label: 'Colour' },
                  { key: 'chip', label: 'Chip' },
                  { key: 'technology', label: 'Technology' },
                  { key: 'discount', label: 'Discount' },
                  { key: 'priceRange', label: 'Price Range' },
                  { key: 'rating', label: 'Rating' },
                  { key: 'sort', label: 'Sort By' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <button
                      onClick={() => handleMobileDropdownToggle(key)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">{label}</span>
                      {mobileActiveDropdown === key ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </button>
                    {mobileActiveDropdown === key && (
                      <div className="mt-2 p-3 bg-white border rounded-lg max-h-60 overflow-y-auto">
                        {filterOptions[key] && filterOptions[key].length > 0 ? (
                          filterOptions[key].map(option => (
                            <button
                              key={option}
                              onClick={() => handleFilterChange(key, option)}
                              className={`w-full text-left p-3 rounded-lg mb-1 last:mb-0 hover:bg-gray-50 transition-colors ${
                                filters[key] === option ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'border border-transparent'
                              }`}
                            >
                              {option}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm p-2">No options available</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 relative z-0">
        <div className="min-h-screen bg-linear-to-b from-transparent to-gray-50">
          {/* Hero Section - Responsive */}
          <div className="bg-linear-to-r from-gray-900 via-black to-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="animate-fade-in mb-6 md:mb-0 md:w-2/3">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                      <img 
                        src="https://images.seeklogo.com/logo-png/15/2/apple-logo-png_seeklogo-158010.png" 
                        alt="Apple Logo" 
                        className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2">Apple Store</h1>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">Think different.</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mb-6 sm:mb-8">
                    Official Apple store featuring the latest iPhones, MacBooks, iPads, Apple Watch, and accessories. 
                    Experience innovation, privacy, and seamless integration across all Apple devices.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-lime-600 text-xs sm:text-sm">✓ 100% Authentic</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-violet-800 text-xs sm:text-sm">🚚 Free Delivery</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-emerald-900 text-xs sm:text-sm">🔒 14-Day Returns</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-amber-600 text-xs sm:text-sm">⚡ Fast Shipping</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{appleProducts.length}</div>
                    <div className="text-base md:text-lg">Apple Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {Object.entries(filters)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {searchQuery && (
                    <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                      <span className="font-medium">Search: {searchQuery}</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-blue-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Categories Section - Responsive */}
          <div className="bg-white py-6 sm:py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Shop By Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'iPhone' ? 'ring-2 sm:ring-4 ring-blue-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'iPhone' ? '' : 'iPhone')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-gray-800 to-black flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiSmartphone className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">iPhone</h3>
                      <p className="text-gray-300 mt-1 text-xs sm:text-sm">{categoryCounts.iPhone} Models</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Mac' ? 'ring-2 sm:ring-4 ring-blue-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Mac' ? '' : 'Mac')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-gray-900 to-blue-900 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiMonitor className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">Mac</h3>
                      <p className="text-gray-300 mt-1 text-xs sm:text-sm">{categoryCounts.Mac} Models</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'iPad' ? 'ring-2 sm:ring-4 ring-blue-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'iPad' ? '' : 'iPad')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-gray-800 to-purple-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiTablet className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">iPad</h3>
                      <p className="text-gray-300 mt-1 text-xs sm:text-sm">{categoryCounts.iPad} Models</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Apple Watch' ? 'ring-2 sm:ring-4 ring-blue-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Apple Watch' ? '' : 'Apple Watch')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-black to-gray-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiWatch className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">Apple Watch</h3>
                      <p className="text-gray-300 mt-1 text-xs sm:text-sm">{categoryCounts['Apple Watch']} Models</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-30 hidden sm:block">
            <div className="max-w-7xl mx-auto">
              <div className="px-4 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-xl">
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        placeholder="Search Apple products by name, category, or chip..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm sm:text-base"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                      >
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                      >
                        <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {filteredProducts.length} products
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="font-medium text-gray-700 text-sm sm:text-base">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
                  {[
                    { key: 'category', label: 'Category', options: filterOptions.category },
                    { key: 'productType', label: 'Type', options: filterOptions.productType },
                    { key: 'storage', label: 'Storage', options: filterOptions.storage },
                    { key: 'colour', label: 'Colour', options: filterOptions.colour },
                    { key: 'chip', label: 'Chip', options: filterOptions.chip }
                  ].map(({ key, label, options }) => (
                    <FilterDropdown
                      key={key}
                      label={label}
                      value={filters[key]}
                      options={options}
                      isOpen={activeDropdown === key}
                      onToggle={() => handleDropdownToggle(key)}
                      onSelect={(option) => handleFilterChange(key, option)}
                      onClear={() => clearFilter(key)}
                      onClose={() => setActiveDropdown(null)}
                    />
                  ))}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 overflow-x-auto pt-2">
                  {[
                    { key: 'technology', label: 'Technology', options: filterOptions.technology },
                    { key: 'discount', label: 'Discount', options: filterOptions.discount },
                    { key: 'priceRange', label: 'Price', options: filterOptions.priceRange },
                    { key: 'rating', label: 'Rating', options: filterOptions.rating },
                    { key: 'sort', label: 'Sort By', options: filterOptions.sort }
                  ].map(({ key, label, options }) => (
                    <FilterDropdown
                      key={key}
                      label={label}
                      value={filters[key]}
                      options={options}
                      isOpen={activeDropdown === key}
                      onToggle={() => handleDropdownToggle(key)}
                      onSelect={(option) => handleFilterChange(key, option)}
                      onClear={() => clearFilter(key)}
                      onClose={() => setActiveDropdown(null)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Summary */}
          <div className="sm:hidden bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4" />
                  <span className="font-medium text-sm">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="text-blue-600 font-medium text-xs sm:text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Section - Responsive */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Apple Products</h2>
                  <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">Designed for innovation and privacy</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-gray-600">Bestseller</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs sm:text-sm text-gray-600">In Stock</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs sm:text-sm text-gray-600">New Arrival</span>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCartWithDelay}
                    onViewDetails={viewProductDetails}
                    onBuyNow={buyNow}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-40 sm:h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/4 p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                {product.category}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {product.chip}
                              </span>
                              {product.isNew && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">{product.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="flex items-center">
                                <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
                                <span className="font-medium text-xs sm:text-sm">{product.rating}</span>
                                <span className="text-gray-500 ml-1 text-xs sm:text-sm">({product.reviews})</span>
                              </div>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              {product.storage && <span className="text-gray-500 text-xs sm:text-sm">Storage: {product.storage}</span>}
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-500 text-xs sm:text-sm">Colour: {product.colour}</span>
                            </div>
                          </div>
                          <div className="md:w-1/3 md:pl-4 lg:pl-6">
                            <div className="mb-3 sm:mb-4">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                {product.discount > 0 && (
                                  <>
                                    <span className="text-sm sm:text-base md:text-lg text-gray-500 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 text-xs sm:text-sm font-medium rounded">
                                      -{product.discount}%
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 mt-1">In stock: {product.stock} units</div>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                              <button
                                onClick={() => addToCartWithDelay(product)}
                                className="flex-1 bg-black hover:bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => buyNow(product)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 sm:py-12 md:py-16">
                <div className="text-gray-300 text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 animate-bounce"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Apple Products Found</h3>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
                  Try adjusting your filters or search query to discover our Apple collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-gray-900 to-blue-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-black hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>

          {/* Apple Technology Section - Responsive */}
          <div className="bg-linear-to-r from-gray-900 to-black text-white py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Apple Silicon & Innovation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiCpu className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Apple Silicon</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">Custom-designed M-series chips for breakthrough performance and efficiency</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiBattery className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Unified Memory</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">High-bandwidth, low-latency memory for smooth multitasking</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiCamera className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Computational Photography</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">Advanced image processing for professional-quality photos</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiShield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Privacy & Security</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">On-device processing and end-to-end encryption</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Shop With Us - Responsive */}
          <div className="bg-white py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8 md:mb-12">Why Shop Apple With Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">Authorized Retailer</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Direct from Apple authorized resellers with full authenticity guarantee</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiTruck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">Same-Day Delivery</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Express delivery available in select metro cities across India</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiShield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">1-Year Warranty</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Full Apple warranty coverage with option to add AppleCare+</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiRepeat className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">14-Day Returns</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Easy return policy for unopened items in original packaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Guide - Responsive */}
          <div className="bg-linear-to-r from-gray-50 to-blue-50 py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6 md:mb-8">Storage & Configuration Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-4">iPhone Storage</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">64GB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Essential apps & photos</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">128GB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Most users, photos & videos</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">256GB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Power users, 4K videos</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">512GB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Pro photographers</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-4">Mac Storage</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">256GB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Basic tasks, documents</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">512GB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Students, office work</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">1TB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Creative professionals</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">2TB</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Video editors, developers</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-4">Device Ecosystems</h3>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">Universal Control: Use one mouse & keyboard across Mac and iPad</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">AirDrop: Instantly share files between Apple devices</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">Handoff: Start work on one device, finish on another</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">iCloud: Seamless sync across all devices</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AppleStore;