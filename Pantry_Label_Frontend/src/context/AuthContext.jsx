import React, { createContext, useState } from 'react';
import { profileService } from '../services/profileService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('flavour_world_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('flavour_world_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const login = async (userData, jwtToken) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('flavour_world_token', jwtToken);
    localStorage.setItem('flavour_world_user', JSON.stringify(userData));

    try {
      const response = await profileService.getProfile(jwtToken);
      if (response && response.data) {
        const mergedUser = { ...userData, ...response.data };
        setUser(mergedUser);
        localStorage.setItem('flavour_world_user', JSON.stringify(mergedUser));
      }
    } catch {
      // Keep existing session intact if profile fetch fails
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('flavour_world_token');
    localStorage.removeItem('flavour_world_user');
  };

  const updateProfileStatus = (isCompleted, additionalData = {}) => {
    if (user) {
      const updated = { ...user, ...additionalData, profileCompleted: isCompleted };
      setUser(updated);
      localStorage.setItem('flavour_world_user', JSON.stringify(updated));
    }
  };

  const value = {
    token,
    user,
    setUser,
    login,
    logout,
    updateProfileStatus,
    isAuthenticated: Boolean(token && user)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
