import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getRegisteredUsers = () => [];
export const saveRegisteredUser = (user) => user;
export const updateRegisteredUserProfile = (identifier, profileData) => profileData;

export const authService = {
  getRegisteredUsers,
  saveRegisteredUser,
  updateRegisteredUserProfile,

  sendOtp: async (email, isLogin = false) => {
    const trimmedEmail = email.trim().toLowerCase();
    const purpose = isLogin ? 'LOGIN' : 'REGISTER';
    const res = await axios.post(
      `${API_BASE}/api/auth/send-otp`,
      { email: trimmedEmail, purpose },
      { timeout: 10000 }
    );
    return res;
  },

  verifyOtp: async (email, otp, isLogin = false) => {
    const trimmedEmail = email.trim().toLowerCase();
    const purpose = isLogin ? 'LOGIN' : 'REGISTER';
    const res = await axios.post(
      `${API_BASE}/api/auth/verify-otp`,
      { email: trimmedEmail, otp: otp.trim(), purpose },
      { timeout: 10000 }
    );
    return res;
  },

  registerWithUsername: async (username, password) => {
    const trimmedUsername = username.trim();
    const res = await axios.post(
      `${API_BASE}/api/auth/register`,
      { username: trimmedUsername, password },
      { timeout: 10000 }
    );
    return res;
  },

  loginWithUsername: async (username, password) => {
    const trimmedUsername = username.trim();
    const res = await axios.post(
      `${API_BASE}/api/auth/login`,
      { username: trimmedUsername, password },
      { timeout: 10000 }
    );
    return res;
  }
};

export default authService;
