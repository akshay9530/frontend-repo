import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from './Navbar';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import ProductDetailPage from '../components/ProductDetailPage';
import FilterDropdown from '../components/FilterDropdown';
import CheckoutPage from '../components/CheckoutPage';
import Footer from './Footer';
import { FiX, FiShoppingCart, FiArrowLeft, FiFilter, FiChevronDown, FiChevronUp, FiWatch } from 'react-icons/fi';
import { womenWatchesData as dummyProducts } from '../dummyData/womenWatchesData';

const WomenWatch = () => {
  const [filters, setFilters] = useState({
    sort: '',
    brand: '',
    category: '',
    productType: '',
    size: '',
    colour: '',
    discount: '',
    priceRange: '',
    rating: ''
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

  // State for combined products (backend + dummy)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchWomenWatches = async () => {
      try {
        setLoading(true);
        
        // Fetch women's watches specifically from backend API
        const response = await fetch('http://localhost:5000/api/products?category=Women%20Watches&limit=100&sort=-createdAt');
        
        if (!response.ok) {
          // Try alternative endpoint
          const allResponse = await fetch('http://localhost:5000/api/products?limit=100&sort=-createdAt');
          
          if (!allResponse.ok) {
            throw new Error('Failed to fetch products');
          }
          
          const allData = await allResponse.json();
          console.log('Backend response (all products):', allData);
          
          // Handle different response structures
          let productsData = [];
          
          if (allData.success) {
            productsData = allData.data || allData.products || [];
          } else if (Array.isArray(allData)) {
            productsData = allData;
          } else if (allData.products) {
            productsData = allData.products;
          }
          
          if (Array.isArray(productsData) && productsData.length > 0) {
            // Strict filtering for women's watches from backend
            const womenWatchesFromBackend = productsData.filter(product => {
              // Strict category check for women's watches
              const isWomenWatch = 
                product.category === 'Women Watches' ||
                product.category === 'Women Watch' ||
                product.category === 'Watch Women' ||
                (product.category && product.category.toLowerCase().includes('women') && 
                 product.category.toLowerCase().includes('watch'));
              
              // Additional checks for women's products
              const hasWomenInName = product.name && 
                (product.name.toLowerCase().includes('women') || 
                 product.name.toLowerCase().includes('female') ||
                 product.name.toLowerCase().includes('ladies') ||
                 product.name.toLowerCase().includes('her'));
              
              const hasWomenInDescription = product.description && 
                (product.description.toLowerCase().includes('women') || 
                 product.description.toLowerCase().includes('female') ||
                 product.description.toLowerCase().includes('ladies'));
              
              const hasWomenTags = product.tags && 
                product.tags.some(tag => 
                  tag.toLowerCase().includes('women') || 
                  tag.toLowerCase().includes('female') ||
                  tag.toLowerCase().includes('ladies')
                );
              
              // Exclude men's watches explicitly
              const isNotMenWatch = !(
                product.category && (
                  product.category.includes('Men') ||
                  product.category.includes('men') ||
                  product.category.includes('Male')
                ) ||
                product.name && (
                  product.name.toLowerCase().includes('men') ||
                  product.name.toLowerCase().includes('male') ||
                  product.name.toLowerCase().includes('gentlemen') ||
                  product.name.toLowerCase().includes('his')
                )
              );
              
              return (isWomenWatch || hasWomenInName || hasWomenInDescription || hasWomenInTags) && 
                     isNotMenWatch && 
                     (product.category?.toLowerCase().includes('watch') || 
                      product.name?.toLowerCase().includes('watch') ||
                      product.productType?.toLowerCase().includes('watch'));
            });
            
            console.log('Filtered women watches from backend:', womenWatchesFromBackend);
            
            // Transform backend women's watches data
            const transformedBackendProducts = womenWatchesFromBackend.map(product => ({
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand || 'Premium Brand',
              category: getCategoryFromBackend(product.category),
              productType: getProductTypeFromBackend(product),
              price: product.price || Math.floor(Math.random() * 50000) + 5000,
              discount: product.discount || Math.floor(Math.random() * 50),
              rating: product.rating || (Math.random() * 1 + 4).toFixed(1),
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : getWatchImage(),
              images: product.images ? product.images.map(img => img.url) : [getWatchImage()],
              size: product.size || getRandomWatchSize(),
              sizes: product.sizes || ['32mm', '36mm', '38mm', '40mm', '42mm'],
              colour: product.colour || getRandomWatchColor(),
              colors: product.colors || [getRandomWatchColor()],
              stock: product.stock || Math.floor(Math.random() * 50) + 10,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isOnSale: product.isOnSale || (Math.random() > 0.5),
              originalPrice: product.originalPrice || product.price * 1.2,
              tags: product.tags || ['women', 'watch', 'elegant', 'fashion'],
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
            console.log('No products from backend, using dummy data only');
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
        } else {
          // Direct women's watches endpoint worked
          const data = await response.json();
          console.log('Backend response (women watches):', data);
          
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
            // Transform backend women's watches data
            const transformedBackendProducts = productsData.map(product => ({
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand || 'Premium Brand',
              category: getCategoryFromBackend(product.category),
              productType: getProductTypeFromBackend(product),
              price: product.price || Math.floor(Math.random() * 50000) + 5000,
              discount: product.discount || Math.floor(Math.random() * 50),
              rating: product.rating || (Math.random() * 1 + 4).toFixed(1),
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : getWatchImage(),
              images: product.images ? product.images.map(img => img.url) : [getWatchImage()],
              size: product.size || getRandomWatchSize(),
              sizes: product.sizes || ['32mm', '36mm', '38mm', '40mm', '42mm'],
              colour: product.colour || getRandomWatchColor(),
              colors: product.colors || [getRandomWatchColor()],
              stock: product.stock || Math.floor(Math.random() * 50) + 10,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isOnSale: product.isOnSale || (Math.random() > 0.5),
              originalPrice: product.originalPrice || product.price * 1.2,
              tags: product.tags || ['women', 'watch', 'elegant', 'fashion'],
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
            console.log('No products from backend, using dummy data only');
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
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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
        setError('Unable to load products from server. Showing sample watches.');
      } finally {
        setLoading(false);
      }
    };

    fetchWomenWatches();
  }, []);

  // Helper functions for watch data
  const getCategoryFromBackend = (backendCategory) => {
    if (!backendCategory) return 'Watch';
    
    if (backendCategory.includes('Watch') || backendCategory.includes('watch')) {
      return 'Watch';
    }
    
    return 'Watch';
  };

  const getProductTypeFromBackend = (product) => {
    const name = product.name?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    
    if (name.includes('luxury') || description.includes('luxury') || category.includes('luxury')) {
      return 'Luxury Watch';
    }
    if (name.includes('smart') || description.includes('smart') || category.includes('smart')) {
      return 'Smart Watch';
    }
    if (name.includes('fashion') || description.includes('fashion') || category.includes('fashion')) {
      return 'Fashion Watch';
    }
    if (name.includes('analog') || description.includes('analog') || category.includes('analog')) {
      return 'Analog Watch';
    }
    if (name.includes('casual') || description.includes('casual') || category.includes('casual')) {
      return 'Casual Watch';
    }
    
    return 'Women\'s Watch';
  };

  const getWatchImage = () => {
    const watchImages = [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w-800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81cdc5a7d7d2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&auto=format&fit=crop'
    ];
    return watchImages[Math.floor(Math.random() * watchImages.length)];
  };

  const getRandomWatchSize = () => {
    const sizes = ['32mm', '36mm', '38mm', '40mm', '42mm'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  const getRandomWatchColor = () => {
    const colors = ['Rose Gold', 'Gold', 'Silver', 'Black', 'White', 'Blue', 'Pink', 'Purple', 'Multi-color'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Dynamic filter options based on actual products
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    const categories = [...new Set(currentProducts.map(p => p.category))].filter(Boolean);
    const productTypes = filters.category
      ? [...new Set(currentProducts.filter(p => p.category === filters.category).map(p => p.productType))].filter(Boolean)
      : [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    
    const sizeOptions = [...new Set(currentProducts.flatMap(p => p.sizes || []).filter(Boolean))];
    const colourOptions = [...new Set(currentProducts.flatMap(p => p.colors || []).filter(Boolean))];
    
    // If no colors from products, use default colors
    if (colourOptions.length === 0) {
      colourOptions.push('Rose Gold', 'Gold', 'Silver', 'Black', 'White', 'Blue', 'Pink', 'Purple', 'Multi-color');
    }
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      brand: brands.sort(),
      category: ['All', 'Luxury Watch', 'Fashion Watch', 'Smart Watch', 'Analog Watch', 'Casual Watch'],
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      colour: colourOptions.sort(),
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹5,000',
        '₹5,000 - ₹15,000',
        '₹15,000 - ₹30,000',
        '₹30,000 - ₹1,00,000',
        '₹1,00,000 - ₹5,00,000',
        'Above ₹5,00,000'
      ],
      rating: ['4.0 and above', '4.2 and above', '4.5 and above', '4.8 and above']
    };
  }, [filters.category, products]);

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
      image: product.image || product.images?.[0],
      images: product.images || [product.image],
      colour: product.colour,
      size: product.size,
      category: product.category,
      productType: product.productType,
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
      image: product.image || product.images?.[0],
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || '',
      productType: product.productType || ''
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
      productType: product.productType || ''
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
      colour: '',
      discount: '',
      priceRange: '',
      rating: ''
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

  // Filter and sort watches - INCLUDES ALL PRODUCTS (backend + dummy)
  const filteredWatches = useMemo(() => {
    let filtered = [...products];
    
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(p => 
        p.productType.includes(filters.category.replace(' Watch', '')) || 
        p.category === filters.category
      );
    }
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => 
      (p.colors && p.colors.includes(filters.colour)) || 
      (p.colour && p.colour === filters.colour)
    );
    if (filters.size) filtered = filtered.filter(p => 
      (p.sizes && p.sizes.includes(filters.size)) || 
      p.size === filters.size
    );
    
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
        case 'Under ₹5,000': filtered = filtered.filter(p => p.price < 5000); break;
        case '₹5,000 - ₹15,000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 15000); break;
        case '₹15,000 - ₹30,000': filtered = filtered.filter(p => p.price >= 15000 && p.price <= 30000); break;
        case '₹30,000 - ₹1,00,000': filtered = filtered.filter(p => p.price >= 30000 && p.price <= 100000); break;
        case '₹1,00,000 - ₹5,00,000': filtered = filtered.filter(p => p.price >= 100000 && p.price <= 500000); break;
        case 'Above ₹5,00,000': filtered = filtered.filter(p => p.price > 500000); break;
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
  }, [filters, products]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading watches...</p>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Watches</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-pink-600 hover:bg-pink-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300"
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
        productType: checkoutProduct.productType || ''
      }];
    } else {
      productsForCheckout = cart;
    }
    
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Watches</span>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-pink-600 hover:bg-pink-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300"
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
        className="fixed bottom-20 left-4 sm:hidden z-100 bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300 flex items-center justify-center"
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
                    <p className="text-gray-400 text-sm sm:text-base">Add watches to get started</p>
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
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
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
                  { key: 'brand', label: 'Brand' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'size', label: 'Size' },
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
                                filters[key] === option ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'border border-transparent'
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
        <div className="min-h-screen bg-linear-to-b from-transparent to-pink-50">
          {/* Hero Banner */}
          <div className="bg-linear-to-r from-pink-600 to-rose-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="animate-fade-in text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {useFallbackData ? 'Elegant Women\'s Watches' : 'Premium Women\'s Watches Collection'}
                  </h1>
                  <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                    {filteredWatches.length} Exquisite Timepieces Await
                    {error && (
                      <span className="block text-yellow-200 text-xs mt-1">
                        {error}
                      </span>
                    )}
                  </p>
                </div>
                <div className="hidden sm:block animate-pulse">
                  <div className="bg-white bg-opacity-20 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                    <span className="text-sm sm:text-base md:text-lg text-black">
                      Free Shipping on Orders Over ₹10,000
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
                    .filter(([ , value]) => value)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs sm:text-sm"
                      >
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                        <button
                          onClick={() => clearFilter(key)}
                          className="ml-1 hover:text-pink-900"
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
                    { key: 'colour', label: 'Colour', options: filterOptions.colour },
                    { key: 'discount', label: 'Discount', options: filterOptions.discount },
                    { key: 'priceRange', label: 'Price', options: filterOptions.priceRange },
                    { key: 'rating', label: 'Rating', options: filterOptions.rating }
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
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="text-pink-600 font-medium text-sm"
                >
                  {hasActiveFilters ? 'Edit' : 'Add'} Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            {/* Products Count */}
            <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Premium Women's Watches
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Showing <span className="font-semibold">{filteredWatches.length}</span> timepiece{filteredWatches.length !== 1 ? 's' : ''}
                  {backendProducts.length > 0 && (
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      {backendProducts.length} from backend
                    </span>
                  )}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">New Arrival</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-sm text-gray-600">In Stock</span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredWatches.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {filteredWatches.map(product => (
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
              <div className="text-center py-12 sm:py-16 md:py-20">
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">💎</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Watches Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to discover our premium women's watch collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-pink-600 to-rose-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Explore All Watches
                </button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-linear-to-r from-pink-50 to-rose-50 py-12 md:py-16 mt-6 sm:mt-8 md:mt-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Choose Our Women's Watches?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <FiWatch className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">Elegant Design</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Sophisticated designs crafted for feminine elegance</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">Premium Materials</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Highest quality materials including diamonds and gold</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">Authentic Warranty</h3>
                  <p className="text-gray-600 text-sm sm:text-base">All watches come with manufacturer warranty</p>
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

export default WomenWatch;