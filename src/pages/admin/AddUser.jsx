import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import { FaUserCircle, FaCamera, FaArrowLeft } from "react-icons/fa";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const AddUser = ({ onUserAdd }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    country: "",
    joined: new Date().toISOString().slice(0, 10),
    status: "Active",
    avatar: "",
    role: "customer",
  });

  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile photo upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      district: "",
      country: "",
      joined: new Date().toISOString().slice(0, 10),
      status: "Active",
      avatar: "",
      role: "customer",
    });
    // Optionally, navigate to users page after adding
    setTimeout(() => navigate("/admin/users"), 1200);
  };

  const handleBack = () => {
    navigate("/admin/users");
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
          <AdminNavbar pageTitle="Add User" />
          <div
            className="max-w-3xl p-8 mx-auto mt-8 mb-10 border shadow-md rounded-2xl"
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
              <FaArrowLeft /> Back to Users
            </button>
            <h2
              className="mb-6 text-2xl font-bold text-center"
              style={{ color: PRIMARY }}
            >
              Add New User
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {/* Left column: Profile photo */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="Avatar Preview"
                      className="object-cover w-24 h-24 border border-gray-300 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="w-24 h-24 text-primary" />
                  )}
                  <button
                    onClick={handleAvatarClick}
                    className="absolute p-2 bg-white rounded-full shadow bottom-1 right-1 hover:bg-gray-100"
                    type="button"
                    title="Upload Photo"
                  >
                    <FaCamera className="text-xl text-gray-600" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="w-full">
                  <label className="font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <label className="font-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="Phone (e.g. 0771234567)"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Right column: Address, role, status */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-semibold">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">District</label>
                  <input
                    type="text"
                    name="district"
                    required
                    placeholder="District"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.district}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    placeholder="Country"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Role</label>
                  <select
                    name="role"
                    className="w-full px-2 py-2 border rounded-lg"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
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
                  Add User
                </button>
                {submitted && (
                  <div className="mt-2 font-semibold text-center text-green-600">
                    User added successfully!
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddUser;
