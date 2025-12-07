// src/pages/AdidasStore.jsx
import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import Footer from './Footer'
import { adidasProducts as dummyProducts, getFilterOptions } from '../dummyData'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiStar, FiCheck, FiTruck, FiShield, FiRepeat, FiGrid, FiList, FiFilter, FiUser, FiHome, FiTrendingUp, FiGlobe, FiShoppingBag, FiHeart, FiTag, FiActivity, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const AdidasStore = () => {
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
  
  const [filters, setFilters] = useState({
    sort: '',
    category: '',
    productType: '',
    priceRange: '',
    rating: '',
    size: '',
    colour: '',
    discount: '',
    collection: '',
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

  // New state for backend products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchAdidasProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch Adidas products from backend
        const response = await fetch('http://localhost:5000/api/products?brand=Adidas&limit=100&sort=-createdAt');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Adidas products');
        }
        
        const data = await response.json();
        console.log('Backend Adidas response:', data);
        
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
          // Transform backend products data for Adidas
          const transformedBackendProducts = productsData.map(product => ({
            id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            description: product.description,
            brand: product.brand || 'Adidas',
            category: getCategoryFromBackend(product.category),
            productType: getProductTypeFromCategory(product.category),
            price: product.price,
            discount: product.discount || 0,
            rating: product.rating || 4.5,
            reviews: product.reviews || Math.floor(Math.random() * 100),
            image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
            images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
            size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
            sizes: product.sizes || [],
            storage: '',
            colour: product.colors && product.colors.length > 0 ? product.colors[0] : '',
            colors: product.colors || [],
            stock: product.stock || 0,
            originalPrice: product.originalPrice || product.price,
            tags: product.tags || [],
            collection: product.collection || getCollectionFromProduct(product.name),
            gender: getGenderFromProduct(product.name, product.category),
            isFeatured: product.isFeatured || false,
            isNewArrival: product.isNewArrival || false,
            isOnSale: product.isOnSale || false,
            createdAt: product.createdAt || new Date(),
            source: 'backend'
          }));
          
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
          
          // Combine both arrays, giving priority to backend products
          const allProducts = [...transformedBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(transformedBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No Adidas products from backend, using dummy data only');
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
        console.error('Error fetching Adidas products:', error);
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
        setError('Unable to load Adidas products from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdidasProducts();
  }, []);

  // Helper function to categorize backend products for Adidas
  const getCategoryFromBackend = (backendCategory) => {
    if (!backendCategory) return 'Shoes';
    
    const categoryMap = {
      'Men Clothes': 'Clothing',
      'Women Clothes': 'Clothing',
      'Men Sneakers': 'Shoes',
      'Women Sneakers': 'Shoes',
      'Clothes': 'Clothing',
      'Shoes': 'Shoes',
      'Accessories': 'Accessories',
      'Sports Equipment': 'Sports Equipment'
    };
    
    return categoryMap[backendCategory] || backendCategory || 'Shoes';
  };

  // Helper function to get product type from category for Adidas
  const getProductTypeFromCategory = (category) => {
    if (!category) return 'Sneakers';
    
    const typeMap = {
      'Men Clothes': 'Men\'s Clothing',
      'Women Clothes': 'Women\'s Clothing',
      'Men Sneakers': 'Men\'s Sneakers',
      'Women Sneakers': 'Women\'s Sneakers',
      'Shoes': 'Sneakers',
      'Clothing': 'Apparel',
      'Accessories': 'Accessory',
      'Sports Equipment': 'Equipment'
    };
    
    return typeMap[category] || category || 'Sneakers';
  };

  // Helper function to extract collection from product name
  const getCollectionFromProduct = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('ultraboost')) return 'Ultraboost';
    if (name.includes('nmd')) return 'NMD';
    if (name.includes('yeezy')) return 'Yeezy';
    if (name.includes('stan smith')) return 'Stan Smith';
    if (name.includes('superstar')) return 'Superstar';
    if (name.includes('originals')) return 'Originals';
    if (name.includes('predator')) return 'Predator';
    if (name.includes('nemeziz')) return 'Nemeziz';
    if (name.includes('x ghosted')) return 'X Ghosted';
    if (name.includes('copa')) return 'Copa';
    return 'Performance';
  };

  // Helper function to extract gender from product name and category
  const getGenderFromProduct = (productName, category) => {
    const name = productName.toLowerCase();
    const cat = (category || '').toLowerCase();
    
    if (name.includes('women') || name.includes('womens') || cat.includes('women')) return 'Women';
    if (name.includes('men') || name.includes('mens') || cat.includes('men')) return 'Men';
    if (name.includes('kids') || name.includes('children')) return 'Kids';
    return 'Unisex';
  };

  // Dynamic filter options based on actual products (combined backend and dummy)
  const filterOptions = useMemo(() => {
    const currentProducts = products;
    
    const categories = [...new Set(currentProducts.map(p => p.category))].filter(Boolean);
    const productTypes = filters.category
      ? [...new Set(currentProducts.filter(p => p.category === filters.category).map(p => p.productType))].filter(Boolean)
      : [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    
    const collections = [...new Set(currentProducts.map(p => p.collection))].filter(Boolean);
    const genders = [...new Set(currentProducts.map(p => p.gender))].filter(Boolean);
    
    let sizeOptions = [];
    if (filters.category === 'Clothing') {
      const allSizes = currentProducts
        .filter(p => p.category === filters.category)
        .flatMap(p => p.sizes || [])
        .filter(Boolean);
      sizeOptions = [...new Set(allSizes)];
    } else if (filters.category === 'Shoes') {
      sizeOptions = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];
    } else {
      const allSizes = currentProducts.flatMap(p => p.sizes || []).filter(Boolean);
      sizeOptions = [...new Set(allSizes)];
    }
    
    let colourOptions = [];
    if (filters.category) {
      const allColors = currentProducts
        .filter(p => p.category === filters.category)
        .flatMap(p => p.colors || [])
        .filter(Boolean);
      colourOptions = [...new Set(allColors)];
    } else {
      const allColors = currentProducts.flatMap(p => p.colors || []).filter(Boolean);
      colourOptions = [...new Set(allColors)];
    }
    
    // If no colors from products, use default colors
    if (colourOptions.length === 0) {
      colourOptions = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Orange', 'Multicolor'];
    }
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      category: categories.sort(),
      productType: productTypes.sort(),
      gender: genders.sort(),
      size: sizeOptions.sort(),
      collection: collections.sort(),
      colour: colourOptions.sort(),
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹2,000',
        '₹2,000 - ₹5,000',
        '₹5,000 - ₹10,000',
        '₹10,000 - ₹20,000',
        '₹20,000 - ₹30,000',
        '₹30,000 - ₹50,000',
        'Above ₹50,000'
      ],
      rating: ['4.5 & above', '4.0 & above', '3.5 & above', '3.0 & above']
    };
  }, [filters.category, products]);

  // Cart functions using CartContext with delay
  const addToCartWithDelay = async (product) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productForCart = {
      id: product.id,
      name: product.name,
      brand: product.brand || 'Adidas',
      price: product.price,
      image: product.image,
      images: product.images,
      colour: product.colour || '',
      category: product.category || '',
      collection: product.collection || '',
      size: product.size || '',
      gender: product.gender || '',
      quantity: 1
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
      image: product.image || product.images?.[0],
      images: product.images,
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || 'Adidas',
      category: product.category || '',
      collection: product.collection || '',
      gender: product.gender || ''
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
      images: product.images,
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || 'Adidas',
      category: product.category || '',
      collection: product.collection || '',
      gender: product.gender || ''
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
    console.log('Adidas purchase completed:', orderData);
    
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
      size: '',
      colour: '',
      discount: '',
      collection: '',
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

  const trackOrder = (orderNumber) => {
    setTrackingOrderNumber(orderNumber);
    setTrackingMode(true);
    setNavigationHistory(prev => [...prev, 'checkout']);
  };

  // Filter and sort products - INCLUDES ALL PRODUCTS (backend + dummy)
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
        (p.collection && p.collection.toLowerCase().includes(query)) ||
        (p.gender && p.gender.toLowerCase().includes(query))
      );
    }
   
    // Apply filters
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => 
      (p.colors && p.colors.includes(filters.colour)) || 
      (p.colour && p.colour === filters.colour)
    );
    if (filters.size) {
      filtered = filtered.filter(p =>
        (p.sizes && p.sizes.includes(filters.size)) || 
        p.size === filters.size
      );
    }
    if (filters.collection) filtered = filtered.filter(p => p.collection === filters.collection);
    if (filters.gender) filtered = filtered.filter(p => p.gender === filters.gender);
    
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
        case '₹20,000 - ₹30,000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 30000); break;
        case '₹30,000 - ₹50,000': filtered = filtered.filter(p => p.price >= 30000 && p.price <= 50000); break;
        case 'Above ₹50,000': filtered = filtered.filter(p => p.price > 50000); break;
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
  }, [filters, searchQuery, products]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery;
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Count products by category
  const categoryCounts = useMemo(() => {
    const counts = { Shoes: 0, Clothing: 0, Accessories: 0, 'Sports Equipment': 0 };
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Adidas products...</p>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Adidas Store</span>
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
      productsForCheckout = [{
        ...checkoutProduct,
        id: checkoutProduct.id,
        name: checkoutProduct.name,
        price: checkoutProduct.price,
        image: checkoutProduct.image || checkoutProduct.images?.[0],
        quantity: checkoutProduct.quantity || 1,
        size: checkoutProduct.size || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || 'Adidas',
        category: checkoutProduct.category || '',
        collection: checkoutProduct.collection || '',
        gender: checkoutProduct.gender || ''
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
          <span className="font-medium">Back to Adidas Store</span>
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

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-black hover:bg-gray-900 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-600 flex items-center justify-center"
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
            className="fixed inset-0  backdrop-blur-sm z-40 transition-opacity duration-300"
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
                    <div className="text-gray-300 text-5xl sm:text-6xl mb-3 sm:mb-4">👟</div>
                    <p className="text-gray-500 text-base sm:text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-400 text-sm sm:text-base">Add Adidas products to get started</p>
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
                              <p className="text-xs sm:text-sm text-gray-500">{item.brand} {item.collection && `• ${item.collection}`}</p>
                              <p className="text-xs text-gray-500">
                                {item.colour && `${item.colour} • `}{item.size || ''}
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
                <div className="border-t p-4 sm:p-5 md:p-6">
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {cartSummary?.formatted?.total || `₹${cartSummary?.total?.toLocaleString() || '0'}`}
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
                          {cartSummary?.formatted?.totalWithShipping || `₹${cartSummary?.totalWithShipping?.toLocaleString() || '0'}`}
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
            className="fixed inset-0  backdrop-blur-sm z-30 sm:hidden"
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
                {/* Search in mobile filters */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search Adidas products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {[
                  { key: 'category', label: 'Category' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'gender', label: 'Gender' },
                  { key: 'size', label: 'Size' },
                  { key: 'collection', label: 'Collection' },
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
                                filters[key] === option ? 'bg-black text-white border border-black' : 'border border-transparent'
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
          {/* Hero Section */}
          <div className="bg-linear-to-r from-black via-gray-900 to-black text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="animate-fade-in mb-6 md:mb-0 md:w-2/3">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png" 
                        alt="Adidas Logo" 
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">Adidas Store</h1>
                      <p className="text-sm sm:text-base md:text-lg opacity-90">Impossible is Nothing</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mb-4 sm:mb-6 md:mb-8">
                    Shop the latest performance and lifestyle products from Adidas. 
                    From running shoes to football gear, training apparel to iconic Originals, 
                    find everything for your sport and style.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-red-600 text-xs sm:text-sm">🏃‍♂️ Performance Running</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-blue-700 text-xs sm:text-sm">⚽️ Football Gear</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-green-600 text-xs sm:text-sm">👕 Originals Lifestyle</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-black text-xs sm:text-sm">💪 Training Essentials</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{products.length}</div>
                    <div className="text-lg">Sport & Lifestyle Products</div>
                    {useFallbackData && (
                      <div className="mt-2 text-sm text-yellow-300 bg-yellow-900 bg-opacity-50 px-3 py-1 rounded-full">
                        Using Sample Products
                      </div>
                    )}
                    {error && (
                      <div className="mt-2 text-sm text-red-300 bg-red-900 bg-opacity-50 px-3 py-1 rounded-full">
                        {error}
                      </div>
                    )}
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
                  {searchQuery && (
                    <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm">
                      <span className="font-medium">
                        Search: {searchQuery}
                      </span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-gray-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {Object.entries(filters)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-gray-900"
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

          {/* Categories Section */}
          <div className="bg-white py-6 sm:py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Shop By Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { category: 'Shoes', icon: FiShoppingBag, count: categoryCounts.Shoes },
                  { category: 'Clothing', icon: FiUser, count: categoryCounts.Clothing },
                  { category: 'Sports Equipment', icon: FiActivity, count: categoryCounts['Sports Equipment'] },
                  { category: 'Accessories', icon: FiTag, count: categoryCounts.Accessories },
                ].map(({ category, icon: Icon, count }) => (
                  <div 
                    key={category}
                    className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === category ? 'ring-4 ring-black' : ''}`}
                    onClick={() => handleFilterChange('category', filters.category === category ? '' : category)}
                  >
                    <div className="h-40 sm:h-48 bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
                      <div className="text-center text-white p-4 sm:p-6">
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" />
                        <h3 className="text-lg sm:text-xl font-bold">{category}</h3>
                        <p className="text-gray-200 mt-1 text-sm sm:text-base">{count} Styles</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-30 hidden sm:block">
            <div className="max-w-7xl mx-auto">
              <div className="px-4 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-xl">
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search Adidas products by name, category, or collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 hidden sm:block">
                      {filteredProducts.length} products
                      {useFallbackData && (
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          Sample Products
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="font-medium text-gray-700 text-sm sm:text-base">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-black hover:text-gray-800 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
                  {[
                    { key: 'category', label: 'Category', options: filterOptions.category },
                    { key: 'productType', label: 'Type', options: filterOptions.productType },
                    { key: 'gender', label: 'Gender', options: filterOptions.gender },
                    { key: 'size', label: 'Size', options: filterOptions.size },
                    { key: 'collection', label: 'Collection', options: filterOptions.collection }
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
                  <span className="font-medium">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="text-black font-medium text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Adidas Sport & Lifestyle</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">Performance innovation meets iconic style</p>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">
                      {error}
                    </p>
                  )}
                  {useFallbackData && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Showing sample products. Backend connection unavailable.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-gray-600 text-sm sm:text-base">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> products
                    {useFallbackData && (
                      <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        Sample
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-black animate-pulse"></div>
                      <span className="text-sm text-gray-600">Best Seller</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">In Stock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
                  <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
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
                              {product.collection && (
                                <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded">
                                  {product.collection}
                                </span>
                              )}
                              {product.source === 'backend' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <div className="flex items-center">
                                <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
                                <span className="font-medium text-sm sm:text-base">{product.rating}</span>
                                <span className="text-gray-500 ml-1 text-sm">({product.reviews || 0})</span>
                              </div>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-500 text-sm">Size: {product.size}</span>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-500 text-sm">Gender: {product.gender}</span>
                            </div>
                          </div>
                          <div className="md:w-1/3 md:pl-4 lg:pl-6">
                            <div className="mb-3 sm:mb-4">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                {product.discount > 0 && (
                                  <>
                                    <span className="text-sm sm:text-base text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                    <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded">
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
                                className="flex-1 bg-black hover:bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
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
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="text-gray-300 text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">👟</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Adidas Products Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters or search query to discover our Adidas collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-black to-gray-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>

          {/* Adidas Collections Section */}
          <div className="bg-linear-to-r from-gray-900 to-black text-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Adidas Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  { icon: 'UB', title: 'Ultraboost', desc: 'Maximum energy return for premium running performance' },
                  { icon: 'O', title: 'Originals', desc: 'Iconic lifestyle sneakers and apparel since 1949' },
                  { icon: 'P', title: 'Predator', desc: 'Elite football boots for precision and control' },
                  { icon: 'T', title: 'Training', desc: 'Performance gear for gym workouts and fitness' },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                      <span className="text-black text-xl sm:text-2xl font-bold">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">{item.title}</h3>
                    <p className="text-gray-200 text-sm sm:text-base px-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Shop With Us */}
          <div className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Shop Adidas With Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  { icon: FiCheck, title: 'Authentic Products', desc: '100% genuine Adidas products with official warranty' },
                  { icon: FiTruck, title: 'Free Shipping', desc: 'Free delivery on orders above ₹3,000 across India' },
                  { icon: FiShield, title: 'Secure Payment', desc: 'Bank-level security with multiple payment options' },
                  { icon: FiRepeat, title: 'Easy Returns', desc: '30-day return policy for unworn items with tags' },
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 sm:p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Adidas Technology Guide */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Adidas Technology Innovation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Running Technology</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Boost: Maximum energy return cushioning</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Primeknit: Adaptive, sock-like fit upper</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Lightstrike Pro: Ultra-light responsive foam</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Energyrods: Carbon fiber propulsion plate</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Football Technology</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Demonskin: 406 fins for superior ball control</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Controlframe: Optimized stud configuration</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Hybridtouch: Premium touch and durability</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">FIFA Quality Pro: Official match standards</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Sustainability</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Primegreen: High-performance recycled materials</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Parley Ocean Plastic: Made from ocean waste</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">AEROREADY: Moisture-wicking sustainable fabric</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">End Plastic Waste: Commitment to sustainability</span>
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

export default AdidasStore;