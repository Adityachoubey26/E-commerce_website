'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';
import { User, Address } from '../../../shared/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addAddress: (address: Omit<Address, '_id'>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const { data } = await API.get('/auth/profile');
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data } = await API.post('/auth/signup', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: 'Signup failed. Invalid response.' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const addAddress = async (address: Omit<Address, '_id'>) => {
    try {
      const { data } = await API.post('/auth/addresses', address);
      if (data.success) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add address:', error);
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { data } = await API.delete(`/auth/addresses/${id}`);
      if (data.success) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete address:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, addAddress, deleteAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
