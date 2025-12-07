import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, 
  FiShoppingBag, 
  FiHeart, 
  FiShare2, 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiCheck,
  FiChevronRight,
  FiPackage,
  FiRefreshCw,
  FiCreditCard,
  FiX,
  FiPlus,
  FiMinus
} from 'react-icons/fi';

const ProductDetailPage = ({ 
  product, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onWishlist,
  onShare,
  cart = [],
  cartItemCount = 0,
  updateQuantity = () => {},
  removeFromCart = () => {},
  formatPrice = (price) => price,
  getCartSummary = () => ({ formatted: { total: 0, shipping: 0, totalWithShipping: 0 } }),
  onNavigateToCheckout // ADD THIS: New prop for checkout navigation
}) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const formatPriceFunc = (price) => {
    if (typeof formatPrice === 'function') {
      return formatPrice(price);
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Product images - use product's images or default
  const productImages = product?.images || [product?.image];

  // Get available sizes/storage based on category
  const getAvailableOptions = () => {
    const category = product?.category || '';
    
    if (category === 'Clothes' || category === 'Sneakers') {
      return {
        type: 'size',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      };
    } else if (category === 'Electronics') {
      return {
        type: 'storage',
        options: ['64GB', '128GB', '256GB', '512GB', '1TB']
      };
    } else if (category === 'Watch') {
      return {
        type: 'size',
        options: ['32mm', '36mm', '40mm', '42mm', '44mm', '46mm']
      };
    }
    return { type: 'size', options: [] };
  };

  const availableOptions = getAvailableOptions();

  // Available colors
  const availableColors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Green', hex: '#059669' },
    { name: 'Gray', hex: '#6B7280' }
  ];

  // Product details based on product data
  const productDetails = {
    title: product?.name || "Product",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    discount: product?.discount || 0,
    style: product?.style || `${product?.brand || ''}-${product?.colour || ''}-${product?.size || ''}`,
    color: product?.colour || 'White',
    description: product?.description || "Premium quality product with excellent features.",
    features: product?.features || [
      "Premium Quality Material",
      "Excellent Craftsmanship",
      "Durable and Long Lasting",
      "Modern Design",
      "Easy to Maintain"
    ],
    specifications: product?.specifications || {
      "Material": "Premium Materials",
      "Fit": "Regular Fit",
      "Care": "Follow Care Instructions",
      "Origin": "Made in India",
      "SKU": product?.sku || "PRODUCT-001"
    }
  };

  useEffect(() => {
    if (product) {
      if (product.category === 'Clothes' || product.category === 'Sneakers') {
        setSelectedSize(product.size || 'M');
      } else if (product.category === 'Electronics') {
        setSelectedStorage(product.storage || '128GB');
      }
      setSelectedColor(product.colour || 'White');
      // Set initial quantity from product if available, otherwise default to 1
      setQuantity(product.quantity || 1);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if ((product.category === 'Clothes' || product.category === 'Sneakers') && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (product.category === 'Electronics' && !selectedStorage) {
      alert('Please select storage option');
      return;
    }

    setIsAddingToCart(true);
    const productWithSelection = {
      ...product,
      size: selectedSize,
      storage: selectedStorage,
      colour: selectedColor,
      quantity: quantity, // Include the current quantity state
      selectedPrice: productDetails.price
    };
    
    await onAddToCart(productWithSelection);
    setIsAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if ((product.category === 'Clothes' || product.category === 'Sneakers') && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (product.category === 'Electronics' && !selectedStorage) {
      alert('Please select storage option');
      return;
    }

    setIsBuyingNow(true);
    const productWithSelection = {
      ...product,
      size: selectedSize,
      storage: selectedStorage,
      colour: selectedColor,
      quantity: quantity,
      selectedPrice: productDetails.price
    };
    
    // Call the existing onBuyNow handler first
    if (onBuyNow) {
      await onBuyNow(productWithSelection);
    }
    
    // FIX: Always navigate to checkout page after Buy Now
    // This ensures redirection happens regardless of what onBuyNow does
    if (onNavigateToCheckout) {
      onNavigateToCheckout([productWithSelection]); // Pass as array for consistency
    }
    
    setIsBuyingNow(false);
  };

  const handleWishlistClick = () => {
    setIsInWishlist(!isInWishlist);
    if (onWishlist) {
      onWishlist(product);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: productDetails.title,
        text: `Check out ${productDetails.title} on our store!`,
        url: window.location.href,
      });
    } else if (onShare) {
      onShare(product);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Calculate cart summary
  const cartSummary = getCartSummary();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No product selected</h3>
          <p className="text-gray-600 mb-4">Please select a product to view details</p>
          <button
            onClick={onBack}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
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
                    <p className="text-gray-400 text-sm sm:text-base">Add items to get started</p>
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
                              <button
                                onClick={() => updateQuantity(item.id, item.size || item.storage, item.quantity - 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base"
                              >
                                <FiMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </button>
                              <span className="font-medium w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size || item.storage, item.quantity + 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base"
                              >
                                <FiPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">
                              {formatPriceFunc(item.price * item.quantity)}
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
                        {cartSummary.formatted?.total || formatPriceFunc(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {cartSummary.formatted?.shipping || 'Free'}
                      </span>
                    </div>
                    <div className="border-t pt-2 sm:pt-3">
                      <div className="flex justify-between font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span>
                          {cartSummary.formatted?.totalWithShipping || formatPriceFunc(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      // Navigate to checkout with cart items
                      if (onNavigateToCheckout) {
                        onNavigateToCheckout(cart);
                      }
                    }}
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="hidden xs:inline">Back</span>
            </button>
            <h1 className="text-lg xs:text-xl font-bold text-gray-900">Product Details</h1>
            <div className="flex items-center space-x-2 xs:space-x-4">
              <button
                onClick={handleWishlistClick}
                className={`p-2 rounded-full ${isInWishlist ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShareClick}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 py-6 xs:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-3 xs:mb-4">
              <img
                src={productImages[selectedImage]}
                alt={productDetails.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 xs:w-20 xs:h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productDetails.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="px-2 xs:px-0">
            {/* Breadcrumb */}
            <div className="hidden xs:flex items-center text-sm text-gray-500 mb-4">
              <span className="truncate">Home</span>
              <FiChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
              <span className="truncate">{product.category || 'Products'}</span>
              <FiChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
              <span className="truncate">{product.brand}</span>
              <FiChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
              <span className="text-gray-900 truncate">{product.name}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {productDetails.title}
            </h1>

            {/* Brand */}
            <div className="flex items-center space-x-2 mb-3 xs:mb-4">
              <span className="text-sm font-medium text-gray-500">Brand:</span>
              <span className="text-sm font-medium text-gray-900">{product.brand}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-3 xs:mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews || 0} Reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-4 xs:mb-6">
              <div className="flex items-baseline space-x-2 flex-wrap">
                <span className="text-2xl xs:text-3xl font-bold text-gray-900">
                  {formatPriceFunc(productDetails.price)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base xs:text-lg text-gray-500 line-through">
                      {formatPriceFunc(productDetails.originalPrice)}
                    </span>
                    <span className="text-xs xs:text-sm font-medium bg-red-100 text-red-700 px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs xs:text-sm text-gray-600 mt-1">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Style */}
            <div className="mb-4 xs:mb-6">
              <p className="text-sm text-gray-600 mb-1">Style</p>
              <p className="font-medium text-sm xs:text-base">{productDetails.style}</p>
            </div>

            {/* Color Selection */}
            <div className="mb-4 xs:mb-6">
              <h3 className="font-medium text-gray-900 mb-2 xs:mb-3 text-sm xs:text-base">
                Color: <span className="font-normal">{selectedColor}</span>
              </h3>
              <div className="flex space-x-2 xs:space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex flex-col items-center space-y-1 xs:space-y-2 flex-shrink-0 ${
                      selectedColor === color.name ? 'ring-2 ring-green-600 ring-offset-2' : ''
                    }`}
                  >
                    <div
                      className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size/Storage Selection */}
            {(product.category === 'Clothes' || product.category === 'Sneakers' || product.category === 'Electronics') && (
              <div className="mb-4 xs:mb-6">
                <div className="flex items-center justify-between mb-2 xs:mb-3">
                  <h3 className="font-medium text-gray-900 text-sm xs:text-base">
                    {availableOptions.type === 'storage' ? 'Storage: ' : 'Size: '}
                    <span className="font-normal">
                      {availableOptions.type === 'storage' ? selectedStorage : selectedSize}
                    </span>
                  </h3>
                  <button className="text-xs xs:text-sm text-green-600 hover:text-green-700">
                    {availableOptions.type === 'storage' ? 'Storage Guide' : 'Size Guide'}
                  </button>
                </div>
                <div className="grid grid-cols-3 xs:grid-cols-6 gap-2">
                  {availableOptions.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        if (availableOptions.type === 'storage') {
                          setSelectedStorage(option);
                        } else {
                          setSelectedSize(option);
                        }
                      }}
                      className={`py-2 xs:py-3 border rounded-lg text-center font-medium transition-colors text-xs xs:text-sm ${
                        (availableOptions.type === 'storage' ? selectedStorage === option : selectedSize === option)
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4 xs:mb-6">
              <h3 className="font-medium text-gray-900 mb-2 xs:mb-3 text-sm xs:text-base">Quantity</h3>
              <div className="flex items-center space-x-3 xs:space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 xs:w-10 xs:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base"
                  >
                    -
                  </button>
                  <span className="w-8 xs:w-12 text-center font-medium text-sm xs:text-base">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="w-8 h-8 xs:w-10 xs:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs xs:text-sm text-gray-600">
                  Only {product.stock || 5} items left in stock
                </span>
              </div>
            </div>

            {/* Action Buttons - Responsive for all devices */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 py-3 px-2 -mx-3 xs:mx-0 xs:border-0 xs:static xs:py-0 xs:px-0 xs:mb-6">
              <div className="flex flex-col xs:grid xs:grid-cols-2 gap-2 xs:gap-3 max-w-lg mx-auto">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 xs:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full text-sm xs:text-base"
                >
                  <FiShoppingBag className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="font-medium">
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </span>
                </button>
                
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 xs:py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full text-sm xs:text-base"
                >
                  <FiCreditCard className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="font-medium">
                    {isBuyingNow ? 'Processing...' : 'Buy Now'}
                  </span>
                </button>
              </div>
            </div>

            {/* Shipping & Policies */}
            <div className="space-y-3 xs:space-y-4 mt-4 xs:mt-6">
              <div className="flex items-start space-x-2 xs:space-x-3">
                <FiTruck className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Free Shipping</h4>
                  <p className="text-xs xs:text-sm text-gray-600">
                    Free standard shipping on orders over ₹500
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 xs:space-x-3">
                <FiPackage className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Easy Returns</h4>
                  <p className="text-xs xs:text-sm text-gray-600">
                    30-day return policy. No questions asked.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 xs:space-x-3">
                <FiShield className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Secure Payment</h4>
                  <p className="text-xs xs:text-sm text-gray-600">
                    Your payment information is processed securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details & Description */}
        <div className="mt-8 xs:mt-12">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-4 xs:space-x-8 min-w-max">
              <button className="py-3 px-1 border-b-2 border-green-600 text-green-600 font-medium text-sm xs:text-base whitespace-nowrap">
                Description
              </button>
              <button className="py-3 px-1 text-gray-500 hover:text-gray-700 font-medium text-sm xs:text-base whitespace-nowrap">
                Specifications
              </button>
              <button className="py-3 px-1 text-gray-500 hover:text-gray-700 font-medium text-sm xs:text-base whitespace-nowrap">
                Reviews ({product.reviews || 0})
              </button>
              <button className="py-3 px-1 text-gray-500 hover:text-gray-700 font-medium text-sm xs:text-base whitespace-nowrap">
                Shipping & Returns
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-6 xs:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8">
              {/* Description */}
              <div>
                <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-3 xs:mb-4">
                  Product Description
                </h3>
                <p className="text-sm xs:text-base text-gray-600 mb-4 xs:mb-6">
                  {productDetails.description}
                </p>
                
                <h4 className="font-medium text-gray-900 mb-2 xs:mb-3 text-sm xs:text-base">
                  Key Features
                </h4>
                <ul className="space-y-1 xs:space-y-2">
                  {productDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm xs:text-base text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-3 xs:mb-4">
                  Product Specifications
                </h3>
                <div className="space-y-2 xs:space-y-4">
                  {Object.entries(productDetails.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-1 xs:pb-2">
                      <span className="text-sm xs:text-base text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900 text-sm xs:text-base text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Care Instructions */}
                <div className="mt-6 xs:mt-8">
                  <h4 className="font-medium text-gray-900 mb-2 xs:mb-3 text-sm xs:text-base flex items-center">
                    <FiRefreshCw className="w-4 h-4 xs:w-5 xs:h-5 mr-2 flex-shrink-0" />
                    Care Instructions
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-3 xs:p-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-4 text-xs xs:text-sm">
                      <div className="flex items-center">
                        <span className="font-medium min-w-16 xs:min-w-20">Wash:</span>
                        <span className="text-gray-600 ml-2">Machine wash cold</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium min-w-16 xs:min-w-20">Bleach:</span>
                        <span className="text-gray-600 ml-2">Do not bleach</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium min-w-16 xs:min-w-20">Dry:</span>
                        <span className="text-gray-600 ml-2">Tumble dry low</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium min-w-16 xs:min-w-20">Iron:</span>
                        <span className="text-gray-600 ml-2">Medium heat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;