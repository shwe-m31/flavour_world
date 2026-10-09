import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const profileService = {
  getProfile: async (token) => {
    const res = await axios.get(`${API_BASE}/api/profile`, { ...getHeaders(token), timeout: 10000 });
    return res;
  },

  saveProfile: async (profileData, token) => {
    const res = await axios.post(`${API_BASE}/api/profile`, profileData, { ...getHeaders(token), timeout: 10000 });
    return res;
  },

  updateProfile: async (profileData, token) => {
    const res = await axios.put(`${API_BASE}/api/profile`, profileData, { ...getHeaders(token), timeout: 10000 });
    return res;
  }
};

export default profileService;
