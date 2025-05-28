import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import TopProducts from "../components/TopProducts/TopProducts";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials";
import Footer from "../components/Footer/Footer";
import Popup from "../components/Popup/Popup";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../config/api';

const HomePage = ({ orderPopup, setOrderPopup, handleOrderPopup }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl('/api/products'));
        const allProducts = response.data.list.filter(product => product.status === 'active');
        
        // Set all products
        setProducts(allProducts);
        
        // Filter top rated products
        const topRated = allProducts.filter(product => product.isTopRated);
        setTopRatedProducts(topRated);
        
        // Filter best selling products
        const bestSelling = allProducts.filter(product => product.isBestSelling);
        setBestSellingProducts(bestSelling);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <Navbar handleOrderPopup={handleOrderPopup} />
      <ToastContainer />
      <Hero handleOrderPopup={handleOrderPopup} />
      <Products products={products} loading={loading} title="Latest Products" />
      <TopProducts 
        products={topRatedProducts} 
        loading={loading} 
        handleOrderPopup={handleOrderPopup} 
      />
      <Banner />
      <Subscribe />
      <Products products={bestSellingProducts} loading={loading} title="Best Selling Products" />
      <Testimonials />
      <Footer />
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  );
};

export default HomePage;
