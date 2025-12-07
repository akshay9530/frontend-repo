import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock,
  FiShoppingBag,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiChevronRight,
  FiShoppingCart,
  FiArrowLeft,
  FiCheck,
  FiCheckSquare,
  FiSquare
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../hooks/useCart';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-xs sm:max-w-sm md:max-w-md w-full mx-2 sm:mx-4">
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6">{message}</p>
          
          <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onCancel}
              className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full xs:w-auto"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full xs:w-auto"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component with selection
const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onSelectItem, isSelected }) => {
  const { formatPrice } = useCart();

  const handleRemove = () => {
    // Create identifier from size/storage/colour
    const identifier = `${item.size || ''}-${item.storage || ''}-${item.colour || ''}`;
    onRemoveItem(item.id, identifier);
  };

  const handleQuantityDecrease = () => {
    const currentQuantity = item.quantity || 1;
    if (currentQuantity > 1) {
      const identifier = `${item.size || ''}-${item.storage || ''}-${item.colour || ''}`;
      onUpdateQuantity(item.id, currentQuantity - 1, identifier);
    } else {
      handleRemove();
    }
  };

  const handleQuantityIncrease = () => {
    const currentQuantity = item.quantity || 1;
    const identifier = `${item.size || ''}-${item.storage || ''}-${item.colour || ''}`;
    onUpdateQuantity(item.id, currentQuantity + 1, identifier);
  };

  const handleSelect = () => {
    onSelectItem(item);
  };

  return (
    <div className={`flex items-start gap-2 sm:gap-3 md:gap-4 bg-white p-3 sm:p-4 rounded-lg border transition-all ${
      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      {/* Selection Checkbox */}
      <div className="shrink-0 pt-1 sm:pt-1.5 md:pt-2">
        <button
          onClick={handleSelect}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-green-600 border-green-600' 
              : 'border border-gray-300 hover:border-green-500'
          }`}
        >
          {isSelected && <FiCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col xs:flex-row xs:gap-2 sm:gap-3">
          {/* Product Image */}
          <div className="shrink-0 mb-2 xs:mb-0">
            <img
              src={item.image || item.images?.[0] || 'https://via.placeholder.com/100'}
              alt={item.name}
              className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 object-cover rounded-lg"
            />
          </div>
          
          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{item.brand || item.category}</p>
                <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                  {item.size && (
                    <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      Size: {item.size}
                    </span>
                  )}
                  {item.storage && (
                    <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      Storage: {item.storage}
                    </span>
                  )}
                  {item.colour && (
                    <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      Color: {item.colour}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="mt-1 sm:mt-0 text-left sm:text-right">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600">
                  {formatPrice(item.price * (item.quantity || 1))}
                </p>
                {item.originalPrice && item.originalPrice > item.price && (
                  <p className="text-xs text-gray-400 line-through mt-0.5">
                    {formatPrice(item.originalPrice * (item.quantity || 1))}
                  </p>
                )}
              </div>
            </div>
            
            {/* Quantity Controls and Remove */}
            <div className="flex items-center justify-between mt-3 sm:mt-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleQuantityDecrease}
                  disabled={(item.quantity || 1) <= 1}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
                
                <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity || 1}</span>
                
                <button
                  onClick={handleQuantityIncrease}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <FiPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              </div>
              
              <button
                onClick={handleRemove}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium"
              >
                <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Item Component
const OrderItem = ({ order, onCancelOrder, onTrackOrder, onRemoveOrder }) => {
  const { formatPrice } = useCart();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'ordered':
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      case 'shipped':
      case 'in_transit':
        return <FiTruck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      case 'processing':
        return <FiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      default:
        return <FiPackage className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'ordered': 'Ordered',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      {/* Order Header */}
      <div className="border-b p-3 sm:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-center xs:gap-1.5 sm:gap-2 mb-1 sm:mb-0">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">Order #{order.orderNumber || order.orderId}</h3>
              <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)} mt-1 xs:mt-0`}>
                {getStatusIcon(order.status)}
                <span>{getStatusText(order.status)}</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-xs text-gray-600">
              <p className="flex items-center mt-1 sm:mt-0">
                <FiCalendar className="w-3 h-3 inline mr-1 shrink-0" />
                Placed on {formatDate(order.date || order.orderDate)}
              </p>
              {order.estimatedDelivery && (
                <p className="flex items-center mt-1 sm:mt-0">
                  <FiClock className="w-3 h-3 inline mr-1 shrink-0" />
                  Est. delivery: {formatDate(order.estimatedDelivery)}
                </p>
              )}
            </div>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {order.items && order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              <img
                src={item.image || item.images?.[0]}
                alt={item.name}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                {item.brand && <p className="text-xs text-gray-600 truncate mt-0.5">{item.brand}</p>}
              </div>
            </div>
          ))}
          {order.items && order.items.length > 2 && (
            <p className="text-xs sm:text-sm text-gray-500 text-center pt-1">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>
      </div>

      {/* Order Actions */}
      <div className="border-t p-3 sm:p-4 bg-gray-50">
        <div className="flex flex-col xs:flex-row flex-wrap gap-2">
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={() => onTrackOrder(order.orderNumber || order.orderId)}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
            >
              <FiTruck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Track Order</span>
            </button>
          )}
          
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={() => onCancelOrder(order.orderNumber || order.orderId)}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 border border-red-600 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm"
            >
              <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Cancel Order</span>
            </button>
          )}
          
          {order.status === 'delivered' && (
            <button
              onClick={() => {
                // Add all items from this order back to cart
                const orderItems = order.items.map(item => ({
                  ...item,
                  quantity: item.quantity || 1
                }));
                // Use localStorage directly for reorder
                const currentCart = JSON.parse(localStorage.getItem('ecommerce_cart') || '[]');
                const newCart = [...currentCart, ...orderItems];
                localStorage.setItem('ecommerce_cart', JSON.stringify(newCart));
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                toast.success('All items from this order have been added to your cart');
              }}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
            >
              <FiShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Reorder All</span>
            </button>
          )}
          
          <button
            onClick={() => window.location.href = `/orders/${order.orderNumber || order.orderId}`}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 border border-blue-600 text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm"
          >
            <FiPackage className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>View Details</span>
          </button>

          {/* Remove Order Button - Only for cancelled orders */}
          {order.status === 'cancelled' && (
            <button
              onClick={() => onRemoveOrder(order.orderNumber || order.orderId)}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 border border-red-600 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm"
            >
              <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Remove Order</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Cart Page Component
const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    cartItemCount, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    formatPrice,
    getCartSummary,
    getItemKey
  } = useCart();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('cart');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Confirmation Modal States
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // Show Confirmation Modal
  const showConfirmation = (config) => {
    setConfirmationModal({
      ...config,
      isOpen: true
    });
  };

  // Hide Confirmation Modal
  const hideConfirmation = () => {
    setConfirmationModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  // Load order data from localStorage on component mount
  useEffect(() => {
    loadOrderData();
    setLoading(false);
  }, []);

  // Listen for storage events to update orders in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ecommerce_orders') {
        loadOrderData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auto-select all items when cart loads or changes
  useEffect(() => {
    if (cart.length > 0) {
      const allItemKeys = cart.map(item => getItemKey(item));
      setSelectedItems(allItemKeys);
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  }, [cart, getItemKey]);

  const loadOrderData = () => {
    try {
      const savedOrders = localStorage.getItem('ecommerce_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        const validOrders = Array.isArray(parsedOrders) 
          ? parsedOrders.filter(order => order && (order.orderNumber || order.orderId) && order.items && order.items.length > 0)
          : [];
        setOrders(validOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      toast.error('Failed to load order data');
      setOrders([]);
    }
  };

  const cancelOrder = (orderId) => {
    showConfirmation({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      confirmText: 'Cancel Order',
      cancelText: 'Keep Order',
      onConfirm: () => {
        hideConfirmation();
        
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order =>
            order.orderNumber === orderId || order.orderId === orderId 
              ? { ...order, status: 'cancelled' } 
              : order
          );
          
          localStorage.setItem('ecommerce_orders', JSON.stringify(updatedOrders));
          return updatedOrders;
        });
        
        toast.success('Order cancelled successfully');
      },
      onCancel: hideConfirmation
    });
  };

  const removeOrder = (orderId) => {
    showConfirmation({
      title: 'Remove Order',
      message: 'Are you sure you want to remove this order from your history?',
      confirmText: 'Remove',
      cancelText: 'Keep',
      onConfirm: () => {
        hideConfirmation();
        
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.filter(order =>
            !(order.orderNumber === orderId || order.orderId === orderId)
          );
          
          localStorage.setItem('ecommerce_orders', JSON.stringify(updatedOrders));
          return updatedOrders;
        });
        
        toast.success('Order removed from history');
      },
      onCancel: hideConfirmation
    });
  };

  const trackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  const handleClearCart = () => {
    showConfirmation({
      title: 'Clear Cart',
      message: 'Are you sure you want to clear your cart?',
      confirmText: 'Clear Cart',
      cancelText: 'Keep Items',
      onConfirm: () => {
        hideConfirmation();
        clearCart();
        setSelectedItems([]);
        setSelectAll(false);
        toast.success('Cart cleared');
      },
      onCancel: hideConfirmation
    });
  };

  const handleSelectItem = (item) => {
    const itemKey = getItemKey(item);
    setSelectedItems(prev => {
      if (prev.includes(itemKey)) {
        const newSelected = prev.filter(key => key !== itemKey);
        setSelectAll(newSelected.length === cart.length && cart.length > 0);
        return newSelected;
      } else {
        const newSelected = [...prev, itemKey];
        setSelectAll(newSelected.length === cart.length && cart.length > 0);
        return newSelected;
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      // Select all
      const allItemKeys = cart.map(item => getItemKey(item));
      setSelectedItems(allItemKeys);
      setSelectAll(true);
    }
  };

  const handleCheckout = () => {
    let itemsToCheckout;
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to proceed');
      return;
    }
    
    if (selectedItems.length === cart.length) {
      // All items selected
      itemsToCheckout = cart;
    } else {
      // Get selected items
      itemsToCheckout = cart.filter(item => 
        selectedItems.includes(getItemKey(item))
      );
    }

    if (itemsToCheckout.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSaving(true);
    
    try {
      // Save selected items to localStorage for checkout page
      localStorage.setItem('checkout_products_guest', JSON.stringify(itemsToCheckout));
      
      // Navigate to checkout with selected items
      navigate('/checkout', { 
        state: { 
          products: itemsToCheckout,
          checkoutType: 'cart'
        } 
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to proceed to checkout');
    } finally {
      setSaving(false);
    }
  };

  const calculateSelectedSubtotal = () => {
    const selectedCartItems = cart.filter(item => 
      selectedItems.includes(getItemKey(item))
    );
    return selectedCartItems.reduce((total, item) => 
      total + (item.price * (item.quantity || 1)), 0
    );
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 999 ? 0 : 49;
  };

  const calculateTotal = (subtotal, shipping) => {
    return subtotal + shipping;
  };

  const selectedItemsCount = cart.filter(item => 
    selectedItems.includes(getItemKey(item))
  ).reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        className="text-sm sm:text-base"
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-8">
        {/* Header with Back Button */}
        <div className="mb-5 sm:mb-6 md:mb-8 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
          <div className="mb-3 xs:mb-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Shopping</h1>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-1.5 md:mt-2">Manage your cart and track your orders</p>
          </div>
          <Link
            to="/new-arrivals"
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-green-600 hover:text-green-700 text-xs sm:text-sm md:text-base w-fit"
          >
            <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 shrink-0" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-2 sm:gap-4 md:gap-8 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('cart')}
                className={`py-2 sm:py-2.5 md:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap transition-colors ${
                  activeTab === 'cart'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <FiShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 shrink-0" />
                  <span>Shopping Cart ({cartItemCount})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 sm:py-2.5 md:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap transition-colors ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <FiPackage className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 shrink-0" />
                  <span>My Orders ({orders.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'cart' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-gray-200">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <button
                        onClick={handleSelectAll}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border transition-colors text-xs sm:text-sm md:text-base ${
                          selectAll
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {selectAll ? (
                          <FiCheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 shrink-0" />
                        ) : (
                          <FiSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 shrink-0" />
                        )}
                        <span className="font-medium">
                          {selectAll ? 'Deselect All' : 'Select All'}
                        </span>
                      </button>
                      <div className="text-xs sm:text-sm md:text-base text-gray-600">
                        {selectedItemsCount} of {cartItemCount} items selected
                      </div>
                    </div>
                    {cart.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="text-red-600 hover:text-red-700 text-xs sm:text-sm md:text-base font-medium flex items-center gap-1 sm:gap-1.5 w-fit"
                      >
                        <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span>Clear Cart</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 sm:py-10 md:py-12">
                      <div className="text-gray-300 mb-3 sm:mb-4">
                        <FiShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto opacity-50" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-1.5 md:mb-2">Your cart is empty</h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6">Add some items to get started</p>
                      <Link
                        to="/new-arrivals"
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base md:text-lg"
                      >
                        <FiShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 shrink-0" />
                        <span>Continue Shopping</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {cart.map((item, index) => (
                        <CartItem
                          key={`${getItemKey(item)}-${index}`}
                          item={item}
                          isSelected={selectedItems.includes(getItemKey(item))}
                          onSelectItem={handleSelectItem}
                          onUpdateQuantity={updateQuantity}
                          onRemoveItem={removeFromCart}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-6">
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-gray-200">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Order Summary</h2>
                    {selectedItemsCount > 0 && (
                      <span className="px-2 py-1 text-xs sm:text-sm bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                        {selectedItemsCount} selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  {/* Price Breakdown */}
                  <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Selected Items</span>
                      <span className="font-medium">
                        {selectedItemsCount} item{selectedItemsCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(calculateSelectedSubtotal())}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {calculateShipping(calculateSelectedSubtotal()) === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(calculateShipping(calculateSelectedSubtotal()))
                        )}
                      </span>
                    </div>
                    
                    <div className="border-t pt-2 sm:pt-2.5 md:pt-3">
                      <div className="flex justify-between text-base sm:text-lg font-bold">
                        <span>Total</span>
                        <span>
                          {formatPrice(calculateTotal(
                            calculateSelectedSubtotal(),
                            calculateShipping(calculateSelectedSubtotal())
                          ))}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Inclusive of all taxes</p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItemsCount === 0 || saving}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                        <span>Proceed to Checkout</span>
                      </>
                    )}
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/new-arrivals"
                    className="w-full mt-2 sm:mt-3 inline-flex items-center justify-center gap-1.5 sm:gap-2 border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base md:text-lg"
                  >
                    <FiShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                    <span>Continue Shopping</span>
                  </Link>

                  {/* Selection Notice */}
                  {selectedItemsCount > 0 && selectedItemsCount < cartItemCount && (
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs sm:text-sm text-blue-800 flex items-start">
                        <FiAlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1 mt-0.5 shrink-0" />
                        Only selected items will be checked out
                      </p>
                    </div>
                  )}

                  {/* Security Info */}
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm md:text-base font-medium text-blue-900">Secure Checkout</p>
                        <p className="text-xs sm:text-sm text-blue-700 mt-0.5">
                          Your payment information is encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Orders Tab Content */
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Order History</h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                Track and manage your recent orders
              </p>
            </div>

            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <div className="text-gray-300 mb-3 sm:mb-4">
                    <FiPackage className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto opacity-50" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-1.5 md:mb-2">No orders yet</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6">Complete your first order to see it here</p>
                  <button
                    onClick={() => setActiveTab('cart')}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base md:text-lg"
                  >
                    <FiShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 shrink-0" />
                    <span>Go to Cart</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Orders Filter */}
                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <button
                        onClick={() => {}}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-full text-xs sm:text-sm font-medium"
                      >
                        All Orders ({orders.length})
                      </button>
                      <button
                        onClick={() => {}}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200"
                      >
                        Active ({orders.filter(o => !['cancelled', 'delivered'].includes(o.status)).length})
                      </button>
                      <button
                        onClick={() => {}}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200"
                      >
                        Cancelled ({orders.filter(o => o.status === 'cancelled').length})
                      </button>
                    </div>
                  </div>
                  
                  {/* Orders Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {orders.map((order, index) => (
                      <OrderItem
                        key={order.orderNumber || order.orderId || index}
                        order={order}
                        onCancelOrder={cancelOrder}
                        onTrackOrder={trackOrder}
                        onRemoveOrder={removeOrder}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;