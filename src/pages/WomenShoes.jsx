import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Footer from './Footer'
import { womenShoesData } from '../dummyData/womenShoesData'

const WomenShoes = () => {
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
    brand: '',
    category: '',
    priceRange: '',
    rating: '',
    size: '',
    colour: '',
    discount: ''
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
          // Filter for ALL shoes from backend (both men's and women's)
          const allShoesFromBackend = productsData.filter(product => {
            const category = getCategoryFromBackend(product.category);
            const productType = getProductTypeFromCategory(product.category);
            const name = product.name || '';
            const description = product.description || '';
            const tags = product.tags || [];
            
            // Check if it's ANY kind of shoe (men's, women's, or unisex)
            const isShoe = category === 'Shoes' || 
                          productType.toLowerCase().includes('shoe') ||
                          productType.toLowerCase().includes('sneaker') ||
                          productType.toLowerCase().includes('footwear') ||
                          name.toLowerCase().includes('shoe') ||
                          name.toLowerCase().includes('sneaker') ||
                          name.toLowerCase().includes('boot') ||
                          name.toLowerCase().includes('loafer') ||
                          name.toLowerCase().includes('sandal') ||
                          description.toLowerCase().includes('shoe') ||
                          description.toLowerCase().includes('sneaker') ||
                          description.toLowerCase().includes('footwear') ||
                          tags.some(tag => 
                            tag.toLowerCase().includes('shoe') ||
                            tag.toLowerCase().includes('sneaker') ||
                            tag.toLowerCase().includes('footwear')
                          );
            
            return isShoe;
          });
          
          // Transform backend products data
          const transformedBackendProducts = allShoesFromBackend.map(product => {
            // Determine if product is for women, men, or unisex
            let gender = 'Unisex';
            const name = product.name || '';
            const desc = product.description || '';
            const category = product.category || '';
            const tags = product.tags || [];
            
            if (category.toLowerCase().includes('women') || 
                name.toLowerCase().includes('women') || 
                name.toLowerCase().includes('woman') ||
                name.toLowerCase().includes('ladies') ||
                name.toLowerCase().includes('girl') ||
                desc.toLowerCase().includes('women') ||
                desc.toLowerCase().includes('woman') ||
                desc.toLowerCase().includes('ladies') ||
                desc.toLowerCase().includes('girl') ||
                tags.some(tag => 
                  tag.toLowerCase().includes('women') ||
                  tag.toLowerCase().includes('woman') ||
                  tag.toLowerCase().includes('ladies') ||
                  tag.toLowerCase().includes('girl')
                )) {
              gender = 'Women';
            } else if (category.toLowerCase().includes('men') || 
                      name.toLowerCase().includes('men') || 
                      name.toLowerCase().includes('man') ||
                      name.toLowerCase().includes('gents') ||
                      name.toLowerCase().includes('boy') ||
                      desc.toLowerCase().includes('men') ||
                      desc.toLowerCase().includes('man') ||
                      desc.toLowerCase().includes('gents') ||
                      desc.toLowerCase().includes('boy') ||
                      tags.some(tag => 
                        tag.toLowerCase().includes('men') ||
                        tag.toLowerCase().includes('man') ||
                        tag.toLowerCase().includes('gents') ||
                        tag.toLowerCase().includes('boy')
                      )) {
              gender = 'Men';
            }
            
            // Determine shoe type
            let shoeType = 'Sneakers';
            if (name.toLowerCase().includes('heel') || desc.toLowerCase().includes('heel')) {
              shoeType = 'Heels';
            } else if (name.toLowerCase().includes('flat') || desc.toLowerCase().includes('flat')) {
              shoeType = 'Flats';
            } else if (name.toLowerCase().includes('sandal') || desc.toLowerCase().includes('sandal')) {
              shoeType = 'Sandals';
            } else if (name.toLowerCase().includes('boot') || desc.toLowerCase().includes('boot')) {
              shoeType = 'Boots';
            } else if (name.toLowerCase().includes('loafer') || desc.toLowerCase().includes('loafer')) {
              shoeType = 'Loafers';
            } else if (name.toLowerCase().includes('sport') || desc.toLowerCase().includes('sport') || desc.toLowerCase().includes('running')) {
              shoeType = 'Sports';
            }
            
            return {
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name,
              description: product.description,
              brand: product.brand,
              category: 'Shoes',
              productType: shoeType,
              gender: gender,
              price: product.price,
              discount: product.discount || 0,
              rating: product.rating || 4.5,
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300',
              images: product.images ? product.images.map(img => img.url) : ['https://via.placeholder.com/300'],
              size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'US 7',
              sizes: product.sizes || ['US 5', 'US 5.5', 'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9'],
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : '',
              colors: product.colors || [],
              stock: product.stock || 0,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isOnSale: product.isOnSale || false,
              originalPrice: product.originalPrice || product.price,
              tags: product.tags || [],
              createdAt: product.createdAt || new Date(),
              source: 'backend'
            };
          });
          
          // Filter to show only Women's and Unisex shoes in Women's section
          const womensShoesFromBackend = transformedBackendProducts.filter(product => 
            product.gender === 'Women' || product.gender === 'Unisex'
          );
          
          // Sort backend products by creation date (newest first)
          womensShoesFromBackend.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          
          // Ensure dummy products have unique IDs that don't conflict
          const uniqueDummyProducts = womenShoesData.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            gender: 'Women',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          
          // Combine both arrays
          const allProducts = [...womensShoesFromBackend, ...uniqueDummyProducts];
          
          setBackendProducts(womensShoesFromBackend);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No women shoes from backend, using dummy data only');
          const uniqueDummyProducts = womenShoesData.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            gender: 'Women',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          setProducts(uniqueDummyProducts);
          setBackendProducts([]);
          setUseFallbackData(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = womenShoesData.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          gender: 'Women',
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

    fetchAllProducts();
  }, []);

  // Helper function to categorize backend products
  const getCategoryFromBackend = (backendCategory) => {
    if (!backendCategory) return 'Shoes';
    
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
      'Fragrance': 'Fragrance',
      'Footwear': 'Shoes'
    };
    
    return categoryMap[backendCategory] || backendCategory || 'Shoes';
  };

  // Helper function to get product type from category
  const getProductTypeFromCategory = (category) => {
    if (!category) return "Shoes";
    
    const typeMap = {
      'Men Clothes': 'Men\'s Clothing',
      'Women Clothes': 'Women\'s Clothing',
      'Men Sneakers': 'Sneakers',
      'Women Sneakers': "Sneakers",
      'Men Watches': 'Watch',
      'Women Watches': 'Watch',
      'Men Fragrances': 'Fragrance',
      'Women Fragrances': 'Fragrance',
      'TV & Home Theater': 'Television',
      'Mobile Phones': 'Smartphone',
      'Earbuds & Headphones': 'Earbuds',
      'Clothes': 'Clothing',
      'Shoes': 'Shoes',
      'Electronics': 'Gadget',
      'Watch': 'Watch',
      'Fragrance': 'Fragrance',
      'Footwear': 'Shoes'
    };
    
    return typeMap[category] || category || "Shoes";
  };

  // Dynamic filter options based on actual products
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    const categories = ['All', ...new Set(currentProducts.map(p => p.category))].filter(Boolean);
    const productTypes = filters.category && filters.category !== 'All'
      ? [...new Set(currentProducts.filter(p => p.category === filters.category).map(p => p.productType))].filter(Boolean)
      : [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    
    let sizeOptions = [];
    const allSizes = currentProducts
      .flatMap(p => p.sizes || [])
      .filter(Boolean);
    sizeOptions = [...new Set(allSizes)];
    
    // If no sizes from products, use default sizes
    if (sizeOptions.length === 0) {
      sizeOptions = ['US 5', 'US 5.5', 'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9'];
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
      colourOptions = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Brown', 'Gray', 'Pink', 'Purple', 'Multi-color'];
    }
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      brand: brands.sort(),
      category: categories.sort(),
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      colour: colourOptions.sort(),
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹2000',
        '₹2000 - ₹3500',
        '₹3500 - ₹5000',
        '₹5000 - ₹7000',
        '₹7000 - ₹10000',
        'Above ₹10000'
      ],
      rating: ['4.0 and above', '4.2 and above', '4.5 and above', '4.8 and above']
    };
  }, [filters.category, products]);

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
      category: product.category || ''
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
      priceRange: '',
      rating: '',
      size: '',
      colour: '',
      discount: ''
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
  const filteredShoes = useMemo(() => {
    let filtered = [...products];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.colour && p.colour.toLowerCase().includes(query)) ||
        (p.productType && p.productType.toLowerCase().includes(query))
      );
    }
   
    // Apply filters
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
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
        case 'Under ₹2000': filtered = filtered.filter(p => p.price < 2000); break;
        case '₹2000 - ₹3500': filtered = filtered.filter(p => p.price >= 2000 && p.price <= 3500); break;
        case '₹3500 - ₹5000': filtered = filtered.filter(p => p.price >= 3500 && p.price <= 5000); break;
        case '₹5000 - ₹7000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 7000); break;
        case '₹7000 - ₹10000': filtered = filtered.filter(p => p.price >= 7000 && p.price <= 10000); break;
        case 'Above ₹10000': filtered = filtered.filter(p => p.price > 10000); break;
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading women's shoes...</p>
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
          <span className="font-medium">Back to Shoes</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-pink-600 hover:bg-pink-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300"
          aria-label="Open Cart"
        >
          <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:h-6 flex items-center justify-center animate-pulse">
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
        category: checkoutProduct.category || ''
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
          <span className="font-medium">Back to Shoes</span>
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-pink-600 hover:bg-pink-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300"
        aria-label="Open Cart"
      >
        <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:h-6 flex items-center justify-center animate-pulse">
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
            className="fixed inset-0 backdrop-blur-md z-40 transition-opacity duration-300"
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
                    <div className="text-gray-300 text-5xl sm:text-6xl mb-3 sm:mb-4">👠</div>
                    <p className="text-gray-500 text-base sm:text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-400 text-sm sm:text-base">Add shoes to get started</p>
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
            className="fixed inset-0 backdrop-blur-md z-30 sm:hidden"
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
                    placeholder="Search shoes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  { key: 'brand', label: 'Brand' },
                  { key: 'productType', label: 'Type' },
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
        <div className="min-h-screen bg-linear-to-b from-transparent to-blue-50">
          {/* Hero Banner */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="animate-fade-in text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Women's Shoes Collection</h1>
                  <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base md:text-lg max-w-2xl">
                    Step into style with our premium women's shoe collection. From athletic sneakers to elegant heels, 
                    find the perfect pair for every occasion.
                    {error && (
                      <span className="block text-yellow-200 text-xs mt-1">
                        {error}
                      </span>
                    )}
                  </p>
                </div>
                <div className="hidden sm:block animate-pulse">
                  <div className="bg-white bg-opacity-20 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-black">
                      Trendy Footwear Starting at ₹2299
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
                    .filter(([ , value]) => value)
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
                <div className="relative max-w-xl mx-auto">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search shoes by name, brand, or color..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
              </div>
              
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
                      {Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0)}
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

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            {/* Products Count */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Premium Women's Shoes</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {filteredShoes.length} stylish pair{filteredShoes.length !== 1 ? 's' : ''} found
                    {!useFallbackData && backendProducts.length > 0 && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        +{backendProducts.length} from backend
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
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">In Stock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredShoes.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {filteredShoes.map(product => (
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
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">👠</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Shoes Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters or search query to discover our premium shoe collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Explore All Shoes
                </button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 py-12 sm:py-16 mt-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Choose Our Shoes?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Premium Comfort</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Engineered for all-day comfort with cushioned insoles and supportive designs</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Size Guarantee</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Perfect fit guarantee with free exchanges on all sizes</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Free Shipping & Returns</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Free delivery and 30-day return policy on all shoe orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Size Guide */}
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Shoe Size Guide</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-3 sm:px-4 text-left font-semibold text-gray-700">US Size</th>
                      <th className="py-3 px-3 sm:px-4 text-left font-semibold text-gray-700">EU Size</th>
                      <th className="py-3 px-3 sm:px-4 text-left font-semibold text-gray-700">UK Size</th>
                      <th className="py-3 px-3 sm:px-4 text-left font-semibold text-gray-700">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 px-3 sm:px-4">US 5</td>
                      <td className="py-3 px-3 sm:px-4">35</td>
                      <td className="py-3 px-3 sm:px-4">3</td>
                      <td className="py-3 px-3 sm:px-4">22.1 cm</td>
                    </tr>
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td className="py-3 px-3 sm:px-4">US 6</td>
                      <td className="py-3 px-3 sm:px-4">36</td>
                      <td className="py-3 px-3 sm:px-4">4</td>
                      <td className="py-3 px-3 sm:px-4">22.9 cm</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 px-3 sm:px-4">US 7</td>
                      <td className="py-3 px-3 sm:px-4">37</td>
                      <td className="py-3 px-3 sm:px-4">5</td>
                      <td className="py-3 px-3 sm:px-4">23.8 cm</td>
                    </tr>
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td className="py-3 px-3 sm:px-4">US 8</td>
                      <td className="py-3 px-3 sm:px-4">38</td>
                      <td className="py-3 px-3 sm:px-4">6</td>
                      <td className="py-3 px-3 sm:px-4">24.6 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

export default WomenShoes;