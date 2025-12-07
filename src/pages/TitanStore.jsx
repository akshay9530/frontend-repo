import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiStar, FiCheck, FiTruck, FiShield, FiRepeat, FiGrid, FiList, FiFilter, FiWatch, FiEye, FiBriefcase, FiDroplet, FiSun, FiMoon, FiGift, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import titanProductsData from '../dummyData/titanProducts'
import Footer from './Footer'

const TitanStore = () => {
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
    size: '',
    colour: '',
    discount: '',
    material: '',
    gender: ''
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

  // State for backend data integration
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchTitanProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch Titan products from backend (filter by brand)
        const response = await fetch('http://localhost:5000/api/products?brand=Titan&limit=100&sort=-createdAt');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Backend response (Titan products):', data);
        
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
          // Transform backend products data to match Titan product structure
          const transformedBackendProducts = productsData.map(product => ({
            id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            description: product.description,
            brand: product.brand || 'Titan',
            category: getTitanCategoryFromBackend(product.category),
            productType: getTitanProductTypeFromCategory(product.category),
            price: product.price,
            discount: product.discount || 0,
            rating: product.rating || 4.5,
            reviews: product.reviews || Math.floor(Math.random() * 100),
            image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
            images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
            size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
            sizes: product.sizes || [],
            colour: product.colors && product.colors.length > 0 ? product.colors[0] : '',
            colors: product.colors || [],
            stock: product.stock || 0,
            isFeatured: product.isFeatured || false,
            isNewArrival: product.isNewArrival || false,
            isOnSale: product.isOnSale || false,
            material: getMaterialFromBackend(product),
            gender: getGenderFromBackend(product),
            originalPrice: product.originalPrice || product.price,
            tags: product.tags || [],
            createdAt: product.createdAt || new Date(),
            source: 'backend'
          }));
          
          // Sort backend products by creation date (newest first)
          transformedBackendProducts.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          
          // Combine backend products with dummy products
          // First, ensure dummy products have unique IDs that don't conflict
          const uniqueDummyProducts = titanProductsData.map(product => ({
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
          console.log('No Titan products from backend, using dummy data only');
          const uniqueDummyProducts = titanProductsData.map(product => ({
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
        console.error('Error fetching Titan products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = titanProductsData.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
        }));
        setProducts(uniqueDummyProducts);
        setBackendProducts([]);
        setUseFallbackData(true);
        setError('Unable to load Titan products from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchTitanProducts();
  }, []);

  // Helper function to categorize backend products for Titan
  const getTitanCategoryFromBackend = (backendCategory) => {
    if (!backendCategory) return 'Accessories';
    
    const lowerCategory = backendCategory.toLowerCase();
    
    if (lowerCategory.includes('watch') || lowerCategory.includes('timepiece') || lowerCategory.includes('horology')) {
      return 'Watches';
    } else if (lowerCategory.includes('eyewear') || lowerCategory.includes('sunglass') || lowerCategory.includes('spectacle')) {
      return 'Eyewear';
    } else if (lowerCategory.includes('jewellery') || lowerCategory.includes('jewelry') || lowerCategory.includes('necklace') || lowerCategory.includes('ring') || lowerCategory.includes('bracelet')) {
      return 'Jewellery';
    } else if (lowerCategory.includes('fragrance') || lowerCategory.includes('perfume') || lowerCategory.includes('cologne')) {
      return 'Fragrances';
    } else if (lowerCategory.includes('gift') || lowerCategory.includes('set') || lowerCategory.includes('box')) {
      return 'Gift Sets';
    } else {
      return 'Accessories';
    }
  };

  // Helper function to get product type from category for Titan
  const getTitanProductTypeFromCategory = (category) => {
    if (!category) return 'Product';
    
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('watch')) {
      return 'Analogue Watch';
    } else if (lowerCategory.includes('eyewear') || lowerCategory.includes('sunglass')) {
      return 'Sunglasses';
    } else if (lowerCategory.includes('jewellery')) {
      return 'Necklace';
    } else if (lowerCategory.includes('fragrance')) {
      return 'Perfume';
    } else if (lowerCategory.includes('gift')) {
      return 'Gift Box';
    } else {
      return 'Titan Product';
    }
  };

  // Helper function to get material from backend product
  const getMaterialFromBackend = (product) => {
    const lowerDesc = (product.description || '').toLowerCase();
    const lowerName = (product.name || '').toLowerCase();
    
    if (lowerDesc.includes('stainless steel') || lowerName.includes('stainless steel')) {
      return 'Stainless Steel';
    } else if (lowerDesc.includes('leather') || lowerName.includes('leather')) {
      return 'Leather';
    } else if (lowerDesc.includes('gold') || lowerName.includes('gold')) {
      return 'Gold Plated';
    } else if (lowerDesc.includes('silver') || lowerName.includes('silver')) {
      return 'Sterling Silver';
    } else if (lowerDesc.includes('titanium') || lowerName.includes('titanium')) {
      return 'Titanium';
    } else if (lowerDesc.includes('plastic') || lowerName.includes('plastic')) {
      return 'Plastic';
    } else if (lowerDesc.includes('rubber') || lowerName.includes('rubber')) {
      return 'Rubber';
    } else {
      return 'Metal';
    }
  };

  // Helper function to get gender from backend product
  const getGenderFromBackend = (product) => {
    const lowerName = (product.name || '').toLowerCase();
    const lowerCategory = (product.category || '').toLowerCase();
    
    if (lowerName.includes('men') || lowerCategory.includes('men') || 
        lowerName.includes('male') || lowerCategory.includes('male') ||
        lowerName.includes('gents') || lowerCategory.includes('gents')) {
      return 'Men';
    } else if (lowerName.includes('women') || lowerCategory.includes('women') || 
              lowerName.includes('female') || lowerCategory.includes('female') ||
              lowerName.includes('ladies') || lowerCategory.includes('ladies')) {
      return 'Women';
    } else if (lowerName.includes('unisex') || lowerCategory.includes('unisex')) {
      return 'Unisex';
    } else {
      return 'Unisex';
    }
  };

  // Dynamic filter options based on actual products (combined backend and dummy)
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const categories = ['All', ...new Set(currentProducts.map(p => p.category))].filter(Boolean);
    const productTypes = [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    const sizeOptions = ['Small', 'Regular', 'Large', '18 inches', '32 inches', '38 inches', '100ml', 'Adjustable', 'Gift Box', 'Premium Box', 'Deluxe Box'];
    const colours = [...new Set(currentProducts.map(p => p.colour))].filter(Boolean);
    const materials = [...new Set(currentProducts.map(p => p.material))].filter(Boolean);
    const genders = ['All', ...new Set(currentProducts.map(p => p.gender))].filter(Boolean);
    
    // If no colors from products, use default colors
    const colourOptions = colours.length > 0 ? colours.sort() : 
      ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Brown', 'Gray', 'Multi-color'];
    
    // If no materials from products, use Titan default materials
    const materialOptions = materials.length > 0 ? materials.sort() : 
      ['Stainless Steel', 'Leather', 'Gold Plated', 'Sterling Silver', 'Titanium', 'Plastic', 'Rubber', 'Metal'];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      category: categories.sort(),
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      colour: colourOptions,
      material: materialOptions,
      gender: genders.sort(),
      discount: ['10% and above', '20% and above', '25% and above', '30% and above', '35% and above', '40% and above'],
      priceRange: [
        'Under ₹1000',
        '₹1000 - ₹3000',
        '₹3000 - ₹5000',
        '₹5000 - ₹10000',
        '₹10000 - ₹20000',
        '₹20000 - ₹35000',
        '₹35000 - ₹50000',
        'Above ₹50000'
      ],
      rating: ['4.0 and above', '4.5 and above', '4.7 and above', '4.8 and above']
    };
  }, [products]);

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
    console.log('Titan purchase completed:', orderData);
    
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
      size: '',
      colour: '',
      discount: '',
      material: '',
      gender: ''
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

  // Filter and sort products - INCLUDES ALL PRODUCTS (backend + dummy)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.productType && p.productType.toLowerCase().includes(query)) ||
        (p.colour && p.colour.toLowerCase().includes(query)) ||
        (p.material && p.material.toLowerCase().includes(query)) ||
        (p.gender && p.gender.toLowerCase().includes(query))
      );
    }
   
    // Apply filters
    if (filters.category && filters.category !== 'All') filtered = filtered.filter(p => p.category === filters.category);
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => p.colour === filters.colour);
    if (filters.size) filtered = filtered.filter(p => p.size === filters.size);
    if (filters.material) filtered = filtered.filter(p => p.material === filters.material);
    if (filters.gender && filters.gender !== 'All') filtered = filtered.filter(p => p.gender === filters.gender);
    
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
        case 'Under ₹1000': filtered = filtered.filter(p => p.price < 1000); break;
        case '₹1000 - ₹3000': filtered = filtered.filter(p => p.price >= 1000 && p.price <= 3000); break;
        case '₹3000 - ₹5000': filtered = filtered.filter(p => p.price >= 3000 && p.price <= 5000); break;
        case '₹5000 - ₹10000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 10000); break;
        case '₹10000 - ₹20000': filtered = filtered.filter(p => p.price >= 10000 && p.price <= 20000); break;
        case '₹20000 - ₹35000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 35000); break;
        case '₹35000 - ₹50000': filtered = filtered.filter(p => p.price >= 35000 && p.price <= 50000); break;
        case 'Above ₹50000': filtered = filtered.filter(p => p.price > 50000); break;
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
          filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
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
  }, [filters, products, searchQuery]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery;
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Count products by category (using combined products)
  const categoryCounts = useMemo(() => {
    const counts = { Watches: 0, Eyewear: 0, Jewellery: 0, Accessories: 0, Fragrances: 0, 'Gift Sets': 0 };
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Titan products...</p>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Titan Store</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-amber-600 hover:bg-amber-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-300"
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm sm:text-base"
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Titan Store</span>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-amber-600 hover:bg-amber-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-300"
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
                    <p className="text-gray-400 text-sm sm:text-base">Add Titan products to get started</p>
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
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
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
                  { key: 'gender', label: 'Gender' },
                  { key: 'size', label: 'Size' },
                  { key: 'material', label: 'Material' },
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
          <div className="bg-linear-to-r from-amber-900 via-amber-800 to-amber-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="animate-fade-in mb-6 md:mb-0 md:w-2/3">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                      <img 
                        src="https://images.seeklogo.com/logo-png/50/1/titan-logo-png_seeklogo-502722.png" 
                        alt="Titan Logo"
                        className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2">Titan Store</h1>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">India's finest watches & lifestyle accessories</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mb-6 sm:mb-8">
                    Official Titan store featuring premium watches, eyewear, jewellery, and accessories. 
                    Experience Indian craftsmanship, timeless designs, and exceptional quality.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-green-800 text-xs sm:text-sm">✓ 100% Authentic</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-amber-950 text-xs sm:text-sm">📦 Free Shipping</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-red-600 text-xs sm:text-sm">⏰ 2-Year Warranty</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-yellow-500 text-xs sm:text-sm">🎁 Gift Ready</span>
                    </div>
                    {useFallbackData && (
                      <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                        <span className="font-medium text-yellow-400 text-xs sm:text-sm">📱 Sample Products</span>
                      </div>
                    )}
                    {backendProducts.length > 0 && !useFallbackData && (
                      <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                        <span className="font-medium text-blue-400 text-xs sm:text-sm">🔄 Live Data: {backendProducts.length} products</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{products.length}</div>
                    <div className="text-base md:text-lg">Premium Products</div>
                    {error && (
                      <p className="text-yellow-300 text-sm mt-2">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Source Indicator */}
          {useFallbackData && (
            <div className="bg-yellow-50 border-b border-yellow-200">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
                <div className="flex items-center justify-center text-center">
                  <p className="text-yellow-800 text-sm">
                    <span className="font-medium">Note:</span> Showing sample Titan products. {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {backendProducts.length > 0 && !useFallbackData && (
            <div className="bg-green-50 border-b border-green-200">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
                <div className="flex items-center justify-center text-center">
                  <p className="text-green-800 text-sm">
                    <span className="font-medium">✓ Live Data:</span> Showing {backendProducts.length} products from database and {products.length - backendProducts.length} sample products
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Watches' ? 'ring-2 sm:ring-4 ring-amber-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Watches' ? '' : 'Watches')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-amber-900 to-amber-700 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiWatch className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">Premium Watches</h3>
                      <p className="text-gray-200 mt-1 text-xs sm:text-sm">{categoryCounts.Watches || 0} Collections</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Eyewear' ? 'ring-2 sm:ring-4 ring-amber-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Eyewear' ? '' : 'Eyewear')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-gray-800 to-amber-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiEye className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">Eyewear</h3>
                      <p className="text-gray-200 mt-1 text-xs sm:text-sm">{categoryCounts.Eyewear || 0} Styles</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Jewellery' ? 'ring-2 sm:ring-4 ring-amber-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Jewellery' ? '' : 'Jewellery')}
                >
                  <div className="h-36 sm:h-48 bg-linear-to-br from-amber-800 to-amber-900 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">Fine Jewellery</h3>
                      <p className="text-gray-200 mt-1 text-xs sm:text-sm">{categoryCounts.Jewellery || 0} Pieces</p>
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
                        placeholder="Search Titan products by name, category, or material..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm sm:text-base"
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
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                      >
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                      >
                        <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {filteredProducts.length} products
                      {useFallbackData && (
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          Sample
                        </span>
                      )}
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
                    { key: 'gender', label: 'Gender', options: filterOptions.gender },
                    { key: 'size', label: 'Size', options: filterOptions.size },
                    { key: 'material', label: 'Material', options: filterOptions.material }
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
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Titan Premium Products</h2>
                  <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">
                    Crafted with precision, designed for life
                    {useFallbackData && (
                      <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        Showing sample products
                      </span>
                    )}
                  </p>
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
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                                {product.gender}
                              </span>
                              {product.isNewArrival && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  New
                                </span>
                              )}
                              {product.source === 'backend' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                  Live
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
                              <span className="text-gray-500 text-xs sm:text-sm">Size: {product.size}</span>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-500 text-xs sm:text-sm">Material: {product.material}</span>
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
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
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
                <div className="text-gray-300 text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 animate-pulse">⌚</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Titan Products Found</h3>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
                  Try adjusting your filters or search query to discover our premium Titan collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-amber-800 to-amber-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-amber-900 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>

          {/* Titan Heritage Section - Responsive */}
          <div className="bg-linear-to-r from-amber-900 to-amber-800 text-white py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Titan Heritage & Craftsmanship</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiWatch className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Indian Horology</h3>
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base">Pioneers of quartz watch technology in India since 1984</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiEye className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Vision Care</h3>
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base">Premium eyewear with UV protection and blue light filters</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiGift className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">Gift Solutions</h3>
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base">Premium gifting options for every occasion, beautifully packaged</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Shop With Us - Responsive */}
          <div className="bg-white py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8 md:mb-12">Why Shop Titan With Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">Official Retailer</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Direct from Titan Company Limited with full authenticity guarantee</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiTruck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">Pan India Delivery</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Free shipping across India with insured delivery for all orders</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiShield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">2-Year Warranty</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Comprehensive warranty on manufacturing defects for all products</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiRepeat className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3">30-Day Returns</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Easy returns for unworn items with original tags and packaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sizing & Care Guide - Responsive */}
          <div className="bg-linear-to-r from-amber-50 to-gray-50 py-8 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6 md:mb-8">Product Care & Sizing Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-4">Watch Sizing</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Small</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Wrist: 5.5-6.5 inches</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Regular</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Wrist: 6.5-7.5 inches</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Large</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Wrist: 7.5-8.5 inches</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Adjustable</span>
                        <span className="text-gray-600 text-xs sm:text-sm">All wrist sizes</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-4">Jewellery Care</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Gold Plated</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Avoid water, chemicals</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Sterling Silver</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Polish with soft cloth</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Diamond</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Clean with mild soap</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 sm:pb-2">
                        <span className="text-gray-700 text-xs sm:text-sm">Leather</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Use leather conditioner</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-4">Watch Care Tips</h3>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">Avoid extreme temperatures and magnetic fields</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">Clean with soft dry cloth, avoid chemicals</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">Replace batteries only at authorized service centers</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">Service mechanical watches every 3-5 years</span>
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

export default TitanStore;