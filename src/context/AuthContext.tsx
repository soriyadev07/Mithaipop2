import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Address } from '../types';
import { INITIAL_USERS } from '../data/mockStoreData';
import { sounds } from '../utils/audio';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  users: User[];
  currentView: 'shop' | 'login' | 'account' | 'admin';
  setCurrentView: (view: 'shop' | 'login' | 'account' | 'admin') => void;
  activeAccountTab: string;
  setActiveAccountTab: (tab: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authViewMode: 'login' | 'register' | 'forgot';
  setAuthViewMode: (mode: 'login' | 'register' | 'forgot') => void;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginAdmin: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: User; error?: string }>;
  registerCustomer: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string; error?: string }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  addSavedAddress: (address: Omit<Address, 'id'>) => Address;
  updateSavedAddress: (id: string, address: Partial<Address>) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  switchUserQuick: (userIndex: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stored users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_users');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  // Current session user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_current_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });

  const isAdmin = !!(currentUser && (
    currentUser.role === 'ADMIN' || 
    currentUser.role === 'SUPER_ADMIN' || 
    currentUser.role === 'OPERATIONS' || 
    currentUser.role === 'INVENTORY_MANAGER' || 
    currentUser.role === 'SUPPORT_ADMIN'
  ));

  // Views & Routing: 'shop' | 'login' | 'account' | 'admin'
  const [currentView, setCurrentViewInternal] = useState<'shop' | 'login' | 'account' | 'admin'>('shop');
  const [activeAccountTab, setActiveAccountTab] = useState<string>('overview');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Auth modal view mode: 'login' | 'register' | 'forgot'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authViewMode, setAuthViewMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mithai_pop_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('mithai_pop_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('mithai_pop_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Sync hash and pathname routing with views
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (path === '/admin/login' || path.startsWith('/admin/login') || hash.startsWith('#admin/login')) {
        if (currentUser && currentUser.role !== 'CUSTOMER') {
          setCurrentViewInternal('admin');
          window.location.hash = '#admin';
        } else {
          setCurrentViewInternal('login');
        }
      } else if (path === '/admin' || path.startsWith('/admin') || hash.startsWith('#admin')) {
        if (!currentUser || currentUser.role === 'CUSTOMER') {
          sounds.playError();
          setCurrentViewInternal('login');
          window.location.hash = '#admin/login';
        } else {
          setCurrentViewInternal('admin');
          // Support /admin/orders or #admin-orders or #admin/orders
          let sub = '';
          if (hash.startsWith('#admin-')) sub = hash.replace('#admin-', '');
          else if (hash.startsWith('#admin/')) sub = hash.replace('#admin/', '');
          else if (path.startsWith('/admin/')) sub = path.replace('/admin/', '');

          if (sub && sub !== 'login') {
            setActiveAdminTab(sub);
          }
        }
      } else if (path === '/login' || path.startsWith('/login') || path === '/signup' || hash.startsWith('#login') || hash.startsWith('#signup') || hash.startsWith('#auth')) {
        if (currentUser) {
          if (currentUser.role === 'CUSTOMER') {
            setCurrentViewInternal('account');
            window.location.hash = '#account';
          } else {
            setCurrentViewInternal('admin');
            window.location.hash = '#admin';
          }
        } else {
          setCurrentViewInternal('login');
          if (hash.startsWith('#signup') || path === '/signup') {
            setAuthViewMode('register');
          } else {
            setAuthViewMode('login');
          }
        }
      } else if (path === '/account' || hash.startsWith('#account') || hash.startsWith('#orders') || hash.startsWith('#preorders')) {
        if (!currentUser) {
          setCurrentViewInternal('login');
          window.location.hash = '#login';
        } else if (currentUser.role !== 'CUSTOMER') {
          // Admin redirected to admin
          setCurrentViewInternal('admin');
          window.location.hash = '#admin';
        } else {
          setCurrentViewInternal('account');
          if (hash.startsWith('#orders/')) {
            const orderId = hash.split('/')[1]?.toUpperCase();
            if (orderId) setSelectedOrderId(orderId);
            setActiveAccountTab('orders');
          } else if (hash.startsWith('#account-')) {
            setActiveAccountTab(hash.replace('#account-', ''));
          }
        }
      } else if (hash === '#shop' || hash === '#menu' || hash === '#hero' || hash === '' || hash.startsWith('#build-your-pop') || hash.startsWith('#reviews') || hash.startsWith('#story') || hash.startsWith('#cities')) {
        setCurrentViewInternal('shop');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    handleHashChange(); // Run on mount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [currentUser]);

  // Setter with hash synchronization
  const setCurrentView = (view: 'shop' | 'login' | 'account' | 'admin') => {
    sounds.playClick();
    if (view === 'admin') {
      if (!currentUser || currentUser.role === 'CUSTOMER') {
        setCurrentViewInternal('login');
        window.location.hash = '#admin/login';
        return;
      }
      setCurrentViewInternal('admin');
      window.location.hash = '#admin';
    } else if (view === 'account') {
      if (!currentUser) {
        setCurrentViewInternal('login');
        window.location.hash = '#login';
        return;
      }
      if (currentUser.role !== 'CUSTOMER') {
        setCurrentViewInternal('admin');
        window.location.hash = '#admin';
        return;
      }
      setCurrentViewInternal('account');
      window.location.hash = '#account';
    } else if (view === 'login') {
      setCurrentViewInternal('login');
      // If previous hash was admin/login keep it, else default to customer #login
      if (window.location.hash.toLowerCase().startsWith('#admin/login')) {
        window.location.hash = '#admin/login';
      } else {
        window.location.hash = '#login';
      }
    } else {
      setCurrentViewInternal('shop');
      window.location.hash = '#';
    }
  };

  // Dedicated Admin Login handler
  const loginAdmin = async (email: string, password: string, rememberMe: boolean = true): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Artificial realistic security delay
    await new Promise((res) => setTimeout(res, 250));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check credentials against exact prototype admin credentials
    if (cleanEmail === 'admin123@mail.com' && cleanPass === 'admin123@mail.com') {
      const adminUser: User = {
        id: 'user_admin_01',
        fullName: 'Admin Staff',
        email: 'admin123@mail.com',
        phone: '+91 98100 99881',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        createdAt: '2024-01-01',
        notes: ['Head of Operations & Brand Commerce', 'Store Administrator']
      };

      setUsers((prev) => [adminUser, ...prev.filter((u) => u.email.toLowerCase() !== 'admin123@mail.com')]);
      setCurrentUser(adminUser);

      if (rememberMe) {
        try {
          localStorage.setItem('mithai_pop_current_user', JSON.stringify(adminUser));
        } catch {
          // ignore
        }
      }

      sounds.playCelebration();
      setCurrentViewInternal('admin');
      window.location.hash = '#admin';

      return { success: true, user: adminUser };
    }

    sounds.playError();
    return { success: false, error: 'Email or password is incorrect.' };
  };

  // Customer Login handler
  const login = async (emailOrPhone: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Artificial slight realistic delay
    await new Promise((res) => setTimeout(res, 350));

    const cleanInput = (emailOrPhone || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // If prototype admin credentials entered on customer form, authenticate admin
    if (cleanInput === 'admin123@mail.com') {
      if (cleanPass === 'admin123@mail.com') {
        return loginAdmin('admin123@mail.com', 'admin123@mail.com', true);
      } else {
        sounds.playError();
        return { success: false, error: 'Email or password is incorrect.' };
      }
    }

    // Check in users list or initial demo users
    const matched = users.find((u) => {
      const emailMatch = u.email.toLowerCase() === cleanInput;
      const phoneMatch = u.phone.replace(/[^0-9]/g, '').includes(cleanInput.replace(/[^0-9]/g, '')) && cleanInput.length >= 6;
      return emailMatch || phoneMatch;
    });

    if (!matched) {
      sounds.playError();
      return { success: false, error: 'Email or password is incorrect.' };
    }

    // Check customer password
    if (cleanPass.length < 4) {
      sounds.playError();
      return { success: false, error: 'Email or password is incorrect.' };
    }

    // Success
    sounds.playCelebration();
    setCurrentUser(matched);

    if (matched.role === 'ADMIN' || matched.role === 'SUPER_ADMIN') {
      setCurrentViewInternal('admin');
      window.location.hash = '#admin';
    } else {
      setCurrentViewInternal('account');
      window.location.hash = '#account';
    }

    return { success: true, user: matched };
  };

  // Register Customer handler (Strictly CUSTOMER role only)
  const registerCustomer = async (data: { fullName: string; email: string; phone: string; password: string }): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise((res) => setTimeout(res, 500));

    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.fullName.trim() || !data.phone.trim() || !data.password) {
      sounds.playError();
      return { success: false, error: 'All fields are required.' };
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      sounds.playError();
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user_cust_${Date.now()}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      role: 'CUSTOMER', // Hardcoded CUSTOMER role
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}&backgroundColor=7A0F29,52091B,F2C76E`,
      dateOfBirth: '',
      gender: '',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      totalOrders: 0,
      notes: ['New registered customer'],
      addresses: []
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    sounds.playCelebration();

    setCurrentViewInternal('account');
    window.location.hash = '#account';

    return { success: true, user: newUser };
  };

  // Forgot password
  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 400));
    sounds.playCanPop();
    return { success: true, message: 'Check your inbox for a password reset link.' };
  };

  // Update profile
  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    const updated: User = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    sounds.playCanPop();
    return { success: true, message: 'Profile updated successfully.' };
  };

  // Change password
  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    await new Promise((res) => setTimeout(res, 400));
    if (newPass.length < 6) {
      sounds.playError();
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    sounds.playCelebration();
    return { success: true, message: 'Password changed successfully.' };
  };

  // Address management
  const addSavedAddress = (address: Omit<Address, 'id'>): Address => {
    const newAddr: Address = {
      ...address,
      id: `addr_${Date.now()}`
    };

    if (!currentUser) return newAddr;

    const existingAddresses = currentUser.addresses || [];
    // If set as default or first address, update others
    const updatedList = (address.isDefault || existingAddresses.length === 0)
      ? existingAddresses.map((a) => ({ ...a, isDefault: false })).concat({ ...newAddr, isDefault: true })
      : existingAddresses.concat(newAddr);

    updateProfile({ addresses: updatedList });
    return newAddr;
  };

  const updateSavedAddress = (id: string, addressData: Partial<Address>) => {
    if (!currentUser) return;
    const existingAddresses = currentUser.addresses || [];
    let updatedList = existingAddresses.map((a) => {
      if (a.id === id) {
        return { ...a, ...addressData };
      }
      // If updating to default, unset others
      if (addressData.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    updateProfile({ addresses: updatedList });
  };

  const deleteSavedAddress = (id: string) => {
    if (!currentUser) return;
    const existingAddresses = currentUser.addresses || [];
    const updatedList = existingAddresses.filter((a) => a.id !== id);
    updateProfile({ addresses: updatedList });
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const existingAddresses = currentUser.addresses || [];
    const updatedList = existingAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    updateProfile({ addresses: updatedList });
  };

  // Logout
  const logout = () => {
    sounds.playClick();
    const wasAdmin = isAdmin || currentView === 'admin' || (currentUser && currentUser.role !== 'CUSTOMER');
    setCurrentUser(null);
    try {
      localStorage.removeItem('mithai_pop_current_user');
    } catch {}

    if (wasAdmin) {
      setCurrentViewInternal('login');
      window.location.hash = '#admin/login';
    } else {
      setCurrentViewInternal('shop');
      window.location.hash = '#';
    }
  };

  // Quick switch for convenient testing
  const switchUserQuick = (userIndex: number) => {
    const target = INITIAL_USERS[userIndex] || INITIAL_USERS[0];
    setCurrentUser(target);
    sounds.playCanPop();
    if (target.role === 'ADMIN') {
      setCurrentViewInternal('admin');
      window.location.hash = '#admin';
    } else {
      setCurrentViewInternal('account');
      window.location.hash = '#account';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser ? currentUser.role : null,
        isAdmin,
        users,
        currentView,
        setCurrentView,
        activeAccountTab,
        setActiveAccountTab,
        activeAdminTab,
        setActiveAdminTab,
        selectedOrderId,
        setSelectedOrderId,
        authModalOpen,
        setAuthModalOpen,
        authViewMode,
        setAuthViewMode,
        login,
        loginAdmin,
        registerCustomer,
        logout,
        resetPassword,
        updateProfile,
        changePassword,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        switchUserQuick,
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
