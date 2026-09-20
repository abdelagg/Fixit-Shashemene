import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NotificationItem } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  login: (email: string, role?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  switchDemoUser: (userType: 'customer' | 'worker' | 'admin' | 'worker2') => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('fixit_user');
    const savedToken = localStorage.getItem('fixit_token');

    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setToken(savedToken);
      } catch (e) {
        console.error('Error parsing stored auth', e);
        fallbackToDefaultCustomer();
      }
    } else {
      fallbackToDefaultCustomer();
    }
    setLoading(false);
  }, []);

  const fallbackToDefaultCustomer = async () => {
    try {
      const res = await api.login('customer@test.com', 'customer');
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('fixit_user', JSON.stringify(res.user));
      localStorage.setItem('fixit_token', res.token);
    } catch (err) {
      console.warn('Initial default login fallback failed', err);
    }
  };

  // Poll notifications
  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications(user.id);
      setNotifications(res.notifications || []);
    } catch (e) {
      console.warn('Could not fetch notifications', e);
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const markNotificationsAsRead = async () => {
    if (!user) return;
    try {
      await api.markNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email: string, role?: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, role);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('fixit_user', JSON.stringify(res.user));
      localStorage.setItem('fixit_token', res.token);
      await refreshNotifications();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('fixit_user', JSON.stringify(res.user));
      localStorage.setItem('fixit_token', res.token);
      await refreshNotifications();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fixit_user');
    localStorage.removeItem('fixit_token');
    setNotifications([]);
  };

  const switchDemoUser = async (userType: 'customer' | 'worker' | 'admin' | 'worker2') => {
    let email = 'customer@test.com';
    let role = 'customer';
    if (userType === 'worker') {
      email = 'worker@test.com'; // Ahmed Hassan (Plumber)
      role = 'worker';
    } else if (userType === 'worker2') {
      email = 'bekele@test.com'; // Bekele Tadesse (Electrician)
      role = 'worker';
    } else if (userType === 'admin') {
      email = 'admin@test.com'; // Aster Mengistu (Admin)
      role = 'admin';
    }
    await login(email, role);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notifications,
        unreadCount,
        login,
        register,
        logout,
        switchDemoUser,
        refreshNotifications,
        markNotificationsAsRead
      }}
    >
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
