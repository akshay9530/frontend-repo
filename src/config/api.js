// src/config/api.js
export const API_BASE_URL = 'http://localhost:5000/api';

export const endpoints = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_ME: '/auth/me',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category) => `/products/category/${category}`,
  PRODUCTS_BY_BRAND: (brand) => `/products/brand/${brand}`,
  SEARCH_PRODUCTS: '/products/search',
  FEATURED_PRODUCTS: '/products/featured',
  NEW_ARRIVALS: '/products/new-arrivals',
  SALE_PRODUCTS: '/products/sale',
  
  // Categories
  CATEGORIES: '/categories',
  MAIN_CATEGORIES: '/categories/main',
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_NUMBER: (orderNumber) => `/orders/order-number/${orderNumber}`,
  USER_ORDERS: (userId) => `/orders/user/${userId}`,
};