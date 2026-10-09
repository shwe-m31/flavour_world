import axios from 'axios';
import { productService } from './productService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// In-memory / localStorage fallback cart
const CART_STORAGE_KEY = 'flavour_world_cart';

const getLocalCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { items: [], subTotal: 0, gst: 0, shipping: 0, grandTotal: 0 };
};

const saveLocalCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
};

const calculateCartTotals = (items, cartId = null) => {
  // Fixed price Rs. 2 per label
  const subTotal = items.length * 2.00;
  const gst = Number((subTotal * 0.18).toFixed(2));
  const shipping = 0.00;
  const grandTotal = Number((subTotal + gst + shipping).toFixed(2));

  return {
    cartId: cartId || 1,
    id: cartId || 1,
    items,
    subTotal,
    gst,
    shipping,
    grandTotal
  };
};

export const cartService = {
  getCart: async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/api/cart`, { ...getHeaders(token), timeout: 15000 });
      if (res.data && res.data.items) {
        // Enforce Rs. 2 per label calculation
        const sanitizedItems = res.data.items.map(item => ({
          ...item,
          product: { ...item.product, price: 2.00 }
        }));
        return { data: calculateCartTotals(sanitizedItems, res.data.cartId || res.data.id) };
      }
    } catch {
      // Fallback to local cart
    }
    return { data: getLocalCart() };
  },

  addToCart: async (productId, token) => {
    try {
      const res = await axios.post(`${API_BASE}/api/cart/items`, { productId }, { ...getHeaders(token), timeout: 15000 });
      if (res.data) {
        return res;
      }
    } catch {
      // Fallback
    }

    const currentCart = getLocalCart();
    const allProducts = productService.getAllProductsSync();
    const product = allProducts.find(p => p.id === Number(productId)) || {
      id: Number(productId),
      name: `Custom Label Item #${productId}`,
      price: 2.00
    };

    const newItem = {
      cartItemId: Date.now() + Math.floor(Math.random() * 1000),
      product: { ...product, price: 2.00 }
    };

    const updatedCart = calculateCartTotals([...currentCart.items, newItem]);
    saveLocalCart(updatedCart);

    return { data: updatedCart };
  },

  removeFromCart: async (cartItemId, token) => {
    try {
      await axios.delete(`${API_BASE}/api/cart/items/${cartItemId}`, { ...getHeaders(token), timeout: 15000 });
    } catch {
      // Fallback
    }

    const currentCart = getLocalCart();
    const updatedItems = currentCart.items.filter(item => item.cartItemId !== cartItemId);
    const updatedCart = calculateCartTotals(updatedItems);
    saveLocalCart(updatedCart);

    return { data: updatedCart };
  },

  deleteCart: async (token) => {
    try {
      await axios.delete(`${API_BASE}/api/cart`, { ...getHeaders(token), timeout: 15000 });
    } catch {
      // Fallback
    }

    const emptyCart = { items: [], subTotal: 0, gst: 0, shipping: 0, grandTotal: 0 };
    saveLocalCart(emptyCart);
    return { data: emptyCart };
  }
};

export default cartService;
