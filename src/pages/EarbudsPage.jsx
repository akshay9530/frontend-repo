// src/pages/EarbudsPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import ProductCard from '../components/ProductCard';
import ProductDetailPage from '../components/ProductDetailPage';
import CheckoutPage from '../components/CheckoutPage';
import Footer from './Footer';
import Header from '../components/Header';
import Navbar from './Navbar';
import { FiX, FiShoppingCart, FiArrowLeft, FiHeadphones, FiFilter, FiChevronDown, FiChevronUp, FiChevronLeft, FiZap, FiVolume2 } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { earbudProducts as dummyProducts } from '../dummyData/earbudsData';

const EarbudsPage = () => {
  const [filters, setFilters] = useState({
    sort: 'Popularity',
    brand: '',
    batteryLife: '',
    features: '',
    priceRange: '',
    discount: ''
  });
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
  const [trackingMode, setTrackingMode] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);
  
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
          // Filter for earbuds-related products
          const earbudCategories = ['Earbuds & Headphones', 'Earbuds', 'Headphones', 'Audio', 'Electronics'];
          
          const filteredBackendProducts = productsData.filter(product => {
            const category = product.category || '';
            const name = product.name || '';
            const description = product.description || '';
            
            // Check if it's an earbud or headphone
            return earbudCategories.some(cat => 
              category.toLowerCase().includes(cat.toLowerCase()) ||
              name.toLowerCase().includes('earbud') ||
              name.toLowerCase().includes('earphone') ||
              name.toLowerCase().includes('headphone') ||
              description.toLowerCase().includes('earbud') ||
              description.toLowerCase().includes('earphone') ||
              description.toLowerCase().includes('headphone') ||
              description.toLowerCase().includes('wireless')
            );
          });
          
          // Transform backend earbud products
          const transformedBackendProducts = filteredBackendProducts.map(product => {
            // Extract battery life and features from description
            let batteryLife = '6 hours';
            let features = ['Wireless'];
            
            const desc = product.description || '';
            const batteryMatch = desc.match(/(\d+)\s*(hour|hr|hours|h)\s*battery/i);
            const featureKeywords = ['noise', 'cancellation', 'water', 'resistant', 'sweat', 'wireless', 'charging', 'bluetooth', 'audio', 'voice', 'assistant'];
            
            if (batteryMatch) batteryLife = `${batteryMatch[1]} hours`;
            
            // Extract features
            const extractedFeatures = [];
            if (desc.toLowerCase().includes('noise cancellation') || desc.toLowerCase().includes('anc')) {
              extractedFeatures.push('Active Noise Cancellation');
            }
            if (desc.toLowerCase().includes('water') || desc.toLowerCase().includes('sweat')) {
              extractedFeatures.push('Water Resistance');
            }
            if (desc.toLowerCase().includes('wireless charging')) {
              extractedFeatures.push('Wireless Charging');
            }
            if (desc.toLowerCase().includes('fast charging')) {
              extractedFeatures.push('Fast Charging');
            }
            
            if (extractedFeatures.length > 0) {
              features = [...features, ...extractedFeatures];
            }
            
            return {
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand || 'Unknown Brand',
              category: 'Electronics',
              productType: 'Earbuds',
              price: product.price,
              discount: product.discount || Math.floor(Math.random() * 30),
              rating: product.rating || 4.0 + Math.random() * 1.5,
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
              images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
              batteryLife: batteryLife,
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : 'Black',
              colors: product.colors || ['Black', 'White', 'Blue'],
              features: features,
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
          console.log('No earbud products from backend, using dummy data only');
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
        console.error('Error fetching earbud products:', error);
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
        setError('Unable to load earbuds from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

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
  
  // Cart functions using CartContext
  const addToCartWithDelay = async (product) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productForCart = {
      ...product,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      images: product.images || [product.image],
      colour: product.colour || '',
      size: product.batteryLife || '',
      brand: product.brand || '',
      category: product.category || 'Earbuds',
      quantity: 1,
      discount: product.discount || 0
    };
    
    addToCart(productForCart);
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
      images: product.images || [product.image],
      quantity: 1,
      size: product.batteryLife || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'Earbuds',
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
      image: product.images?.[0],
      images: product.images || [product.image],
      quantity: 1,
      size: product.batteryLife || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'Earbuds',
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
      batteryLife: '',
      features: '',
      priceRange: '',
      discount: ''
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
    } else {
      window.history.back();
    }
  };

  const trackOrder = (orderNumber) => {
    setTrackingOrderNumber(orderNumber);
    setTrackingMode(true);
    setNavigationHistory(prev => [...prev, 'checkout']);
  };

  // Dynamic filter options based on actual products
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    
    // Extract unique battery life options
    const batteryOptionsSet = new Set();
    currentProducts.forEach(p => {
      if (p.batteryLife) {
        batteryOptionsSet.add(p.batteryLife);
      }
    });
    const batteryOptions = Array.from(batteryOptionsSet);
    
    // Extract all features
    const allFeatures = new Set();
    currentProducts.forEach(p => {
      if (p.features && Array.isArray(p.features)) {
        p.features.forEach(f => allFeatures.add(f));
      }
    });
    const featureOptions = Array.from(allFeatures);
    
    return {
      sort: ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Customer Rating', 'Battery Life', 'Discount %', 'Newest'],
      brand: brands.sort(),
      batteryLife: batteryOptions.sort((a, b) => {
        // Extract numeric value for sorting
        const aNum = parseInt(a.replace(/[^\d]/g, '')) || 0;
        const bNum = parseInt(b.replace(/[^\d]/g, '')) || 0;
        return aNum - bNum;
      }),
      features: featureOptions.sort(),
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹2000',
        '₹2000 - ₹5000',
        '₹5000 - ₹10000',
        '₹10000 - ₹15000',
        '₹15000 - ₹20000',
        'Above ₹20000'
      ]
    };
  }, [products]);

  // Filter and sort products - INCLUDES ALL PRODUCTS (backend + dummy)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    
    if (filters.batteryLife) {
      const hours = parseInt(filters.batteryLife);
      filtered = filtered.filter(p => {
        if (!p.batteryLife) return false;
        const productHours = parseInt(p.batteryLife.replace(/[^\d]/g, '')) || 0;
        return productHours >= hours;
      });
    }
    
    if (filters.features) {
      filtered = filtered.filter(p => {
        if (!p.features) return false;
        if (Array.isArray(p.features)) {
          return p.features.includes(filters.features);
        }
        return p.features === filters.features;
      });
    }
    
    if (filters.discount) {
      const minDiscount = parseInt(filters.discount);
      filtered = filtered.filter(p => p.discount >= minDiscount);
    }
    
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'Under ₹2000': filtered = filtered.filter(p => p.price < 2000); break;
        case '₹2000 - ₹5000': filtered = filtered.filter(p => p.price >= 2000 && p.price <= 5000); break;
        case '₹5000 - ₹10000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 10000); break;
        case '₹10000 - ₹15000': filtered = filtered.filter(p => p.price >= 10000 && p.price <= 15000); break;
        case '₹15000 - ₹20000': filtered = filtered.filter(p => p.price >= 15000 && p.price <= 20000); break;
        case 'Above ₹20000': filtered = filtered.filter(p => p.price > 20000); break;
        default: break;
      }
    }
    
    if (filters.sort) {
      switch (filters.sort) {
        case 'Price: Low to High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'Popularity':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'Customer Rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'Battery Life':
          filtered.sort((a, b) => {
            const aHours = parseInt(a.batteryLife?.replace(/[^\d]/g, '')) || 0;
            const bHours = parseInt(b.batteryLife?.replace(/[^\d]/g, '')) || 0;
            return bHours - aHours;
          });
          break;
        case 'Discount %':
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

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Feature statistics
  const featureStats = useMemo(() => {
    const stats = {
      'Active Noise Cancellation': 0,
      'Water Resistance': 0,
      'Wireless Charging': 0,
      'Spatial Audio': 0,
      'Fast Charging': 0,
      'Voice Assistant': 0
    };
    
    products.forEach(earbud => {
      if (earbud.features) {
        if (Array.isArray(earbud.features)) {
          if (earbud.features.some(f => f.includes('Noise Cancellation') || f.includes('ANC'))) {
            stats['Active Noise Cancellation']++;
          }
          if (earbud.features.some(f => f.includes('Water') || f.includes('Sweat'))) {
            stats['Water Resistance']++;
          }
          if (earbud.features.some(f => f.includes('Wireless Charging'))) {
            stats['Wireless Charging']++;
          }
          if (earbud.features.some(f => f.includes('Spatial Audio'))) {
            stats['Spatial Audio']++;
          }
          if (earbud.features.some(f => f.includes('Fast Charging'))) {
            stats['Fast Charging']++;
          }
          if (earbud.features.some(f => f.includes('Voice Assistant'))) {
            stats['Voice Assistant']++;
          }
        }
      }
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading earbuds...</p>
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
          <span className="font-medium">Back to Earbuds</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
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
        size: checkoutProduct.batteryLife || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || '',
        category: checkoutProduct.category || 'Earbuds',
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
          <span className="font-medium">Back to Earbuds</span>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
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
                    <div className="text-gray-300 text-5xl sm:text-6xl mb-3 sm:mb-4">🎧</div>
                    <p className="text-gray-500 text-base sm:text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-400 text-sm sm:text-base">Add earbuds to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item, index) => (
                      <div 
                        key={`${item.id}-${item.size || item.batteryLife}-${index}`} 
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
                                {item.colour && `${item.colour} • `}{item.batteryLife || item.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size || item.batteryLife)}
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
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
                <h2 className="text-lg font-bold">Earbuds Filters</h2>
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
                  { key: 'batteryLife', label: 'Battery Life' },
                  { key: 'features', label: 'Features' },
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
        <div className="min-h-screen bg-linear-to-b from-transparent to-gray-50">
          {/* Hero Banner */}
          <div className="bg-linear-to-r from-green-800 to-emerald-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-full transition-all duration-200 text-sm sm:text-base"
                  >
                    <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FiHeadphones className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div className="animate-fade-in">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Wireless Earbuds</h1>
                      <p className="mt-1 opacity-90 text-xs sm:text-sm md:text-base">
                        Music without limits • {products.length} Premium Models
                        {error && (
                          <span className="block text-yellow-200 text-xs mt-1">
                            {error}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block animate-pulse">
                  <div className="bg-white bg-opacity-20 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                    <span className="text-sm sm:text-base md:text-lg text-black font-medium">
                      Free Shipping on Orders Over ₹999

                      
                    </span>
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
                    .filter(([_, value]) => value && value !== 'Popularity')
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key === 'batteryLife' ? 'Battery Life' : 
                           key === 'priceRange' ? 'Price Range' :
                           key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-blue-900"
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

          {/* Quick Stats */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{products.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Models</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-xl">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                    {products.length > 0 ? Math.max(...products.map(p => p.discount)) : 0}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Max Discount</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                    {products.filter(p => p.features && (p.features.includes('ANC') || p.features.includes('Noise Cancellation'))).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Noise Cancelling</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                    {products.filter(p => p.price < 5000).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Budget Options</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">✨ Key Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(featureStats).map(([feature, count]) => (
                  <button
                    key={feature}
                    onClick={() => handleFilterChange('features', feature)}
                    className={`p-3 sm:p-4 rounded-xl text-center transition-all duration-200 ${filters.features === feature ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="text-base sm:text-lg font-bold text-gray-900">{count}</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{feature}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-30 hidden sm:block">
            <div className="max-w-7xl mx-auto">
              <div className="px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Earbuds Filter</h2>
                    <p className="text-sm text-gray-600">Find your perfect audio companion</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-semibold text-green-600">
                        {filteredProducts.length} earbuds available
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {[
                    { key: 'sort', label: 'Sort', options: filterOptions.sort },
                    { key: 'brand', label: 'Brand', options: filterOptions.brand },
                    { key: 'batteryLife', label: 'Battery', options: filterOptions.batteryLife },
                    { key: 'features', label: 'Features', options: filterOptions.features },
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

          {/* Price Categories */}
          <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">💰 Choose Your Budget</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => handleFilterChange('priceRange', 'Under ₹2000')}
                  className={`p-4 sm:p-6 rounded-xl text-center transition-all duration-200 ${filters.priceRange === 'Under ₹2000' ? 'bg-green-100 border-2 border-green-500' : 'bg-white hover:bg-gray-100'}`}
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Budget</div>
                  <div className="text-base sm:text-lg text-gray-600">Under ₹2K</div>
                  <div className="text-xs sm:text-sm text-green-600 mt-2">Great value picks</div>
                </button>
                <button
                  onClick={() => handleFilterChange('priceRange', '₹5000 - ₹10000')}
                  className={`p-4 sm:p-6 rounded-xl text-center transition-all duration-200 ${filters.priceRange === '₹5000 - ₹10000' ? 'bg-green-100 border-2 border-green-500' : 'bg-white hover:bg-gray-100'}`}
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Mid-range</div>
                  <div className="text-base sm:text-lg text-gray-600">₹5K - ₹10K</div>
                  <div className="text-xs sm:text-sm text-green-600 mt-2">Best features</div>
                </button>
                <button
                  onClick={() => handleFilterChange('priceRange', 'Above ₹20000')}
                  className={`p-4 sm:p-6 rounded-xl text-center transition-all duration-200 ${filters.priceRange === 'Above ₹20000' ? 'bg-green-100 border-2 border-green-500' : 'bg-white hover:bg-gray-100'}`}
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Premium</div>
                  <div className="text-base sm:text-lg text-gray-600">₹20K+</div>
                  <div className="text-xs sm:text-sm text-green-600 mt-2">Top-tier audio</div>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            {/* Products Count */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Featured Earbuds</h2>
              <p className="mt-1 sm:mt-2 text-gray-600 text-sm sm:text-base">
                Wireless freedom with premium sound quality • Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative group">
                    {product.discount > 25 && (
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
                    
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
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
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">🎧</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Earbuds Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to find the perfect wireless earbuds.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Show All Earbuds
                </button>
              </div>
            )}
          </div>

          {/* Earbuds Buying Guide */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 py-8 sm:py-12 md:py-16 mt-8 sm:mt-12 border-t border-green-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">🎧 Earbuds Buying Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <FiZap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
                    <h3 className="font-bold text-base sm:text-lg">Battery & Connectivity</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>5+ hours for daily use</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Fast charging support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Bluetooth 5.0+ for stability</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Multipoint connection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Wireless charging case</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <FiVolume2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
                    <h3 className="font-bold text-base sm:text-lg">Sound & Features</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Active Noise Cancellation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Transparency/Ambient mode</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Customizable EQ</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Voice assistant support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Spatial audio support</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <FiHeadphones className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
                    <h3 className="font-bold text-base sm:text-lg">Comfort & Durability</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Multiple ear tip sizes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Secure fit for workouts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>IP rating for sweat/water</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Lightweight design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Premium build quality</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">🎯 Perfect for Your Lifestyle</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🏃</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Workouts</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Sweat resistance & secure fit</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">✈️</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Travel</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Noise cancellation & long battery</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">💼</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Work</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Crystal clear calls & comfort</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl">🎮</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Gaming</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Low latency & immersive sound</p>
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

export default EarbudsPage;