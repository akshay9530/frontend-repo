import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiHome, 
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiRefreshCw,
  FiAlertCircle,
  FiNavigation,
  FiMap,
  FiGlobe,
  FiCalendar,
  FiUser,
  FiDownload,
  FiShare2,
  FiBell
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock API Service (Replace with real API calls)
const OrderTrackingService = {
  async getOrderTracking(orderId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate realistic tracking data based on order age
    const orderDate = new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000);
    const orderAge = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const statuses = [
      { id: 1, name: 'Order Placed', completed: true, icon: '📦' },
      { id: 2, name: 'Processing', completed: orderAge > 0.5, icon: '⚙️' },
      { id: 3, name: 'Shipped', completed: orderAge > 1, icon: '🚚' },
      { id: 4, name: 'In Transit', completed: orderAge > 2, icon: '✈️' },
      { id: 5, name: 'Out for Delivery', completed: orderAge > 3, icon: '🏍️' },
      { id: 6, name: 'Delivered', completed: orderAge > 4, icon: '🏠' }
    ];
    
    const currentStatus = statuses.find(s => s.completed) || statuses[0];
    const progress = (statuses.filter(s => s.completed).length / statuses.length) * 100;
    
    return {
      orderId,
      orderNumber: orderId,
      orderDate: orderDate.toISOString(),
      estimatedDelivery: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: currentStatus.name.toLowerCase().replace(' ', '_'),
      statusText: currentStatus.name,
      progress: Math.min(progress, 100),
      carrier: this.getRandomCarrier(),
      trackingNumber: this.generateTrackingNumber(),
      currentLocation: this.getRandomLocation(),
      nextLocation: this.getRandomLocation(),
      timeline: statuses,
      updates: this.generateUpdates(orderDate),
      packageDetails: {
        weight: `${(Math.random() * 5 + 0.5).toFixed(1)} kg`,
        dimensions: '30 × 20 × 15 cm',
        items: Math.floor(Math.random() * 5) + 1,
        fragile: Math.random() > 0.5,
        signatureRequired: true
      },
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050',
        phone: '+91 9876543210',
        email: 'john.doe@example.com'
      }
    };
  },
  
  getRandomCarrier() {
    const carriers = [
      { name: 'BlueDart', trackingUrl: 'https://www.bluedart.com/tracking' },
      { name: 'Delhivery', trackingUrl: 'https://www.delhivery.com/track' },
      { name: 'DHL Express', trackingUrl: 'https://www.dhl.com/tracking' },
      { name: 'FedEx', trackingUrl: 'https://www.fedex.com/tracking' },
      { name: 'India Post', trackingUrl: 'https://www.indiapost.gov.in/tracking' }
    ];
    return carriers[Math.floor(Math.random() * carriers.length)];
  },
  
  generateTrackingNumber() {
    const prefix = ['BDX', 'DLV', 'DHL', 'FED', 'IND'][Math.floor(Math.random() * 5)];
    const number = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}${number}`;
  },
  
  getRandomLocation() {
    const locations = [
      { city: 'Mumbai', state: 'MH', hub: 'Mumbai Sorting Center' },
      { city: 'Delhi', state: 'DL', hub: 'Delhi Hub' },
      { city: 'Bengaluru', state: 'KA', hub: 'Bengaluru Processing Center' },
      { city: 'Chennai', state: 'TN', hub: 'Chennai Distribution Center' },
      { city: 'Kolkata', state: 'WB', hub: 'Kolkata Warehouse' }
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  },
  
  generateUpdates(orderDate) {
    const updates = [];
    const now = new Date();
    const events = [
      'Package scanned at origin facility',
      'Departed from processing center',
      'Arrived at sorting facility',
      'Customs clearance completed',
      'In transit to destination',
      'Arrived at destination hub',
      'Out for delivery',
      'Delivery attempted',
      'Delivered successfully'
    ];
    
    let currentDate = new Date(orderDate);
    events.forEach((event, index) => {
      currentDate = new Date(currentDate.getTime() + Math.random() * 12 * 60 * 60 * 1000);
      if (currentDate < now) {
        updates.push({
          id: index + 1,
          message: event,
          timestamp: currentDate.toISOString(),
          location: this.getRandomLocation().city
        });
      }
    });
    
    return updates.reverse();
  }
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const refreshInterval = useRef(null);
  
  // Fetch tracking data
  const fetchTrackingData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    
    try {
      const data = await OrderTrackingService.getOrderTracking(orderId);
      setTrackingData(data);
      setError('');
    } catch (err) {
      setError('Unable to fetch tracking information. Please try again.');
      toast.error('Failed to load tracking data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [orderId]);
  
  // Initial load
  useEffect(() => {
    if (orderId) {
      fetchTrackingData();
    } else {
      setError('Order ID is required');
      setLoading(false);
    }
  }, [orderId, fetchTrackingData]);
  
  // Set up auto-refresh for in-transit orders
  useEffect(() => {
    if (trackingData && trackingData.status === 'in_transit') {
      refreshInterval.current = setInterval(() => {
        fetchTrackingData(true);
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [trackingData, fetchTrackingData]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate time remaining
  const calculateTimeRemaining = (estimatedDate) => {
    const now = new Date();
    const estimated = new Date(estimatedDate);
    const diffMs = estimated - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle notifications
  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Tracking notifications enabled');
      }
    } else {
      toast.warning('Notifications not supported in your browser');
    }
  };
  
  // Share tracking
  const handleShareTracking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Order ${trackingData.orderNumber}`,
          text: `Track your order ${trackingData.orderNumber} here: ${window.location.href}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tracking link copied to clipboard');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }
  
  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Track Order</h3>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold text-gray-900">Track Your Order</h1>
              <div className="flex items-center space-x-2 mt-1">
                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-green-600' : 'text-gray-400'}`} />
                <span className="text-xs text-gray-600">Live Tracking</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchTrackingData(true)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                title="Refresh"
              >
                <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleShareTracking}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                title="Share"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order {trackingData.orderNumber}</h2>
              <p className="text-gray-600 mt-1">Placed on {formatDate(trackingData.orderDate)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(trackingData.status)}`}>
                <FiPackage className="w-4 h-4" />
                <span>{trackingData.statusText}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tracking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Delivery Progress</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600">{trackingData.progress.toFixed(0)}% Complete</span>
                  <button
                    onClick={handleEnableNotifications}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FiBell className="w-4 h-4" />
                    <span>{notificationsEnabled ? 'Notified' : 'Notify Me'}</span>
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${trackingData.progress}%` }}
                  ></div>
                </div>
                
                {/* Timeline Points */}
                <div className="flex justify-between mt-2 relative">
                  {trackingData.timeline.map((point, index) => (
                    <div key={point.id} className="flex flex-col items-center relative z-10">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2 ${
                          point.completed 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {point.completed ? <FiCheckCircle className="w-4 h-4" /> : point.icon}
                      </div>
                      <span className={`text-xs text-center ${point.completed ? 'font-medium' : 'text-gray-500'}`}>
                        {point.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* ETA */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(trackingData.estimatedDelivery)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="text-lg font-bold text-green-600">
                      {calculateTimeRemaining(trackingData.estimatedDelivery)}
                    </p>
                  </div>
                </div>
              </div>continue
            </div>
            
            {/* Current Location */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Current Location</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trackingData.currentLocation.hub}</p>
                    <p className="text-sm text-gray-600">
                      {trackingData.currentLocation.city}, {trackingData.currentLocation.state}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last updated: {formatDate(new Date().toISOString())}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiNavigation className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Next Destination</p>
                    <p className="text-sm text-gray-600">
                      {trackingData.nextLocation.hub}, {trackingData.nextLocation.city}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Expected arrival: {formatDate(new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString())}</p>
                  </div>
                </div>
              </div>
              
              {/* Map Toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="mt-4 flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <FiMap className="w-5 h-5" />
                <span>{showMap ? 'Hide Map' : 'Show Route Map'}</span>
              </button>
              
              {/* Map Preview */}
              {showMap && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-center h-48 bg-gradient-to-r from-blue-100 to-green-100 rounded">
                    <div className="text-center">
                      <FiGlobe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive map view coming soon</p>
                      <p className="text-sm text-gray-500">Real-time GPS tracking available in app</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent Updates */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Updates</h3>
              <div className="space-y-4">
                {trackingData.updates.map((update) => (
                  <div key={update.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{update.message}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-600">{update.location}</span>
                        <span className="text-sm text-gray-500">{formatDate(update.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Info & Actions */}
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-medium">{trackingData.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carrier:</span>
                  <span className="font-medium">{trackingData.carrier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Method:</span>
                  <span className="font-medium">Standard Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Package Weight:</span>
                  <span className="font-medium">{trackingData.packageDetails.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signature Required:</span>
                  <span className="font-medium">Yes</span>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{trackingData.shippingAddress.name}</p>
                <p className="text-sm text-gray-600">{trackingData.shippingAddress.address}</p>
                <p className="text-sm text-gray-600">
                  {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zipCode}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                  <FiPhone className="w-4 h-4" />
                  <span>{trackingData.shippingAddress.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open(trackingData.carrier.trackingUrl, '_blank')}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiGlobe className="w-5 h-5" />
                  <span>Track on Carrier Website</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>Print Shipping Label</span>
                </button>
                
               
              </div>
              
              {/* Contact Support */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Need help with your delivery?</p>
                <button
                  onClick={() => window.location.href = 'mailto:support@ecommerce.com'}
                  className="w-full text-center text-green-600 hover:text-green-700 font-medium"
                >
                  Contact Support
                </button>
              </div>
            </div>
            
            {/* Delivery Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-2">Delivery Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep phone available for delivery calls</li>
                <li>• Ensure someone is available at the address</li>
                <li>• Have ID ready for signature verification</li>
                <li>• Check package condition before accepting</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => fetchTrackingData(true)}
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
        >
          <FiRefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default OrderTrackingPage;