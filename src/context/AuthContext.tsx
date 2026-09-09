import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BusinessProfile } from '../types';
import { 
  getCurrentUser, 
  loginUser, 
  registerUser, 
  loginWithGoogle as googleLoginService, 
  logoutUser as logoutService, 
  resetPasswordRequest,
  getUserBusinessProfile,
  saveUserBusinessProfile
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  businessProfile: BusinessProfile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => { success: boolean; message: string };
  saveBusinessProfile: (profile: BusinessProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial active session
    const current = getCurrentUser();
    if (current) {
      setUser(current);
      const profile = getUserBusinessProfile(current.id);
      setBusinessProfile(profile);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await loginUser({ email, password });
    setIsLoading(false);

    if (res.user) {
      setUser(res.user);
      const profile = getUserBusinessProfile(res.user.id);
      setBusinessProfile(profile);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const res = await registerUser({ name, email, password });
    setIsLoading(false);

    if (res.user) {
      setUser(res.user);
      setBusinessProfile(null);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const res = await googleLoginService();
    setUser(res.user);
    const profile = getUserBusinessProfile(res.user.id);
    setBusinessProfile(profile);
    setIsLoading(false);
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setBusinessProfile(null);
  };

  const resetPassword = (email: string) => {
    return resetPasswordRequest(email);
  };

  const saveBusinessProfile = (profile: BusinessProfile) => {
    if (user) {
      saveUserBusinessProfile(user.id, profile);
      setBusinessProfile(profile);
      setUser(prev => prev ? { ...prev, businessName: profile.businessName, hasCompletedOnboarding: true } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        businessProfile,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        saveBusinessProfile
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
