import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiStar, FiCheck, FiTruck, FiShield, FiRepeat, FiGrid, FiList, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { nikeProducts as dummyProducts } from '../dummyData/nikeProductsData'
import Footer from './Footer'

const NikeStore = () => {
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
    technology: '',
    gender: ''
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
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // State for products management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch Nike products from backend on component mount
  useEffect(() => {
    const fetchNikeProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch Nike products from backend - try multiple approaches
        let response;
        
        // First try: Fetch by brand name
        response = await fetch('http://localhost:5000/api/products?brand=Nike&limit=50&sort=-createdAt');
        
        // If first approach fails, try fetching all and filter by brand on frontend
        if (!response.ok) {
          response = await fetch('http://localhost:5000/api/products?limit=100&sort=-createdAt');
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Backend response (Nike products):', data);
        
        // Handle different response structures
        let productsData = [];
        
        if (data.success) {
          productsData = data.data || data.products || [];
        } else if (Array.isArray(data)) {
          productsData = data;
        } else if (data.products) {
          productsData = data.products;
        }
        
        // Filter for Nike products (either by brand or by name containing Nike)
        let nikeProductsData = productsData.filter(product => 
          product.brand === 'Nike' || 
          product.name?.toLowerCase().includes('nike') ||
          product.description?.toLowerCase().includes('nike')
        );
        
        if (Array.isArray(nikeProductsData) && nikeProductsData.length > 0) {
          // Transform backend products data
          const transformedBackendProducts = nikeProductsData.map(product => ({
            id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            description: product.description,
            brand: 'Nike',
            category: getNikeCategory(product.category, product.name),
            productType: getNikeProductType(product.name, product.category),
            price: product.price,
            discount: product.discount || 0,
            rating: product.rating || 4.0 + Math.random() * 1.0,
            reviews: product.reviews || Math.floor(Math.random() * 100),
            image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
            images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
            size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M',
            sizes: product.sizes || ['S', 'M', 'L', 'XL'],
            storage: '',
            colour: product.colors && product.colors.length > 0 ? product.colors[0] : 'Black',
            colors: product.colors || ['Black', 'White', 'Red'],
            stock: product.stock || Math.floor(Math.random() * 50) + 10,
            isFeatured: product.isFeatured || false,
            isNewArrival: product.isNewArrival || false,
            isOnSale: product.isOnSale || false,
            originalPrice: product.originalPrice || product.price,
            tags: product.tags || [],
            technology: getNikeTechnology(product.name),
            gender: getNikeGender(product.name),
            isNew: product.isNewArrival || false,
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
          
          // Combine both arrays
          const allProducts = [...transformedBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(transformedBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No Nike products from backend, using dummy data only');
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
        console.error('Error fetching Nike products:', error);
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
        setError('Unable to load Nike products from server. Showing sample products.');
      } finally {
        setLoading(false);
      }
    };

    fetchNikeProducts();
  }, []);

  // Helper function to get Nike category
  const getNikeCategory = (backendCategory, productName) => {
    const name = productName?.toLowerCase() || '';
    
    // First try to infer from product name
    if (name.includes('shoe') || name.includes('sneaker') || name.includes('air') || name.includes('force') || name.includes('dunk')) {
      return 'Shoes';
    }
    if (name.includes('shirt') || name.includes('t-shirt') || name.includes('jacket') || name.includes('hoodie') || name.includes('pant') || name.includes('short')) {
      return 'Apparel';
    }
    if (name.includes('bag') || name.includes('backpack') || name.includes('cap') || name.includes('hat') || name.includes('socks')) {
      return 'Accessories';
    }
    
    // Fallback to backend category mapping
    if (!backendCategory) return 'Shoes';
    
    const categoryMap = {
      'Men Sneakers': 'Shoes',
      'Women Sneakers': 'Shoes',
      'Men Clothes': 'Apparel',
      'Women Clothes': 'Apparel',
      'Shoes': 'Shoes',
      'Clothes': 'Apparel',
      'Accessories': 'Accessories'
    };
    
    return categoryMap[backendCategory] || 'Shoes';
  };

  // Helper function to get Nike product type
  const getNikeProductType = (productName, category) => {
    const name = productName?.toLowerCase() || '';
    
    if (name.includes('air max')) return 'Air Max';
    if (name.includes('air force')) return 'Air Force';
    if (name.includes('jordan')) return 'Jordan';
    if (name.includes('dunk')) return 'Dunk';
    if (name.includes('blazer')) return 'Blazer';
    if (name.includes('running') || name.includes('run')) return 'Running Shoes';
    if (name.includes('basketball')) return 'Basketball Shoes';
    if (name.includes('training')) return 'Training Shoes';
    if (name.includes('hoodie') || name.includes('sweatshirt')) return 'Hoodies & Sweatshirts';
    if (name.includes('t-shirt') || name.includes('tshirt')) return 'T-Shirts';
    if (name.includes('jacket')) return 'Jackets';
    if (name.includes('pant') || name.includes('trouser')) return 'Pants & Tights';
    if (name.includes('short')) return 'Shorts';
    if (name.includes('sock')) return 'Socks';
    if (name.includes('cap') || name.includes('hat')) return 'Caps & Hats';
    if (name.includes('bag') || name.includes('backpack')) return 'Bags & Backpacks';
    
    return 'Nike Product';
  };

  // Helper function to get Nike technology
  const getNikeTechnology = (productName) => {
    const name = productName?.toLowerCase() || '';
    
    if (name.includes('air')) return 'Air Technology';
    if (name.includes('react')) return 'React Foam';
    if (name.includes('zoom')) return 'Zoom Air';
    if (name.includes('flyknit')) return 'Flyknit';
    if (name.includes('flywire')) return 'Flywire';
    if (name.includes('dri-fit')) return 'Dri-FIT';
    if (name.includes('tech')) return 'Tech Fleece';
    if (name.includes('shield')) return 'Storm-FIT';
    
    return 'Nike Technology';
  };

  // Helper function to get Nike gender
  const getNikeGender = (productName) => {
    const name = productName?.toLowerCase() || '';
    
    if (name.includes('men') || name.includes("men's")) return 'Men';
    if (name.includes('women') || name.includes("women's")) return 'Women';
    if (name.includes('unisex')) return 'Unisex';
    if (name.includes('kids') || name.includes('child')) return 'Kids';
    
    return 'Unisex';
  };

  // Dynamic filter options based on actual products
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const categories = ['All', 'Shoes', 'Apparel', 'Accessories'];
    const productTypes = [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'US 7', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12', 'Adjustable', 'One Size'];
    const colours = [...new Set(currentProducts.flatMap(p => p.colors || []).filter(Boolean))];
    const technologies = [...new Set(currentProducts.map(p => p.technology))].filter(Boolean);
    const genders = ['All', 'Men', 'Women', 'Unisex', 'Kids'];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      category: categories,
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      colour: colours.length > 0 ? colours.sort() : ['Black', 'White', 'Red', 'Blue', 'Gray', 'Green', 'Orange'],
      technology: technologies.sort(),
      gender: genders,
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹1000',
        '₹1000 - ₹3000',
        '₹3000 - ₹5000',
        '₹5000 - ₹8000',
        '₹8000 - ₹12000',
        '₹12000 - ₹20000',
        'Above ₹20000'
      ],
      rating: ['4.0 and above', '4.2 and above', '4.5 and above', '4.8 and above']
    };
  }, [products]);

  // Count products by category
  const categoryCounts = useMemo(() => {
    const counts = { Shoes: 0, Apparel: 0, Accessories: 0 };
    products.forEach(product => {
      if (counts[product.category] !== undefined) {
        counts[product.category]++;
      }
    });
    return counts;
  }, [products]);

  // Cart functions using CartContext
  const addToCartWithDelay = async (product) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart({
      ...product,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || '',
      gender: product.gender || ''
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
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || '',
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
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || '',
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
      category: '',
      productType: '',
      priceRange: '',
      rating: '',
      size: '',
      colour: '',
      discount: '',
      technology: '',
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
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.productType && p.productType.toLowerCase().includes(query)) ||
        (p.colour && p.colour.toLowerCase().includes(query)) ||
        (p.technology && p.technology.toLowerCase().includes(query)) ||
        (p.gender && p.gender.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
   
    // Apply filters
    if (filters.category && filters.category !== 'All') filtered = filtered.filter(p => p.category === filters.category);
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
    if (filters.technology) filtered = filtered.filter(p => p.technology === filters.technology);
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
        case '₹5000 - ₹8000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 8000); break;
        case '₹8000 - ₹12000': filtered = filtered.filter(p => p.price >= 8000 && p.price <= 12000); break;
        case '₹12000 - ₹20000': filtered = filtered.filter(p => p.price >= 12000 && p.price <= 20000); break;
        case 'Above ₹20000': filtered = filtered.filter(p => p.price > 20000); break;
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
  const cartSummary = getCartSummary();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Nike products...</p>
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
          <span className="font-medium">Back to Nike Store</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
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
        size: checkoutProduct.size || '',
        colour: checkoutProduct.colour || '',
        brand: checkoutProduct.brand || '',
        category: checkoutProduct.category || '',
        gender: checkoutProduct.gender || ''
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
          <span className="font-medium">Back to Nike Store</span>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
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
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
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
            className="fixed inset-0  backdrop-blur-md z-40 transition-opacity duration-300"
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
                    <p className="text-gray-400 text-sm sm:text-base">Add Nike products to get started</p>
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
                                {item.colour && `${item.colour} • `}{item.size}
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
            className="fixed inset-0  backdrop-blur-md z-30 sm:hidden"
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
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Nike products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
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
                  { key: 'productType', label: 'Type' },
                  { key: 'gender', label: 'Gender' },
                  { key: 'size', label: 'Size' },
                  { key: 'technology', label: 'Technology' },
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
        <div className="min-h-screen bg-linear-to-b from-transparent to-red-50">
          {/* Hero Section */}
          <div className="bg-linear-to-r from-black via-red-900 to-black text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="animate-fade-in mb-6 md:mb-0 md:w-2/3">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <span className="text-black text-2xl sm:text-3xl font-bold italic">NIKE</span>
                    </div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                        {useFallbackData ? 'Nike Official Store' : 'Nike Official Collection'}
                      </h1>
                      <p className="text-base sm:text-lg md:text-xl opacity-90">Just Do It.</p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg opacity-90 max-w-3xl mb-6 sm:mb-8">
                    {useFallbackData 
                      ? 'Official Nike store featuring footwear, apparel, and accessories.' 
                      : 'Official Nike collection featuring authentic products with the latest technology.'}
                    {error && (
                      <span className="block text-yellow-200 text-xs mt-1">
                        {error}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-green-400 text-sm sm:text-base">✓ 100% Authentic</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-red-500 text-sm sm:text-base">🚚 Free Shipping</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                      <span className="font-medium text-orange-500 text-sm sm:text-base">↩️ Easy Returns</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{filteredProducts.length}</div>
                    <div className="text-lg">Nike Products</div>
                    {useFallbackData && (
                      <div className="text-yellow-300 text-sm mt-2">Sample Data</div>
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
                    <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                      <span className="font-medium">Search: {searchQuery}</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-green-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
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

          {/* Categories Section */}
          <div className="bg-white py-6 sm:py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Shop By Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Shoes' ? 'ring-4 ring-red-500' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Shoes' ? '' : 'Shoes')}
                >
                  <div className="h-40 sm:h-48 bg-linear-to-br from-gray-900 to-red-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <div className="text-3xl sm:text-4xl mb-2">👟</div>
                      <h3 className="text-lg sm:text-xl font-bold">Footwear</h3>
                      <p className="text-gray-300 mt-1 text-sm sm:text-base">{categoryCounts.Shoes || 0} Products</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Apparel' ? 'ring-4 ring-red-500' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Apparel' ? '' : 'Apparel')}
                >
                  <div className="h-40 sm:h-48 bg-linear-to-br from-red-800 to-orange-700 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <div className="text-3xl sm:text-4xl mb-2">👕</div>
                      <h3 className="text-lg sm:text-xl font-bold">Apparel</h3>
                      <p className="text-gray-300 mt-1 text-sm sm:text-base">{categoryCounts.Apparel || 0} Products</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Accessories' ? 'ring-4 ring-red-500' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Accessories' ? '' : 'Accessories')}
                >
                  <div className="h-40 sm:h-48 bg-linear-to-br from-black to-gray-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <div className="text-3xl sm:text-4xl mb-2">🎒</div>
                      <h3 className="text-lg sm:text-xl font-bold">Accessories</h3>
                      <p className="text-gray-300 mt-1 text-sm sm:text-base">{categoryCounts.Accessories || 0} Products</p>
                    </div>
                  </div>
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
                  className="text-red-600 font-medium text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
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
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                      <input
                        type="text"
                        placeholder="Search Nike products by name, category, or technology..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {filteredProducts.length} products
                      {useFallbackData && (
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          Sample Data
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="font-medium text-gray-700 text-sm sm:text-base">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
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
                    { key: 'technology', label: 'Technology', options: filterOptions.technology }
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

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nike Products</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {filteredProducts.length} Authentic Nike products for every athlete
                    {useFallbackData && (
                      <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        Using sample products only
                      </span>
                    )}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm text-gray-600">Bestseller</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">In Stock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">New Arrival</span>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative">
                    {/* Backend product indicator */}
                    {product.source === 'backend' && (
                      <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </div>
                    )}
                    {/* Discount badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                    <ProductCard
                      product={product}
                      onAddToCart={addToCartWithDelay}
                      onViewDetails={viewProductDetails}
                      onBuyNow={buyNow}
                    />
                  </div>
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
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                {product.category}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {product.gender}
                              </span>
                              {product.source === 'backend' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  New
                                </span>
                              )}
                              {product.discount > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                  -{product.discount}% OFF
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                              <div className="flex items-center">
                                <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="font-medium text-sm sm:text-base">{product.rating}</span>
                                <span className="text-gray-500 ml-1 text-sm sm:text-base">({product.reviews})</span>
                              </div>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-500 text-sm sm:text-base">Size: {product.size}</span>
                              <span className="text-gray-500 hidden sm:inline">•</span>
                              <span className="text-gray-500 text-sm sm:text-base">Colour: {product.colour}</span>
                            </div>
                          </div>
                          <div className="md:w-1/3 md:pl-6">
                            <div className="mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                {product.discount > 0 && (
                                  <>
                                    <span className="text-lg text-gray-500 line-through hidden sm:inline">₹{product.originalPrice?.toLocaleString()}</span>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                      -{product.discount}%
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">In stock: {product.stock} units</div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => addToCartWithDelay(product)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => buyNow(product)}
                                className="flex-1 bg-black hover:bg-gray-900 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
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
              <div className="text-center py-12 sm:py-16 md:py-20">
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">✗</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Nike Products Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters or search query to discover our exclusive Nike collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-black to-red-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-gray-900 hover:to-red-900 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>

          {/* Nike Technology Section */}
          <div className="bg-linear-to-r from-gray-900 to-black text-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Nike Innovation & Technology</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl">💨</div>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Air Technology</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Pressurized air inside durable membranes for lightweight cushioning</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl">⚡</div>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">React Foam</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Soft, responsive, durable cushioning for all-day comfort</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl">🧵</div>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Flyknit</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Precision-engineered yarns for lightweight, form-fitting uppers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl">💧</div>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Dri-FIT</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Moisture-wicking fabric technology for dry comfort</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Shop With Us */}
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Shop Nike With Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiCheck className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 sm:mb-3">100% Authentic</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Direct from Nike authorized distributors with authenticity guarantee</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiTruck className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 sm:mb-3">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Express shipping with real-time tracking across India</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiShield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 sm:mb-3">Warranty</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Extended warranty on manufacturing defects for all products</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiRepeat className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 sm:mb-3">Easy Returns</h3>
                  <p className="text-gray-600 text-sm sm:text-base">30-day return policy for unused items in original packaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Size Guide */}
          <div className="bg-linear-to-r from-red-50 to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Size Guide & Fit Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 sm:mb-4">Footwear Sizing</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">US 8</span>
                        <span className="text-gray-600 text-sm sm:text-base">EU 41, UK 7</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">US 9</span>
                        <span className="text-gray-600 text-sm sm:text-base">EU 42, UK 8</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">US 10</span>
                        <span className="text-gray-600 text-sm sm:text-base">EU 43, UK 9</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 sm:mb-4">Apparel Sizing</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Small (S)</span>
                        <span className="text-gray-600 text-sm sm:text-base">Chest: 36-38"</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Medium (M)</span>
                        <span className="text-gray-600 text-sm sm:text-base">Chest: 38-40"</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Large (L)</span>
                        <span className="text-gray-600 text-sm sm:text-base">Chest: 40-42"</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 sm:mb-4">Fit Guide</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Regular Fit: Standard sizing</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Slim Fit: More fitted through body</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Relaxed Fit: Looser, comfortable fit</span>
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

export default NikeStore;