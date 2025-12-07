import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Header from '../components/Header';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiMapPin,
  FiShoppingBag, FiPackage, FiHeart, FiCreditCard, FiSettings,
  FiLogOut, FiCheck, FiX, FiArrowLeft, FiShield, FiBell,
  FiHome, FiTruck, FiStar, FiShoppingCart, FiPlus
} from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
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
        console.log('Backend response:', data); // Debug log
        
        // Handle different possible response structures
        const userData = data.data || data.user || data;
        
        if (data.success || userData) {
          setUser(userData);
          // Ensure user data is stored in localStorage for Navbar and other components
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
        console.log('Orders response:', data); // Debug log
        
        // Handle different possible response structures
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
        console.log('Wishlist response:', data); // Debug log
        
        // Handle different possible response structures
        const wishlistData = data.data || data.wishlist || data;
        if (data.success || wishlistData) {
          setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
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
      console.log('Update response:', data); // Debug log
      
      // Handle different possible response structures
      const updatedUser = data.data || data.user || data;
      
      if (data.success || updatedUser) {
        setUser(updatedUser);
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setEditMode(false);
        alert('Profile updated successfully!');
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
    // Trigger storage event to update Navbar
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navbar />
        <div className="grow flex items-center justify-center">
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

      {/* Main Content */}
      <main className="grow py-6 xs:py-8">
        <div className="container mx-auto px-3 xs:px-4">
          {/* Back Button */}
          <div className="mb-4 xs:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
              <span className="text-sm xs:text-base">Back to Shopping</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <FiX className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6 mb-6">
                {/* User Avatar & Basic Info */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-2xl xs:text-3xl font-bold">
                      {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <h2 className="text-lg xs:text-xl font-bold text-gray-900">
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
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
                  >
                    <FiLogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm p-4 xs:p-6 text-white">
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

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl xs:text-2xl font-bold text-gray-900">My Profile</h2>
                      <p className="text-gray-600 mt-1">Manage your personal information</p>
                    </div>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">{formData.email}</span>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-3"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="ZIP Code"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
                  <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
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
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {(order.items?.length || 0)} items
                            </div>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl xs:text-2xl font-bold text-gray-900">My Addresses</h2>
                    <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
                          <button className="text-green-600 hover:text-green-700">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
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
                    <div className="text-center py-12">
                      <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                      <p className="text-gray-600 mb-6">Add your first address for faster checkout</p>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
                  <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                  
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">Save items you love for later</p>
                      <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <div key={item._id || item.id} className="border border-gray-200 rounded-lg p-4">
                          <img
                            src={item.image || 'https://via.placeholder.com/150'}
                            alt={item.name || 'Product'}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-medium text-gray-900 mb-2">{item.name || 'Product Name'}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">₹{item.price || 0}</span>
                            <button className="text-red-500 hover:text-red-600">
                              <FiHeart className="w-5 h-5 fill-current" />
                            </button>
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
    </div>
  );
};

export default Profile;