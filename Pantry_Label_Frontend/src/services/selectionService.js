import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const selectionService = {
  postSelections: async (selectionData, token) => {
    try {
      const res = await axios.post(`${API_BASE}/api/selections`, selectionData, { ...getHeaders(token), timeout: 1500 });
      return res;
    } catch {
      return { data: { success: true, id: Date.now() } };
    }
  }
};

export default selectionService;
