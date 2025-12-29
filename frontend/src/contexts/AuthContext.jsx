import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (username, password) => {
    try {
      const response = await authAPI.signin(username, password);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  };

  const signup = async (data) => {
    try {
      await authAPI.signup(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng ký thất bại' 
      };
    }
  };

  const signout = async () => {
    try {
      await authAPI.signout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN');
  };

  const isSeller = () => {
    return user?.roles?.includes('ROLE_SELLER');
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    signout,
    checkAuth,
    isAdmin,
    isSeller,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

