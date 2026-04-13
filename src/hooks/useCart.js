import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth'; 
import { supabase } from '../lib/supabaseClient';

export const useCart = () => {
  const context = useContext(CartContext);
  const { user } = useAuth();

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  // Grab the base values and functions from the Provider
  const { cart, clearCart, setCart, cartCount, updateQuantity, removeFromCart, checkout } = context;

  const addToCart = async (product) => {
    // 1. Check if item already exists in local state
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // If it exists, just use the updateQuantity logic we already built
      updateQuantity(product.id, 1);
      return;
    }

    // 2. If it's new, update Local State (Optimistic UI)
    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);

    // 3. Sync to Supabase
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .insert([{ 
          user_id: user.id, 
          product_id: product.id, 
          quantity: 1 
        }]);

      if (error) {
        console.error('Error syncing cart to database:', error.message);
        // Rollback local state if DB fails (optional but good practice)
        setCart((prevCart) => prevCart.filter(item => item.id !== product.id));
      }
    }
  };

  return {
    cart,
    cartCount,
    addToCart,
    removeFromCart, // Required by Cart.jsx
    updateQuantity,  // Required by Cart.jsx
    checkout,         // Required by Cart.jsx
    clearCart
  };
};