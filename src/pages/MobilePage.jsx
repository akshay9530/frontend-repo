import React, { useState, useMemo, useEffect } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import ProductCard from '../components/ProductCard';
import ProductDetailPage from '../components/ProductDetailPage';
import CheckoutPage from '../components/CheckoutPage';
import Footer from './Footer';
import Header from '../components/Header';
import Navbar from './Navbar';
import { FiX, FiShoppingCart, FiArrowLeft, FiSmartphone, FiFilter, FiChevronDown, FiChevronUp, FiBattery, FiCamera } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { smartphoneProducts as dummyProducts } from '../dummyData/smartphoneData';

const SmartphonePage = () => {
  const [filters, setFilters] = useState({
    sort: 'Popularity',
    brand: '',
    ram: '',
    storage: '',
    priceRange: '',
    discount: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  
  // Use CartContext instead of local cart state
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
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productDetailMode, setProductDetailMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutType, setCheckoutType] = useState('single');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [trackingMode, setTrackingMode] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchSmartphoneProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products from backend
        const response = await fetch('http://localhost:5000/api/products?limit=100&sort=-createdAt');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Backend response (all products):', data);
        
        // Handle different response structures
        let productsData = [];
        
        if (data.success) {
          productsData = data.data || data.products || [];
        } else if (Array.isArray(data)) {
          productsData = data;
        } else if (data.products) {
          productsData = data.products;
        }
        
        if (Array.isArray(productsData) && productsData.length > 0) {
          // Filter for smartphone-related products
          const smartphoneCategories = ['Mobile Phones', 'Smartphone', 'Electronics'];
          
          const filteredBackendProducts = productsData.filter(product => {
            const category = product.category || '';
            const name = product.name || '';
            const description = product.description || '';
            
            // Check if it's a smartphone
            return smartphoneCategories.some(cat => 
              category.toLowerCase().includes(cat.toLowerCase()) ||
              name.toLowerCase().includes('phone') ||
              name.toLowerCase().includes('smartphone') ||
              description.toLowerCase().includes('phone') ||
              description.toLowerCase().includes('smartphone')
            );
          });
          
          // Transform backend smartphone products
          const transformedBackendProducts = filteredBackendProducts.map(product => {
            // Extract RAM and Storage from description if not in product data
            let ram = '8GB';
            let storage = '128GB';
            
            const desc = product.description || '';
            const ramMatch = desc.match(/(\d+)\s*(GB|gb)\s*RAM/);
            const storageMatch = desc.match(/(\d+)\s*(GB|gb|TB|tb)\s*(?:storage|memory)/);
            
            if (ramMatch) ram = `${ramMatch[1]}GB`;
            if (storageMatch) storage = `${storageMatch[1]}${storageMatch[2].toUpperCase()}`;
            
            return {
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand || 'Unknown Brand',
              category: 'Electronics',
              productType: 'Smartphone',
              model: product.model || product.name,
              price: product.price,
              discount: product.discount || Math.floor(Math.random() * 30),
              rating: product.rating || 4.0 + Math.random() * 1.5,
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
              images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
              storage: storage,
              ram: ram,
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : 'Black',
              colors: product.colors || ['Black', 'White', 'Blue'],
              stock: product.stock || 10,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isOnSale: product.isOnSale || false,
              originalPrice: product.originalPrice || product.price * 1.2,
              tags: product.tags || [],
              createdAt: product.createdAt || new Date(),
              source: 'backend'
            };
          });
          
          // Sort backend products by creation date (newest first)
          transformedBackendProducts.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          
          // Ensure dummy products have unique IDs that don't conflict
          const uniqueDummyProducts = dummyProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          
          // Combine both arrays
          const allProducts = [...transformedBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(transformedBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No smartphone products from backend, using dummy data only');
          const uniqueDummyProducts = dummyProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          setProducts(uniqueDummyProducts);
          setBackendProducts([]);
          setUseFallbackData(true);
        }
      } catch (error) {
        console.error('Error fetching smartphone products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = dummyProducts.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
        }));
        setProducts(uniqueDummyProducts);
        setBackendProducts([]);
        setUseFallbackData(true);
        setError('Unable to load smartphones from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchSmartphoneProducts();
  }, []);

  // Dynamic filter options based on actual products
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    const ramOptions = [...new Set(currentProducts.map(p => p.ram))].filter(Boolean);
    const storageOptions = [...new Set(currentProducts.map(p => p.storage))].filter(Boolean);
    
    return {
      sort: ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Customer Rating', 'Discount', 'Newest'],
      brand: brands.sort(),
      ram: ramOptions.sort((a, b) => {
        // Extract numeric value for sorting
        const aNum = parseInt(a.replace(/[^\d]/g, '')) || 0;
        const bNum = parseInt(b.replace(/[^\d]/g, '')) || 0;
        return aNum - bNum;
      }),
      storage: storageOptions.sort((a, b) => {
        // Convert to MB for comparison
        const toMB = (val) => {
          if (val.includes('TB')) return parseInt(val.replace(/[^\d]/g, '')) * 1000;
          return parseInt(val.replace(/[^\d]/g, '')) || 0;
        };
        return toMB(a) - toMB(b);
      }),
      discount: ['All Discounts', '10% and above', '15% and above', '20% and above', '25% and above', '30% and above'],
      priceRange: [
        'Under ₹20,000',
        '₹20,000 - ₹40,000',
        '₹40,000 - ₹60,000',
        '₹60,000 - ₹90,000',
        '₹90,000 - ₹1,50,000',
        'Above ₹1,50,000'
      ]
    };
  }, [products]);

  // Cart functions using CartContext
  const addToCartWithDelay = async (product) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Prepare product for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images?.[0] || product.image,
      images: product.images || [product.image],
      colour: product.colour || '',
      storage: product.storage,
      ram: product.ram,
      category: product.category || 'Smartphone',
      productType: product.model || '',
      discount: product.discount || 0,
      quantity: 1
    };
    
    addToCart(cartProduct);
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
      image: product.images?.[0] || product.image,
      quantity: 1,
      storage: product.storage || '',
      ram: product.ram || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'Smartphone',
      productType: product.model || '',
      discount: product.discount || 0
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
      image: product.images?.[0] || product.image,
      quantity: 1,
      storage: product.storage || '',
      ram: product.ram || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'Smartphone',
      productType: product.model || '',
      discount: product.discount || 0
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
    console.log('Purchase completed:', orderData);
    
    if (checkoutType === 'cart') {
      clearCart();
    }
    
    setCheckoutMode(false);
    setCheckoutProduct(null);
    setProductDetailMode(false);
    setNavigationHistory([]);
  };

  const handleWishlist = (product) => {
    console.log('Added to wishlist:', product);
  };

  const handleShare = (product) => {
    console.log('Share product:', product);
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
      sort: 'Popularity',
      brand: '',
      ram: '',
      storage: '',
      priceRange: '',
      discount: ''
    });
    setActiveDropdown(null);
    setMobileActiveDropdown(null);
    setShowMobileFilters(false);
    setShowDesktopFilters(false);
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
    } else {
      window.history.back();
    }
  };

  const trackOrder = (orderNumber) => {
    setTrackingOrderNumber(orderNumber);
    setTrackingMode(true);
    setNavigationHistory(prev => [...prev, 'checkout']);
  };

  // Filter and sort products - INCLUDES ALL PRODUCTS (backend + dummy)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply filters
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    if (filters.ram) filtered = filtered.filter(p => p.ram === filters.ram);
    if (filters.storage) filtered = filtered.filter(p => p.storage === filters.storage);
    
    if (filters.discount && filters.discount !== 'All Discounts') {
      const minDiscount = parseInt(filters.discount);
      filtered = filtered.filter(p => p.discount >= minDiscount);
    }
    
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'Under ₹20,000': filtered = filtered.filter(p => p.price < 20000); break;
        case '₹20,000 - ₹40,000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 40000); break;
        case '₹40,000 - ₹60,000': filtered = filtered.filter(p => p.price >= 40000 && p.price <= 60000); break;
        case '₹60,000 - ₹90,000': filtered = filtered.filter(p => p.price >= 60000 && p.price <= 90000); break;
        case '₹90,000 - ₹1,50,000': filtered = filtered.filter(p => p.price >= 90000 && p.price <= 150000); break;
        case 'Above ₹1,50,000': filtered = filtered.filter(p => p.price > 150000); break;
        default: break;
      }
    }
    
    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'Popularity':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'Price: Low to High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'Customer Rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'Discount':
          filtered.sort((a, b) => b.discount - a.discount);
          break;
        case 'Newest':
          // Sort by creation date (newest first)
          filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          break;
        default:
          // Default sort by popularity
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
      }
    } else {
      // Default sort by newest
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
    }
    
    return filtered;
  }, [filters, products]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'Popularity');
  
  // Get cart summary
  const cartSummary = getCartSummary();

  const brandStats = useMemo(() => {
    const stats = {};
    products.forEach(phone => {
      const brand = phone.brand;
      if (!stats[brand]) {
        stats[brand] = { count: 0, minPrice: Infinity };
      }
      stats[brand].count++;
      stats[brand].minPrice = Math.min(stats[brand].minPrice, phone.price);
    });
    return stats;
  }, [products]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading smartphones...</p>
          </div>
        </div>
      </div>
    );
  }

  // If in product detail mode, show product detail page
  if (productDetailMode && selectedProduct) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Phones</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
          aria-label="Open Cart"
        >
          <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </button>

        <ProductDetailPage
          product={selectedProduct}
          onBack={goBack}
          onAddToCart={addToCartFromDetail}
          onBuyNow={buyNowFromDetail}
          onWishlist={handleWishlist}
          onShare={handleShare}
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
        storage: checkoutProduct.storage || '',
        ram: checkoutProduct.ram || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || '',
        category: checkoutProduct.category || 'Smartphone',
        productType: checkoutProduct.productType || '',
        discount: checkoutProduct.discount || 0
      }];
    } else {
      productsForCheckout = cart;
    }
    
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Phones</span>
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
      
      {/* Mobile Cart Button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
        aria-label="Open Cart"
      >
        <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center"
        aria-label="Toggle Filters"
      >
        <FiFilter className="w-5 h-5" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
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
                    <p className="text-gray-400 text-sm sm:text-base">Add phones to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.storage}-${index}`} 
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
                                {item.ram && `${item.ram} RAM • `}{item.storage}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.storage)}
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
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
                <h2 className="text-lg font-bold">Phone Filters</h2>
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
                  { key: 'sort', label: 'Sort By' },
                  { key: 'brand', label: 'Brand' },
                  { key: 'ram', label: 'RAM' },
                  { key: 'storage', label: 'Storage' },
                  { key: 'discount', label: 'Discount' },
                  { key: 'priceRange', label: 'Price Range' }
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
                                filters[key] === option ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'border border-transparent'
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
        <div className="min-h-screen bg-linear-to-b from-purple-50 to-pink-50">
          {/* Smartphone Banner */}
          <div className="bg-linear-to-r from-purple-700 to-pink-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 animate-fade-in text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <FiSmartphone className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Smartphones</h1>
                      <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                        Power in your pocket
                        {error && (
                          <span className="block text-yellow-200 text-xs mt-1">
                            {error}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold mb-1">{products.length} Models</div>
                  <p className="text-sm opacity-90">
                    From ₹{products.length > 0 ? Math.min(...products.map(p => p.price)).toLocaleString() : '0'}
                  </p>
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
                    .filter(([key, value]) => value && key !== 'sort' && value !== 'Popularity')
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-purple-900"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-30 hidden sm:block">
            <div className="max-w-7xl mx-auto">
              <div className="px-4 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Phone Filter</h2>
                    <p className="text-sm text-gray-600">Find your perfect smartphone</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full font-medium transition-all duration-200 text-sm sm:text-base"
                    >
                      <FiFilter className="w-4 h-4" />
                      <span>{showDesktopFilters ? 'Hide' : 'Show'} Filters</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-purple-600">
                        {filteredProducts.length} Phones available
                      </span>
                    </div>
                  </div>
                </div>
                
                {showDesktopFilters && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                    {[
                      { key: 'sort', label: 'Sort By', options: filterOptions.sort },
                      { key: 'brand', label: 'Brand', options: filterOptions.brand },
                      { key: 'ram', label: 'RAM', options: filterOptions.ram },
                      { key: 'storage', label: 'Storage', options: filterOptions.storage },
                      { key: 'discount', label: 'Discount', options: filterOptions.discount },
                      { key: 'priceRange', label: 'Price Range', options: filterOptions.priceRange }
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
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-full font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
                      >
                        <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Filter Summary */}
          <div className="sm:hidden bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4" />
                  <span className="font-medium">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {Object.values(filters).filter(v => v && v !== 'Popularity').length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="text-purple-600 font-medium text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
              </div>
            </div>
          </div>

          {/* Brand Guide */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Popular Brands</h3>
              <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2">
                {Object.entries(brandStats)
                  .sort(([,a], [,b]) => b.count - a.count)
                  .map(([brand, stats]) => (
                    <button
                      key={brand}
                      onClick={() => handleFilterChange('brand', brand)}
                      className={`flex flex-col items-center p-3 sm:p-4 rounded-xl min-w-28 sm:min-w-32 transition-all duration-200 ${
                        filters.brand === brand ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-bold text-gray-900">{brand}</span>
                      <span className="text-xs sm:text-sm text-gray-600">{stats.count} models</span>
                      <span className="text-xs sm:text-sm font-semibold text-purple-600 mt-1">
                        From ₹{stats.minPrice === Infinity ? '0' : stats.minPrice.toLocaleString()}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            {filteredProducts.length > 0 ? (
              <>
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Featured Smartphones</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {filteredProducts.length} models with latest technology
  
                  </p>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="relative group">
                      {/* Only show discount badge when discount > 20% */}
                      {product.discount > 20 && (
                        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                          -{product.discount}% OFF
                        </div>
                      )}
                      
                      {/* Show source badge */}
                      {product.source === 'backend' && (
                        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Live
                        </div>
                      )}
                      
                      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <ProductCard
                          product={product}
                          onAddToCart={addToCartWithDelay}
                          onViewDetails={viewProductDetails}
                          onBuyNow={buyNow}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 sm:py-16 md:py-20">
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">📱</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Phones Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to find the perfect phone for your needs.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Show All Phones
                </button>
              </div>
            )}
          </div>

          {/* Smartphone Buying Guide */}
          <div className="bg-linear-to-r from-purple-50 to-pink-50 py-8 sm:py-12 md:py-16 mt-6 sm:mt-8 md:mt-12 border-t border-purple-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">📱 Smartphone Buying Guide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <FiCamera className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
                    <h3 className="font-bold text-base sm:text-lg">Camera Quality</h3>
                  </div>
                  <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• Main sensor: 48MP+ for detailed photos</li>
                    <li>• Optical Image Stabilization (OIS)</li>
                    <li>• Night mode for low-light</li>
                    <li>• Video recording: 4K 60fps</li>
                    <li>• Front camera: 32MP+ for selfies</li>
                  </ul>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <FiBattery className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
                    <h3 className="font-bold text-base sm:text-lg">Battery & Performance</h3>
                  </div>
                  <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• Battery: 4500mAh+ for all-day use</li>
                    <li>• Fast charging: 65W+ recommended</li>
                    <li>• Processor: Snapdragon 8 series</li>
                    <li>• RAM: 8GB+ for multitasking</li>
                    <li>• Storage: 128GB+ minimum</li>
                  </ul>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="text-xl sm:text-2xl mb-3 sm:mb-4">📱</div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Display & Design</h3>
                  <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• AMOLED for vibrant colors</li>
                    <li>• 120Hz refresh rate for smoothness</li>
                    <li>• HDR10+ for content consumption</li>
                    <li>• IP rating for water resistance</li>
                    <li>• Gorilla Glass protection</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">🎯 Choose Your Perfect Phone</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">📸</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Photography Enthusiast</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Flagships with pro cameras</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🎮</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Mobile Gamer</h4>
                    <p className="text-xs sm:text-sm text-gray-600">High refresh rate & cooling</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">💼</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Business User</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Security & productivity</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">📚</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Student</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Budget-friendly & durable</p>
                  </div>
                </div>
              </div>

              {/* Price Category Guide */}
              <div className="mt-8 sm:mt-12 bg-linear-to-r from-purple-100 to-pink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6 md:mb-8">💰 Price Range Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white p-4 sm:p-6 rounded-xl">
                    <h4 className="font-bold text-base sm:text-lg text-green-600 mb-2 sm:mb-3">Budget (Under ₹25,000)</h4>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                      <li>• Long battery life</li>
                      <li>• Good main camera</li>
                      <li>• 90Hz display</li>
                      <li>• 5G connectivity</li>
                      <li>• 2 years of updates</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl">
                    <h4 className="font-bold text-base sm:text-lg text-blue-600 mb-2 sm:mb-3">Mid-range (₹25,000 - ₹60,000)</h4>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                      <li>• Flagship-like cameras</li>
                      <li>• 120Hz AMOLED</li>
                      <li>• Premium design</li>
                      <li>• Fast charging</li>
                      <li>• 3+ years of updates</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl">
                    <h4 className="font-bold text-base sm:text-lg text-purple-600 mb-2 sm:mb-3">Flagship (₹60,000+)</h4>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                      <li>• Best-in-class cameras</li>
                      <li>• Premium materials</li>
                      <li>• IP68 water resistance</li>
                      <li>• Wireless charging</li>
                      <li>• 5+ years of updates</li>
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
};

export default SmartphonePage;