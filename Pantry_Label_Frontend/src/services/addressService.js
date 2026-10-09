import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const DEFAULT_ADDRESSES = [
  {
    id: 1,
    name: 'Priya Kumar',
    phone: '+91 98401 23456',
    flatHouseNo: 'Flat 4B, Shanthi Apts',
    areaStreetName: '14th Cross, Gandhi Nagar, Adyar',
    landmark: 'Near Adyar Bakery',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020'
  }
];

export const addressService = {
  getAddresses: async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/api/addresses`, { ...getHeaders(token), timeout: 10000 });
      if (res.data && res.data.length > 0) return res;
    } catch {
      // Fallback
    }
    return { data: DEFAULT_ADDRESSES };
  },

  saveAddress: async (addressData, token) => {
    try {
      const res = await axios.post(`${API_BASE}/api/addresses`, addressData, { ...getHeaders(token), timeout: 10000 });
      return res;
    } catch {
      const newAddr = { ...addressData, id: Date.now() };
      return { data: newAddr };
    }
  }
};

export default addressService;
