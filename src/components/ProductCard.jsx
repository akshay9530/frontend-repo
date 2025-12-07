import React, { useState } from 'react';
import { FiStar, FiShoppingBag, FiCreditCard } from 'react-icons/fi';

const ProductCard = ({ product, onAddToCart, onViewDetails, onBuyNow }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Stop event from bubbling to card
    e.preventDefault(); // Prevent default behavior
    setIsAddingToCart(true);
    try {
      // Pass product with default quantity of 1
      await onAddToCart({
        ...product,
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation(); // Stop event from bubbling to card
    e.preventDefault(); // Prevent default behavior
    setIsBuyingNow(true);
    try {
      // Pass product with default quantity of 1
      await onBuyNow({
        ...product,
        quantity: 1
      });
    } catch (error) {
      console.error('Error buying now:', error);
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Only show view details when clicking on specific areas (not buttons)
  const handleCardClick = (e) => {
    // Don't trigger view details if clicked on a button
    if (e.target.closest('button') || e.target.tagName === 'BUTTON') {
      return;
    }
    onViewDetails(product);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-40 xs:h-48 sm:h-52 md:h-56 lg:h-60 object-cover"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
            New
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-3 xs:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase truncate max-w-[50%]">
            {product.brand}
          </span>
          <div className="flex items-center space-x-1">
            <FiStar className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm xs:text-base">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-2 flex-wrap">
          {product.discount > 0 ? (
            <>
              <span className="text-base xs:text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs xs:text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs xs:text-sm text-red-600 font-medium whitespace-nowrap">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            </>
          ) : (
            <span className="text-base xs:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="truncate max-w-[50%]">{product.colour}</span>
          {product.category === 'Clothes' || product.category === 'Sneakers' ? (
            <span className="truncate max-w-[40%]">{product.size}</span>
          ) : product.category === 'Electronics' ? (
            <span className="truncate max-w-[40%]">{product.storage || product.size}</span>
          ) : null}
        </div>

        {/* Buttons container - stops propagation */}
        <div 
          className="flex flex-col xs:flex-row xs:space-x-2 space-y-2 xs:space-y-0" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* Mobile: Full width buttons, Tablet: Side by side, Desktop: Optimized */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-green-600 text-white py-2.5 xs:py-2 sm:py-2.5 md:py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-xs sm:text-sm md:text-sm"
          >
            <FiShoppingBag className="w-3.5 h-3.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="truncate font-medium">
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </span>
          </button>
          
          <button
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            className="w-full bg-blue-600 text-white py-2.5 xs:py-2 sm:py-2.5 md:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-xs sm:text-sm md:text-sm"
          >
            <FiCreditCard className="w-3.5 h-3.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="truncate font-medium">
              {isBuyingNow ? 'Processing...' : 'Buy Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;