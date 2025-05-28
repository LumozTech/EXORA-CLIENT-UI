import React, { useState, useRef } from "react";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import { FaBoxOpen, FaCamera, FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadMediaToSupabase } from "../../utils/mediaUploads";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../../assets/adminBg.jpg";
import { getApiUrl } from '../../config/api';

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const AddProduct = () => {
  const [form, setForm] = useState({
    productName: "",
    altNames: "",
    images: [],
    price: "",
    lastPrice: "",
    description: "",
    stock: "",
    soldCount: 0,
    category: "kids",
    isBestSelling: false,
    isTopRated: false,
    status: "active"
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAltNamesChange = (e) => {
    const names = e.target.value.split(',').map(name => name.trim());
    setForm({ ...form, altNames: names });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error("You can upload up to 5 images only");
      return;
    }
    
    // Show previews immediately
    files.forEach(file => {
          const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
        ...prev,
          images: [...prev.images, reader.result].slice(0, 5),
      }));
      };
      reader.readAsDataURL(file);
    });
    
    // Store files for later upload
    setImageFiles(prev => [...prev, ...files].slice(0, 5));
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleRemoveImage = (idx) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleToggle = (field) => {
    setForm(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validate required fields
      if (!form.productName || !form.price || !form.description || !form.stock || imageFiles.length === 0) {
        toast.error("Please fill in all required fields and add at least one image");
        setLoading(false);
        return;
      }

      // Validate price and stock
      if (parseFloat(form.price) <= 0) {
        toast.error("Price must be greater than 0");
        setLoading(false);
        return;
      }

      if (parseInt(form.stock) < 0) {
        toast.error("Stock cannot be negative");
        setLoading(false);
        return;
      }

      // Upload all images to Supabase
      const uploadPromises = imageFiles.map(file => 
        uploadMediaToSupabase(file, 'products')
      );
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (!uploadedUrls.length) {
        throw new Error("Failed to upload images");
      }
      
      // Generate a unique productId
      const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare the product data
      const productData = {
        productId,
        productName: form.productName.trim(),
        altNames: form.altNames ? form.altNames.split(',').map(name => name.trim()).filter(Boolean) : [],
        images: uploadedUrls,
        price: parseFloat(form.price),
        lastPrice: form.lastPrice ? parseFloat(form.lastPrice) : parseFloat(form.price),
        description: form.description.trim(),
        stock: parseInt(form.stock),
        soldCount: parseInt(form.soldCount) || 0,
        category: form.category,
        isBestSelling: form.isBestSelling,
        isTopRated: form.isTopRated,
        status: form.status
      };

      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate('/login');
        return;
      }

      // Make API call
      const response = await axios.post(getApiUrl('/api/products'), productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        // Handle success
        toast.success("Product added successfully!");
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          navigate("/admin/products");
        }, 1200);
      } else {
        throw new Error(response.data.message || "Failed to create product");
      }

    } catch (error) {
      console.error("Error creating product:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        navigate('/login');
        return;
      }
      
      if (error.response?.status === 403) {
        toast.error("You don't have permission to add products");
        return;
      }
      
      if (error.message.includes("Network Error")) {
        toast.error("Network error. Please check your connection");
        return;
      }

      toast.error(error.response?.data?.message || error.message || "Failed to create product");
      setError(error.response?.data?.message || error.message || "Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/products");
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Add Product" />
          <div
            className="w-full max-w-4xl p-8 mx-auto mt-8 mb-10 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30"
            style={{
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 mb-6 text-white font-semibold hover:underline"
              type="button"
            >
              <FaArrowLeft /> Back to Products
            </button>
            <h2
              className="mb-6 text-2xl font-bold text-center text-white"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Add New Product
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {/* Left column: Product details */}
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <label className="font-semibold">Product Name*</label>
                  <input
                    type="text"
                    name="productName"
                    required
                    placeholder="Product Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.productName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="font-semibold">Alternative Names</label>
                  <input
                    type="text"
                    name="altNames"
                    placeholder="Comma separated alternative names"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.altNames}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate multiple names with commas</p>
                </div>

                <div>
                  <label className="font-semibold">Description*</label>
                  <textarea
                    name="description"
                    required
                    placeholder="Product Description"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Current Price*</label>
                    <input
                      type="number"
                      name="price"
                      required
                      placeholder="Current Price"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Previous Price</label>
                    <input
                      type="number"
                      name="lastPrice"
                      placeholder="Previous Price"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={form.lastPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Stock*</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      placeholder="Stock"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Sold Count</label>
                    <input
                      type="number"
                      name="soldCount"
                      placeholder="Sold Count"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={form.soldCount}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold">Category*</label>
                  <select
                    name="category"
                    className="w-full px-2 py-2 border rounded-lg"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="kids">Kids</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isBestSelling}
                      onChange={() => handleToggle("isBestSelling")}
                      className="accent-[#00796B] w-5 h-5"
                    />
                    Best Selling
                  </label>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isTopRated}
                      onChange={() => handleToggle("isTopRated")}
                      className="accent-[#00796B] w-5 h-5"
                    />
                    Top Rated
                  </label>
                </div>

                <div>
                  <label className="font-semibold">Status*</label>
                  <select
                    name="status"
                    className="w-full px-2 py-2 border rounded-lg"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#00796B] hover:bg-[#005B4F]'
                  } text-white font-semibold py-2 rounded-lg transition w-full flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-t-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      Adding Product...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>

                {submitted && (
                  <div className="mt-2 font-semibold text-center text-green-600">
                    Product added successfully!
                  </div>
                )}

                {error && (
                  <div className="mt-2 font-semibold text-center text-red-600">
                    {error}
                  </div>
                )}
              </div>

              {/* Right column: Product images */}
              <div className="flex flex-col items-center gap-4">
                <label className="mb-2 font-semibold">
                  Product Images (max 5)
                </label>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {form.images.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 border border-gray-300 rounded-lg">
                      <FaBoxOpen className="w-10 h-10 text-primary" />
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="object-cover w-24 h-24 border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute p-1 text-gray-600 transition rounded-full top-1 right-1 bg-white/80 hover:text-red-600 group-hover:scale-110"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <button
                      onClick={handleImageClick}
                      type="button"
                      className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-[#00796B] rounded-lg bg-white hover:bg-[#E0F2F1] transition"
                      title="Add Image"
                    >
                      <FaCamera className="text-2xl text-[#00796B]" />
                      <span className="text-xs text-[#00796B] mt-1">
                        Add Image
                      </span>
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;