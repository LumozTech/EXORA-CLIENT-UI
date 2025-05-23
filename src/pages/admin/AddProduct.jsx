import React, { useState, useRef } from "react";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import { FaBoxOpen, FaCamera, FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    sold: "",
    status: "Active",
    images: [], // Array for up to 5 images
    category: "Kids", // New field
    bestSelling: false,
    topRated: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle multiple product image uploads (max 5)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.images.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((images) => {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...images].slice(0, 5),
      }));
    });
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setForm({
      name: "",
      sku: "",
      price: "",
      stock: "",
      sold: "",
      status: "Active",
      images: [],
      category: "Kids",
      bestSelling: false,
      topRated: false,
    });
    setTimeout(() => navigate("/admin/products"), 1200);
  };

  const handleBack = () => {
    navigate("/admin/products");
  };

  // Toggle handlers for bestSelling and topRated
  const handleToggle = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(135deg, #E0F2F1 0%, #CBD5E0 100%)",
      }}
    >
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Add Product" />
          <div
            className="w-full max-w-4xl p-8 mx-auto mt-8 mb-10 border shadow-md rounded-2xl"
            style={{
              background: CARD_BG,
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 mb-6 text-[#00796B] font-semibold hover:underline"
              type="button"
            >
              <FaArrowLeft /> Back to Products
            </button>
            <h2
              className="mb-6 text-2xl font-bold text-center"
              style={{ color: PRIMARY }}
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
                  <label className="font-semibold">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Product Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <label className="font-semibold">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    placeholder="SKU"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.sku}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Price</label>
                  <input
                    type="text"
                    name="price"
                    required
                    placeholder="Price (e.g. Rs. 2,000)"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    placeholder="Stock"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.stock}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Sold</label>
                  <input
                    type="number"
                    name="sold"
                    required
                    placeholder="Sold"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.sold}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Category</label>
                  <select
                    name="category"
                    className="w-full px-2 py-2 border rounded-lg"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="Kids">Kids</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.bestSelling}
                      onChange={() => handleToggle("bestSelling")}
                      className="accent-[#00796B] w-5 h-5"
                    />
                    Best Selling
                  </label>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.topRated}
                      onChange={() => handleToggle("topRated")}
                      className="accent-[#00796B] w-5 h-5"
                    />
                    Top Rated
                  </label>
                </div>
                <div>
                  <label className="font-semibold">Status</label>
                  <select
                    name="status"
                    className="w-full px-2 py-2 border rounded-lg"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-2 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 rounded-lg transition w-full"
                >
                  Add Product
                </button>
                {submitted && (
                  <div className="mt-2 font-semibold text-center text-green-600">
                    Product added successfully!
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
