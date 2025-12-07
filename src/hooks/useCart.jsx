/* eslint-disable react-refresh/only-export-components */
// src/hooks/useCart.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const ecommerceCart = localStorage.getItem('ecommerce_cart');
      if (ecommerceCart) {
        return JSON.parse(ecommerceCart);
      }
      return [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
      // Dispatch custom event for components that listen to cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  // Helper function to create item key for identification
  const getItemKey = (item) => {
    return `${item.id}-${item.size || ''}-${item.storage || ''}-${item.colour || ''}`;
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check for existing item with same ID and all identifiers
      const existingItemIndex = prevCart.findIndex(item => {
        const itemKey = getItemKey(item);
        const productKey = getItemKey(product);
        return itemKey === productKey;
      });
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex] = { 
          ...newCart[existingItemIndex], 
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
      } else {
        // Add new item
        return [...prevCart, {
          ...product,
          quantity: quantity || 1,
          size: product.size || '',
          storage: product.storage || '',
          colour: product.colour || '',
          addedAt: new Date().toISOString()
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, identifier = '') => {
    setCart(prevCart => {
      if (identifier) {
        // Remove with identifier (size/storage/colour)
        const [size, storage, colour] = identifier.split('-');
        return prevCart.filter(item => {
          const matchesId = item.id === productId;
          const matchesSize = !size || item.size === size;
          const matchesStorage = !storage || item.storage === storage;
          const matchesColour = !colour || item.colour === colour;
          
          return !(matchesId && matchesSize && matchesStorage && matchesColour);
        });
      } else {
        // Remove by ID only (remove all variants)
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity, identifier = '') => {
    if (newQuantity < 1) {
      removeFromCart(productId, identifier);
      return;
    }
    
    setCart(prevCart => {
      if (identifier) {
        // Update with identifier
        const [size, storage, colour] = identifier.split('-');
        return prevCart.map(item => {
          const matchesId = item.id === productId;
          const matchesSize = !size || item.size === size;
          const matchesStorage = !storage || item.storage === storage;
          const matchesColour = !colour || item.colour === colour;
          
          if (matchesId && matchesSize && matchesStorage && matchesColour) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        // Update first matching item without identifier
        const index = prevCart.findIndex(item => item.id === productId);
        if (index >= 0) {
          const newCart = [...prevCart];
          newCart[index] = { ...newCart[index], quantity: newQuantity };
          return newCart;
        }
        return prevCart;
      }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Check if item is in cart
  const isInCart = (productId, identifier = '') => {
    if (identifier) {
      const [size, storage, colour] = identifier.split('-');
      return cart.some(item => {
        const matchesId = item.id === productId;
        const matchesSize = !size || item.size === size;
        const matchesStorage = !storage || item.storage === storage;
        const matchesColour = !colour || item.colour === colour;
        
        return matchesId && matchesSize && matchesStorage && matchesColour;
      });
    } else {
      return cart.some(item => item.id === productId);
    }
  };

  // Get item quantity
  const getItemQuantity = (productId, identifier = '') => {
    if (identifier) {
      const [size, storage, colour] = identifier.split('-');
      const item = cart.find(item => {
        const matchesId = item.id === productId;
        const matchesSize = !size || item.size === size;
        const matchesStorage = !storage || item.storage === storage;
        const matchesColour = !colour || item.colour === colour;
        
        return matchesId && matchesSize && matchesStorage && matchesColour;
      });
      return item ? item.quantity : 0;
    } else {
      const item = cart.find(item => item.id === productId);
      return item ? item.quantity : 0;
    }
  };

  // Merge cart from another source
  const mergeCart = (newItems) => {
    setCart(prevCart => {
      const mergedCart = [...prevCart];
      
      newItems.forEach(newItem => {
        const existingItemIndex = mergedCart.findIndex(item => 
          getItemKey(item) === getItemKey(newItem)
        );
        
        if (existingItemIndex >= 0) {
          // Merge quantities
          mergedCart[existingItemIndex] = {
            ...mergedCart[existingItemIndex],
            quantity: mergedCart[existingItemIndex].quantity + (newItem.quantity || 1)
          };
        } else {
          // Add new item
          mergedCart.push({
            ...newItem,
            quantity: newItem.quantity || 1
          });
        }
      });
      
      return mergedCart;
    });
  };

  // Get cart total (compatibility function)
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  // Get cart items count (compatibility function)
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // Calculate shipping cost
  const getShippingCost = () => {
    const freeShippingThreshold = 999;
    return cartTotal > freeShippingThreshold ? 0 : 49;
  };

  // Calculate total with shipping
  const getTotalWithShipping = () => {
    return cartTotal + getShippingCost();
  };

  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get cart summary
  const getCartSummary = () => {
    const shipping = getShippingCost();
    const totalWithShipping = cartTotal + shipping;
    
    return {
      itemCount: cartItemCount,
      total: cartTotal,
      shipping: shipping,
      totalWithShipping: totalWithShipping,
      formatted: {
        total: formatPrice(cartTotal),
        shipping: formatPrice(shipping),
        totalWithShipping: formatPrice(totalWithShipping)
      }
    };
  };

  // Get items by category
  const getItemsByCategory = (category) => {
    return cart.filter(item => item.category === category);
  };

  // Get unique categories in cart
  const getUniqueCategories = () => {
    return [...new Set(cart.map(item => item.category))];
  };

  // Get cart item by key
  const getCartItemByKey = (key) => {
    return cart.find(item => getItemKey(item) === key);
  };

  const value = {
    // Cart data
    cart,
    cartItemCount,
    cartTotal,
    
    // Core cart operations
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    
    // Helper functions
    isInCart,
    getItemQuantity,
    mergeCart,
    getShippingCost,
    getTotalWithShipping,
    formatPrice,
    getCartSummary,
    getItemsByCategory,
    getUniqueCategories,
    getItemKey,
    getCartItemByKey,
    
    // Raw setter (use with caution)
    setCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for listening to cart updates
export const useCartListener = (callback) => {
  useEffect(() => {
    const handleCartUpdate = (event) => {
      if (callback) callback(event.detail.cart);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [callback]);
};

// Export default the useCart hook for convenience
export default useCart;