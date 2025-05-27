import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, size = 'M') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/api/cart/add',
        { productId, quantity, size },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      await fetchCart();
      toast.success('Item added to cart successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding item to cart');
      console.error('Error adding to cart:', error);
    }
  };

  // Buy Now function - adds to cart and redirects to checkout
  const buyNow = async (productId, quantity = 1, size = 'M') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to proceed with purchase');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/api/cart/add',
        { productId, quantity, size },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      await fetchCart();
      navigate('/checkout');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing your request');
      console.error('Error with buy now:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, size, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update cart');
        navigate('/login');
        return;
      }

      await axios.put('http://localhost:5000/api/cart/update',
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating cart');
      console.error('Error updating cart:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, size) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to remove items');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}/${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing item');
      console.error('Error removing from cart:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to clear cart');
        navigate('/login');
        return;
      }

      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchCart();
      toast.success('Cart cleared successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error clearing cart');
      console.error('Error clearing cart:', error);
    }
  };

  // Fetch cart on mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      buyNow,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 