import React, { useState, useMemo, useEffect } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import ProductCard from '../components/ProductCard';
import ProductDetailPage from '../components/ProductDetailPage';
import CheckoutPage from '../components/CheckoutPage';
import Footer from './Footer';
import Header from '../components/Header';
import Navbar from './Navbar';
import { FiX, FiShoppingCart, FiArrowLeft, FiTv, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import tvProductsData from '../dummyData/tvProducts';

const TVPage = () => {
  const [filters, setFilters] = useState({
    sort: 'Popularity',
    brand: '',
    screenSize: '',
    screenType: '',
    priceRange: '',
    discount: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  
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

  // State for backend integration
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchTVProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products from backend first
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
          // Filter for TV & Home Theater products
          const tvProductsBackend = productsData.filter(product => {
            const category = product.category || '';
            const catLower = category.toLowerCase();
            
            const name = product.name || '';
            const nameLower = name.toLowerCase();
            
            const description = product.description || '';
            const descLower = description.toLowerCase();
            
            // Check if it's a TV product
            const isTVCategory = 
              catLower.includes('tv') || 
              catLower.includes('television') || 
              catLower.includes('home theater') ||
              catLower.includes('home theatre') ||
              catLower === 'tv & home theater' ||
              catLower === 'television';
            
            const hasTVKeywords = 
              nameLower.includes('tv') ||
              nameLower.includes('television') ||
              nameLower.includes('smart tv') ||
              nameLower.includes('led tv') ||
              nameLower.includes('oled') ||
              nameLower.includes('qled') ||
              descLower.includes('tv') ||
              descLower.includes('television');
            
            return isTVCategory || hasTVKeywords;
          });
          
          console.log('Filtered TV products from backend:', tvProductsBackend.length);
          
          // Transform backend products data for TVs
          const transformedBackendProducts = tvProductsBackend.map(product => {
            // Extract screen size from name or description
            const extractScreenSize = () => {
              const text = (product.name || '') + ' ' + (product.description || '');
              const sizeMatch = text.match(/(\d+)(?:\s*inch|\s*英寸|\s*"|\s*''|\s*in)/i);
              if (sizeMatch && sizeMatch[1]) {
                return `${sizeMatch[1]}"`;
              }
              return '55"'; // Default size
            };
            
            // Extract screen type from name or description
            const extractScreenType = () => {
              const text = (product.name || '').toLowerCase() + ' ' + (product.description || '').toLowerCase();
              if (text.includes('oled')) return 'OLED';
              if (text.includes('qled')) return 'QLED';
              if (text.includes('miniled')) return 'Mini-LED';
              if (text.includes('nanocell')) return 'NanoCell';
              if (text.includes('led')) return 'LED';
              return 'LED'; // Default type
            };
            
            // Extract brand
            const extractBrand = () => {
              if (product.brand) return product.brand;
              const text = product.name || '';
              const tvBrands = ['Samsung', 'LG', 'Sony', 'Panasonic', 'TCL', 'Hisense', 'Xiaomi', 'OnePlus', 'Vu', 'BPL', 'Thomson'];
              for (const brand of tvBrands) {
                if (text.toLowerCase().includes(brand.toLowerCase())) {
                  return brand;
                }
              }
              return 'Samsung'; // Default brand
            };
            
            return {
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name || 'Smart TV',
              description: product.description || 'High-definition smart television with advanced features',
              brand: extractBrand(),
              category: 'TV',
              productType: 'Television',
              size: extractScreenSize(),
              screenType: extractScreenType(),
              price: product.price || 29999,
              discount: product.discount || Math.floor(Math.random() * 30) + 10,
              rating: product.rating || (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
              reviews: product.reviews || Math.floor(Math.random() * 200),
              image: product.images && product.images[0] ? product.images[0].url : 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&q=80',
              images: product.images ? product.images.map(img => img.url) : ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&q=80'],
              sizes: [extractScreenSize()],
              storage: '',
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : 'Black',
              colors: product.colors || ['Black', 'Silver', 'White'],
              stock: product.stock || Math.floor(Math.random() * 50) + 10,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isOnSale: product.isOnSale || false,
              originalPrice: product.originalPrice || (product.price ? product.price * 1.2 : 35999),
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
          
          // Transform dummy products to have unique IDs
          const uniqueDummyProducts = tvProductsData.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          
          // Combine both arrays - backend products first (newest), then dummy products
          const allProducts = [...transformedBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(transformedBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No products from backend, using dummy data only');
          const uniqueDummyProducts = tvProductsData.map(product => ({
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
        console.error('Error fetching TV products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = tvProductsData.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
        }));
        setProducts(uniqueDummyProducts);
        setBackendProducts([]);
        setUseFallbackData(true);
        setError('Unable to load products from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchTVProducts();
  }, []);

  // Dynamic filter options based on actual products (combined backend and dummy)
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    const screenSizes = [...new Set(currentProducts.map(p => p.size))].filter(Boolean);
    const screenTypes = [...new Set(currentProducts.map(p => p.screenType))].filter(Boolean);
    
    return {
      sort: ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Customer Rating', 'Discount', 'Newest'],
      brand: brands.sort(),
      screenSize: screenSizes.sort((a, b) => {
        const aNum = parseInt(a.replace(/[^\d]/g, '')) || 0;
        const bNum = parseInt(b.replace(/[^\d]/g, '')) || 0;
        return aNum - bNum;
      }),
      screenType: screenTypes.sort(),
      discount: ['All Discounts', '10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹20,000',
        '₹20,000 - ₹40,000',
        '₹40,000 - ₹70,000',
        '₹70,000 - ₹1,00,000',
        '₹1,00,000 - ₹2,00,000',
        'Above ₹2,00,000'
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
      size: product.size,
      category: product.category || 'TV',
      productType: product.screenType || '',
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
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'TV',
      productType: product.screenType || '',
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
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'TV',
      productType: product.screenType || '',
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
      screenSize: '',
      screenType: '',
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
    if (filters.screenSize) filtered = filtered.filter(p => p.size === filters.screenSize);
    if (filters.screenType) filtered = filtered.filter(p => p.screenType === filters.screenType);
    
    if (filters.discount && filters.discount !== 'All Discounts') {
      const minDiscount = parseInt(filters.discount);
      filtered = filtered.filter(p => p.discount >= minDiscount);
    }
    
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'Under ₹20,000': filtered = filtered.filter(p => p.price < 20000); break;
        case '₹20,000 - ₹40,000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 40000); break;
        case '₹40,000 - ₹70,000': filtered = filtered.filter(p => p.price >= 40000 && p.price <= 70000); break;
        case '₹70,000 - ₹1,00,000': filtered = filtered.filter(p => p.price >= 70000 && p.price <= 100000); break;
        case '₹1,00,000 - ₹2,00,000': filtered = filtered.filter(p => p.price >= 100000 && p.price <= 200000); break;
        case 'Above ₹2,00,000': filtered = filtered.filter(p => p.price > 200000); break;
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
          break;
      }
    }
    
    return filtered;
  }, [filters, products]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'Popularity');
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Screen size statistics
  const screenSizeStats = useMemo(() => {
    const stats = {};
    products.forEach(tv => {
      const size = tv.size;
      if (!stats[size]) {
        stats[size] = { count: 0, minPrice: Infinity };
      }
      stats[size].count++;
      stats[size].minPrice = Math.min(stats[size].minPrice, tv.price);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading televisions...</p>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to TVs</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
        size: checkoutProduct.size || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || '',
        category: checkoutProduct.category || 'TV',
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to TVs</span>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
                    <p className="text-gray-400 text-sm sm:text-base">Add TVs to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.size}-${index}`} 
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
                                {item.size && `${item.size}`}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
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
                <h2 className="text-lg font-bold">TV Filters</h2>
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
                  { key: 'screenSize', label: 'Screen Size' },
                  { key: 'screenType', label: 'Screen Type' },
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
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-cyan-50">
          {/* TV Banner */}
          <div className="bg-linear-to-r from-blue-800 to-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 animate-fade-in text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <FiTv className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {useFallbackData ? 'Premium Televisions' : 'Televisions Collection'}
                      </h1>
                      <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                        {products.length} Models Available
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
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key === 'screenSize' ? 'Size' : key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-blue-900"
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
                    <h2 className="text-lg font-bold text-gray-900">TV Filter</h2>
                    <p className="text-sm text-gray-600">Find your perfect television</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full font-medium transition-all duration-200 text-sm sm:text-base"
                    >
                      <FiFilter className="w-4 h-4" />
                      <span>{showDesktopFilters ? 'Hide' : 'Show'} Filters</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-blue-600">
                        {filteredProducts.length} TVs available
                    
                      </span>
                    </div>
                  </div>
                </div>
                
                {showDesktopFilters && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                    {[
                      { key: 'sort', label: 'Sort By', options: filterOptions.sort },
                      { key: 'brand', label: 'Brand', options: filterOptions.brand },
                      { key: 'screenSize', label: 'Screen Size', options: filterOptions.screenSize },
                      { key: 'screenType', label: 'Screen Type', options: filterOptions.screenType },
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
                  className="text-blue-600 font-medium text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
              </div>
            </div>
          </div>

          {/* Screen Size Guide */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📏 Popular Screen Sizes</h3>
              <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2">
                {Object.entries(screenSizeStats)
                  .sort(([a], [b]) => {
                    const aNum = parseInt(a.replace(/[^\d]/g, '')) || 0;
                    const bNum = parseInt(b.replace(/[^\d]/g, '')) || 0;
                    return aNum - bNum;
                  })
                  .map(([size, stats]) => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange('screenSize', size)}
                      className={`flex flex-col items-center p-3 sm:p-4 rounded-xl min-w-28 sm:min-w-32 transition-all duration-200 ${
                        filters.screenSize === size ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-bold text-gray-900">{size}"</span>
                      <span className="text-xs sm:text-sm text-gray-600">{stats.count} models</span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 mt-1">
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
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Featured Televisions</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    Smart TVs, 4K UHD, OLED, and more with latest features
                  </p>
                  <div className="flex items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Showing <span className="font-semibold">{filteredProducts.length}</span> television{filteredProducts.length !== 1 ? 's' : ''}
                      
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="relative group">
                      {/* Badge container to prevent overlap */}
                      <div className="absolute top-2 left-0 right-0 z-10 flex justify-between items-start px-2">
                        {/* Source badge */}
                        {product.source === 'backend' && (
                          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            New
                          </div>
                        )}
                        
                        {/* Discount badge positioned at top-left */}
                        {product.discount > 20 && (
                          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            -{product.discount}% OFF
                          </div>
                        )}
                        
                        {/* Screen size badge positioned at top-right */}
                        <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.size}"
                        </div>
                      </div>
                      
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
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">📺</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No TVs Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to find the perfect TV for your home.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Show All TVs
                </button>
              </div>
            )}
          </div>

          {/* TV Buying Guide */}
          <div className="bg-linear-to-r from-blue-50 to-cyan-50 py-8 sm:py-12 md:py-16 mt-6 sm:mt-8 md:mt-12 border-t border-blue-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">📺 TV Buying Guide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="text-xl sm:text-2xl mb-3 sm:mb-4">📏</div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Choose the Right Size</h3>
                  <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• Small rooms (10-15 ft): 32-43 inch</li>
                    <li>• Medium rooms (15-20 ft): 50-55 inch</li>
                    <li>• Large rooms (20+ ft): 65+ inch</li>
                    <li>• Consider viewing distance</li>
                  </ul>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="text-xl sm:text-2xl mb-3 sm:mb-4">⚡</div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Display Technology</h3>
                  <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• LED: Budget-friendly, good brightness</li>
                    <li>• QLED: Better colors, higher brightness</li>
                    <li>• OLED: Perfect blacks, best contrast</li>
                    <li>• 4K UHD: Standard for premium TVs</li>
                  </ul>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="text-xl sm:text-2xl mb-3 sm:mb-4">🔧</div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Smart Features</h3>
                  <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• Android TV: Google ecosystem</li>
                    <li>• webOS: LG's smooth interface</li>
                    <li>• Tizen: Samsung's platform</li>
                    <li>• Check app availability</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">🎮 Perfect for Your Needs</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🎬</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Movie Watching</h4>
                    <p className="text-xs sm:text-sm text-gray-600">OLED TVs with Dolby Vision</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🎮</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Gaming</h4>
                    <p className="text-xs sm:text-sm text-gray-600">High refresh rate & low latency</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🏠</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Living Room</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Large screens with smart features</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🛋️</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Bedroom</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Compact sizes with good sound</p>
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

export default TVPage;