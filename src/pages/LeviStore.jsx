// src/pages/LeviStore.jsx
import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import { leviProducts } from '../dummyData/leviProducts'
import Footer from './Footer'
import { FiX, FiShoppingCart, FiArrowLeft, FiSearch, FiStar, FiCheck, FiTruck, FiShield, FiRepeat, FiGrid, FiList, FiFilter, FiUser, FiHeart, FiTag, FiWatch, FiBriefcase, FiSun, FiMoon, FiPackage, FiGift, FiTruck as FiDelivery, FiAward, FiFeather, FiCompass, FiAnchor, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const LeviStore = () => {
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
    gender: '',
    fit: '',
    wash: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  
  // Use CartContext
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
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [checkoutType, setCheckoutType] = useState('single');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [trackingMode, setTrackingMode] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);

  // New state variables for backend data
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
        console.log('Backend response (all products) for Levi Store:', data);
        
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
          // Filter for Levi's brand or transform all products
          const leviBackendProducts = productsData
            .filter(product => 
              product.brand === 'Levi\'s' || 
              product.brand === 'Levi' ||
              product.name?.toLowerCase().includes('levi') ||
              product.category?.includes('Clothes') ||
              product.category?.includes('Jeans') ||
              product.description?.toLowerCase().includes('denim')
            )
            .map(product => ({
              id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
              name: product.name || 'Levi\'s Product',
              description: product.description || 'Authentic Levi\'s denim product',
              brand: product.brand || 'Levi\'s',
              category: getLeviCategoryFromBackend(product.category),
              productType: getLeviProductTypeFromCategory(product.category),
              collection: getLeviCollectionFromProduct(product),
              gender: getLeviGenderFromProduct(product),
              fit: getLeviFitFromProduct(product),
              wash: getLeviWashFromProduct(product),
              price: product.price || 0,
              originalPrice: product.originalPrice || product.price || 0,
              discount: product.discount || 0,
              rating: product.rating || 4.5,
              reviews: product.reviews || Math.floor(Math.random() * 100),
              image: product.images && product.images[0] ? product.images[0].url : getLeviDefaultImage(product.category),
              images: product.images ? product.images.map(img => img.url) : [getLeviDefaultImage(product.category)],
              size: getLeviSizeFromProduct(product),
              sizes: product.sizes || getDefaultSizesForCategory(product.category),
              colour: product.colors && product.colors.length > 0 ? product.colors[0] : getLeviDefaultColor(),
              colors: product.colors || [getLeviDefaultColor()],
              stock: product.stock || 10,
              isNew: product.isNewArrival || false,
              isFeatured: product.isFeatured || false,
              isOnSale: product.isOnSale || false,
              tags: product.tags || ['Levi\'s', 'Denim', 'Jeans'],
              createdAt: product.createdAt || new Date(),
              source: 'backend'
            }));
          
          // Sort backend products by creation date (newest first)
          leviBackendProducts.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          
          // Ensure dummy products have unique IDs that don't conflict
          const uniqueDummyProducts = leviProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: new Date(Date.now() - Math.random() * 10000000000) // Random past dates for dummy data
          }));
          
          // Combine both arrays
          const allProducts = [...leviBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(leviBackendProducts);
          setProducts(allProducts);
          setUseFallbackData(false);
        } else {
          // No products from backend, use only dummy data
          console.log('No products from backend, using dummy data only');
          const uniqueDummyProducts = leviProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            createdAt: new Date(Date.now() - Math.random() * 10000000000)
          }));
          setProducts(uniqueDummyProducts);
          setBackendProducts([]);
          setUseFallbackData(true);
        }
      } catch (error) {
        console.error('Error fetching Levi products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = leviProducts.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          createdAt: new Date(Date.now() - Math.random() * 10000000000)
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

  // Helper functions for Levi's products
  const getLeviCategoryFromBackend = (backendCategory) => {
    if (!backendCategory) return 'Jeans';
    
    const categoryMap = {
      'Men Clothes': 'Jeans',
      'Women Clothes': 'Jeans',
      'Men Jeans': 'Jeans',
      'Women Jeans': 'Jeans',
      'Men Jackets': 'Jackets',
      'Women Jackets': 'Jackets',
      'Men Shirts': 'Shirts',
      'Women Shirts': 'Shirts',
      'Men T-Shirts': 'T-Shirts',
      'Women T-Shirts': 'T-Shirts',
      'Clothes': 'Jeans',
      'Jeans': 'Jeans',
      'Jackets': 'Jackets',
      'Shirts': 'Shirts',
      'T-Shirts': 'T-Shirts',
      'Shorts': 'Shorts',
      'Dresses': 'Dresses',
      'Jumpsuits': 'Jumpsuits',
      'Accessories': 'Accessories',
      'Bags': 'Bags',
      'Kids': 'Kids',
      'Loungewear': 'Loungewear',
      'Hoodies': 'Hoodies'
    };
    
    return categoryMap[backendCategory] || 'Jeans';
  };

  const getLeviProductTypeFromCategory = (category) => {
    if (!category) return 'Denim Jeans';
    
    const typeMap = {
      'Jeans': 'Denim Jeans',
      'Jackets': 'Trucker Jacket',
      'Shirts': 'Denim Shirt',
      'T-Shirts': 'Graphic Tee',
      'Shorts': 'Denim Shorts',
      'Dresses': 'Denim Dress',
      'Jumpsuits': 'Denim Jumpsuit',
      'Accessories': 'Belt',
      'Bags': 'Backpack',
      'Kids': 'Kids Jeans',
      'Loungewear': 'Sweatpants',
      'Hoodies': 'Hooded Sweatshirt'
    };
    
    return typeMap[category] || 'Product';
  };

  const getLeviCollectionFromProduct = (product) => {
    if (product.collection) return product.collection;
    
    // Generate collection based on category or name
    const collections = ['501® Original', 'Red Tab', 'Premium', 'Made & Crafted', 'Sustainable', 'Vintage', 'Modern'];
    return collections[Math.floor(Math.random() * collections.length)];
  };

  const getLeviGenderFromProduct = (product) => {
    if (product.gender) return product.gender;
    
    // Determine gender from category or name
    if (product.category?.includes('Women') || product.name?.toLowerCase().includes('women')) {
      return 'Women';
    } else if (product.category?.includes('Men') || product.name?.toLowerCase().includes('men')) {
      return 'Men';
    } else if (product.category?.includes('Kids')) {
      return 'Kids';
    } else {
      return Math.random() > 0.5 ? 'Men' : 'Women';
    }
  };

  const getLeviFitFromProduct = (product) => {
    if (product.fit) return product.fit;
    
    const fits = ['Slim', 'Straight', 'Skinny', 'Relaxed', 'Tapered', 'Bootcut', 'Original'];
    return fits[Math.floor(Math.random() * fits.length)];
  };

  const getLeviWashFromProduct = (product) => {
    if (product.wash) return product.wash;
    
    const washes = ['Dark Wash', 'Medium Wash', 'Light Wash', 'Black', 'Distressed', 'Raw', 'Vintage'];
    return washes[Math.floor(Math.random() * washes.length)];
  };

  const getLeviDefaultImage = (category) => {
    const imageMap = {
      'Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Jackets': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Shorts': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };
    
    return imageMap[category] || 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  };

  const getLeviSizeFromProduct = (product) => {
    if (product.size) return product.size;
    
    const sizes = ['S', 'M', 'L', 'XL', '28W', '30W', '32W', '34W', '36W', '38W', '28W x 30L', '30W x 30L', '32W x 32L'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  const getDefaultSizesForCategory = (category) => {
    if (category?.includes('Jeans') || category?.includes('Shorts') || category?.includes('Pants')) {
      return ['28W', '30W', '32W', '34W', '36W', '38W'];
    } else if (category?.includes('Jackets') || category?.includes('Shirts') || category?.includes('T-Shirts')) {
      return ['S', 'M', 'L', 'XL', 'XXL'];
    } else if (category?.includes('Kids')) {
      return ['10-12 Years', '8-10 Years', '6-8 Years'];
    } else {
      return ['One Size'];
    }
  };

  const getLeviDefaultColor = () => {
    const colors = ['Blue', 'Black', 'Gray', 'White', 'Indigo', 'Dark Blue', 'Light Blue'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Dynamic filter options based on actual products
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const categories = ['All', ...new Set(currentProducts.map(p => p.category))].filter(Boolean);
    const productTypes = filters.category && filters.category !== 'All'
      ? [...new Set(currentProducts.filter(p => p.category === filters.category).map(p => p.productType))].filter(Boolean)
      : [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    
    let sizeOptions = [];
    if (filters.category === 'Jeans' || filters.category === 'Shorts' || filters.category === 'Pants') {
      const allSizes = currentProducts
        .filter(p => p.category === filters.category)
        .flatMap(p => p.sizes || [])
        .filter(Boolean);
      sizeOptions = [...new Set(allSizes)];
    } else if (filters.category === 'Jackets' || filters.category === 'Shirts' || filters.category === 'T-Shirts' || filters.category === 'Hoodies') {
      sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    } else if (filters.category === 'Kids') {
      sizeOptions = ['10-12 Years', '8-10 Years', '6-8 Years', '4-6 Years'];
    } else {
      const allSizes = currentProducts.flatMap(p => p.sizes || []).filter(Boolean);
      sizeOptions = [...new Set(allSizes)];
    }
    
    let colourOptions = [];
    if (filters.category && filters.category !== 'All') {
      const allColors = currentProducts
        .filter(p => p.category === filters.category)
        .flatMap(p => p.colors || [])
        .filter(Boolean);
      colourOptions = [...new Set(allColors)];
    } else {
      const allColors = currentProducts.flatMap(p => p.colors || []).filter(Boolean);
      colourOptions = [...new Set(allColors)];
    }
    
    // If no colors from products, use default Levi's colors
    if (colourOptions.length === 0) {
      colourOptions = ['Blue', 'Black', 'Gray', 'White', 'Indigo', 'Dark Blue', 'Light Blue', 'Denim'];
    }
    
    const collections = [...new Set(currentProducts.map(p => p.collection))].filter(Boolean);
    const genders = ['All', ...new Set(currentProducts.map(p => p.gender))].filter(Boolean);
    const fits = [...new Set(currentProducts.map(p => p.fit).filter(f => f && f !== 'N/A'))];
    const washes = [...new Set(currentProducts.map(p => p.wash).filter(w => w && w !== 'N/A'))];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      category: categories.sort(),
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      colour: colourOptions.sort(),
      collection: collections.sort(),
      gender: genders.sort(),
      fit: fits.sort(),
      wash: washes.sort(),
      discount: ['15% and above', '20% and above', '25% and above', '30% and above', '35% and above', '40% and above'],
      priceRange: [
        'Under ₹2,000',
        '₹2,000 - ₹3,000',
        '₹3,000 - ₹5,000',
        '₹5,000 - ₹8,000',
        '₹8,000 - ₹12,000',
        '₹12,000 - ₹18,000',
        'Above ₹18,000'
      ],
      rating: ['4.0 and above', '4.3 and above', '4.5 and above', '4.7 and above']
    };
  }, [filters.category, products]);

  // Cart functions using CartContext
  const addToCartWithDelay = async (product) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      images: product.images,
      colour: product.colour,
      size: product.size,
      category: product.category,
      collection: product.collection,
      fit: product.fit,
      wash: product.wash,
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
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || '',
      collection: product.collection || '',
      fit: product.fit || '',
      wash: product.wash || ''
    };
    
    setCheckoutProducts([productForCheckout]);
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
      collection: product.collection || '',
      fit: product.fit || '',
      wash: product.wash || ''
    };
    
    setCheckoutProducts([productForCheckout]);
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
    console.log('Levi\'s purchase completed:', orderData);
    
    if (checkoutType === 'cart') {
      clearCart();
    }
    
    setCheckoutMode(false);
    setCheckoutProducts([]);
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
      collection: '',
      gender: '',
      fit: '',
      wash: ''
    });
    setSearchQuery('');
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
        p.collection?.toLowerCase().includes(query) ||
        p.gender.toLowerCase().includes(query) ||
        p.fit?.toLowerCase().includes(query) ||
        p.wash?.toLowerCase().includes(query)
      );
    }
   
    // Apply filters
    if (filters.category && filters.category !== 'All') filtered = filtered.filter(p => p.category === filters.category);
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => p.colour === filters.colour);
    if (filters.size) filtered = filtered.filter(p => 
      (p.sizes && p.sizes.includes(filters.size)) || 
      p.size === filters.size
    );
    if (filters.collection) filtered = filtered.filter(p => p.collection === filters.collection);
    if (filters.gender && filters.gender !== 'All') filtered = filtered.filter(p => p.gender === filters.gender);
    if (filters.fit) filtered = filtered.filter(p => p.fit === filters.fit);
    if (filters.wash) filtered = filtered.filter(p => p.wash === filters.wash);
    
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
        case '₹2,000 - ₹3,000': filtered = filtered.filter(p => p.price >= 2000 && p.price <= 3000); break;
        case '₹3,000 - ₹5,000': filtered = filtered.filter(p => p.price >= 3000 && p.price <= 5000); break;
        case '₹5,000 - ₹8,000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 8000); break;
        case '₹8,000 - ₹12,000': filtered = filtered.filter(p => p.price >= 8000 && p.price <= 12000); break;
        case '₹12,000 - ₹18,000': filtered = filtered.filter(p => p.price >= 12000 && p.price <= 18000); break;
        case 'Above ₹18,000': filtered = filtered.filter(p => p.price > 18000); break;
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

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'All') || searchQuery;
  
  // Get cart summary
  const cartSummary = getCartSummary();

  // Count products by category
  const categoryCounts = useMemo(() => {
    const counts = { 
      Jeans: 0, Jackets: 0, Shirts: 0, 'T-Shirts': 0, 
      Shorts: 0, Dresses: 0, Jumpsuits: 0, Accessories: 0, 
      Bags: 0, Kids: 0, Loungewear: 0, Hoodies: 0 
    };
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
            <p className="text-gray-600">Loading authentic Levi's products...</p>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Levi's Store</span>
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
        />
      </div>
    );
  }

  // If in checkout mode, show checkout page
  if (checkoutMode) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">
            {checkoutType === 'single' ? 'Back to Product' : 'Back to Cart'}
          </span>
        </button>
        
        <CheckoutPage
          products={checkoutType === 'single' ? checkoutProducts : cart}
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Products</span>
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

      {/* Mobile Filter Button */}
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
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
                    <p className="text-gray-400 text-sm sm:text-base">Add Levi's products to get started</p>
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
                    placeholder="Search Levi's products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                  />
                </div>

                {[
                  { key: 'category', label: 'Category' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'gender', label: 'Gender' },
                  { key: 'fit', label: 'Fit' },
                  { key: 'wash', label: 'Wash' },
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
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
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
          <div className="bg-linear-to-r from-red-800 via-red-700 to-red-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="animate-fade-in mb-6 md:mb-0 md:w-2/3">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <img 
                        src="https://logowik.com/content/uploads/images/254_levis.jpg" 
                        alt="Levi's Logo"
                        className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 rounded-4xl object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">Levi's Official Store</h1>
                      <p className="text-sm sm:text-base md:text-lg opacity-90">
                        {useFallbackData ? 'Sample Levi\'s Collection' : 'Authentic Levi\'s Collection'}
                      </p>
                      {error && (
                        <span className="block text-yellow-200 text-xs mt-1">
                          {error}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mb-4 sm:mb-6 md:mb-8">
                    Since 1853, Levi's has been defining American denim culture. 
                    From the original 501® jeans to modern fits and styles, 
                    discover authentic denim, jackets, and apparel built to last.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    <div className="bg-white bg-opacity-20 px-3 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm">
                      <span className="font-medium text-blue-700">👖 Original 501® Jeans</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm">
                      <span className="font-medium text-amber-950">🧥 Iconic Trucker Jackets</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm">
                      <span className="font-medium text-lime-700">👕 Premium Denim Shirts</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm">
                      <span className="font-medium text-green-950">🌱 Sustainable Collection</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{products.length}</div>
                    <div className="text-lg">Authentic Products</div>
                    {useFallbackData && (
                      <div className="text-yellow-300 text-xs mt-2 bg-yellow-900 bg-opacity-30 px-2 py-1 rounded">
                        Using sample products
                      </div>
                    )}
                    <div className="mt-4 text-sm opacity-90">Since 1853</div>
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
                  {Object.entries(filters)
                    .filter(([_, value]) => value && value !== 'All')
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Jeans' ? 'ring-2 sm:ring-4 ring-red-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Jeans' ? '' : 'Jeans')}
                >
                  <div className="h-40 sm:h-48 bg-linear-to-br from-blue-900 to-indigo-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiUser className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-lg sm:text-xl font-bold">Denim Jeans</h3>
                      <p className="text-gray-200 mt-1 text-sm sm:text-base">{categoryCounts.Jeans || 0} Styles</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Jackets' ? 'ring-2 sm:ring-4 ring-red-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Jackets' ? '' : 'Jackets')}
                >
                  <div className="h-40 sm:h-48 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiBriefcase className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-lg sm:text-xl font-bold">Jackets</h3>
                      <p className="text-gray-200 mt-1 text-sm sm:text-base">{categoryCounts.Jackets || 0} Styles</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${filters.category === 'Shirts' || filters.category === 'T-Shirts' ? 'ring-2 sm:ring-4 ring-red-600' : ''}`}
                  onClick={() => handleFilterChange('category', filters.category === 'Shirts' ? '' : 'Shirts')}
                >
                  <div className="h-40 sm:h-48 bg-linear-to-br from-red-700 to-red-800 flex items-center justify-center">
                    <div className="text-center text-white p-4 sm:p-6">
                      <FiFeather className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-lg sm:text-xl font-bold">Shirts & Tees</h3>
                      <p className="text-gray-200 mt-1 text-sm sm:text-base">
                        {(categoryCounts.Shirts || 0) + (categoryCounts['T-Shirts'] || 0)} Styles
                      </p>
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
                        placeholder="Search Levi's products by name, fit, wash, or collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm sm:text-base"
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
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} text-sm sm:text-base`}
                      >
                        <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} text-sm sm:text-base`}
                      >
                        <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {filteredProducts.length} products
                      {useFallbackData && (
                        <span className="text-yellow-600 text-xs ml-2">(Sample)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-4">
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
                
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide">
                  {[
                    { key: 'category', label: 'Category', options: filterOptions.category },
                    { key: 'productType', label: 'Type', options: filterOptions.productType },
                    { key: 'gender', label: 'Gender', options: filterOptions.gender },
                    { key: 'fit', label: 'Fit', options: filterOptions.fit },
                    { key: 'wash', label: 'Wash', options: filterOptions.wash }
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
                    { key: 'size', label: 'Size', options: filterOptions.size },
                    { key: 'colour', label: 'Colour', options: filterOptions.colour },
                    { key: 'collection', label: 'Collection', options: filterOptions.collection },
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
                    <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {Object.values(filters).filter(v => v && v !== 'All').length + (searchQuery ? 1 : 0)}
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
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Levi's Authentic Denim Collection</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                    {useFallbackData && (
                      <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        Using sample products only
                      </span>
                    )}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-gray-600">Premium Denim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs sm:text-sm text-gray-600">In Stock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs sm:text-sm text-gray-600">Made to Last</span>
                  </div>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
                              <div className="flex flex-wrap gap-2 mb-2">
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
                                {product.source === 'backend' && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    Live
                                  </span>
                                )}
                                {product.fit && product.fit !== 'N/A' && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    {product.fit}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{product.description}</p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                                <div className="flex items-center">
                                  <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="font-medium text-sm sm:text-base">{product.rating}</span>
                                  <span className="text-gray-500 ml-1 text-sm">({product.reviews})</span>
                                </div>
                                <span className="text-gray-500 hidden sm:inline">•</span>
                                <span className="text-gray-500 text-sm">Size: {product.size}</span>
                                <span className="text-gray-500 hidden sm:inline">•</span>
                                <span className="text-gray-500 text-sm">Gender: {product.gender}</span>
                                {product.wash && product.wash !== 'N/A' && (
                                  <>
                                    <span className="text-gray-500 hidden sm:inline">•</span>
                                    <span className="text-gray-500 text-sm">Wash: {product.wash}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="md:w-1/3 md:pl-6">
                              <div className="mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                  {product.discount > 0 && (
                                    <>
                                      <span className="text-lg text-gray-500 line-through text-sm sm:text-base">₹{product.originalPrice.toLocaleString()}</span>
                                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                                        -{product.discount}%
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">In stock: {product.stock} units</div>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => addToCartWithDelay(product)}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => buyNow(product)}
                                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
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
              <div className="text-center py-12 sm:py-16">
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">👖</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Levi's Products Found</h3>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
                  Try adjusting your filters or search query to discover our authentic Levi's collection.
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

          {/* Levi's Fit Guide Section */}
          <div className="bg-linear-to-r from-gray-900 to-black text-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12">Levi's Fit Guide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center p-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-red-600 text-xl sm:text-2xl font-bold">501</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">501® Original</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Iconic straight leg, button fly, sits at waist</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-red-600 text-xl sm:text-2xl font-bold">511</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">511™ Slim</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Slim through hip and thigh, narrow leg opening</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-red-600 text-xl sm:text-2xl font-bold">721</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">721™ High Rise</h3>
                  <p className="text-gray-200 text-sm sm:text-base">High rise skinny, hugs curves from waist to ankle</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                    <FiAnchor className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Made & Crafted</h3>
                  <p className="text-gray-200 text-sm sm:text-base">Premium selvedge denim and elevated details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Shop Levi's With Us */}
          <div className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Shop Levi's With Us?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Authentic Levi's</h3>
                  <p className="text-gray-600 text-sm sm:text-base">100% genuine Levi's products direct from official sources</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiTruck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Free Denim Delivery</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Free shipping on orders above ₹4,000 across India</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiShield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Quality Guarantee</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Premium denim quality with authentic Levi's craftsmanship</p>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FiRepeat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Easy Returns</h3>
                  <p className="text-gray-600 text-sm sm:text-base">30-day return policy for unworn items with original tags</p>
                </div>
              </div>
            </div>
          </div>

          {/* Denim Care Guide */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Levi's Denim Care & Style Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Denim Care Instructions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Wash inside out in cold water to preserve color</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Hang dry or tumble dry on low heat</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Avoid washing too frequently to maintain fit</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Spot clean when possible to reduce water usage</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">For raw denim, wear for 6 months before first wash</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Fit & Sizing Tips</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">501® Original</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Order your true size, will stretch with wear</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">511™ Slim</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Size down for snug fit, true size for comfort</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">721™ High Rise</span>
                        <span className="text-gray-600 text-xs sm:text-sm">True to size, designed to hug curves</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700 text-sm sm:text-base">Trucker Jackets</span>
                        <span className="text-gray-600 text-xs sm:text-sm">Size up for layering, true size for fitted look</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Style Inspiration</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Pair 501® jeans with trucker jacket for classic look</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Cuff jeans to show off selvedge detail</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Layer flannel shirt under denim jacket</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Mix denim washes for modern contrast</span>
                      </li>
                      <li className="flex items-start">
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">Complete with leather belt and boots</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Levi's Heritage Section */}
          <div className="bg-linear-to-r from-red-50 to-red-100 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Levi's Heritage Since 1853</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">
                  Founded during the California Gold Rush, Levi's invented the first blue jeans in 1873. 
                  Today, we continue to craft durable, authentic denim while innovating for a more sustainable future.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-red-600 mb-2">1873</div>
                  <div className="text-gray-700 text-sm sm:text-base">First blue jeans patented with copper rivets</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-red-600 mb-2">1936</div>
                  <div className="text-gray-700 text-sm sm:text-base">Red Tab™ introduced on back pocket</div>
               </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-red-600 mb-2">Today</div>
                  <div className="text-gray-700 text-sm sm:text-base">Water Less technology saves billions of liters</div>
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

export default LeviStore;