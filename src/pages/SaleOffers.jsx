// src/pages/SaleOffers.jsx
import React, { useState, useMemo, useEffect } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import ProductCard from '../components/ProductCard';
import ProductDetailPage from '../components/ProductDetailPage';
import CheckoutPage from '../components/CheckoutPage';
import Footer from './Footer';
import Header from '../components/Header';
import Navbar from './Navbar';
import { FiX, FiShoppingCart, FiArrowLeft, FiFilter, FiChevronDown, FiChevronUp, FiTag, FiClock, FiPercent } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { saleProducts, getFilterOptions } from '../dummyData/saleProductsData';

const SaleOffers = () => {
  const [filters, setFilters] = useState({
    sort: '',
    brand: '',
    category: '',
    productType: '',
    size: '',
    discount: '',
    priceRange: ''
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
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45
  });

  // State for backend products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) {
          return { ...prev, seconds: newSeconds };
        }
        
        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) {
          return { ...prev, minutes: newMinutes, seconds: 59 };
        }
        
        const newHours = prev.hours - 1;
        if (newHours >= 0) {
          return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
        }
        
        const newDays = prev.days - 1;
        if (newDays >= 0) {
          return { ...prev, days: newDays, hours: 23, minutes: 59, seconds: 59 };
        }
        
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
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
          // Transform backend products data for sale items
          const transformedBackendProducts = productsData.map(product => {
            // Only include products with discount > 0 for sale
            const productDiscount = product.discount || 0;
            
            if (productDiscount <= 0) {
              return null;
            }
            
            // Determine category and product type
            const category = getCategoryFromBackend(product.category);
            const productType = getProductTypeFromCategory(product.category);
            
            // Calculate original price if not provided
            const originalPrice = product.originalPrice || 
              (product.price && productDiscount > 0 
                ? Math.round(product.price / (1 - productDiscount/100))
                : product.price);
            
            // Generate sale badge based on discount
            let saleBadge = '';
            if (productDiscount >= 70) saleBadge = '🔥 FLASH SALE';
            else if (productDiscount >= 50) saleBadge = '⚡ HOT DEAL';
            else if (productDiscount >= 30) saleBadge = '🎯 ON SALE';
            
            // Fix the rating to show full decimal value
            let ratingValue;
            if (product.rating !== undefined && product.rating !== null) {
              // Parse rating and ensure it's a number with proper decimal places
              const parsedRating = parseFloat(product.rating);
              // Check if it's a valid number
              if (!isNaN(parsedRating)) {
                // Ensure it has proper decimal formatting
                ratingValue = parseFloat(parsedRating.toFixed(2));
              } else {
                // Fallback to generated rating with proper decimal
                ratingValue = parseFloat((4.0 + Math.random() * 1.5).toFixed(2));
              }
            } else {
              // Generate rating with proper decimal formatting
              ratingValue = parseFloat((4.0 + Math.random() * 1.5).toFixed(2));
            }
            
            return {
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand,
              category: category,
              productType: productType,
              price: product.price,
              discount: productDiscount,
              rating: ratingValue,
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
              images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
              size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
              sizes: product.sizes || [],
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : '',
              colors: product.colors || [],
              stock: product.stock || Math.floor(Math.random() * 20) + 1,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isOnSale: productDiscount > 0,
              originalPrice: originalPrice,
              tags: product.tags || [],
              createdAt: product.createdAt || new Date(),
              isLimited: product.stock < 5 || Math.random() > 0.7,
              saleBadge: saleBadge,
              source: 'backend'
            };
          }).filter(product => product !== null); // Remove null products (no discount)
          
          // Sort backend products by discount (highest first)
          transformedBackendProducts.sort((a, b) => b.discount - a.discount);
          
          // Ensure dummy sale products have unique IDs and proper ratings
          const uniqueDummyProducts = saleProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000),
            // Ensure rating has proper decimal formatting
            rating: typeof product.rating === 'number' ? parseFloat(product.rating.toFixed(2)) : product.rating
          }));
          
          // Combine both arrays - backend products first (higher discounts)
          const allProducts = [...transformedBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(transformedBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No sale products from backend, using dummy data only');
          const uniqueDummyProducts = saleProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000),
            // Ensure rating has proper decimal formatting
            rating: typeof product.rating === 'number' ? parseFloat(product.rating.toFixed(2)) : product.rating
          }));
          setProducts(uniqueDummyProducts);
          setBackendProducts([]);
          setUseFallbackData(true);
        }
      } catch (error) {
        console.error('Error fetching sale products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = saleProducts.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000),
          // Ensure rating has proper decimal formatting
          rating: typeof product.rating === 'number' ? parseFloat(product.rating.toFixed(2)) : product.rating
        }));
        setProducts(uniqueDummyProducts);
        setBackendProducts([]);
        setUseFallbackData(true);
        setError('Unable to load sale products from server. Showing sample deals.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Helper function to categorize backend products
  const getCategoryFromBackend = (backendCategory) => {
    if (!backendCategory) return 'Electronics';
    
    const categoryMap = {
      'Men Clothes': 'Clothes',
      'Women Clothes': 'Clothes',
      'Men Sneakers': 'Shoes',
      'Women Sneakers': 'Shoes',
      'Men Watches': 'Watch',
      'Women Watches': 'Watch',
      'Men Fragrances': 'Fragrance',
      'Women Fragrances': 'Fragrance',
      'TV & Home Theater': 'Electronics',
      'Mobile Phones': 'Electronics',
      'Earbuds & Headphones': 'Electronics',
      'Clothes': 'Clothes',
      'Shoes': 'Shoes',
      'Electronics': 'Electronics',
      'Watch': 'Watch',
      'Fragrance': 'Fragrance'
    };
    
    return categoryMap[backendCategory] || backendCategory || 'Electronics';
  };

  // Helper function to get product type from category
  const getProductTypeFromCategory = (category) => {
    if (!category) return 'Smartphone';
    
    const typeMap = {
      'Men Clothes': 'Men\'s Clothing',
      'Women Clothes': 'Women\'s Clothing',
      'Men Sneakers': 'Men\'s Sneakers',
      'Women Sneakers': 'Women\'s Sneakers',
      'Men Watches': 'Men\'s Watch',
      'Women Watches': 'Women\'s Watch',
      'Men Fragrances': 'Men\'s Fragrance',
      'Women Fragrances': 'Women\'s Fragrance',
      'TV & Home Theater': 'Television',
      'Mobile Phones': 'Smartphone',
      'Earbuds & Headphones': 'Earbuds',
      'Clothes': 'Clothing',
      'Shoes': 'Footwear',
      'Electronics': 'Gadget',
      'Watch': 'Watch',
      'Fragrance': 'Fragrance'
    };
    
    return typeMap[category] || category || 'Product';
  };

  // Dynamic filter options based on actual products (combined backend and dummy)
  const filterOptions = useMemo(() => {
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    const categories = [...new Set(currentProducts.map(p => p.category))].filter(Boolean);
    const productTypes = filters.category
      ? [...new Set(currentProducts.filter(p => p.category === filters.category).map(p => p.productType))].filter(Boolean)
      : [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    
    // Extract all unique sizes from products
    const allSizes = new Set();
    currentProducts.forEach(p => {
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach(size => allSizes.add(size));
      } else if (p.size) {
        allSizes.add(p.size);
      }
    });
    const sizeOptions = Array.from(allSizes);
    
    return {
      sort: ['Discount: High to Low', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Popularity', 'Customer Rating'],
      brand: brands.sort(),
      category: categories.sort(),
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above', '60% and above', '70% and above'],
      priceRange: [
        'Under ₹1000',
        '₹1000 - ₹3000',
        '₹3000 - ₹5000',
        '₹5000 - ₹10000',
        '₹10000 - ₹20000',
        'Above ₹20000'
      ]
    };
  }, [filters.category, products]);

  // Cart functions using CartContext
  const addToCartWithDelay = async (product) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      images: product.images,
      colour: product.colour,
      size: product.size,
      category: product.category,
      quantity: 1,
      discount: product.discount,
      originalPrice: product.originalPrice
    });
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
      image: product.images?.[0],
      quantity: 1,
      size: product.size || '',
      storage: product.storage || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || '',
      discount: product.discount || 0,
      originalPrice: product.originalPrice || product.price
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
      category: product.category || '',
      discount: product.discount || 0,
      originalPrice: product.originalPrice || product.price
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
      sort: '',
      brand: '',
      category: '',
      productType: '',
      size: '',
      discount: '',
      priceRange: ''
    });
    setActiveDropdown(null);
    setMobileActiveDropdown(null);
    setShowMobileFilters(false);
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

  const trackOrder = (orderNumber) => {
    setTrackingOrderNumber(orderNumber);
    setTrackingMode(true);
    setNavigationHistory(prev => [...prev, 'checkout']);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply filters
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.size) filtered = filtered.filter(p => 
      (p.sizes && p.sizes.includes(filters.size)) || 
      p.size === filters.size
    );
    
    if (filters.discount) {
      const minDiscount = parseInt(filters.discount);
      filtered = filtered.filter(p => p.discount >= minDiscount);
    }
    
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'Under ₹1000': filtered = filtered.filter(p => p.price < 1000); break;
        case '₹1000 - ₹3000': filtered = filtered.filter(p => p.price >= 1000 && p.price <= 3000); break;
        case '₹3000 - ₹5000': filtered = filtered.filter(p => p.price >= 3000 && p.price <= 5000); break;
        case '₹5000 - ₹10000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 10000); break;
        case '₹10000 - ₹20000': filtered = filtered.filter(p => p.price >= 10000 && p.price <= 20000); break;
        case 'Above ₹20000': filtered = filtered.filter(p => p.price > 20000); break;
        default: break;
      }
    }
    
    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'Discount: High to Low':
          filtered.sort((a, b) => b.discount - a.discount);
          break;
        case 'Price: Low to High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'Newest':
          // Sort by creation date (newest first)
          filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          break;
        case 'Popularity':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'Customer Rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    } else {
      // Default sorting: by discount (highest first) when no sort is selected
      filtered.sort((a, b) => b.discount - a.discount);
    }
    
    return filtered;
  }, [filters, products]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Get cart summary
  const cartSummary = getCartSummary();

  const totalSavings = filteredProducts.reduce((total, product) => {
    const savings = (product.originalPrice || product.price * (1 + product.discount/100)) - product.price;
    return total + savings;
  }, 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hot deals...</p>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Sale</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
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
        storage: checkoutProduct.storage || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || '',
        category: checkoutProduct.category || '',
        discount: checkoutProduct.discount || 0
      }];
    } else {
      productsForCheckout = cart;
    }
    
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Sale</span>
        </button>
        
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Track Your Sale Order</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">Tracking order: {trackingOrderNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex flex-col">
      <Header />
      <Navbar />
      
      {/* Mobile Cart Button - Positioned higher to avoid overlap */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
        aria-label="Open Cart"
      >
        <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Button - Positioned higher to avoid overlap */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
        aria-label="Toggle Filters"
      >
        <FiFilter className="w-5 h-5" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-red-50">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Sale Cart ({cartItemCount})</h2>
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
                    <p className="text-gray-500 text-base sm:text-lg mb-2">Your sale cart is empty</p>
                    <p className="text-gray-400 text-sm sm:text-base">Add hot deals to save big!</p>
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
                              {item.discount && (
                                <div className="mt-1">
                                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                    -{item.discount}% OFF
                                  </span>
                                </div>
                              )}
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
                              {formatPrice ? formatPrice(item.price * item.quantity) : `₹${(item.price * item.quantity).toLocaleString()}`}
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
                <div className="border-t p-4 sm:p-5 md:p-6 bg-red-50">
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {cartSummary?.formatted?.total || `₹${cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {cartSummary?.formatted?.shipping || 'Free'}
                      </span>
                    </div>
                    <div className="border-t pt-2 sm:pt-3">
                      <div className="flex justify-between font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span>
                          {cartSummary?.formatted?.totalWithShipping || `₹${cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-green-600 font-bold mb-4 text-sm sm:text-base">
                    🎉 You're saving on every item!
                  </div>
                  
                  <button
                    onClick={handleCartCheckout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
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
              <div className="p-4 border-b flex items-center justify-between bg-red-50">
                <h2 className="text-lg font-bold text-gray-900">Sale Filters</h2>
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
                  { key: 'brand', label: 'Brand' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'size', label: 'Size' },
                  { key: 'discount', label: 'Discount' },
                  { key: 'priceRange', label: 'Price Range' },
                  { key: 'sort', label: 'Sort By' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <button
                      onClick={() => handleMobileDropdownToggle(key)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-sm">{label}</span>
                      {mobileActiveDropdown === key ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </button>
                    {mobileActiveDropdown === key && (
                      <div className="mt-2 p-3 bg-white border rounded-lg max-h-60 overflow-y-auto">
                        {filterOptions[key] && filterOptions[key].length > 0 ? (
                          filterOptions[key].map(option => (
                            <button
                              key={option}
                              onClick={() => handleFilterChange(key, option)}
                              className={`w-full text-left p-3 rounded-lg mb-1 last:mb-0 hover:bg-gray-50 transition-colors text-sm ${
                                filters[key] === option ? 'bg-red-50 text-red-600 border border-red-200' : 'border border-transparent'
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
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors text-sm"
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
        <div className="min-h-screen bg-linear-to-b from-red-50 to-orange-50">
          {/* Sale Banner with Countdown */}
          <div className="bg-linear-to-r from-red-600 to-orange-600 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="animate-pulse text-center lg:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-4">
                    <FiTag className="w-6 h-6 sm:w-8 sm:h-8" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                        {useFallbackData ? 'MEGA SALE EVENT' : 'REAL-TIME SALE DEALS'}
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl">
                        Up to 70% OFF on premium brands. Limited time offer! Don't miss these incredible deals.
                        {error && (
                          <span className="block text-yellow-200 text-xs mt-1">
                            {error}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                    <div className="bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                      <span className="text-xs sm:text-sm">Total Savings: ₹{totalSavings.toLocaleString()}+</span>
                    </div>
                    <div className="bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                      <span className="text-xs sm:text-sm">{filteredProducts.length} Hot Deals</span>
                    </div>
                    {backendProducts.length > 0 && (
                      <div className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                        <span className="text-xs sm:text-sm">Live Deals: {backendProducts.length}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Countdown Timer */}
                <div className="bg-white/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl mt-4 sm:mt-0">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <FiClock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <span className="text-base sm:text-lg md:text-xl font-bold">Sale Ends In:</span>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="text-center">
                      <div className="bg-white text-red-600 text-xl sm:text-2xl md:text-3xl font-bold px-2 sm:px-3 py-2 sm:py-3 rounded-lg">
                        {String(timeLeft.days).padStart(2, '0')}
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Days</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white text-red-600 text-xl sm:text-2xl md:text-3xl font-bold px-2 sm:px-3 py-2 sm:py-3 rounded-lg">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Hours</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white text-red-600 text-xl sm:text-2xl md:text-3xl font-bold px-2 sm:px-3 py-2 sm:py-3 rounded-lg">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Mins</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white text-red-600 text-xl sm:text-2xl md:text-3xl font-bold px-2 sm:px-3 py-2 sm:py-3 rounded-lg">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-red-50 border-b border-red-100">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {Object.entries(filters)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-red-900"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
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

          {/* Sale Categories Bar */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
              <div className="flex overflow-x-auto gap-2 sm:gap-3 scrollbar-hide">
                <button
                  onClick={() => handleFilterChange('discount', '70% and above')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    filters.discount === '70% and above' ? 'bg-red-100 text-red-600 font-bold' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  🔥 70%+ OFF
                </button>
                <button
                  onClick={() => handleFilterChange('discount', '60% and above')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    filters.discount === '60% and above' ? 'bg-red-100 text-red-600 font-bold' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⚡ 60%+ OFF
                </button>
                <button
                  onClick={() => handleFilterChange('discount', '50% and above')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    filters.discount === '50% and above' ? 'bg-red-100 text-red-600 font-bold' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  💥 50%+ OFF
                </button>
                <button
                  onClick={() => handleFilterChange('category', 'Electronics')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    filters.category === 'Electronics' ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  📱 Electronics
                </button>
                <button
                  onClick={() => handleFilterChange('category', 'Clothes')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    filters.category === 'Clothes' ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  👕 Fashion
                </button>
                <button
                  onClick={() => handleFilterChange('category', 'Shoes')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm ${
                    filters.category === 'Shoes' ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  👟 Footwear
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-30 hidden sm:block">
            <div className="max-w-7xl mx-auto">
              <div className="px-4 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {[
                    { key: 'sort', label: 'Sort', options: filterOptions.sort },
                    { key: 'brand', label: 'Brand', options: filterOptions.brand },
                    { key: 'category', label: 'Category', options: filterOptions.category },
                    { key: 'productType', label: 'Type', options: filterOptions.productType },
                    { key: 'size', label: 'Size', options: filterOptions.size }
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
              <div className="px-4 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
                  {[
                    { key: 'discount', label: 'Discount', options: filterOptions.discount },
                    { key: 'priceRange', label: 'Price', options: filterOptions.priceRange }
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
                      <span>Clear All</span>
                    </button>
                  )}
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
                    <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="text-red-600 font-medium text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            {/* Products Count */}
            <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">🔥 Hottest Deals</h2>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Save up to {filteredProducts.length > 0 ? Math.max(...filteredProducts.map(p => p.discount)) : 70}% on premium products
                  {useFallbackData && (
                    <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      Using sample deals only
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-red-50 px-3 sm:px-4 py-2 rounded-full">
                <span className="text-red-600 font-semibold text-sm sm:text-base">
                  Total Savings: ₹{totalSavings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Products Count */}
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold">{filteredProducts.length}</span> deal{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative group">
                    {product.isLimited && (
                      <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        ⚡ LIMITED STOCK
                      </div>
                    )}
                    {product.saleBadge && (
                      <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.saleBadge}
                      </div>
                    )}
                    
                    {/* Show source badge for backend products */}
                    {product.source === 'backend' && (
                      <div className="absolute top-10 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        LIVE
                      </div>
                    )}
                    
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Discount Ribbon */}
                      <div className="absolute -top-2 right-2 sm:-top-3 sm:right-4 bg-linear-to-r from-red-600 to-orange-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-t-lg shadow-lg z-10">
                        <span className="font-bold text-xs sm:text-sm">-{product.discount}% OFF</span>
                      </div>
                      
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
            ) : (
              <div className="text-center py-12 sm:py-16 md:py-20">
                <div className="text-gray-300 text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 animate-bounce">🎁</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Sale Items Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to find amazing deals. The sale is still on!
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-red-600 to-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Show All Deals
                </button>
              </div>
            )}
          </div>

          {/* Sale Information Section */}
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 py-8 sm:py-12 md:py-16 mt-8 sm:mt-12 border-t border-orange-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">🎉 Why Shop Our Sale?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiPercent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Massive Discounts</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Up to 70% off on premium brands and products</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiClock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Limited Time</h3>
                  <p className="text-gray-600 text-sm sm:text-base">These prices won't last. Grab deals before they're gone!</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiTag className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Premium Quality</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Same premium quality, just heavily discounted</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Free Shipping</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Free delivery on all sale orders over ₹1999</p>
                </div>
              </div>
              
              <div className="mt-12 sm:mt-16 bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">💰 How to Get the Best Deals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-red-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                    <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">1️⃣</div>
                    <h4 className="font-bold text-base sm:text-lg mb-2">Sort by Discount</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Filter to show highest discounts first to find the biggest savings</p>
                  </div>
                  <div className="bg-orange-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                    <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">2️⃣</div>
                    <h4 className="font-bold text-base sm:text-lg mb-2">Check Limited Stock</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Items marked "Limited Stock" sell out fast. Act quickly!</p>
                  </div>
                  <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                    <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">3️⃣</div>
                    <h4 className="font-bold text-base sm:text-lg mb-2">Use Cart Feature</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Add multiple items to cart to save even more with bundle deals</p>
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

export default SaleOffers;