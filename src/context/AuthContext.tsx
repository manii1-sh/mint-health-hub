import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hospital: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const mockUser: User = {
  id: '1',
  name: 'Dr. Manish Kumar',
  email: 'admin@healthcare.com',
  role: 'Hospital Admin',
  hospital: 'City General Hospital',
  phone: '+91 98765 43210',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hc_token');
    return stored ? mockUser : null;
  });

  const login = async (email: string, password: string) => {
    if (email && password) {
      localStorage.setItem('hc_token', 'mock-jwt-token');
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('hc_token');
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
