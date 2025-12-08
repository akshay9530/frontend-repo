import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiUpload, FiImage } from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subCategory: '',
    brand: '',
    stock: '',
    images: [],
    sizes: [],
    colors: [],
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    discount: 0,
    gender: ''
  });

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'delete', 'success', 'error'
  const [modalMessage, setModalMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  // Static categories and subcategories based on your navbar routes
  const staticCategories = {
    'Clothes': ['Men Clothes', 'Women Clothes'],
    'Shoes': ['Men Sneakers', 'Women Sneakers'],
    'Watches': ['Men Watches', 'Women Watches'],
    'Fragrances': ['Men Fragrance', 'Women Fragrance'],
    'Electronics': ['TV & Home Theater', 'Mobile Phones', 'Earbuds & Headphones'],
    'Brand Stores': ['Nike', 'Puma', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Titan', 'Fossil', 'Casio', 'Calvin Klein', 'Levi\'s', 'H&M']
  };

  const staticBrands = [
    'Nike', 'Puma', 'Adidas', 'Apple', 'Samsung', 'Sony',
    'Titan', 'Fossil', 'Casio', 'Calvin Klein', 'Levi\'s', 'H&M'
  ];

  // Gender options
  const genderOptions = ['Men', 'Women', 'Unisex'];

  useEffect(() => {
    fetchProducts();
    // Initialize categories and brands
    const allCategories = [];
    Object.keys(staticCategories).forEach(mainCat => {
      staticCategories[mainCat].forEach(subCat => {
        allCategories.push(subCat);
      });
    });
    setCategories(allCategories);
    setBrands(staticBrands);
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Products data:', data);
      
      const productsData = data.data || data.products || data;
      
      if (data.success || Array.isArray(productsData)) {
        setProducts(Array.isArray(productsData) ? productsData : []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showModal('error', 'Error', 'Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Modal functions
  const showModal = (type, title, message, callback = null) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalCallback(() => callback);
    setShowConfirmModal(true);
  };

  const hideModal = () => {
    setShowConfirmModal(false);
    setModalType('');
    setModalTitle('');
    setModalMessage('');
    setModalCallback(null);
    setProductToDelete(null);
  };

  const handleConfirm = () => {
    if (modalCallback) {
      modalCallback();
    }
    hideModal();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData({
      ...formData,
      category: category,
      // Auto-set gender based on category
      gender: category.includes('Men') ? 'Men' : 
              category.includes('Women') ? 'Women' : 'Unisex'
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: [...formData.images, ...imageUrls]
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      // Calculate prices
      let price = parseFloat(formData.price);
      let originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : price;
      let discount = parseFloat(formData.discount) || 0;
      
      // Calculate discount if on sale
      if (formData.isOnSale && discount === 0 && originalPrice > price) {
        discount = ((originalPrice - price) / originalPrice) * 100;
      }
      
      // Prepare product data matching backend model
      const productData = {
        name: formData.name,
        description: formData.description,
        price: price,
        originalPrice: originalPrice,
        category: formData.category,
        subCategory: formData.subCategory || '',
        brand: formData.brand,
        stock: parseInt(formData.stock),
        images: formData.images.map(img => ({ 
          url: img, 
          altText: formData.name 
        })),
        sizes: formData.sizes.filter(size => size.trim() !== ''),
        colors: formData.colors.filter(color => color.trim() !== ''),
        features: [], // Add features if needed
        specifications: {}, // Add specs if needed
        rating: 0, // Default rating
        reviews: 0, // Default reviews
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isOnSale: formData.isOnSale || discount > 0,
        discount: discount,
        tags: [formData.category, formData.brand, formData.gender].filter(tag => tag)
      };
      
      console.log('Sending product data:', productData);
      
      const url = showEditModal && selectedProduct 
        ? `http://localhost:5000/api/products/${selectedProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = showEditModal && selectedProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (data.success || data._id) {
        fetchProducts();
        resetForm();
        showEditModal ? setShowEditModal(false) : setShowAddModal(false);
        showModal(
          'success',
          'Success',
          showEditModal ? 'Product updated successfully!' : 'Product added successfully!'
        );
      } else {
        showModal('error', 'Error', data.message || 'Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showModal('error', 'Error', 'Error saving product. Please check console for details.');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || product.price || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      brand: product.brand || '',
      stock: product.stock || '',
      images: product.images?.map(img => img.url) || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isOnSale: product.isOnSale || false,
      discount: product.discount || 0,
      gender: product.tags?.find(tag => ['Men', 'Women', 'Unisex'].includes(tag)) || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    showModal(
      'delete',
      'Confirm Delete',
      'Are you sure you want to delete this product? This action cannot be undone.',
      () => performDelete(productId)
    );
  };

  const performDelete = async (productId) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        showModal('success', 'Success', 'Product deleted successfully!');
      } else {
        showModal('error', 'Error', data.message || 'Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showModal('error', 'Error', 'Error deleting product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      subCategory: '',
      brand: '',
      stock: '',
      images: [],
      sizes: [],
      colors: [],
      isFeatured: false,
      isNewArrival: false,
      isOnSale: false,
      discount: 0,
      gender: ''
    });
    setSelectedProduct(null);
    setImagePreview('');
  };

  // Get modal icon based on type
  const getModalIcon = () => {
    switch(modalType) {
      case 'delete':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiTrash2 className="h-6 w-6 text-red-600" />
          </div>
        );
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Get button color based on modal type
  const getButtonColor = () => {
    switch(modalType) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Fixed Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {getModalIcon()}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {modalTitle}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {modalMessage}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
              {modalType === 'delete' ? (
                <>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={hideModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm ${getButtonColor()}`}
                    onClick={handleConfirm}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm ${getButtonColor()}`}
                  onClick={hideModal}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Product Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          <FiPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate max-w-[60%]">
                    {product.name}
                  </h3>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 sm:p-0"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 sm:p-0"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
                
                {product.images && product.images[0] && (
                  <div className="mb-3 sm:mb-4">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                  <div>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                          ₹{product.originalPrice || product.price}
                        </span>
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-bold text-red-600">
                          ({product.discount}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' : 
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    Stock: {product.stock}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {product.isFeatured && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      Featured
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      New
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Sale
                    </span>
                  )}
                  {product.tags?.includes('Men') && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Men
                    </span>
                  )}
                  {product.tags?.includes('Women') && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-pink-100 text-pink-800 rounded-full">
                      Women
                    </span>
                  )}
                </div>
                
                <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                  <p className="truncate">Category: {product.category}</p>
                  <p className="truncate">Brand: {product.brand}</p>
                  {product.subCategory && <p className="truncate">Sub: {product.subCategory}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-40 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-2 sm:mx-4 my-4 max-h-[95vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Add New Product</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., Nike Air Max"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select Category</option>
                    <optgroup label="Clothes">
                      <option value="Men Clothes">Men Clothes</option>
                      <option value="Women Clothes">Women Clothes</option>
                    </optgroup>
                    <optgroup label="Shoes">
                      <option value="Men Sneakers">Men Sneakers</option>
                      <option value="Women Sneakers">Women Sneakers</option>
                    </optgroup>
                    <optgroup label="Watches">
                      <option value="Men Watches">Men Watches</option>
                      <option value="Women Watches">Women Watches</option>
                    </optgroup>
                    <optgroup label="Fragrances">
                      <option value="Men Fragrances">Men Fragrances</option>
                      <option value="Women Fragrances">Women Fragrances</option>
                    </optgroup>
                    <optgroup label="Electronics">
                      <option value="TV & Home Theater">TV & Home Theater</option>
                      <option value="Mobile Phones">Mobile Phones</option>
                      <option value="Earbuds & Headphones">Earbuds & Headphones</option>
                    </optgroup>
                    <optgroup label="Brand Stores">
                      {staticBrands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand} Store
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select Brand</option>
                    {staticBrands.map((brand, index) => (
                      <option key={index} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Current Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="1999"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="2499"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="20"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="2"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Describe the product features, materials, etc."
                />
              </div>
              
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => {
                      const sizes = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      setFormData({ ...formData, sizes });
                    }}
                    placeholder="S, M, L, XL, 38, 40, 42"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => {
                      const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                      setFormData({ ...formData, colors });
                    }}
                    placeholder="Red, Blue, Black, White"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-2 sm:p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <FiUpload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm text-gray-600 text-center">Click to upload images</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">PNG, JPG, GIF up to 5MB</span>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 sm:p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700">Featured Product</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700">New Arrival</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOnSale"
                    checked={formData.isOnSale}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700">On Sale</label>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors order-1 sm:order-2"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-40 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-2 sm:mx-4 my-4 max-h-[95vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Edit Product</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select Category</option>
                    <optgroup label="Clothes">
                      <option value="Men Clothes">Men Clothes</option>
                      <option value="Women Clothes">Women Clothes</option>
                    </optgroup>
                    <optgroup label="Shoes">
                      <option value="Men Sneakers">Men Sneakers</option>
                      <option value="Women Sneakers">Women Sneakers</option>
                    </optgroup>
                    <optgroup label="Watches">
                      <option value="Men Watches">Men Watches</option>
                      <option value="Women Watches">Women Watches</option>
                    </optgroup>
                    <optgroup label="Fragrances">
                      <option value="Men Fragrances">Men Fragrances</option>
                      <option value="Women Fragrances">Women Fragrances</option>
                    </optgroup>
                    <optgroup label="Electronics">
                      <option value="TV & Home Theater">TV & Home Theater</option>
                      <option value="Mobile Phones">Mobile Phones</option>
                      <option value="Earbuds & Headphones">Earbuds & Headphones</option>
                    </optgroup>
                    <optgroup label="Brand Stores">
                      {staticBrands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand} Store
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select Brand</option>
                    {staticBrands.map((brand, index) => (
                      <option key={index} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Current Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="2"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => {
                      const sizes = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      setFormData({ ...formData, sizes });
                    }}
                    placeholder="S, M, L, XL"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => {
                      const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                      setFormData({ ...formData, colors });
                    }}
                    placeholder="Red, Blue, Green"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-2 sm:p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <FiUpload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm text-gray-600">Click to upload more images</span>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 sm:p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700">Featured Product</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700">New Arrival</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOnSale"
                    checked={formData.isOnSale}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-gray-700">On Sale</label>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors order-1 sm:order-2"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;