import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import Footer from './Footer'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiStar, FiCheck, FiTruck, FiShield, FiRepeat, FiGrid, FiList, FiFilter, FiWatch, FiClock, FiCalendar, FiSun, FiMoon, FiZap, FiNavigation, FiMap, FiGlobe, FiMusic, FiSmartphone, FiTrendingUp, FiTarget, FiAward, FiFeather, FiCompass, FiAnchor, FiPocket, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { casioProducts } from '../dummyData/casioProducts'

const CasioStore = () => {
  // Use CartContext with all functions
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
    model: '',
    colour: '',
    discount: '',
    collection: '',
    features: '',
    movement: '',
    waterResistance: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [productDetailMode, setProductDetailMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [checkoutProduct, setCheckoutProduct] = useState(null)
  const [checkoutType, setCheckoutType] = useState('single')
  const [navigationHistory, setNavigationHistory] = useState([])
  const [trackingMode, setTrackingMode] = useState(false)
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  
  // New state for backend integration
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
          // Filter and transform only Casio brand products from backend
          const casioBackendProducts = productsData
            .filter(product => 
              product.brand && product.brand.toLowerCase().includes('casio') ||
              product.name && product.name.toLowerCase().includes('casio')
            )
            .map(product => ({
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand || 'Casio',
              category: getCategoryForCasio(product.category || product.name),
              productType: getProductTypeForCasio(product.category || product.name),
              price: product.price,
              discount: product.discount || 0,
              rating: product.rating || 4.5,
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : getCasioPlaceholderImage(product.category || product.name),
              images: product.images ? product.images.map(img => img.url) : [getCasioPlaceholderImage(product.category || product.name)],
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : getRandomCasioColor(),
              colors: product.colors || [getRandomCasioColor()],
              size: getDefaultSizeForCategory(product.category || product.name),
              stock: product.stock || 10,
              isNew: product.isNewArrival || false,
              isFeatured: product.isFeatured || false,
              originalPrice: product.originalPrice || product.price * 1.2,
              collection: getCollectionForCasio(product.name),
              model: extractModelNumber(product.name),
              features: getFeaturesForCasio(product.category || product.name),
              movement: getMovementType(product.category || product.name),
              waterResistance: getWaterResistance(product.category || product.name),
              createdAt: product.createdAt || new Date(),
              source: 'backend'
            }));
          
          // Sort backend products by creation date (newest first)
          casioBackendProducts.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          
          // Transform dummy products to have unique IDs
          const uniqueDummyProducts = casioProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          
          // Combine both arrays
          const allProducts = [...casioBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(casioBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No Casio products from backend, using dummy data only');
          const uniqueDummyProducts = casioProducts.map(product => ({
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
        console.error('Error fetching Casio products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = casioProducts.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
        }));
        setProducts(uniqueDummyProducts);
        setBackendProducts([]);
        setUseFallbackData(true);
        setError('Unable to load Casio products from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Helper functions for Casio products
  const getCategoryForCasio = (category) => {
    if (!category) return 'Watches';
    
    const categoryMap = {
      'Watches': 'Watches',
      'Watch': 'Watches',
      'Calculator': 'Calculators',
      'Calculators': 'Calculators',
      'Keyboard': 'Musical Instruments',
      'Piano': 'Musical Instruments',
      'Musical Instruments': 'Musical Instruments',
      'Projector': 'Projectors',
      'Projectors': 'Projectors',
      'Label Printer': 'Label Printers',
      'Label Printers': 'Label Printers',
      'Cash Register': 'Cash Registers',
      'Cash Registers': 'Cash Registers',
      'Men Watches': 'Watches',
      'Women Watches': 'Watches'
    };
    
    // Check if any key matches the category
    const lowerCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCategory.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return 'Watches';
  };

  const getProductTypeForCasio = (category) => {
    if (!category) return 'Digital Watch';
    
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch') || lowerCategory.includes('wrist')) {
      if (lowerCategory.includes('g-shock')) return 'G-Shock Watch';
      if (lowerCategory.includes('edifice')) return 'Edifice Watch';
      if (lowerCategory.includes('pro trek')) return 'Pro Trek Watch';
      if (lowerCategory.includes('baby-g')) return 'Baby-G Watch';
      if (lowerCategory.includes('analog')) return 'Analog Watch';
      return 'Digital Watch';
    }
    
    if (lowerCategory.includes('calculator')) {
      if (lowerCategory.includes('scientific')) return 'Scientific Calculator';
      if (lowerCategory.includes('graphing')) return 'Graphing Calculator';
      return 'Basic Calculator';
    }
    
    if (lowerCategory.includes('keyboard') || lowerCategory.includes('piano')) {
      return 'Keyboard';
    }
    
    if (lowerCategory.includes('projector')) {
      return 'Projector';
    }
    
    if (lowerCategory.includes('label')) {
      return 'Label Printer';
    }
    
    if (lowerCategory.includes('cash')) {
      return 'Cash Register';
    }
    
    return 'Casio Product';
  };

  const getCasioPlaceholderImage = (category) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch')) {
      return 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    }
    
    if (lowerCategory.includes('calculator')) {
      return 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80';
    }
    
    if (lowerCategory.includes('keyboard') || lowerCategory.includes('piano')) {
      return 'https://images.unsplash.com/photo-1571974599782-87624638275c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    }
    
    return 'https://images.unsplash.com/photo-1587387119725-9d6bac0f22fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  };

  const getRandomCasioColor = () => {
    const colors = ['Black', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'White', 'Gray', 'Rose Gold'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getDefaultSizeForCategory = (category) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch')) {
      return '42mm';
    }
    
    if (lowerCategory.includes('calculator')) {
      return 'Standard';
    }
    
    return 'Standard';
  };

  const getCollectionForCasio = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('g-shock')) return 'G-Shock';
    if (lowerName.includes('edifice')) return 'Edifice';
    if (lowerName.includes('pro trek')) return 'Pro Trek';
    if (lowerName.includes('baby-g')) return 'Baby-G';
    if (lowerName.includes('sheen')) return 'Sheen';
    if (lowerName.includes('oceanus')) return 'Oceanus';
    
    return 'Standard';
  };

  const extractModelNumber = (name) => {
    // Extract potential model numbers (like GA-2100, AE-1200, etc.)
    const match = name.match(/([A-Z]{1,3}-?\d{3,4}[A-Z]?)/);
    return match ? match[1] : 'N/A';
  };

  const getFeaturesForCasio = (category) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch')) {
      const features = [
        'Shock Resistant',
        'Water Resistant',
        'World Time',
        'Stopwatch',
        'Countdown Timer',
        'LED Light',
        'Solar Power',
        'Bluetooth Connectivity'
      ];
      return features.slice(0, 3).join(', ');
    }
    
    if (lowerCategory.includes('calculator')) {
      return 'Basic Functions, Memory, Solar Powered';
    }
    
    return 'Standard Features';
  };

  const getMovementType = (category) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch')) {
      return 'Quartz';
    }
    
    return 'N/A';
  };

  const getWaterResistance = (category) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch')) {
      const resistances = ['50m', '100m', '200m'];
      return resistances[Math.floor(Math.random() * resistances.length)];
    }
    
    return 'N/A';
  };

  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const categories = ['All', 'Watches', 'Calculators', 'Musical Instruments', 'Projectors', 'Label Printers', 'Cash Registers'];
    const productTypes = [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    const colours = [...new Set(currentProducts.map(p => p.colour))].filter(Boolean);
    const collections = [...new Set(currentProducts.map(p => p.collection))].filter(Boolean);
    const models = [...new Set(currentProducts.map(p => p.model))].filter(Boolean);
    const features = [...new Set(currentProducts.map(p => p.features).filter(f => f && f !== 'N/A'))];
    const movements = [...new Set(currentProducts.map(p => p.movement).filter(m => m && m !== 'N/A'))];
    const waterResistances = [...new Set(currentProducts.map(p => p.waterResistance).filter(w => w && w !== 'N/A'))];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      category: categories,
      productType: productTypes.sort(),
      model: models.sort(),
      colour: colours.sort(),
      collection: collections.sort(),
      features: features.sort(),
      movement: movements.sort(),
      waterResistance: waterResistances.sort(),
      discount: ['15% and above', '20% and above', '25% and above', '30% and above', '35% and above', '40% and above', '45% and above', '50% and above'],
      priceRange: [
        'Under ₹2,000',
        '₹2,000 - ₹5,000',
        '₹5,000 - ₹10,000',
        '₹10,000 - ₹20,000',
        '₹20,000 - ₹35,000',
        '₹35,000 - ₹60,000',
        'Above ₹60,000'
      ],
      rating: ['4.0 and above', '4.3 and above', '4.5 and above', '4.7 and above']
    };
  }, [products])

  // Cart functions with delay
  const addToCartWithDelay = async (product) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand || 'Casio',
      price: product.price,
      image: product.image,
      images: product.images,
      colour: product.colour,
      size: product.size,
      storage: product.storage,
      category: product.category,
      collection: product.collection,
      quantity: 1
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
      image: product.image || product.images?.[0],
      quantity: 1,
      size: product.size || '',
      storage: product.storage || '',
      colour: product.colour || '',
      brand: product.brand || 'Casio',
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
      brand: product.brand || 'Casio',
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
    console.log('Casio purchase completed:', orderData);
    
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
      category: '',
      productType: '',
      priceRange: '',
      rating: '',
      model: '',
      colour: '',
      discount: '',
      collection: '',
      features: '',
      movement: '',
      waterResistance: ''
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

  const trackOrder = (orderNumber) => {
    setTrackingOrderNumber(orderNumber);
    setTrackingMode(true);
    setNavigationHistory(prev => [...prev, 'checkout']);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.productType.toLowerCase().includes(query) ||
        p.colour.toLowerCase().includes(query) ||
        p.collection?.toLowerCase().includes(query) ||
        p.model?.toLowerCase().includes(query) ||
        p.features?.toLowerCase().includes(query) ||
        p.movement?.toLowerCase().includes(query)
      );
    }
   
    // Apply filters
    if (filters.category && filters.category !== 'All') filtered = filtered.filter(p => p.category === filters.category);
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => p.colour === filters.colour);
    if (filters.collection) filtered = filtered.filter(p => p.collection === filters.collection);
    if (filters.model) filtered = filtered.filter(p => p.model === filters.model);
    if (filters.features) filtered = filtered.filter(p => p.features === filters.features);
    if (filters.movement) filtered = filtered.filter(p => p.movement === filters.movement);
    if (filters.waterResistance) filtered = filtered.filter(p => p.waterResistance === filters.waterResistance);
    
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
        case 'Under ₹2,000': filtered = filtered.filter(p => p.price < 2000); break;
        case '₹2,000 - ₹5,000': filtered = filtered.filter(p => p.price >= 2000 && p.price <= 5000); break;
        case '₹5,000 - ₹10,000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 10000); break;
        case '₹10,000 - ₹20,000': filtered = filtered.filter(p => p.price >= 10000 && p.price <= 20000); break;
        case '₹20,000 - ₹35,000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 35000); break;
        case '₹35,000 - ₹60,000': filtered = filtered.filter(p => p.price >= 35000 && p.price <= 60000); break;
        case 'Above ₹60,000': filtered = filtered.filter(p => p.price > 60000); break;
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
          // Sort by creation date (newest first)
          filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          break;
        case 'Popularity':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'Customer Rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Default sort by newest
          filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
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
  }, [filters, searchQuery, products]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery;
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Count products by category - updated to use combined products
  const categoryCounts = useMemo(() => {
    const counts = { Watches: 0, Calculators: 0, 'Musical Instruments': 0, Projectors: 0, 'Label Printers': 0, 'Cash Registers': 0 };
    products.forEach(product => {
      if (counts[product.category] !== undefined) {
        counts[product.category]++;
      }
    });
    return counts;
  }, [products]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Casio products...</p>
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
          <span className="font-medium">Back to Casio Store</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
          aria-label="Open Cart"
        >
          <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white text-red-600 text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
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
        brand: checkoutProduct.brand || 'Casio',
        category: checkoutProduct.category || ''
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
          <span className="font-medium">Back to Casio Store</span>
        </button>
        
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Track Your Casio Order</h1>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
        aria-label="Open Cart"
      >
        <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white text-red-600 text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-pulse">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
        aria-label="Toggle Filters"
      >
        <FiFilter className="w-5 h-5" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shopping Cart ({cartItemCount})</h2>
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
                    <p className="text-gray-400 text-sm sm:text-base">Add Casio products to get started</p>
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
                                {item.colour && `${item.colour} • `}{item.size || item.storage || item.model}
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
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="font-medium w-6 text-center text-sm sm:text-base">{item.quantity || 1}</span>
                            </div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">
                              {formatPrice ? formatPrice((item.price || 0) * (item.quantity || 1)) : `₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}`}
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
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
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
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Casio products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                  />
                </div>
                {[
                  { key: 'category', label: 'Category' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'collection', label: 'Collection' },
                  { key: 'model', label: 'Model' },
                  { key: 'features', label: 'Features' },
                  { key: 'movement', label: 'Movement' },
                  { key: 'waterResistance', label: 'Water Resistance' },
                  { key: 'colour', label: 'Colour' },
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
        <div className="min-h-screen bg-linear-to-b from-transparent to-gray-50">
          {/* Hero Section */}
          <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="animate-fade-in text-center lg:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <img 
                        src="https://cdn.freebiesupply.com/logos/thumbs/2x/casio-logo-logo.png" 
                        alt="Casio Logo"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2">Casio Official Store</h1>
                      <p className="text-sm sm:text-base md:text-lg opacity-90">Creative & Reliable Technology Since 1946.</p>
                      {error && (
                        <span className="block text-yellow-200 text-xs mt-2">
                          {error}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mb-4 sm:mb-6">
                    From iconic G-Shock watches to precision calculators, Casio brings you reliable technology for every aspect of life.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-purple-800 text-xs sm:text-sm">⌚ G-Shock Durability</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-orange-800 text-xs sm:text">🧮 Precision Calculators</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-black text-xs sm:text-sm">🎹 Musical Instruments</span>
                    </div>
                    {useFallbackData && (
                      <div className="bg-yellow-500 bg-opacity-90 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                        <span className="font-medium text-black text-xs sm:text-sm">Using Sample Data</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-center">
                    <div className="text-4xl xl:text-5xl font-bold mb-2">{products.length}</div>
                    <div className="text-lg">Tech Products</div>
                    <div className="mt-4 text-sm opacity-90">Since 1946</div>
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

          {/* Categories Section */}
          <div className="bg-white py-6 sm:py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Shop By Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Watches' ? 'ring-2 sm:ring-4 ring-red-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Watches' ? '' : 'Watches')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-gray-800 to-black flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiWatch className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-lg sm:text-xl font-bold">Watches</h3>
                      <p className="text-gray-200 text-sm sm:text-base mt-1">{categoryCounts.Watches} Models</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Calculators' ? 'ring-2 sm:ring-4 ring-red-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Calculators' ? '' : 'Calculators')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-blue-900 to-blue-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <div className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">123</div>
                      <h3 className="text-lg sm:text-xl font-bold">Calculators</h3>
                      <p className="text-gray-200 text-sm sm:text-base mt-1">{categoryCounts.Calculators} Models</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Musical Instruments' ? 'ring-2 sm:ring-4 ring-red-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Musical Instruments' ? '' : 'Musical Instruments')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-purple-800 to-purple-700 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiMusic className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-lg sm:text-xl font-bold">Musical Instruments</h3>
                      <p className="text-gray-200 text-sm sm:text-base mt-1">{categoryCounts['Musical Instruments']} Models</p>
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
                        placeholder="Search Casio products by model, features, or collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm sm:text-base"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                  <div className="flex items-center space-x-2">
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
                
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
                  {[
                    { key: 'category', label: 'Category', options: filterOptions.category },
                    { key: 'productType', label: 'Type', options: filterOptions.productType },
                    { key: 'collection', label: 'Collection', options: filterOptions.collection },
                    { key: 'model', label: 'Model', options: filterOptions.model },
                    { key: 'features', label: 'Features', options: filterOptions.features }
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
                
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pt-2">
                  {[
                    { key: 'movement', label: 'Movement', options: filterOptions.movement },
                    { key: 'waterResistance', label: 'Water Resistance', options: filterOptions.waterResistance },
                    { key: 'colour', label: 'Colour', options: filterOptions.colour },
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
                    <span className="bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0)}
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

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Casio Technology Collection</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">Innovation you can count on</p>
                  {useFallbackData && (
                    <p className="text-yellow-600 text-xs mt-1">
                      Showing sample Casio products only
                    </p>
                  )}
                </div>
                <div className="hidden sm:flex items-center space-x-4 md:space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-gray-600">Premium Technology</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs sm:text-sm text-gray-600">In Stock</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs sm:text-sm text-gray-600">Official Warranty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Count */}
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                {useFallbackData && (
                  <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                    Using sample products only
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
                <div className="space-y-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 p-4 sm:p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                  {product.category}
                                </span>
                                <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                                  {product.collection}
                                </span>
                                {product.isNew && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    New
                                  </span>
                                )}
                                {product.model && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    {product.model}
                                  </span>
                                )}
                                {product.source === 'backend' && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    Live
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <div className="flex items-center">
                                  <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
                                  <span className="font-medium text-sm sm:text-base">{product.rating}</span>
                                  <span className="text-gray-500 ml-1 text-sm">({product.reviews})</span>
                                </div>
                                <span className="text-gray-500 hidden sm:inline">•</span>
                                <span className="text-gray-500 text-sm">Size: {product.size}</span>
                                <span className="text-gray-500 hidden sm:inline">•</span>
                                <span className="text-gray-500 text-sm">Colour: {product.colour}</span>
                                {product.waterResistance && product.waterResistance !== 'N/A' && (
                                  <>
                                    <span className="text-gray-500 hidden sm:inline">•</span>
                                    <span className="text-gray-500 text-sm">Water: {product.waterResistance}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="md:w-1/3 md:pl-4 lg:pl-6">
                              <div className="mb-3 sm:mb-4">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                  <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                  {product.discount > 0 && (
                                    <>
                                      <span className="text-lg text-gray-500 line-through hidden sm:inline">₹{product.originalPrice?.toLocaleString()}</span>
                                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                                        -{product.discount}%
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">In stock: {product.stock} units</div>
                              </div>
                              <div className="flex space-x-2 sm:space-x-3">
                                <button
                                  onClick={() => addToCartWithDelay(product)}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => buyNow(product)}
                                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
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
              )
            ) : (
              <div className="text-center py-12 sm:py-16 md:py-20">
                <div className="text-gray-300 text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 animate-bounce">⌚</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Casio Products Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters or search query to discover our Casio technology collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-red-600 to-red-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>

          {/* Casio Collections Section */}
          <div className="bg-linear-to-r from-gray-900 to-black text-white py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12">Casio Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiZap className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">G-Shock</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Shock-resistant watches built for extreme durability</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiMusic className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Musical</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Keyboards, digital pianos, and musical accessories</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiNavigation className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Pro Trek</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Outdoor watches with sensors for adventure</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiSmartphone className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Edifice</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Elegant watches with Bluetooth connectivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Shop Casio With Us */}
          <div className="bg-white py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Shop Casio With Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiAward className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Authentic Products</h3>
                  <p className="text-gray-600 text-sm sm:text-base">100% genuine Casio products with official warranty</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiTruck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Free shipping on orders above ₹5,000 across India</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiShield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Warranty Protection</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Comprehensive warranty on all Casio products</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiRepeat className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Easy Returns</h3>
                  <p className="text-gray-600 text-sm sm:text-base">15-day return policy for defective products</p>
                </div>
              </div>
            </div>
          </div>

          {/* Casio Technology Guide */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Casio Technology Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Watch Technology</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="flex items-start">
                        <FiZap className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base"><strong>Tough Solar:</strong> Converts light into power</span>
                      </li>
                      <li className="flex items-start">
                        <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base"><strong>Multi-Band 6:</strong> Atomic timekeeping accuracy</span>
                      </li>
                      <li className="flex items-start">
                        <FiTarget className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base"><strong>Triple Sensor:</strong> Altimeter, barometer, compass</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Calculator Features</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Basic Calculators</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Everyday calculations</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Scientific Calculators</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Advanced functions</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Graphing Calculators</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Visual plotting</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Care & Maintenance</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Clean watches with soft, dry cloth</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Avoid extreme temperatures</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Keep solar watches in light</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Casio Heritage Section */}
          <div className="bg-linear-to-r from-red-50 to-red-100 py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Casio Innovation Since 1946</h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
                  Founded in Tokyo, Japan, Casio has been at the forefront of consumer electronics innovation. 
                  From creating the world's first compact electronic calculator to revolutionizing the watch 
                  industry with G-Shock, Casio continues to push technological boundaries.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 mb-2">1957</div>
                  <div className="text-gray-700 text-sm sm:text-base">World's first compact electronic calculator</div>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 mb-2">1974</div>
                  <div className="text-gray-700 text-sm sm:text-base">First digital watch with automatic calendar</div>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 mb-2">1983</div>
                  <div className="text-gray-700 text-sm sm:text-base">G-Shock launched - shock-resistant watch</div>
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

export default CasioStore;