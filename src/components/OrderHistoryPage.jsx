import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock,
  FiEye,
  FiDownload,
  FiRepeat,
  FiShoppingBag,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiChevronRight,
  FiAlertCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderHistoryPage = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const navigate = useNavigate();

  // Fetch orders (simulated)
  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate dynamic orders
      const mockOrders = Array.from({ length: 8 }, (_, i) => {
        const orderDate = new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000);
        const statuses = ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const total = Math.floor(Math.random() * 50000) + 1999;
        
        return {
          id: `ORD-${Date.now().toString().slice(-8)}${i}`,
          orderNumber: `ORD-${Date.now().toString().slice(-8)}${i}`,
          date: orderDate.toISOString(),
          status,
          statusText: status.replace('_', ' ').toUpperCase(),
          items: Math.floor(Math.random() * 5) + 1,
          total,
          deliveryDate: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          products: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
            id: `prod-${i}-${j}`,
            name: `Product ${i + 1}${j + 1}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(total / 3),
            image: `https://picsum.photos/100/100?random=${i}${j}`
          }))
        };
      });
      
      // Apply filters
      let filtered = mockOrders;
      
      if (filter !== 'all') {
        filtered = filtered.filter(order => order.status === filter);
      }
      
      if (searchTerm) {
        filtered = filtered.filter(order => 
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate >= start && orderDate <= end;
        });
      }
      
      setOrders(filtered);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, dateRange]);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle className="w-4 h-4" />;
      case 'in_transit': return <FiTruck className="w-4 h-4" />;
      case 'shipped': return <FiPackage className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleReorder = async (order) => {
    try {
      // Add items to cart
      localStorage.setItem('cart_items', JSON.stringify(order.products));
      toast.success('Items added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to reorder');
    }
  };

  const handleDownloadInvoice = (orderId) => {
    toast.info('Invoice download started');
    // In real app, this would generate and download PDF
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">Track and manage all your orders</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiFilter className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['all', 'confirmed', 'processing', 'shipped', 'in_transit', 'delivered'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType === 'all' ? 'All Orders' : filterType.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="border-b px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.statusText}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        <FiCalendar className="w-3 h-3 inline mr-1" />
                        Placed on {formatDate(order.date)} • {order.items} item{order.items > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span className="text-xl font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Order Products */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {product.quantity} × ₹{product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">₹{(product.quantity * product.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/track-order/${order.orderNumber}`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiTruck className="w-4 h-4" />
                      <span>Track Order</span>
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${order.orderNumber}`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiRepeat className="w-4 h-4" />
                      <span>Reorder</span>
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                <FiPackage className="w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <FiShoppingBag className="w-5 h-5 inline mr-2" />
                Start Shopping
              </button>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {orders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50">
                Previous
              </button>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={`px-3 py-2 rounded ${
                    num === 1
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;