import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiCreditCard, 
  FiTruck, 
  FiShield, 
  FiLock,
  FiPackage,
  FiHome,
  FiSmartphone,
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiSave,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiX
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://api.ecommerce.com',
  ENDPOINTS: {
    CREATE_ORDER: '/orders',
    GET_ORDER: '/orders/:id',
    TRACK_ORDER: '/orders/:id/tracking',
    UPDATE_ORDER: '/orders/:id',
    SAVE_CART: '/cart/save'
  }
};

// Shipping Configuration
const SHIPPING_CONFIG = {
  standard: { days: 5, cost: 49, name: 'Standard Shipping' },
  express: { days: 2, cost: 149, name: 'Express Shipping' },
  overnight: { days: 1, cost: 299, name: 'Overnight Shipping' }
};

// Carrier Configuration
const CARRIERS = {
  india: [
    { id: 'bluedart', name: 'BlueDart', trackingUrl: 'https://www.bluedart.com/tracking' },
    { id: 'delhivery', name: 'Delhivery', trackingUrl: 'https://www.delhivery.com/track' },
    { id: 'dhl', name: 'DHL Express', trackingUrl: 'https://www.dhl.com/tracking' },
    { id: 'fedex', name: 'FedEx', trackingUrl: 'https://www.fedex.com/tracking' },
    { id: 'indiapost', name: 'India Post', trackingUrl: 'https://www.indiapost.gov.in/tracking' }
  ]
};

