import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = (stateId, categoryId, searchQuery, selectedLanguage = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(stateId, categoryId, searchQuery, selectedLanguage);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [stateId, categoryId, searchQuery, selectedLanguage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};

export default useProducts;
