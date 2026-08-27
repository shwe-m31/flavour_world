import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const productService = {
  getStates: async () => {
    return axios.get(`${API_BASE}/api/states`);
  },

  getCategories: async () => {
    return axios.get(`${API_BASE}/api/categories`);
  },

  getProducts: async (stateId, categoryId = null, searchQuery = '', lang = '') => {
    const params = new URLSearchParams();
    if (stateId) params.append('state', stateId);
    if (categoryId) params.append('category', categoryId);
    if (searchQuery) params.append('search', searchQuery);
    if (lang) params.append('lang', lang);

    return axios.get(`${API_BASE}/api/products`, { params });
  }
};

export default productService;