const CheckoutPage = ({ 
  products: propProducts, 
  checkoutType, 
  onBack, 
  onCompletePurchase, 
  onUpdateQuantity, 
  onRemoveItem, 
  onTrackOrder,
  cart = []
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [products, setProducts] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [orderProgress, setOrderProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  
  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // Use refs to track previous values and prevent infinite loops
  const prevCartRef = useRef([]);
  const prevLocationStateRef = useRef(null);
  
  // Storage keys
  const STORAGE_KEYS = {
    FORM_DATA: 'checkout_form_guest',
    PAYMENT_DATA: 'checkout_payment_guest',
    SHIPPING_METHOD: 'checkout_shipping_guest',
    PAYMENT_METHOD: 'checkout_payment_method_guest',
    STEP: 'checkout_step_guest',
    PRODUCTS: 'checkout_products_guest',
    ADDRESSES: 'user_addresses_guest'
  };

  // Initialize form data with saved data or defaults
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    return savedFormData ? JSON.parse(savedFormData) : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      address2: '',
      landmark: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      addressType: 'home',
      isDefault: false
    };
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState(() => {
    const savedPaymentData = localStorage.getItem(STORAGE_KEYS.PAYMENT_DATA);
    return savedPaymentData ? JSON.parse(savedPaymentData) : {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      upiId: '',
      saveCard: false
    };
  });

  // Show Confirmation Modal
  const showConfirmation = useCallback((config) => {
    setConfirmModalConfig(config);
    setShowConfirmModal(true);
  }, []);

  // Hide Confirmation Modal
  const hideConfirmation = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  // Handle modal confirmation
  const handleModalConfirm = useCallback(() => {
    if (confirmModalConfig.onConfirm) {
      confirmModalConfig.onConfirm();
    }
    hideConfirmation();
  }, [confirmModalConfig, hideConfirmation]);

  // Handle modal cancel
  const handleModalCancel = useCallback(() => {
    if (confirmModalConfig.onCancel) {
      confirmModalConfig.onCancel();
    }
    hideConfirmation();
  }, [confirmModalConfig, hideConfirmation]);

  // Load saved data on component mount - FIXED: Removed infinite loop
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        console.log('CheckoutPage - Loading data...');

        // CRITICAL FIX: Load products with priority
        let productsToSet = [];
        
        // 1. Check location state (Buy Now flow)
        if (location.state && location.state.products) {
          console.log('Found products in location.state');
          const locationProducts = Array.isArray(location.state.products) 
            ? location.state.products 
            : [location.state.products];
          
          productsToSet = locationProducts.map(product => ({
            ...product,
            quantity: product.quantity || 1
          }));
        }
        // 2. Check cart prop (Cart checkout flow)
        else if (cart && cart.length > 0) {
          console.log('Using cart from props');
          productsToSet = cart;
        }
        // 3. Check propProducts (Direct props)
        else if (propProducts && propProducts.length > 0) {
          console.log('Using products from props');
          productsToSet = Array.isArray(propProducts) ? propProducts : [propProducts];
        }
        // 4. Check localStorage
        else {
          const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts);
            productsToSet = Array.isArray(parsedProducts) ? parsedProducts : [parsedProducts];
          }
        }

        if (productsToSet.length > 0) {
          setProducts(productsToSet);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsToSet));
        }

        // Load shipping addresses
        const savedAddresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
        if (savedAddresses) {
          const addresses = JSON.parse(savedAddresses);
          setShippingAddresses(addresses);
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setFormData(defaultAddress);
          }
        }

        // Load saved shipping and payment methods
        const savedShippingMethod = localStorage.getItem(STORAGE_KEYS.SHIPPING_METHOD);
        const savedPaymentMethod = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHOD);
        const savedStep = localStorage.getItem(STORAGE_KEYS.STEP);
        
        if (savedShippingMethod) setShippingMethod(savedShippingMethod);
        if (savedPaymentMethod) setPaymentMethod(savedPaymentMethod);
        if (savedStep) setStep(parseInt(savedStep));
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast.error('Failed to load saved data');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadSavedData();
  }, []); // Empty dependency array - only run once on mount

  // FIXED: Sync products from cart or location.state without infinite loop
  useEffect(() => {
    // Skip if no changes
    const currentCartString = JSON.stringify(cart);
    const prevCartString = JSON.stringify(prevCartRef.current);
    const currentLocationState = location.state ? JSON.stringify(location.state) : null;
    const prevLocationState = prevLocationStateRef.current;
    
    let shouldUpdate = false;
    let newProducts = [...products];
    
    // Check if cart changed
    if (currentCartString !== prevCartString && cart.length > 0) {
      console.log('Cart changed, updating products');
      newProducts = cart;
      shouldUpdate = true;
      prevCartRef.current = [...cart];
    }
    
    // Check if location.state changed (Buy Now flow)
    if (currentLocationState !== prevLocationState && location.state?.products) {
      console.log('Location state changed, updating products');
      const locationProducts = Array.isArray(location.state.products) 
        ? location.state.products 
        : [location.state.products];
      
      newProducts = locationProducts.map(product => ({
        ...product,
        quantity: product.quantity || 1
      }));
      shouldUpdate = true;
      prevLocationStateRef.current = currentLocationState;
    }
    
    if (shouldUpdate) {
      setProducts(newProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
    }
  }, [cart, location.state, products]); // Add products to dependencies but guard with refs

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
        localStorage.setItem(STORAGE_KEYS.PAYMENT_DATA, JSON.stringify(paymentData));
        localStorage.setItem(STORAGE_KEYS.SHIPPING_METHOD, shippingMethod);
        localStorage.setItem(STORAGE_KEYS.PAYMENT_METHOD, paymentMethod);
        localStorage.setItem(STORAGE_KEYS.STEP, step.toString());
        
        if (products && products.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        }
        
        setHasUnsavedChanges(true);
        setAutoSaved(true);
        
        setTimeout(() => setAutoSaved(false), 3000);
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };
    
    saveData();
  }, [formData, paymentData, shippingMethod, paymentMethod, step, products]);

  // Handle before unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !orderComplete) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, orderComplete]);

  // Validate form field on change - FIXED: Optimized validation
  const validateFormField = useCallback((name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'This field is required';
        else if (value.length < 2) error = 'Minimum 2 characters required';
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Invalid email format';
        break;
      
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (!phoneDigits) error = 'Phone number is required';
        else if (phoneDigits.length !== 10) error = '10 digits required';
        else if (!/^[6-9]\d{9}$/.test(phoneDigits)) error = 'Invalid Indian mobile number';
        break;
      
      case 'address':
        if (!value.trim()) error = 'Address is required';
        else if (value.length < 10) error = 'Please enter complete address';
        break;
      
      case 'city':
      case 'state':
        if (!value.trim()) error = 'This field is required';
        break;
      
      case 'zipCode':
        if (!value.trim()) error = 'PIN code is required';
        else if (!/^\d{6}$/.test(value)) error = 'Invalid PIN code (6 digits required)';
        break;
      
      default:
        break;
    }
    
    return error;
  }, []);

  // Validate payment field on change - FIXED: Optimized validation
  const validatePaymentField = useCallback((name, value) => {
    let error = '';
    
    switch (name) {
      case 'cardNumber':
        const cardDigits = value.replace(/\s/g, '').replace(/\D/g, '');
        if (!cardDigits) error = 'Card number is required';
        else if (cardDigits.length !== 16) error = '16 digits required';
        else if (!/^\d{16}$/.test(cardDigits)) error = 'Invalid card number';
        break;
      
      case 'expiryDate':
        if (!value.trim()) error = 'Expiry date is required';
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) error = 'Format: MM/YY';
        else {
          const [month, year] = value.split('/');
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;
          
          if (parseInt(year) < currentYear) {
            error = 'Card has expired';
          } else if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
            error = 'Card has expired';
          }
        }
        break;
      
      case 'cvv':
        if (!value.trim()) error = 'CVV is required';
        else if (!/^\d{3,4}$/.test(value)) error = '3 or 4 digits required';
        break;
      
      case 'nameOnCard':
        if (!value.trim()) error = 'Name on card is required';
        else if (value.length < 2) error = 'Minimum 2 characters required';
        break;
      
      case 'upiId':
        if (!value.trim()) error = 'UPI ID is required';
        else if (!/^[\w.-]+@[\w]+$/.test(value)) error = 'Invalid UPI ID format';
        break;
      
      default:
        break;
    }
    
    return error;
  }, []);

  // Handle form input change with validation - FIXED: Debounced validation
  const handleFormChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate the field with debounce
    setTimeout(() => {
      const error = validateFormField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }, 300);
  }, [validateFormField]);

  // Handle payment input change with validation - FIXED: Debounced validation
  const handlePaymentChange = useCallback((name, value) => {
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Validate the field with debounce
    setTimeout(() => {
      const error = validatePaymentField(name, value);
      setPaymentErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }, 300);
  }, [validatePaymentField]);

  // Check if step 1 is valid - FIXED: Optimized validation
  const isStep1Valid = useMemo(() => {
    if (isAddingAddress || shippingAddresses.length === 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      return requiredFields.every(field => {
        const value = formData[field];
        const error = validateFormField(field, value);
        return !error;
      });
    } else {
      return selectedAddressId !== null;
    }
  }, [formData, isAddingAddress, shippingAddresses.length, selectedAddressId, validateFormField]);

  // Check if step 2 is valid
  const isStep2Valid = useMemo(() => {
    return shippingMethod && SHIPPING_CONFIG[shippingMethod];
  }, [shippingMethod]);

  // Check if step 3 is valid - FIXED: Optimized validation
  const isStep3Valid = useMemo(() => {
    if (paymentMethod === 'credit-card') {
      const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
      return requiredFields.every(field => {
        const value = paymentData[field];
        const error = validatePaymentField(field, value);
        return !error;
      });
    } else if (paymentMethod === 'upi') {
      return validatePaymentField('upiId', paymentData.upiId) === '';
    }
    return false;
  }, [paymentMethod, paymentData, validatePaymentField]);

  // Check if current step is valid - FIXED: Simplified
  const isCurrentStepValid = useMemo(() => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    return false;
  }, [step, isStep1Valid, isStep2Valid, isStep3Valid]);

  // Validate entire form for submission - FIXED: Removed recursive showConfirmation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate shipping address
    const addressFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    addressFields.forEach(field => {
      const error = validateFormField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate payment
    if (paymentMethod === 'credit-card') {
      const paymentFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
      paymentFields.forEach(field => {
        const error = validatePaymentField(field, paymentData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (paymentMethod === 'upi') {
      const error = validatePaymentField('upiId', paymentData.upiId);
      if (error) {
        newErrors.upiId = error;
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    setPaymentErrors(newErrors);

    return isValid;
  };

  // Price formatter
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  // Calculate delivery date
  const calculateDeliveryDate = useCallback((shippingDays) => {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    let addedDays = 0;
    while (addedDays < shippingDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return deliveryDate;
  }, []);

  // Calculate totals - FIXED: Optimized calculation
  const calculateTotals = useMemo(() => {
    const subtotal = products.reduce((sum, item) => {
      const itemQuantity = item.quantity || 1;
      return sum + (item.price * itemQuantity);
    }, 0);
    
    const shippingCost = SHIPPING_CONFIG[shippingMethod]?.cost || 0;
    const tax = subtotal * 0.18;
    const total = subtotal + shippingCost + tax;
    
    return { subtotal, shippingCost, tax, total };
  }, [products, shippingMethod]);

  // Generate order number
  const generateOrderNumber = useCallback(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp.toString().slice(-8)}${randomNum.toString().padStart(3, '0')}`;
  }, []);

  // Generate tracking number
  const generateTrackingNumber = useCallback(() => {
    const carriers = CARRIERS.india;
    const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
    const trackingNum = Math.random().toString(36).substring(2, 12).toUpperCase();
    return {
      number: `${randomCarrier.id.toUpperCase()}${trackingNum}`,
      carrier: randomCarrier.name,
      url: randomCarrier.trackingUrl
    };
  }, []);

  // Create order API call - FIXED: Simplified progress updates
  const createOrder = useCallback(async (orderPayload) => {
    try {
      // Simulate API call with progress
      await new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setOrderProgress(Math.min(progress, 100));
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(resolve, 500);
          }
        }, 300);
      });

      // Generate realistic order response
      const orderNumber = generateOrderNumber();
      const trackingInfo = generateTrackingNumber();
      const orderDate = new Date();
      const deliveryDate = calculateDeliveryDate(SHIPPING_CONFIG[shippingMethod].days);
      
      return {
        success: true,
        data: {
          orderId: orderNumber,
          trackingNumber: trackingInfo.number,
          carrier: trackingInfo.carrier,
          trackingUrl: trackingInfo.url,
          orderDate: orderDate.toISOString(),
          estimatedDelivery: deliveryDate.toISOString(),
          paymentId: `PAY${orderNumber.slice(-8)}`,
          status: 'confirmed',
          items: products,
          totals: calculateTotals,
          shippingAddress: formData,
          paymentMethod: paymentMethod
        }
      };
    } catch (error) {
      console.error('Order creation failed:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  }, [shippingMethod, products, calculateTotals, formData, paymentMethod, generateOrderNumber, generateTrackingNumber, calculateDeliveryDate]);

  // Handle place order - FIXED: Replaced window.confirm with custom modal
  const handlePlaceOrder = useCallback(() => {
    if (!validateForm()) {
      toast.error('Please fix all errors before placing order');
      return;
    }

    showConfirmation({
      title: 'Confirm Order',
      message: `Are you sure you want to place this order for ${formatPrice(calculateTotals.total)}?`,
      confirmText: 'Place Order',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setIsProcessing(true);
        setOrderProgress(0);

        try {
          // Prepare order payload
          const orderPayload = {
            items: products.map(item => ({
              productId: item.id,
              name: item.name,
              quantity: item.quantity || 1,
              price: item.price,
              image: item.image || item.images?.[0]
            })),
            shippingAddress: formData,
            shippingMethod: {
              type: shippingMethod,
              cost: SHIPPING_CONFIG[shippingMethod].cost,
              estimatedDays: SHIPPING_CONFIG[shippingMethod].days
            },
            payment: {
              method: paymentMethod,
              ...(paymentMethod === 'credit-card' && {
                lastFour: paymentData.cardNumber.replace(/\s/g, '').slice(-4)
              }),
              ...(paymentMethod === 'upi' && {
                upiId: paymentData.upiId
              })
            },
            totals: calculateTotals,
            customer: {
              email: formData.email,
              phone: formData.phone,
              name: `${formData.firstName} ${formData.lastName}`
            }
          };

          // Call create order API
          const result = await createOrder(orderPayload);
          
          if (result.success) {
            setOrderData(result.data);
            setOrderComplete(true);
            
            // Save order to localStorage
            const existingOrders = JSON.parse(localStorage.getItem('ecommerce_orders') || '[]');
            const newOrder = {
              id: result.data.orderId,
              orderNumber: result.data.orderId,
              date: result.data.orderDate,
              status: 'ordered',
              items: result.data.items,
              total: result.data.totals.total,
              shippingAddress: result.data.shippingAddress,
              paymentMethod: result.data.paymentMethod,
              trackingNumber: result.data.trackingNumber,
              carrier: result.data.carrier
            };
            
            localStorage.setItem('ecommerce_orders', JSON.stringify([newOrder, ...existingOrders]));
            
            // Clear checkout data
            Object.keys(STORAGE_KEYS).forEach(key => {
              localStorage.removeItem(STORAGE_KEYS[key]);
            });
            
            toast.success('Order placed successfully!');
            
            // Call the parent completion handler
            if (onCompletePurchase) {
              onCompletePurchase(result.data);
            }
          }
        } catch (error) {
          toast.error(error.message || 'Failed to place order. Please try again.');
          console.error('Order error:', error);
        } finally {
          setIsProcessing(false);
        }
      },
      onCancel: () => {
        // Do nothing when cancelled
      }
    });
  }, [validateForm, formatPrice, calculateTotals, products, formData, shippingMethod, paymentMethod, paymentData, createOrder, onCompletePurchase, showConfirmation]);

  // Handle address selection
  const handleAddressSelect = useCallback((addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = shippingAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setFormData(selectedAddress);
    }
  }, [shippingAddresses]);

  // Save address with confirmation - FIXED: Replaced window.confirm with custom modal
  const handleSaveAddress = useCallback(() => {
    if (!isStep1Valid) {
      toast.error('Please fill all required fields correctly before saving the address.');
      return;
    }

    showConfirmation({
      title: 'Save Address',
      message: 'Do you want to save this address for future orders?',
      confirmText: 'Save',
      cancelText: 'Cancel',
      onConfirm: () => {
        const newAddress = {
          id: `addr_${Date.now()}`,
          ...formData,
          isDefault: shippingAddresses.length === 0
        };

        const updatedAddresses = [...shippingAddresses, newAddress];
        setShippingAddresses(updatedAddresses);
        setSelectedAddressId(newAddress.id);
        localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(updatedAddresses));
        
        setIsAddingAddress(false);
        toast.success('Address saved successfully');
      },
      onCancel: () => {
        // Do nothing when cancelled
      }
    });
  }, [isStep1Valid, formData, shippingAddresses, showConfirmation]);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // Calculate delivery progress
  const calculateDeliveryProgress = useCallback((orderDate, estimatedDate) => {
    const start = new Date(orderDate).getTime();
    const end = new Date(estimatedDate).getTime();
    const now = new Date().getTime();
    
    const total = end - start;
    const elapsed = now - start;
    
    return Math.min(Math.max(Math.floor((elapsed / total) * 100), 0), 100);
  }, []);

  // Handle step navigation - FIXED: Replaced window.confirm with custom modal
  const handleNextStep = useCallback(() => {
    if (step === 1 && !isStep1Valid) {
      toast.error('Please fill all required shipping address fields before proceeding.');
      return;
    }
    
    if (step === 2 && !isStep2Valid) {
      toast.error('Please select a shipping method before proceeding.');
      return;
    }
    
    setStep(prev => Math.min(prev + 1, 3));
  }, [step, isStep1Valid, isStep2Valid]);

  const handlePrevStep = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      showConfirmation({
        title: 'Leave Checkout',
        message: 'Are you sure you want to leave? Your progress will be saved.',
        confirmText: 'Leave',
        cancelText: 'Stay',
        onConfirm: () => {
          if (onBack) {
            onBack();
          } else {
            navigate(-1);
          }
        },
        onCancel: () => {
          // Do nothing when cancelled
        }
      });
    }
  }, [step, onBack, navigate, showConfirmation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm w-full px-4">
          <div className="text-gray-400 text-5xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No items to checkout</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">Add items to your cart first</p>
          <button
            onClick={() => onBack ? onBack() : navigate('/')}
            className="bg-green-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete && orderData) {
    const deliveryProgress = calculateDeliveryProgress(orderData.orderDate, orderData.estimatedDelivery);
    
    // Handle button clicks in success modal
    const handleSuccessModalButtonClick = (action) => {
      switch(action) {
        case 'print':
          window.print();
          break;
        case 'track':
          if (onTrackOrder) {
            onTrackOrder(orderData.orderId);
          } else {
            window.open(`/track-order/${orderData.orderId}`, '_blank');
          }
          break;
        case 'continue':
          setOrderComplete(false);
          setOrderData(null);
          if (onBack) {
            onBack();
          } else {
            navigate('/');
          }
          break;
        case 'view-order':
          window.open(`/orders/${orderData.orderId}`, '_blank');
          break;
        case 'invoice':
          window.open(`/invoice/${orderData.orderId}`, '_blank');
          break;
        case 'history':
          window.open('/orders', '_blank');
          break;
        case 'copy-tracking':
          navigator.clipboard.writeText(orderData.trackingNumber);
          toast.success('Tracking number copied!');
          break;
        default:
          break;
      }
    };
    
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50">
        <ToastContainer />
        
        {/* Order Success Modal */}
        <div className="fixed inset-0 backdrop-blur-sm sm:backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl max-w-md sm:max-w-lg md:max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Success Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiCheck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 text-sm sm:text-base">Your order has been placed successfully</p>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                    <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Order Details
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium truncate ml-2">{orderData.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(orderData.orderDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Confirmed</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium">{formatPrice(calculateTotals.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                    <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Delivery Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{formatDate(orderData.estimatedDelivery)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Carrier:</span>
                      <span className="font-medium">{orderData.carrier}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-medium truncate ml-2">{orderData.trackingNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Progress */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Delivery Progress</h3>
                  <span className="text-xs sm:text-sm font-medium text-green-600">{deliveryProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div 
                    className="bg-green-600 h-2 sm:h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${deliveryProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="text-xs">Placed</span>
                  <span className="text-xs">In Transit</span>
                  <span className="text-xs hidden xs:inline">Out for Delivery</span>
                  <span className="text-xs">Delivered</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                  onClick={() => handleSuccessModalButtonClick('print')}
                  className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print Receipt</span>
                </button>
                
                <button
                  onClick={() => handleSuccessModalButtonClick('track')}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  <FiTruck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Track Order</span>
                </button>
                
                <button
                  onClick={() => handleSuccessModalButtonClick('continue')}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Continue Shopping</span>
                </button>
              </div>

              {/* Note */}
              <div className="mt-4 sm:mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <strong>Note:</strong> You'll receive email updates about your order. 
                  Track your package in real-time using the tracking number above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <FiAlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {confirmModalConfig.title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {confirmModalConfig.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
              <button
                type="button"
                onClick={handleModalCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                {confirmModalConfig.cancelText}
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
              >
                {confirmModalConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{step > 1 ? 'Back' : 'Cancel'}</span>
            </button>
            
            <div className="flex flex-col items-center">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Checkout</h1>
              <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
                <FiShield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-xs text-gray-600">Secure Checkout</span>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between mb-1">
              <span className={`text-xs font-medium ${step >= 1 ? 'text-green-600' : 'text-gray-500'}`}>Shipping</span>
              <span className={`text-xs font-medium ${step >= 2 ? 'text-green-600' : 'text-gray-500'}`}>Payment</span>
              <span className={`text-xs font-medium ${step >= 3 ? 'text-green-600' : 'text-gray-500'}`}>Review</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4">Shipping Address</h2>
                
                {/* Saved Addresses */}
                {shippingAddresses.length > 0 && !isAddingAddress && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Select Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {shippingAddresses.map(address => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address.id)}
                          className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{address.address}</p>
                              {address.address2 && (
                                <p className="text-xs sm:text-sm text-gray-600 truncate">{address.address2}</p>
                              )}
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{address.phone}</p>
                            </div>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded ml-2 flex-shrink-0">
                                Default
                              </span>
                            )}
                          </div>
                          {address.addressType && (
                            <div className="flex items-center mt-2 sm:mt-3">
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {address.addressType}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="mt-3 sm:mt-4 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* Address Form */}
                {(isAddingAddress || shippingAddresses.length === 0) && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleFormChange('firstName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleFormChange('lastName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength="10"
                        required
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleFormChange('address', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                          formErrors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="House number, street name"
                        required
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.address2 || ''}
                        onChange={(e) => handleFormChange('address2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleFormChange('city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            formErrors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleFormChange('state', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            formErrors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {formErrors.state && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.state}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleFormChange('zipCode', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          maxLength="6"
                          required
                        />
                        {formErrors.zipCode && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.zipCode}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between space-x-3 pt-2">
                      <button
                        onClick={() => {
                          if (isAddingAddress) {
                            setIsAddingAddress(false);
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base flex-1 sm:flex-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        disabled={!isStep1Valid}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4">Shipping Method</h2>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(SHIPPING_CONFIG).map(([key, method]) => {
                    const deliveryDate = calculateDeliveryDate(method.days);
                    return (
                      <div
                        key={key}
                        onClick={() => setShippingMethod(key)}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                          shippingMethod === key
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            shippingMethod === key ? 'border-green-500 bg-green-500' : 'border-gray-300'
                          }`}>
                            {shippingMethod === key && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{method.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                              Estimated delivery: {formatDate(deliveryDate.toISOString())}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {method.days} business day{method.days !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-4">
                          <span className="font-medium text-gray-900 text-sm sm:text-base">{formatPrice(method.cost)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4">Payment Method</h2>
                
                {/* Payment Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div
                    onClick={() => setPaymentMethod('credit-card')}
                    className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === 'credit-card' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'credit-card' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'credit-card' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                      <span className="text-sm sm:text-base">Credit/Debit Card</span>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 ml-2">
                      <div className="w-6 h-4 sm:w-8 sm:h-5 bg-gray-200 rounded shrink-0"></div>
                      <div className="w-6 h-4 sm:w-8 sm:h-5 bg-gray-200 rounded shrink-0"></div>
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'upi' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'upi' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <FiSmartphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                      <span className="text-sm sm:text-base">UPI</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 ml-2">GPay/PhonePe/etc</div>
                  </div>
                </div>

                {/* Card Form */}
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                          paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {paymentErrors.cardNumber && (
                        <p className="mt-1 text-xs text-red-600">{paymentErrors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {paymentErrors.expiryDate && (
                          <p className="mt-1 text-xs text-red-600">{paymentErrors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {paymentErrors.cvv && (
                          <p className="mt-1 text-xs text-red-600">{paymentErrors.cvv}</p>
                        )}
                      </div>
                      <div className="xs:col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={paymentData.nameOnCard}
                          onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                            paymentErrors.nameOnCard ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Sanchit Patil"
                        />
                        {paymentErrors.nameOnCard && (
                          <p className="mt-1 text-xs text-red-600">{paymentErrors.nameOnCard}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Form */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        value={paymentData.upiId}
                        onChange={(e) => handlePaymentChange('upiId', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base ${
                          paymentErrors.upiId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="username@bank"
                      />
                      {paymentErrors.upiId && (
                        <p className="mt-1 text-xs text-red-600">{paymentErrors.upiId}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        You'll receive a payment request on your UPI app
                      </p>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <FiLock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                      <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">
                        Your payment information is encrypted and secure. We don't store your card details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
              
              {/* Products List */}
              <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
                {products.map((product, index) => {
                  const productQuantity = product.quantity || 1;
                  
                  return (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <img
                        src={product.image || product.images?.[0] || 'https://via.placeholder.com/100'}
                        alt={product.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-xs text-gray-600 truncate">{product.category || product.brand || ''}</p>
                        <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                          <span className="text-xs sm:text-sm font-medium">{formatPrice(product.price)}</span>
                          <span className="text-xs text-gray-600">Qty: {productQuantity}</span>
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-0.5">
                          Total: {formatPrice(product.price * productQuantity)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(calculateTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatPrice(calculateTotals.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span>{formatPrice(calculateTotals.tax)}</span>
                </div>
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between font-bold text-sm sm:text-base">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              {step === 3 && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isStep3Valid || isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ${formatPrice(calculateTotals.total)}`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-4 sm:mt-6 flex justify-between space-x-3">
          <button
            onClick={handlePrevStep}
            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base flex-1 sm:flex-none"
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          
          {step < 3 && (
            <button
              onClick={handleNextStep}
              disabled={!isCurrentStepValid}
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none"
            >
              Continue
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;