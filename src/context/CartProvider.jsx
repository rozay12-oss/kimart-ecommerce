import { useState } from 'react';
import { CartContext } from './CartContext';
import { supabase } from '../lib/supabaseClient';

export function CartProvider({ children }) {
  // Using 'cart' consistently as your state name
  const [cart, setCart] = useState([]);

  // --- 1. CLEAR CART FUNCTION ---
  // Moved this outside of checkout so it is accessible globally
  const clearCart = async (userId) => {
    setCart([]); // Clear local state
    localStorage.removeItem('cart'); // Clear storage
    
    // If the user is logged in, clear their cart in Supabase too
    if (userId) {
      await supabase.from('cart_items').delete().eq('user_id', userId);
    }
  };

  // --- 2. UPDATE QUANTITY ---
  const updateQuantity = async (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );

    const itemToUpdate = cart.find((item) => item.id === id);
    if (!itemToUpdate) return;

    const newQuantity = Math.max(1, itemToUpdate.quantity + amount);

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('product_id', id);

    if (error) console.error("Error updating Supabase:", error.message);
  };

  // --- 3. REMOVE FROM CART ---
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // --- 4. ADD TO CART ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // --- 5. CHECKOUT ---
  const checkout = async (user) => {
    if (!user) return alert("Please login to checkout");

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ user_id: user.id, total_price: totalPrice, customer_email: user.email, status: 'pending' }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Use the clearCart function we defined above
      await clearCart(user.id);
      
      return true;
    } catch (err) {
      console.error("Checkout failed:", err.message);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      clearCart, 
      checkout, 
      setCart, 
      addToCart, 
      cartCount, 
      removeFromCart, 
      updateQuantity 
    }}>
      {children}
    </CartContext.Provider>
  );
}