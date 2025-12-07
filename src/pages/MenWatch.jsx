import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import Footer from './Footer'
import { FiX, FiShoppingCart, FiArrowLeft, FiFilter, FiChevronDown, FiChevronUp, FiWatch } from 'react-icons/fi'
import { menWatchData } from '../dummyData/menWatchData'

const MenWatch = () => {
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productDetailMode, setProductDetailMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutType, setCheckoutType] = useState('single');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [trackingMode, setTrackingMode] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);

  // State for backend integration
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchMenWatches = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products from backend first (like MenFragrance)
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
          // Filter for men's watches ONLY (using same logic as MenFragrance)
          const menWatchesBackend = productsData.filter(product => {
            // Check category first (most reliable)
            const category = product.category || '';
            const catLower = category.toLowerCase();
            
            // Check gender field if exists
            const gender = product.gender || '';
            const genderLower = gender.toLowerCase();
            
            // Check if it's a men's product
            const isMenCategory = 
              (catLower.includes('men') && catLower.includes('watch')) || 
              (catLower.includes('male') && catLower.includes('watch')) || 
              (catLower.includes('gentlemen') && catLower.includes('watch')) ||
              catLower === 'men watches' ||
              catLower === 'men watch' ||
              catLower === 'male watches' ||
              catLower === 'watches men' ||
              catLower === 'watch men';
            
            const isMenGender = 
              genderLower.includes('men') || 
              genderLower.includes('male') || 
              genderLower.includes('gentlemen');
            
            // Check brand for men's brands (more specific)
            const isMenBrand = product.brand && getWatchBrandType(product.brand) === 'men';
            
            // Check name for men's indicators
            const productName = product.name || '';
            const nameLower = productName.toLowerCase();
            const hasMenInName = 
              nameLower.includes('men') || 
              nameLower.includes('male') ||
              nameLower.includes('gentlemen') ||
              nameLower.includes('his ') ||
              nameLower.startsWith('men ') ||
              nameLower.includes(' men ') ||
              nameLower.includes(' men\'s') ||
              nameLower.includes(' men’s');
            
            // Check description for men's indicators
            const productDesc = product.description || '';
            const descLower = productDesc.toLowerCase();
            const hasMenInDesc = 
              descLower.includes('men') || 
              descLower.includes('male') ||
              descLower.includes('gentlemen');
            
            // Check tags for men's indicators
            const productTags = product.tags || [];
            const hasMenTags = productTags.some(tag => 
              tag.toLowerCase().includes('men') || 
              tag.toLowerCase().includes('male') ||
              tag.toLowerCase().includes('gentlemen')
            );
            
            // EXCLUDE women's products explicitly (CRITICAL - same as MenFragrance)
            const isWomenCategory = 
              (catLower.includes('women') && catLower.includes('watch')) || 
              (catLower.includes('female') && catLower.includes('watch')) || 
              (catLower.includes('woman') && catLower.includes('watch')) ||
              catLower === 'women watches' ||
              catLower === 'women watch' ||
              catLower === 'female watches' ||
              catLower === 'watches women' ||
              catLower === 'watch women' ||
              catLower === 'ladies watches' ||
              catLower === 'ladies watch';
            
            const isWomenGender = 
              genderLower.includes('women') || 
              genderLower.includes('female') || 
              genderLower.includes('woman') ||
              genderLower.includes('ladies');
            
            const isWomenBrand = product.brand && getWatchBrandType(product.brand) === 'women';
            
            const isWomenName = nameLower.includes('women') || 
              nameLower.includes('female') ||
              nameLower.includes('ladies') ||
              nameLower.includes('her ') ||
              nameLower.includes(' women\'s') ||
              nameLower.includes(' women’s') ||
              nameLower.includes('for women') ||
              nameLower.includes('for her');
            
            // Check if it's a watch product
            const isWatchProduct = 
              catLower.includes('watch') ||
              nameLower.includes('watch') ||
              (product.productType && product.productType.toLowerCase().includes('watch')) ||
              (product.tags && product.tags.some(tag => tag.toLowerCase().includes('watch')));
            
            // Return true if it's a men's watch AND NOT a women's watch
            return (isMenCategory || isMenGender || isMenBrand || hasMenInName || hasMenInDesc || hasMenTags) && 
                   !(isWomenCategory || isWomenGender || isWomenBrand || isWomenName) &&
                   isWatchProduct;
          });
          
          console.log('Filtered men watches from backend:', menWatchesBackend.length);
          
          // Transform backend products data
          const transformedBackendProducts = menWatchesBackend.map(product => ({
            id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            description: product.description,
            brand: product.brand,
            category: 'Watch',
            productType: getWatchTypeFromBackend(product),
            price: product.price,
            discount: product.discount || 0,
            rating: product.rating || 4.5,
            reviews: product.reviews || Math.floor(Math.random() * 100),
            image: product.images && product.images[0] ? product.images[0].url : 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80',
            images: product.images ? product.images.map(img => img.url) : ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80'],
            size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '42mm',
            sizes: product.sizes || ['38mm', '40mm', '42mm', '44mm', '46mm'],
            storage: '',
            colour: product.colors && product.colors.length > 0 ? product.colors[0] : '',
            colors: product.colors || [],
            stock: product.stock || 0,
            isFeatured: product.isFeatured || false,
            isNewArrival: product.isNewArrival || false,
            isOnSale: product.isOnSale || false,
            originalPrice: product.originalPrice || product.price,
            tags: product.tags || [],
            watchType: getWatchTypeFromBackend(product),
            movement: getWatchMovement(product),
            waterResistance: getWaterResistance(),
            material: getWatchMaterial(),
            features: getWatchFeatures(product),
            warranty: '2 Years',
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
          const uniqueDummyProducts = menWatchData.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            watchType: product.watchType || getWatchTypeFromDummy(product),
            movement: product.movement || getWatchMovement(product),
            waterResistance: product.waterResistance || getWaterResistance(),
            material: product.material || getWatchMaterial(),
            features: product.features || getWatchFeatures(product),
            warranty: product.warranty || '2 Years',
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
          const uniqueDummyProducts = menWatchData.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            source: 'dummy',
            watchType: product.watchType || getWatchTypeFromDummy(product),
            movement: product.movement || getWatchMovement(product),
            waterResistance: product.waterResistance || getWaterResistance(),
            material: product.material || getWatchMaterial(),
            features: product.features || getWatchFeatures(product),
            warranty: product.warranty || '2 Years',
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          setProducts(uniqueDummyProducts);
          setBackendProducts([]);
          setUseFallbackData(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = menWatchData.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          source: 'dummy',
          watchType: product.watchType || getWatchTypeFromDummy(product),
          movement: product.movement || getWatchMovement(product),
          waterResistance: product.waterResistance || getWaterResistance(),
          material: product.material || getWatchMaterial(),
          features: product.features || getWatchFeatures(product),
          warranty: product.warranty || '2 Years',
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

    fetchMenWatches();
  }, []);

  // Helper function to determine brand type for watches (same logic as MenFragrance)
  const getWatchBrandType = (brand) => {
    if (!brand) return 'unisex';
    
    const brandName = brand.toLowerCase().trim();
    
    // Men's watch brands
    const menBrands = [
      'rolex', 'omega', 'tag heuer', 'breitling', 'patek philippe',
      'audemars piguet', 'cartier', 'iwc', 'panerai', 'hublot',
      'tudor', 'zenith', 'jaeger-lecoultre', 'vacheron constantin',
      'seiko', 'citizen', 'casio', 'fossil', 'diesel', 'emporio armani',
      'armani', 'boss', 'hugo boss', 'tommy hilfiger', 'ralph lauren',
      'calvin klein', 'mvmt', 'daniel wellington', 'timex', 'g-shock',
      'skagen', 'nixon', 'michael kors', 'tissot', 'longines', 'baume et mercier'
    ];
    
    // Women's watch brands
    const womenBrands = [
      'michael kors', 'kate spade', 'coach', 'tory burch', 'fossil',
      'anne klein', 'guess', 'swatch', 'seiko', 'citizen',
      'bulova', 'skagen', 'armani', 'emporio armani', 'dior',
      'chanel', 'gucci', 'prada', 'versace', 'hermes',
      'cartier', 'omega', 'rolex', 'audemars piguet', 'patek philippe'
    ];
    
    // Check for men's brands
    for (const menBrand of menBrands) {
      if (brandName.includes(menBrand)) {
        // But check if it's not actually a women's brand with similar name
        if (womenBrands.some(womenBrand => brandName.includes(womenBrand) && 
            womenBrand.length > menBrand.length)) {
          continue; // Skip if it's actually a women's brand
        }
        return 'men';
      }
    }
    
    // Check for women's brands
    for (const womenBrand of womenBrands) {
      if (brandName.includes(womenBrand)) {
        return 'women';
      }
    }
    
    return 'unisex';
  };

  // Helper function to get watch type from backend product
  const getWatchTypeFromBackend = (product) => {
    if (!product) return 'Analog Watch';
    
    const typeMap = {
      'Smart Watch': 'Smart Watch',
      'Analog Watch': 'Analog Watch',
      'Digital Watch': 'Digital Watch',
      'Chronograph': 'Chronograph',
      'Diver Watch': 'Diver Watch',
      'Automatic Watch': 'Automatic Watch',
      'Fashion Watch': 'Fashion Watch'
    };
    
    if (product.category && typeMap[product.category]) {
      return typeMap[product.category];
    }
    
    if (product.name) {
      const name = product.name.toLowerCase();
      if (name.includes('smart') || name.includes('apple') || name.includes('samsung')) return 'Smart Watch';
      if (name.includes('digital')) return 'Digital Watch';
      if (name.includes('chronograph')) return 'Chronograph';
      if (name.includes('diver') || name.includes('diving')) return 'Diver Watch';
      if (name.includes('automatic')) return 'Automatic Watch';
    }
    
    return 'Analog Watch';
  };

  // Helper function to get watch type from dummy product
  const getWatchTypeFromDummy = (product) => {
    if (product.productType) {
      return product.productType;
    }
    
    const typeMap = {
      'Smart Watch': 'Smart Watch',
      'Analog Watch': 'Analog Watch',
      'Digital Watch': 'Digital Watch',
      'Chronograph': 'Chronograph',
      'Diver Watch': 'Diver Watch',
      'Automatic Watch': 'Automatic Watch',
      'Fashion Watch': 'Fashion Watch'
    };
    
    if (product.category && typeMap[product.category]) {
      return typeMap[product.category];
    }
    
    return 'Analog Watch';
  };

  // Helper function to get watch movement
  const getWatchMovement = (product) => {
    if (product.movement) return product.movement;
    
    const movements = ['Quartz', 'Automatic', 'Mechanical', 'Smart'];
    return movements[Math.floor(Math.random() * movements.length)];
  };

  // Helper function to get water resistance
  const getWaterResistance = () => {
    const resistances = ['30m', '50m', '100m', '200m', '300m', '500m'];
    return resistances[Math.floor(Math.random() * resistances.length)];
  };

  // Helper function to get watch material
  const getWatchMaterial = () => {
    const materials = ['Stainless Steel', 'Titanium', 'Leather', 'Rubber', 'Ceramic', 'Plastic', 'Gold Plated'];
    return materials[Math.floor(Math.random() * materials.length)];
  };

  // Helper function to get watch features
  const getWatchFeatures = (product) => {
    if (product.features) return product.features;
    
    const featuresList = [
      'Date Display',
      'Luminous Hands',
      'Chronograph',
      'Tachymeter',
      'World Time',
      'Alarm',
      'Heart Rate Monitor',
      'GPS',
      'Bluetooth',
      'Water Resistant'
    ];
    
    const numFeatures = Math.floor(Math.random() * 4) + 2;
    const selectedFeatures = [];
    for (let i = 0; i < numFeatures; i++) {
      const feature = featuresList[Math.floor(Math.random() * featuresList.length)];
      if (!selectedFeatures.includes(feature)) {
        selectedFeatures.push(feature);
      }
    }
    
    return selectedFeatures.join(', ');
  };

  // Dynamic filter options based on actual products (combined backend and dummy)
  const filterOptions = useMemo(() => {
    // Use current products (combined backend and dummy)
    const currentProducts = products;
    
    const brands = [...new Set(currentProducts.map(p => p.brand))].filter(Boolean);
    const categories = ['All', 'Smart Watch', 'Analog Watch', 'Digital Watch', 'Chronograph', 'Diver Watch', 'Automatic Watch', 'Fashion Watch'];
    const productTypes = [...new Set(currentProducts.map(p => p.productType))].filter(Boolean);
    const sizeOptions = [...new Set(currentProducts.flatMap(p => p.sizes || []).filter(Boolean))];
    
    let colourOptions = [];
    if (filters.category) {
      const allColors = currentProducts
        .filter(p => p.productType.includes(filters.category.replace(' Watch', '')) || 
                  p.category === filters.category ||
                  p.watchType === filters.category)
        .map(p => p.colour)
        .filter(Boolean);
      colourOptions = [...new Set(allColors)];
    } else {
      const allColors = currentProducts.map(p => p.colour).filter(Boolean);
      colourOptions = [...new Set(allColors)];
    }
    
    // If no sizes from products, use default sizes
    const finalSizeOptions = sizeOptions.length > 0 ? sizeOptions.sort() : 
      ['38mm', '40mm', '42mm', '44mm', '46mm'];
    
    // If no colors from products, use default colors
    const finalColourOptions = colourOptions.length > 0 ? colourOptions.sort() : 
      ['Black', 'Silver', 'Gold', 'Blue', 'Brown', 'White', 'Rose Gold', 'Stainless Steel'];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      brand: brands.sort(),
      category: categories.sort(),
      productType: productTypes.sort(),
      size: finalSizeOptions,
      colour: finalColourOptions,
      discount: ['10% and above', '20% and above', '30% and above', '40% and above', '50% and above'],
      priceRange: [
        'Under ₹5,000',
        '₹5,000 - ₹20,000',
        '₹20,000 - ₹50,000',
        '₹50,000 - ₹1,00,000',
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

  // Filter and sort watches (combined backend and dummy)
  const filteredWatches = useMemo(() => {
    let filtered = [...products];
    
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(p => 
        p.productType.includes(filters.category.replace(' Watch', '')) || 
        p.category === filters.category ||
        p.watchType === filters.category
      );
    }
    if (filters.productType) filtered = filtered.filter(p => p.productType === filters.productType);
    if (filters.colour) filtered = filtered.filter(p => p.colour === filters.colour);
    if (filters.size) filtered = filtered.filter(p => p.size === filters.size);
    
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
        case '₹5,000 - ₹20,000': filtered = filtered.filter(p => p.price >= 5000 && p.price <= 20000); break;
        case '₹20,000 - ₹50,000': filtered = filtered.filter(p => p.price >= 20000 && p.price <= 50000); break;
        case '₹50,000 - ₹1,00,000': filtered = filtered.filter(p => p.price >= 50000 && p.price <= 100000); break;
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Watches</span>
        </button>
        
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-100 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
        <div className="min-h-screen bg-linear-to-b from-transparent to-blue-50">
          {/* Hero Banner */}
          <div className="bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="animate-fade-in text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {useFallbackData ? 'Men\'s Luxury Watches' : 'Men\'s Watches Collection'}
                  </h1>
                  <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                    {filteredWatches.length} Premium Timepieces Await
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
                      Premium Watches Starting at ₹2,999
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
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold">{filteredWatches.length}</span> watch{filteredWatches.length !== 1 ? 'es' : ''}
                {useFallbackData && (
                  <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                    Using sample watches only
                  </span>
                )}
              </p>
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
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">⌚</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Watches Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to discover amazing timepieces.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Explore All Watches
                </button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-linear-to-r from-blue-50 to-cyan-50 py-12 md:py-16 mt-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">Why Choose Our Men's Watches?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 transform hover:scale-110 transition-transform duration-300">
                    <FiWatch className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 md:mb-2">Premium Quality</h3>
                  <p className="text-gray-600 text-sm md:text-base">Crafted with finest materials and precision engineering</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 md:mb-2">Precision Timing</h3>
                  <p className="text-gray-600 text-sm md:text-base">Accurate movements with minimal time deviation</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 md:mb-2">Authentic Warranty</h3>
                  <p className="text-gray-600 text-sm md:text-base">All watches come with manufacturer warranty</p>
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

export default MenWatch;