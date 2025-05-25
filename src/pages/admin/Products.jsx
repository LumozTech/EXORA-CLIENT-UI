import React, { useState, useEffect, useRef } from "react";
import {
  FaBoxOpen,
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
  FaTag,
  FaBoxes,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaCamera
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";
const PRODUCTS_PER_PAGE = 5;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
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
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(response.data.list || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and pagination
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(search.toLowerCase()) ||
      product.productId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Toggle product status
  const handleToggleStatus = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const product = products.find(p => p.productId === productId);
      const newStatus = product.status === "active" ? "inactive" : "active";
      
      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setProducts(products.map(p => 
        p.productId === productId ? { ...p, status: newStatus } : p
      ));

      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(products.filter(p => p.productId !== productId));
      setConfirmDelete(null);
      toast.success('Product deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Navigation handlers
  const handleAddProduct = () => navigate("/admin/add-product");
  const handleEditProduct = (productId) => navigate(`/admin/edit-product/${productId}`);

  // Modal close handlers
  const closeModal = () => setSelectedProduct(null);
  const closeConfirm = () => setConfirmDelete(null);

  // Format price for display
  const formatPrice = (price) => `Rs. ${price.toLocaleString()}`;

  // Handle edit modal open
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({
      productName: product.productName,
      altNames: Array.isArray(product.altNames) ? product.altNames.join(', ') : product.altNames || "",
      images: product.images || [],
      price: product.price,
      lastPrice: product.lastPrice || product.price,
      description: product.description,
      stock: product.stock,
      soldCount: product.soldCount,
      category: product.category,
      isBestSelling: product.isBestSelling,
      isTopRated: product.isTopRated,
      status: product.status
    });
  };

  // Handle form changes
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image changes
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + editForm.images.length > 5) {
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
      setEditForm(prev => ({
        ...prev,
        images: [...prev.images, ...images].slice(0, 5),
      }));
    });
  };

  // Handle image removal
  const handleRemoveEditImage = (idx) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Handle form submission
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...editForm,
        altNames: editForm.altNames ? editForm.altNames.split(',').map(name => name.trim()) : [],
        price: parseFloat(editForm.price),
        lastPrice: editForm.lastPrice ? parseFloat(editForm.lastPrice) : parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
        soldCount: parseInt(editForm.soldCount),
      };

      await axios.put(
        `http://localhost:5000/api/products/${editingProduct.productId}`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update products list
      setProducts(products.map(p => 
        p.productId === editingProduct.productId ? { ...p, ...productData } : p
      ));

      // Close modal and show success message
      setEditingProduct(null);
      toast.success('Product updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(135deg, #E0F2F1 0%, #CBD5E0 100%)",
      }}
    >
      <ToastContainer />
      {/* Sidebar */}
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Products" />
          <div
            className="p-6 mt-8 mb-10 border shadow-md rounded-2xl"
            style={{
              background: CARD_BG,
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            {/* Header and Search */}
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold" style={{ color: PRIMARY }}>
                Product Management
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    style={{ minWidth: 200 }}
                  />
                  <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                </div>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow bg-[#00796B] hover:bg-[#005B4F] transition ml-0 sm:ml-4"
                >
                  <FaPlus /> Add Product
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 mb-4 text-red-600 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-[#00796B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Products Table */}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b" style={{ borderColor: CARD_BORDER }}>
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Sold</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-6 text-center text-gray-500">
                          {search ? "No matching products found" : "No products available"}
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((product) => (
                        <tr
                          key={product.productId}
                          className="border-t hover:bg-[#E0F2F1]/60 transition"
                          style={{ borderColor: CARD_BORDER }}
                        >
                          <td className="px-4 py-3">
                            {product.images?.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.productName}
                                className="object-cover w-12 h-12 border border-gray-300 rounded-lg"
                              />
                            ) : (
                              <FaBoxOpen className="text-2xl text-primary" />
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {product.productName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {product.productId}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-4 py-3">{product.stock}</td>
                          <td className="px-4 py-3">{product.soldCount}</td>
                          <td className="px-4 py-3 capitalize">
                            {product.category}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                product.status === "active"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="p-2 text-[#00796B] bg-[#E0F2F1] rounded-lg hover:bg-[#B2DFDB] transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(product.productId)}
                                className="p-2 text-red-600 transition bg-red-100 rounded-lg hover:bg-red-200"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(product.productId)}
                                className={`p-2 rounded-lg transition ${
                                  product.status === "active"
                                    ? "text-gray-700 bg-gray-200 hover:bg-red-100"
                                    : "text-green-800 bg-green-200 hover:bg-green-300"
                                }`}
                                title={product.status === "active" ? "Deactivate" : "Activate"}
                              >
                                {product.status === "active" ? <FaTimes /> : <FaCheck />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && (
              <div className="flex flex-col items-center gap-4 mt-6">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * PRODUCTS_PER_PAGE + 1} to{" "}
                  {Math.min(page * PRODUCTS_PER_PAGE, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 disabled:hover:bg-gray-200"
                  >
                    <FaArrowLeft className="text-sm" /> Prev
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded font-semibold min-w-[2rem] ${
                          page === i + 1
                            ? "bg-[#00796B] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={page === totalPages || totalPages === 0}
                    className="flex items-center gap-1 px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 disabled:hover:bg-gray-200"
                  >
                    Next <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
              className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-2xl"
              style={{ border: `2px solid ${CARD_BORDER}` }}
            >
              <button
                className="absolute text-2xl text-gray-500 top-3 right-3 hover:text-red-500"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center gap-4">
                {selectedProduct.images?.length > 0 ? (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.productName}
                    className="object-cover w-32 h-32 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <FaBoxOpen className="w-32 h-32 text-primary" />
                )}
                <h3 className="mt-2 text-2xl font-bold text-center">
                  {selectedProduct.productName}
                </h3>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <FaTag className="text-gray-500" />
                    <span className="font-semibold">Product ID:</span>
                    <span>{selectedProduct.productId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Price:</span>
                    <span>{formatPrice(selectedProduct.price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Previous Price:</span>
                    <span>{formatPrice(selectedProduct.lastPrice)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBoxes className="text-gray-500" />
                    <span className="font-semibold">Stock:</span>
                    <span>{selectedProduct.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Sold:</span>
                    <span>{selectedProduct.soldCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Category:</span>
                    <span className="capitalize">{selectedProduct.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Best Selling:</span>
                    <span>{selectedProduct.isBestSelling ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Top Rated:</span>
                    <span>{selectedProduct.isTopRated ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedProduct.status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
              className="relative w-full max-w-md p-6 bg-white shadow-lg rounded-2xl"
              style={{ border: `2px solid ${CARD_BORDER}` }}
            >
              <button
                className="absolute text-2xl text-gray-500 top-3 right-3 hover:text-red-500"
                onClick={closeConfirm}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="mb-4 text-xl font-bold text-center">Confirm Delete</h3>
              <p className="mb-6 text-center">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeConfirm}
                  className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-4xl p-6 bg-white shadow-lg rounded-2xl" style={{ border: `2px solid ${CARD_BORDER}` }}>
              <button
                className="absolute text-2xl text-gray-500 top-3 right-3 hover:text-red-500"
                onClick={() => setEditingProduct(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="mb-6 text-2xl font-bold text-center" style={{ color: PRIMARY }}>
                Edit Product
              </h3>
              
              <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left column: Product details */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="font-semibold">Product Name*</label>
                    <input
                      type="text"
                      name="productName"
                      required
                      placeholder="Product Name"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={editForm.productName}
                      onChange={handleEditFormChange}
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Alternative Names</label>
                    <input
                      type="text"
                      name="altNames"
                      placeholder="Comma separated alternative names"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={editForm.altNames}
                      onChange={handleEditFormChange}
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
                      value={editForm.description}
                      onChange={handleEditFormChange}
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
                        value={editForm.price}
                        onChange={handleEditFormChange}
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
                        value={editForm.lastPrice}
                        onChange={handleEditFormChange}
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
                        value={editForm.stock}
                        onChange={handleEditFormChange}
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
                        value={editForm.soldCount}
                        onChange={handleEditFormChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold">Category*</label>
                    <select
                      name="category"
                      className="w-full px-2 py-2 border rounded-lg"
                      value={editForm.category}
                      onChange={handleEditFormChange}
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
                        name="isBestSelling"
                        checked={editForm.isBestSelling}
                        onChange={handleEditFormChange}
                        className="accent-[#00796B] w-5 h-5"
                      />
                      Best Selling
                    </label>
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        name="isTopRated"
                        checked={editForm.isTopRated}
                        onChange={handleEditFormChange}
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
                      value={editForm.status}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 rounded-lg transition w-full"
                  >
                    Update Product
                  </button>
                </div>

                {/* Right column: Product images */}
                <div className="flex flex-col items-center gap-4">
                  <label className="mb-2 font-semibold">
                    Product Images (max 5)
                  </label>
                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                    {editForm.images.length === 0 && (
                      <div className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 border border-gray-300 rounded-lg">
                        <FaBoxOpen className="w-10 h-10 text-primary" />
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                    {editForm.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="object-cover w-24 h-24 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute p-1 text-gray-600 transition rounded-full top-1 right-1 bg-white/80 hover:text-red-600 group-hover:scale-110"
                          onClick={() => handleRemoveEditImage(idx)}
                          title="Remove"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    {editForm.images.length < 5 && (
                      <button
                        onClick={() => fileInputRef.current.click()}
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
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;