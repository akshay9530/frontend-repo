import React, { useState, useEffect } from 'react';
import { FiSave, FiUpload, FiGlobe, FiCreditCard, FiTruck, FiMail, FiShield } from 'react-icons/fi';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'E-Commerce Store',
    siteLogo: '',
    siteFavicon: '',
    contactEmail: 'support@example.com',
    contactPhone: '+91 1234567890',
    address: '123 Main Street, City, State 12345',
    
    // Payment Settings
    stripeEnabled: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    razorpayEnabled: true,
    razorpayKeyId: '',
    razorpayKeySecret: '',
    codEnabled: true,
    upiEnabled: true,
    
    // Shipping Settings
    freeShippingThreshold: 999,
    standardShippingCost: 49,
    expressShippingCost: 149,
    overnightShippingCost: 299,
    shippingZones: [
      { name: 'Metro Cities', cost: 49, deliveryDays: '3-5' },
      { name: 'Tier 2 Cities', cost: 79, deliveryDays: '5-7' },
      { name: 'Rest of India', cost: 99, deliveryDays: '7-10' }
    ],
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFrom: 'noreply@example.com',
    orderConfirmationEmail: true,
    shippingUpdateEmail: true,
    newsletterSubscription: true,
    
    // Security Settings
    twoFactorAuth: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    ipWhitelist: [],
    maintenanceMode: false
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleShippingZoneChange = (index, field, value) => {
    const updatedZones = [...settings.shippingZones];
    updatedZones[index] = {
      ...updatedZones[index],
      [field]: value
    };
    setSettings(prev => ({
      ...prev,
      shippingZones: updatedZones
    }));
  };

  const addShippingZone = () => {
    setSettings(prev => ({
      ...prev,
      shippingZones: [
        ...prev.shippingZones,
        { name: '', cost: 0, deliveryDays: '5-7' }
      ]
    }));
  };

  const removeShippingZone = (index) => {
    const updatedZones = settings.shippingZones.filter((_, i) => i !== index);
    setSettings(prev => ({
      ...prev,
      shippingZones: updatedZones
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('Saving...');
    
    try {
      // Save to localStorage (in real app, send to API)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // In real app, upload to server
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings(prev => ({
        ...prev,
        [type]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center space-x-4">
          {saveStatus && (
            <span className={`text-sm ${
              saveStatus.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}>
              {saveStatus}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
          >
            <FiSave className="mr-2" /> Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiGlobe className="inline mr-2" /> General
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiCreditCard className="inline mr-2" /> Payment
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipping'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiTruck className="inline mr-2" /> Shipping
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiMail className="inline mr-2" /> Email
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiShield className="inline mr-2" /> Security
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Site Logo & Favicon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {settings.siteLogo ? (
                      <img 
                        src={settings.siteLogo} 
                        alt="Site Logo" 
                        className="h-16 w-16 object-contain border rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 border rounded flex items-center justify-center">
                        <FiUpload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="logoUpload"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'siteLogo')}
                        className="hidden"
                      />
                      <label
                        htmlFor="logoUpload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Upload Logo
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center space-x-4">
                    {settings.siteFavicon ? (
                      <img 
                        src={settings.siteFavicon} 
                        alt="Favicon" 
                        className="h-16 w-16 object-contain border rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 border rounded flex items-center justify-center">
                        <FiUpload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="faviconUpload"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'siteFavicon')}
                        className="hidden"
                      />
                      <label
                        htmlFor="faviconUpload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Upload Favicon
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Gateways</h3>
              
              <div className="space-y-4">
                {/* Stripe */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="stripeEnabled"
                        checked={settings.stripeEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-900">
                        Stripe Payment Gateway
                      </label>
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Recommended
                    </span>
                  </div>
                  
                  {settings.stripeEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Public Key
                        </label>
                        <input
                          type="text"
                          name="stripePublicKey"
                          value={settings.stripePublicKey}
                          onChange={handleInputChange}
                          placeholder="pk_live_..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          name="stripeSecretKey"
                          value={settings.stripeSecretKey}
                          onChange={handleInputChange}
                          placeholder="sk_live_..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Razorpay */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="razorpayEnabled"
                        checked={settings.razorpayEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-900">
                        Razorpay Payment Gateway
                      </label>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Popular in India
                    </span>
                  </div>
                  
                  {settings.razorpayEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key ID
                        </label>
                        <input
                          type="text"
                          name="razorpayKeyId"
                          value={settings.razorpayKeyId}
                          onChange={handleInputChange}
                          placeholder="rzp_live_..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key Secret
                        </label>
                        <input
                          type="password"
                          name="razorpayKeySecret"
                          value={settings.razorpayKeySecret}
                          onChange={handleInputChange}
                          placeholder="..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* COD & UPI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="codEnabled"
                        checked={settings.codEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-900">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="upiEnabled"
                        checked={settings.upiEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-900">
                        UPI Payments
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Rates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Free shipping for orders above this amount</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Shipping (₹)
                  </label>
                  <input
                    type="number"
                    name="standardShippingCost"
                    value={settings.standardShippingCost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express Shipping (₹)
                  </label>
                  <input
                    type="number"
                    name="expressShippingCost"
                    value={settings.expressShippingCost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Shipping Zones</h3>
                <button
                  onClick={addShippingZone}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Add Zone
                </button>
              </div>
              
              <div className="space-y-4">
                {settings.shippingZones.map((zone, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zone Name
                        </label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => handleShippingZoneChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Cost (₹)
                        </label>
                        <input
                          type="number"
                          value={zone.cost}
                          onChange={(e) => handleShippingZoneChange(index, 'cost', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Days
                        </label>
                        <input
                          type="text"
                          value={zone.deliveryDays}
                          onChange={(e) => handleShippingZoneChange(index, 'deliveryDays', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => removeShippingZone(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove Zone
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={settings.smtpHost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    name="smtpPort"
                    value={settings.smtpPort}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    value={settings.smtpPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    name="emailFrom"
                    value={settings.emailFrom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="orderConfirmationEmail"
                    checked={settings.orderConfirmationEmail}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Send order confirmation emails to customers
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="shippingUpdateEmail"
                    checked={settings.shippingUpdateEmail}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Send shipping update emails
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="newsletterSubscription"
                    checked={settings.newsletterSubscription}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Allow newsletter subscription
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Require 2FA for admin login</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium text-gray-900">Maintenance Mode</div>
                    <div className="text-sm text-gray-500">Take site offline for maintenance</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (Days)
                    </label>
                    <input
                      type="number"
                      name="passwordExpiryDays"
                      value={settings.passwordExpiryDays}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      name="maxLoginAttempts"
                      value={settings.maxLoginAttempts}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      name="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Whitelist (Comma-separated)
                  </label>
                  <textarea
                    value={settings.ipWhitelist.join(', ')}
                    onChange={(e) => {
                      const ips = e.target.value.split(',').map(ip => ip.trim()).filter(ip => ip);
                      setSettings(prev => ({ ...prev, ipWhitelist: ips }));
                    }}
                    rows="3"
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Only allow admin access from these IP addresses
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;