// Utility functions for tracking functionality
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}${random}`.slice(0, 15);
};

export const formatTrackingStatus = (status) => {
  const statusMap = {
    'pending': { text: 'Pending', color: 'gray', icon: '⏳' },
    'processing': { text: 'Processing', color: 'yellow', icon: '⚙️' },
    'shipped': { text: 'Shipped', color: 'blue', icon: '🚚' },
    'in_transit': { text: 'In Transit', color: 'blue', icon: '📦' },
    'out_for_delivery': { text: 'Out for Delivery', color: 'orange', icon: '🏍️' },
    'delivered': { text: 'Delivered', color: 'green', icon: '✅' },
    'delayed': { text: 'Delayed', color: 'red', icon: '⚠️' },
    'cancelled': { text: 'Cancelled', color: 'red', icon: '❌' }
  };
  
  return statusMap[status] || { text: 'Unknown', color: 'gray', icon: '❓' };
};

export const calculateDeliveryProgress = (timeline) => {
  if (!timeline || timeline.length === 0) return 0;
  
  const completedSteps = timeline.filter(step => step.completed).length;
  const totalSteps = timeline.length;
  
  return Math.round((completedSteps / totalSteps) * 100);
};

export const getEstimatedDeliveryDate = (shippedDate, shippingMethod) => {
  const date = new Date(shippedDate);
  let daysToAdd = 7; // Standard shipping
  
  if (shippingMethod === 'express') daysToAdd = 3;
  if (shippingMethod === 'overnight') daysToAdd = 1;
  
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

export const validateOrderNumber = (orderNumber) => {
  const orderRegex = /^ORD-\d{10,}$/;
  return orderRegex.test(orderNumber);
};

// Mock API functions (replace with real API calls)
export const mockTrackingAPI = {
  async getTrackingInfo(orderNumber) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data based on order number
    const mockData = {
      // ... (same as mockTrackingData in OrderTrackingPage)
    };
    
    return mockData[orderNumber] || null;
  },
  
  async subscribeToUpdates(orderNumber, callback) {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const update = {
        timestamp: new Date().toISOString(),
        status: 'location_updated',
        message: 'Package location updated',
        location: 'In transit'
      };
      callback(update);
    }, 30000);
    
    return () => clearInterval(interval);
  }
};