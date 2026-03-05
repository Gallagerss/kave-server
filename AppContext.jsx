import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialUsers = [
  { id: 1, username: 'customer', password: 'customer123', role: 'customer', name: 'Pelanggan Biasa' },
  { id: 2, username: 'kasir', password: 'kasir123', role: 'cashier', name: 'Barista Kasir' },
  { id: 3, username: 'owner', password: 'owner123', role: 'owner', name: 'Pemilik Kave' }
];

const initialProducts = [
  { id: 1, name: 'Americano', price: 38000, cost: 10000, stock: 50, description: "Kopi hitam pekat dengan rasa klasik yang menyegarkan.", image: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=400&fit=crop', category: 'coffee' },
  { id: 2, name: 'Butterscotch Latte', price: 48000, cost: 15000, stock: 30, description: "Perpaduan manis mentega dan kopi susu yang lembut.", image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', category: 'special' },
  { id: 3, name: 'Matcha Latte', price: 52000, cost: 18000, stock: 20, description: "Green tea premium dengan susu segar, rasa earthy.", image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop', category: 'special' },
  { id: 4, name: 'Palm Sugar Latte', price: 45000, cost: 12000, stock: 25, description: "Kemanisan alami gula aren khas Nusantara.", image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop', category: 'special' },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('kave_users');
    if (!storedUsers) localStorage.setItem('kave_users', JSON.stringify(initialUsers));

    const storedProducts = localStorage.getItem('kave_products');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    else {
      localStorage.setItem('kave_products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }

    const storedOrders = localStorage.getItem('kave_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    else localStorage.setItem('kave_orders', JSON.stringify([]));

    const storedUser = localStorage.getItem('kave_current_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedCart = localStorage.getItem('kave_cart');
    if(storedCart) setCart(JSON.parse(storedCart));

    const storedFeedbacks = localStorage.getItem('kave_feedbacks');
    if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));
    else localStorage.setItem('kave_feedbacks', JSON.stringify([]));
  }, []);

  const updateStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('kave_users'));
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('kave_current_user', JSON.stringify(foundUser));
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: 'Username atau password salah' };
  };

  const logout = () => {
    setUser(null); setCart([]);
    localStorage.removeItem('kave_current_user');
    localStorage.removeItem('kave_cart');
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(newCart);
    updateStorage('kave_cart', newCart);
    return true;
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    updateStorage('kave_cart', newCart);
  };

  const updateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      const newCart = cart.map(item => item.id === productId ? { ...item, qty: newQty } : item);
      setCart(newCart);
      updateStorage('kave_cart', newCart);
    }
  };

  const checkout = (paymentMethod) => {
    if (cart.length === 0) return { success: false };
    const totalCost = cart.reduce((sum, item) => sum + ((item.cost || 0) * item.qty), 0);
    const totalRevenue = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: totalRevenue,
      cost: totalCost,
      profit: totalRevenue - totalCost,
      status: 'pending', 
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      customerName: user?.name || 'Guest',
    };

    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.qty };
      return p;
    });

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    setProducts(updatedProducts);
    setCart([]);
    updateStorage('kave_orders', newOrders);
    updateStorage('kave_products', updatedProducts);
    updateStorage('kave_cart', []);
    return { success: true, orderId: newOrder.id };
  };

  const updateOrderStatus = (orderId, status) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(newOrders);
    updateStorage('kave_orders', newOrders);
  };

  const deleteOrder = (orderId) => {
    const newOrders = orders.filter(o => o.id !== orderId);
    setOrders(newOrders);
    updateStorage('kave_orders', newOrders);
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), cost: product.cost || 0, description: product.description || '' };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    updateStorage('kave_products', newProducts);
  };

  const updateProduct = (updatedProd) => {
    const newProducts = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(newProducts);
    updateStorage('kave_products', newProducts);
  };

  const deleteProduct = (productId) => {
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
    updateStorage('kave_products', newProducts);
  };

  const addFeedback = (feedback) => {
    const newFeedback = { ...feedback, id: Date.now(), createdAt: new Date().toISOString() };
    const newFeedbacks = [newFeedback, ...feedbacks];
    setFeedbacks(newFeedbacks);
    updateStorage('kave_feedbacks', newFeedbacks);
    return true;
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateCartQuantity, checkout,
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrderStatus, deleteOrder,
      feedbacks, addFeedback
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);