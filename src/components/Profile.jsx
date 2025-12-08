import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Header from '../components/Header';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiMapPin,
  FiShoppingBag, FiPackage, FiHeart, FiCreditCard, FiSettings,
  FiLogOut, FiCheck, FiX, FiArrowLeft, FiShield, FiBell,
  FiHome, FiTruck, FiStar, FiShoppingCart, FiPlus, FiTrash2,
  FiEye, FiAlertCircle
} from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteWishlistModal, setShowDeleteWishlistModal] = useState(false);
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/signin');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        // Handle different possible response structures
        const userData = data.data || data.user || data;
        
        if (data.success || userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Set form data from backend response
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address?.street || userData.address || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || 'India'
          });
          
          // Fetch user orders
          fetchUserOrders(token);
          // Fetch wishlist
          fetchWishlist(token);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('Error loading profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Fetch user orders
  const fetchUserOrders = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const ordersData = data.data || data.orders || data;
        if (data.success || ordersData) {
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch wishlist
  const fetchWishlist = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const wishlistData = data.data || data.wishlist || data;
        if (data.success || wishlistData) {
          setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWishlist(wishlist.filter(item => item._id !== itemId));
        setShowDeleteWishlistModal(false);
        setSuccess('Item removed from wishlist');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Error removing item from wishlist');
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        })
      });

      const data = await response.json();
      const updatedUser = data.data || data.user || data;
      
      if (data.success || updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setEditMode(false);
        setShowUpdateSuccessModal(true);
        setTimeout(() => {
          setShowUpdateSuccessModal(false);
        }, 2000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Error updating profile');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.dispatchEvent(new Event('storage'));
    navigate('/signin');
  };

  // Calculate order statistics
  const orderStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order && order.status === 'pending').length,
    completedOrders: orders.filter(order => order && order.status === 'delivered').length,
    cancelledOrders: orders.filter(order => order && order.status === 'cancelled').length,
    totalSpent: orders.reduce((total, order) => total + ((order && order.total) || 0), 0)
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // View order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Add to cart from wishlist
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1
        })
      });

      if (response.ok) {
        setSuccess('Item added to cart');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Error adding item to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navbar />
        <div className="grow flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar />

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-xs sm:max-w-sm shadow-lg">
            <div className="flex items-center">
              <FiCheck className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-700 text-sm sm:text-base">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-xs sm:max-w-sm shadow-lg">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="grow py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors text-sm sm:text-base"
            >
              <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span>Back to Shopping</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar Navigation - Mobile First */}
            <div className="lg:col-span-1">
              {/* Mobile Sidebar Toggle */}
              <div className="lg:hidden mb-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">
                          {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">
                          {user?.firstName || 'User'} {user?.lastName || ''}
                        </h2>
                        <p className="text-xs text-gray-600">{user?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiUser className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">Profile</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiShoppingBag className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">Orders</span>
                      {orderStats.totalOrders > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {orderStats.totalOrders}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiHeart className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                  {/* User Avatar & Basic Info */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {user?.firstName || 'User'} {user?.lastName || ''}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">{user?.email || 'No email'}</p>
                    {user?.role === 'admin' && (
                      <span className="mt-2 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        Admin
                      </span>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Member since {user?.createdAt ? formatDate(user.createdAt) : '2024'}
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiUser className="w-5 h-5 mr-3" />
                      <span className="font-medium">My Profile</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiShoppingBag className="w-5 h-5 mr-3" />
                      <span className="font-medium">My Orders</span>
                      {orderStats.totalOrders > 0 && (
                        <span className="ml-auto bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                          {orderStats.totalOrders}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiMapPin className="w-5 h-5 mr-3" />
                      <span className="font-medium">Addresses</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FiHeart className="w-5 h-5 mr-3" />
                      <span className="font-medium">Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="ml-auto bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                          {wishlist.length}
                        </span>
                      )}
                    </button>

                    <Link
                      to="/cart"
                      className="w-full flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiShoppingCart className="w-5 h-5 mr-3" />
                      <span className="font-medium">My Cart</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full flex items-center px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
                    >
                      <FiLogOut className="w-5 h-5 mr-3" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </nav>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm p-4 sm:p-6 text-white">
                  <h3 className="font-semibold mb-4">Shopping Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Orders</span>
                      <span className="font-bold">{orderStats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Spent</span>
                      <span className="font-bold">₹{orderStats.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Member Since</span>
                      <span className="font-bold">
                        {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your personal information</p>
                    </div>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
                      >
                        <FiEdit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700 text-sm sm:text-base">{formData.email}</span>
                          <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex items-center">
                          <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base mb-3"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                          />
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                          />
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="ZIP Code"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <FiUser className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-medium text-gray-900">Personal Information</h3>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-500">Name:</span>{' '}
                              <span className="font-medium">{user?.firstName || 'Not set'} {user?.lastName || ''}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Email:</span>{' '}
                              <span className="font-medium">{user?.email || 'Not set'}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Phone:</span>{' '}
                              <span className="font-medium">{user?.phone || 'Not provided'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <FiCalendar className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-medium text-gray-900">Account Details</h3>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-500">Member Since:</span>{' '}
                              <span className="font-medium">
                                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Account Status:</span>{' '}
                              <span className="font-medium text-green-600">Active</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">User ID:</span>{' '}
                              <span className="font-mono text-xs">{user?._id?.substring(0, 8) || 'N/A'}...</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {(user?.address?.street || user?.address) && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <FiHome className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-medium text-gray-900">Default Address</h3>
                          </div>
                          <p className="text-sm">{user?.address?.street || user?.address}</p>
                          {(user?.address?.city || user?.address?.state) && (
                            <p className="text-sm text-gray-600 mt-1">
                              {user?.address?.city || ''}{user?.address?.city && user?.address?.state ? ', ' : ''}
                              {user?.address?.state || ''} {user?.address?.zipCode || ''}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Orders</h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage your orders</p>
                    </div>
                    {orders.length > 0 && (
                      <div className="mt-3 sm:mt-0">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span>Pending: {orderStats.pendingOrders}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span>Delivered: {orderStats.completedOrders}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <FiShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto px-4">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                      </p>
                      <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id || order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">Order #{order._id?.substring(0, 8) || order.id?.substring(0, 8) || 'N/A'}</h3>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt || order.date)}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
                              </span>
                              <span className="font-bold text-gray-900">₹{(order.total || 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="text-sm text-gray-600">
                              {(order.items?.length || 0)} items • {order.paymentMethod || 'Cash on Delivery'}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewOrderDetails(order._id || order.id)}
                                className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              >
                                <FiEye className="w-4 h-4 mr-2" />
                                View Details
                              </button>
                              {order.status === 'pending' && (
                                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Addresses</h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your shipping addresses</p>
                    </div>
                    <button className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors w-full sm:w-auto">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add New Address
                    </button>
                  </div>
                  
                  {(user?.address?.street || user?.address) ? (
                    <div className="space-y-4">
                      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <FiHome className="w-5 h-5 text-green-600 mr-2" />
                            <div>
                              <h3 className="font-medium text-gray-900">Home Address</h3>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-700 p-1">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-1">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700">{user.address.street || user.address}</p>
                        {user.address.city && (
                          <p className="text-gray-600 mt-1">
                            {user.address.city}, {user.address.state} {user.address.zipCode}
                          </p>
                        )}
                        <div className="flex items-center mt-3">
                          <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{user.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <FiMapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto px-4">
                        Add your first address for faster checkout and better shopping experience.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Wishlist</h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">Items you've saved for later</p>
                    </div>
                    {wishlist.length > 0 && (
                      <div className="mt-3 sm:mt-0 text-sm text-gray-600">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                      </div>
                    )}
                  </div>
                  
                  {wishlist.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <FiHeart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto px-4">
                        Save items you love for later. They'll appear here!
                      </p>
                      <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <div key={item._id || item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="relative">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'}
                              alt={item.name || 'Product'}
                              className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                            <button
                              onClick={() => {
                                setSelectedWishlistItem(item);
                                setShowDeleteWishlistModal(true);
                              }}
                              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{item.name || 'Product Name'}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                            {item.description || 'No description available'}
                          </p>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-lg font-bold text-gray-900">₹{item.price || 0}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddToCart(item._id || item.productId)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Update Success Modal */}
      {showUpdateSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Updated</h3>
              <p className="text-gray-600 mb-6">Your profile has been updated successfully.</p>
              <button
                onClick={() => setShowUpdateSuccessModal(false)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors w-full"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiLogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Logout Confirmation</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Wishlist Item Modal */}
      {showDeleteWishlistModal && selectedWishlistItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Remove from Wishlist</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove "{selectedWishlistItem.name || 'this item'}" from your wishlist?
              </p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => {
                    setShowDeleteWishlistModal(false);
                    setSelectedWishlistItem(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeFromWishlist(selectedWishlistItem._id || selectedWishlistItem.id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;