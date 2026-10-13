import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const addressService = {
  getAddresses: async (token) => {
    try {
      if (token) {
        const res = await axios.get(`${API_BASE}/api/addresses`, { ...getHeaders(token), timeout: 10000 });
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res;
      }
    } catch {
      // Backend unavailable or error
    }
    // Check localStorage saved addresses for guest / offline fallback
    try {
      const stored = localStorage.getItem('user_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { data: parsed };
        }
      }
    } catch {}
    return { data: [] };
  },

  saveAddress: async (addressData, token) => {
    try {
      if (token) {
        const res = await axios.post(`${API_BASE}/api/addresses`, addressData, { ...getHeaders(token), timeout: 10000 });
        if (res.data) return res;
      }
    } catch {
      // Backend unavailable or error
    }
    const newAddr = { ...addressData, id: Date.now() };
    try {
      const stored = JSON.parse(localStorage.getItem('user_addresses') || '[]');
      stored.push(newAddr);
      localStorage.setItem('user_addresses', JSON.stringify(stored));
    } catch {}
    return { data: newAddr };
  }
};

export default addressService;
