import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  signin: (username, password) => 
    api.post('/auth/signin', { username, password }),
  
  signup: (data) => 
    api.post('/auth/signup', data),
  
  signout: () => 
    api.post('/auth/signout'),
  
  getCurrentUser: () => 
    api.get('/auth/user'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => 
    api.get('/public/products', { params }),
  
  getByCategory: (categoryId, params = {}) => 
    api.get(`/public/${categoryId}/products`, { params }),
  
  searchByKeyword: (keyword, params = {}) => 
    api.get(`/public/products/keyword/${keyword}`, { params }),
  
  create: (categoryId, productData) => 
    api.post(`/admin/categories/${categoryId}/product`, productData),
  
  update: (productId, productData) => 
    api.put(`/admin/products/${productId}`, productData),
  
  delete: (productId) => 
    api.delete(`/admin/products/${productId}`),
  
  updateImage: (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.put(`/products/${productId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => 
    api.get('/public/categories', { params }),
  
  create: (categoryData) => 
    api.post('/public/categories', categoryData),
  
  update: (categoryId, categoryData) => 
    api.put(`/public/categories/${categoryId}`, categoryData),
  
  delete: (categoryId) => 
    api.delete(`/admin/categories/${categoryId}`),
};

// Cart API
export const cartAPI = {
  addProduct: (productId, quantity) => 
    api.post(`/carts/products/${productId}/quantity/${quantity}`),
  
  getCart: () => 
    api.get('/carts/users/cart'),
  
  getAllCarts: () => 
    api.get('/carts'),
  
  updateQuantity: (productId, operation) => 
    api.put(`/cart/products/${productId}/quantity/${operation}`),
  
  deleteProduct: (cartId, productId) => 
    api.delete(`/cart/${cartId}/product/${productId}`),
};

// Address API
export const addressAPI = {
  create: (addressData) => 
    api.post('/addresses', addressData),
  
  getAll: () => 
    api.get('/addresses'),
  
  getById: (addressId) => 
    api.get(`/addresses/${addressId}`),
  
  getUserAddresses: () => 
    api.get('/user/addresses'),
  
  update: (addressId, addressData) => 
    api.put(`/user/addresses/${addressId}`, addressData),
  
  delete: (addressId) => 
    api.delete(`/user/addresses/${addressId}`),
};

// Order API
export const orderAPI = {
  placeOrder: (paymentMethod, orderData) => 
    api.post(`/order/user/payments/${paymentMethod}`, orderData),
};

export default api;

