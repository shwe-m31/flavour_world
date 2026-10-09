import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const paymentService = {
  createRazorpayOrder: async (orderId, token) => {
    const res = await axios.post(
      `${API_BASE}/api/payments/razorpay/create`,
      { orderId: Number(orderId) },
      { ...getHeaders(token), timeout: 15000 }
    );
    return res;
  },

  verifyPayment: async (paymentDetails, token) => {
    const res = await axios.post(
      `${API_BASE}/api/payments/razorpay/verify`,
      paymentDetails,
      { ...getHeaders(token), timeout: 15000 }
    );
    return res;
  }
};

export default paymentService;
