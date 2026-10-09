import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const orderService = {
  createOrder: async (orderData, token) => {
    const res = await axios.post(`${API_BASE}/api/orders`, orderData, { ...getHeaders(token), timeout: 15000 });
    return res;
  },

  getOrderDetails: async (orderId, token) => {
    const res = await axios.get(`${API_BASE}/api/orders/${orderId}`, { ...getHeaders(token), timeout: 15000 });
    return res;
  },

  getOrders: async (token) => {
    const res = await axios.get(`${API_BASE}/api/orders`, { ...getHeaders(token), timeout: 15000 });
    return res;
  }
};

export default orderService;
