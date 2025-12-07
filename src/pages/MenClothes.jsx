import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Navbar from './Navbar'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import ProductDetailPage from '../components/ProductDetailPage'
import FilterDropdown from '../components/FilterDropdown'
import CheckoutPage from '../components/CheckoutPage'
import Footer from './Footer'
import { menClothes as dummyProducts } from '../dummyData/menClothes'
import { FiX, FiShoppingCart, FiArrowLeft, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const MenClothes = () => {
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

  // State for products management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchMenClothesProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL products from backend first
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
          // Filter for men's clothes ONLY
          const menClothesBackend = productsData.filter(product => {
            // Check category first (most reliable)
            const category = product.category || '';
            const catLower = category.toLowerCase();
            
            // Check gender field if exists
            const gender = product.gender || '';
            const genderLower = gender.toLowerCase();
            
            // Check if it's a men's product
            const isMenCategory = 
              catLower.includes('men') || 
              catLower.includes('male') || 
              catLower.includes('gentlemen') ||
              catLower === 'men clothes' ||
              catLower === 'men clothing' ||
              catLower === 'men\'s clothes' ||
              catLower === 'men\'s clothing' ||
              catLower.includes('shirt') ||
              catLower.includes('t-shirt') ||
              catLower.includes('jean');
            
            const isMenGender = 
              genderLower.includes('men') || 
              genderLower.includes('male') || 
              genderLower.includes('gentlemen');
            
            // Check brand for men's brands (more specific)
            const isMenBrand = product.brand && getBrandType(product.brand) === 'men';
            
            // EXCLUDE women's products explicitly
            const isWomenCategory = 
              catLower.includes('women') || 
              catLower.includes('female') || 
              catLower.includes('woman') ||
              catLower === 'women clothes' ||
              catLower === 'women clothing' ||
              catLower === 'women\'s clothes' ||
              catLower === 'women\'s clothing';
            
            const isWomenGender = 
              genderLower.includes('women') || 
              genderLower.includes('female') || 
              genderLower.includes('woman');
            
            const isWomenBrand = product.brand && getBrandType(product.brand) === 'women';
            
            // Return true if it's a men's product AND NOT a women's product
            return (isMenCategory || isMenGender || isMenBrand) && 
                   !(isWomenCategory || isWomenGender || isWomenBrand);
          });
          
          console.log('Filtered men clothes from backend:', menClothesBackend.length);
          
          // Transform backend products data
          const transformedBackendProducts = menClothesBackend.map(product => ({
            id: product._id || product.id || `backend-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            description: product.description,
            brand: product.brand,
            category: getSpecificCategory(product.category, product.name),
            productType: getProductType(product.name, product.brand),
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
            colors: product.colors || ['Black', 'White', 'Blue'],
            stock: product.stock || Math.floor(Math.random() * 50) + 10,
            isFeatured: product.isFeatured || false,
            isNewArrival: product.isNewArrival || false,
            isOnSale: product.isOnSale || false,
            originalPrice: product.originalPrice || product.price,
            tags: product.tags || [],
            createdAt: product.createdAt || new Date()
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
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          
          // Combine both arrays
          const allProducts = [...transformedBackendProducts, ...uniqueDummyProducts];
          
          setBackendProducts(transformedBackendProducts);
          setProducts(allProducts);
        } else {
          // No products from backend, use only dummy data
          console.log('No products from backend, using dummy data only');
          const uniqueDummyProducts = dummyProducts.map(product => ({
            ...product,
            id: `dummy-${product.id}`,
            createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
          }));
          setProducts(uniqueDummyProducts);
          setBackendProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use dummy data on error
        const uniqueDummyProducts = dummyProducts.map(product => ({
          ...product,
          id: `dummy-${product.id}`,
          createdAt: product.createdAt || new Date(Date.now() - Math.random() * 10000000000)
        }));
        setProducts(uniqueDummyProducts);
        setBackendProducts([]);
        setError('Unable to load products from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenClothesProducts();
  }, []);

  // Helper function to get brand type
  const getBrandType = (brand) => {
    if (!brand) return 'unisex';
    
    const brandName = brand.toLowerCase().trim();
    
    // Men's clothing brands
    const menBrands = [
      'nike', 'adidas', 'puma', 'reebok', 'under armour', 
      'levi\'s', 'wrangler', 'lee', 'diesel', 'armani', 
      'hugo boss', 'calvin klein', 'tommy hilfiger', 
      'ralph lauren', 'lacoste', 'burberry', 'gucci', 
      'versace', 'prada', 'dolce & gabbana', 'dolce and gabbana',
      'zara', 'hm', 'uniqlo', 'gap', 'old navy', 'brooks brothers',
      'j.crew', 'banana republic', 'express', 'american eagle',
      'abercrombie & fitch', 'hollister'
    ];
    
    // Women's clothing brands
    const womenBrands = [
      'zara', 'h&m', 'forever 21', 'mango', 'bershka', 
      'pull&bear', 'stradivarius', 'topshop', 'river island', 
      'asos', 'boohoo', 'missguided', 'pretty little thing', 
      'nasty gal', 'reformation', 'free people', 'anthropologie',
      'urban outfitters', 'madewell', 'j.crew', 'banana republic',
      'chico\'s', 'white house black market', 'ann taylor',
      'loft', 'express', 'h&m', 'uniqlo', 'gap', 'old navy',
      'victoria\'s secret', 'pink', 'calvin klein', 'tommy hilfiger',
      'ralph lauren', 'lacoste', 'burberry', 'gucci', 'prada',
      'versace', 'dior', 'chanel', 'hermes', 'louis vuitton',
      'michael kors', 'kate spade', 'tory burch', 'coach'
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

  // Helper function to get specific category
  const getSpecificCategory = (backendCategory, productName) => {
    if (!backendCategory) {
      // Try to infer from product name
      const name = productName?.toLowerCase() || '';
      if (name.includes('shirt') && !name.includes('t-shirt')) return 'Shirts';
      if (name.includes('t-shirt') || name.includes('tshirt')) return 'T-Shirts';
      if (name.includes('jean') || name.includes('pant')) return 'Jeans';
      if (name.includes('jacket') || name.includes('coat')) return 'Jackets';
      if (name.includes('blazer')) return 'Blazers';
      if (name.includes('sweater') || name.includes('pullover')) return 'Sweaters';
      if (name.includes('hoodie')) return 'Hoodies';
      if (name.includes('short')) return 'Shorts';
      if (name.includes('active') || name.includes('sport')) return 'Activewear';
      if (name.includes('lounge') || name.includes('pajama')) return 'Loungewear';
      return 'Shirts';
    }
    
    // If backend category is "Men Clothes", we need to be more specific
    if (backendCategory === 'Men Clothes') {
      // Try to infer from product name
      return getSpecificCategory(null, productName);
    }
    
    return backendCategory;
  };

  // Helper function to get product type
  const getProductType = (productName, brand) => {
    const name = productName?.toLowerCase() || '';
    
    if (name.includes('casual') || name.includes('regular')) return 'Casual Shirts';
    if (name.includes('formal') || name.includes('office')) return 'Formal Shirts';
    if (name.includes('slim') || name.includes('fitted')) return 'Slim Fit';
    if (name.includes('oversized') || name.includes('loose')) return 'Oversized';
    if (name.includes('graphic') || name.includes('printed')) return 'Graphic T-Shirts';
    if (name.includes('plain') || name.includes('solid')) return 'Plain T-Shirts';
    if (name.includes('denim') || name.includes('jeans')) return 'Denim Jeans';
    if (name.includes('chino') || name.includes('khaki')) return 'Chino Pants';
    if (name.includes('leather') || name.includes('bomber')) return 'Leather Jackets';
    if (name.includes('wool') || name.includes('blend')) return 'Wool Blend';
    
    // Default product types based on brand
    const premiumBrands = ['Armani', 'Gucci', 'Prada', 'Versace'];
    if (premiumBrands.includes(brand)) return 'Premium Collection';
    
    return 'Casual Wear';
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
    
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];
    const colours = [...new Set(currentProducts.flatMap(p => p.colors || []).filter(Boolean))];
    
    return {
      sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
      brand: brands.sort(),
      category: categories.sort(),
      productType: productTypes.sort(),
      size: sizeOptions.sort(),
      colour: colours.length > 0 ? colours.sort() : ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Navy', 'Beige'],
      discount: ['10% and above', '20% and above', '30% and above', '40% and above'],
      priceRange: [
        'Under ₹1500',
        '₹1500 - ₹2500',
        '₹2500 - ₹3500',
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
    
    const productForCart = {
      ...product,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      images: product.images || [product.image],
      colour: product.colour || '',
      size: product.size || '',
      brand: product.brand || '',
      category: product.category || 'Men Clothes',
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
      image: product.images?.[0] || product.image,
      images: product.images || [product.image],
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'Men Clothes',
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
      image: product.images?.[0] || product.image,
      images: product.images || [product.image],
      quantity: 1,
      size: product.size || '',
      colour: product.colour || '',
      brand: product.brand || '',
      category: product.category || 'Men Clothes',
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

  // Filter and sort products - INCLUDES ALL PRODUCTS (backend + dummy)
  const filteredClothes = useMemo(() => {
    let filtered = [...products];
    
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
        case 'Under ₹1500': filtered = filtered.filter(p => p.price < 1500); break;
        case '₹1500 - ₹2500': filtered = filtered.filter(p => p.price >= 1500 && p.price <= 2500); break;
        case '₹2500 - ₹3500': filtered = filtered.filter(p => p.price >= 2500 && p.price <= 3500); break;
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
            <p className="text-gray-600">Loading men's clothing...</p>
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
          <span className="font-medium">Back to Clothes</span>
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
        category: checkoutProduct.category || 'Men Clothes',
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
          <span className="font-medium">Back to Clothes</span>
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
                    <div className="text-gray-300 text-5xl sm:text-6xl mb-3 sm:mb-4">👔</div>
                    <p className="text-gray-500 text-base sm:text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-400 text-sm sm:text-base">Add items to get started</p>
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
                <h2 className="text-lg font-bold">Clothing Filters</h2>
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
                  { key: 'category', label: 'Category' },
                  { key: 'productType', label: 'Product Type' },
                  { key: 'size', label: 'Size' },
                  { key: 'colour', label: 'Colour' },
                  { key: 'discount', label: 'Discount' },
                  { key: 'priceRange', label: 'Price Range' },
                  { key: 'rating', label: 'Rating' }
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
          <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="animate-fade-in text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Men's Clothing Collection</h1>
                  <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                    {filteredClothes.length} Premium Styles Await
                    {error && (
                      <span className="block text-yellow-200 text-xs mt-1">
                        {error}
                      </span>
                    )}
                  </p>
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
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Premium Men's Clothing</h2>
              <p className="mt-1 sm:mt-2 text-gray-600 text-sm sm:text-base">
                Discover premium men's clothing that combines style, comfort, and quality • 
                Showing <span className="font-semibold">{filteredClothes.length}</span> item{filteredClothes.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Products Grid */}
            {filteredClothes.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {filteredClothes.map(product => (
                  <div key={product.id} className="relative group">
                    {product.discount > 25 && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        -{product.discount}% OFF
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
                <div className="text-gray-300 text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">👔</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Clothing Items Found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Try adjusting your filters to discover our premium men's clothing collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-linear-to-r from-blue-700 to-indigo-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:from-blue-800 hover:to-indigo-900 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Explore All Clothing
                </button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 py-8 sm:py-12 md:py-16 mt-8 sm:mt-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Why Choose Our Men's Clothing?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">Premium Quality</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Made with high-quality fabrics for comfort and durability</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">Secure Shopping</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Safe and secure payment with easy returns policy</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">Free Shipping</h3>
                  </div>
                    <p className="text-gray-600 text-sm sm:text-base">Free delivery on all orders over ₹3000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Highlights */}
          <div className="bg-white py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Shop By Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                  { name: 'Shirts', emoji: '👔', filter: 'Shirts' },
                  { name: 'T-Shirts', emoji: '👕', filter: 'T-Shirts' },
                  { name: 'Jeans', emoji: '👖', filter: 'Jeans' },
                  { name: 'Jackets', emoji: '🧥', filter: 'Jackets' },
                  { name: 'Hoodies', emoji: '🧣', filter: 'Hoodies' },
                  { name: 'Activewear', emoji: '🏃', filter: 'Activewear' }
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleFilterChange('category', category.filter)}
                    className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                      filters.category === category.filter ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{category.emoji}</div>
                    <span className="font-medium text-sm sm:text-base text-gray-900">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenClothes;