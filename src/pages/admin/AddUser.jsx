import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import { FaUserCircle, FaCamera, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../../assets/adminBg.jpg";
// import uploadMediaToSupabase from "../../utils/mediaUpload";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const AddUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("customer");
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleProfilePicClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleBack = () => {
    navigate("/admin/users");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    let imgUrl = "";
    // If you want to upload to Supabase, uncomment and use the below:
    // if (imageFile) {
    //   try {
    //     imgUrl = await uploadMediaToSupabase(imageFile);
    //   } catch (uploadError) {
    //     toast.error("Image upload failed.");
    //     return;
    //   }
    // }

    const user = {
      firstName,
      lastName,
      email,
      password,
      type,
      isBlocked,
      profilePic: imgUrl, // Will be "" unless you use upload
    };

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users", user, {
        headers: {
          Authorization: "Bearer " + token, // token must be for an admin user
        },
      });
      toast.success("User added successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setImageFile(null);
      setPassword("");
      setConfirmPassword("");
      setType("customer");
      setIsBlocked(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        navigate("/admin/users");
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add user: " + error.message
      );
    } finally {
      setLoading(false);
    }
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
      <ToastContainer position="top-right" />
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Add User" />
          <div
            className="w-full p-8 mx-auto mt-8 mb-10 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30"
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
              <FaArrowLeft /> Back to Users
            </button>
            <h2
              className="mb-6 text-2xl font-bold text-center text-white"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Add New User
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {/* Left column: Profile photo and names */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Avatar Preview"
                      className="object-cover w-24 h-24 border border-gray-300 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="w-24 h-24 text-primary" />
                  )}
                  <button
                    onClick={handleProfilePicClick}
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
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </div>
                <div className="w-full">
                  <label className="font-semibold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label className="font-semibold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* Right column: Password, role, status */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold">Role</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isBlocked}
                    onChange={(e) => setIsBlocked(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="font-medium text-gray-700">Blocked</label>
                </div>
                <button
                  type="submit"
                  className={`mt-2 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 rounded-lg transition w-full ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add User"}
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
