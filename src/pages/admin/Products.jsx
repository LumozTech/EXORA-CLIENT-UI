import React, { useState } from "react";
import {
  FaBoxOpen,
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
  FaTag,
  FaBoxes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- Add this import
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

// Example product data
const initialProducts = [
  {
    id: 1,
    name: "Classic Polo Shirt",
    sku: "POLO-001",
    price: "Rs. 2,000",
    stock: 30,
    sold: 120,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=128&q=80",
  },
  {
    id: 2,
    name: "Denim Jeans",
    sku: "JEANS-002",
    price: "Rs. 2,800",
    stock: 15,
    sold: 95,
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=128&q=80",
  },
  {
    id: 3,
    name: "Formal Suit",
    sku: "SUIT-003",
    price: "Rs. 8,500",
    stock: 10,
    sold: 80,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=facearea&w=128&q=80",
  },
  {
    id: 4,
    name: "Casual T-Shirt",
    sku: "TSHIRT-004",
    price: "Rs. 1,200",
    stock: 25,
    sold: 75,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=128&q=80",
  },
];

const PRODUCTS_PER_PAGE = 5;

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); // <-- Add this line

  // Pagination
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  // Toggle product status
  const handleToggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              status: product.status === "Active" ? "Inactive" : "Active",
            }
          : product
      )
    );
  };

  // Modal close handler
  const closeModal = () => setSelectedProduct(null);

  // Add Product button handler
  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(135deg, #E0F2F1 0%, #CBD5E0 100%)",
      }}
    >
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
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold" style={{ color: PRIMARY }}>
                Product Information
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search Bar */}
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
                {/* Add Product Button */}
                <button
                  onClick={handleAddProduct} // <-- Link to Add Product page
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow bg-[#00796B] hover:bg-[#005B4F] transition ml-0 sm:ml-4"
                >
                  <FaPlus /> Add Product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">SKU</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Sold</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-6 text-center text-gray-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t cursor-pointer hover:bg-[#E0F2F1]/60 transition"
                        style={{ borderColor: CARD_BORDER }}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <td className="px-4 py-2 font-semibold">
                          {product.id}
                        </td>
                        <td className="px-4 py-2">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="inline-block object-cover w-12 h-12 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <FaBoxOpen className="inline text-2xl text-primary" />
                          )}
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          {product.name}
                        </td>
                        <td className="px-4 py-2">{product.sku}</td>
                        <td className="px-4 py-2">{product.price}</td>
                        <td className="px-4 py-2">{product.stock}</td>
                        <td className="px-4 py-2">{product.sold}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.status === "Active"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleToggleStatus(product.id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded transition text-xs font-semibold ${
                              product.status === "Active"
                                ? "bg-gray-300 text-gray-700 hover:bg-red-200"
                                : "bg-green-200 text-green-800 hover:bg-green-300"
                            }`}
                            title={
                              product.status === "Active"
                                ? "Set Inactive"
                                : "Set Active"
                            }
                          >
                            {product.status === "Active" ? (
                              <>
                                <FaTimes /> Deactivate
                              </>
                            ) : (
                              <>
                                <FaCheck /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded font-semibold ${
                    page === i + 1
                      ? "bg-[#00796B] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
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
              <div className="flex flex-col items-center gap-3">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="object-cover w-24 h-24 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <FaBoxOpen className="w-24 h-24 text-primary" />
                )}
                <h3 className="mt-2 mb-1 text-2xl font-bold">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaTag /> <span>SKU: {selectedProduct.sku}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBoxes /> <span>Stock: {selectedProduct.stock}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">Sold:</span>
                  <span>{selectedProduct.sold}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">Price:</span>
                  <span>{selectedProduct.price}</span>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedProduct.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
