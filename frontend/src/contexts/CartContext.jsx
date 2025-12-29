import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addProduct(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Không thể thêm vào giỏ hàng' 
      };
    }
  };

  const updateQuantity = async (productId, operation) => {
    try {
      await cartAPI.updateQuantity(productId, operation);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const removeFromCart = async (cartId, productId) => {
    try {
      await cartAPI.deleteProduct(cartId, productId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const getTotalItems = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

