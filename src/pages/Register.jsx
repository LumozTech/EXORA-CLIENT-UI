import React, { useState, useRef } from "react";
import axios from "axios";
import { getApiUrl } from '../config/api';
import { useNavigate, Link } from "react-router-dom";
import StoreBackground from "../assets/exora1.jpg";
import { FaGoogle, FaFacebookF, FaCamera, FaTimes, FaSignInAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadMediaToSupabase } from "../utils/mediaUploads";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm(prev => ({ ...prev, profilePic: reader.result }));
        };
        reader.readAsDataURL(file);
        setImageFile(file);
      } catch (error) {
        console.error("Error handling profile picture:", error);
        toast.error("Failed to process image");
      }
    }
  };

  const handleRemoveProfilePic = () => {
    setForm(prev => ({ ...prev, profilePic: "" }));
    setImageFile(null);
  };

  const handleProfilePicClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      let profilePicUrl = "";
      
      if (imageFile) {
        try {
          profilePicUrl = await uploadMediaToSupabase(imageFile, 'profiles');
        } catch (uploadError) {
          console.error("Failed to upload profile picture:", uploadError);
          toast.error("Failed to upload profile picture");
          return;
        }
      }

      const response = await axios.post(getApiUrl("/api/users"), {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        profilePic: profilePicUrl || undefined
      });

      if (response.data) {
        toast.success("Registration successful! Please login.");
        setForm({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          profilePic: "",
        });
        setImageFile(null);
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.info("Google register clicked");
  };

  const handleFacebookRegister = () => {
    toast.info("Facebook register clicked");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${StoreBackground})`,
      }}
    >
      <ToastContainer position="top-right" />
      <div className="w-full max-w-xl p-8 mx-4 backdrop-blur-sm bg-white/10 rounded-2xl shadow-2xl">
        <h2 className="mb-4 text-4xl font-bold text-center text-white">
          Create Account
        </h2>
        <p className="mb-8 text-center text-gray-300">
          Join us to start shopping
        </p>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {form.profilePic ? (
              <div className="relative">
                <img
                  src={form.profilePic}
                  alt="Profile"
                  className="object-cover w-24 h-24 border-2 rounded-full border-white/30"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all"
                  onClick={handleRemoveProfilePic}
                  title="Remove"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleProfilePicClick}
                type="button"
                className="flex flex-col items-center justify-center w-24 h-24 transition-all border-2 border-dashed rounded-full border-white/30 hover:border-white/50 hover:bg-white/10"
                title="Add Profile Picture"
              >
                <FaCamera className="text-2xl text-white" />
                <span className="mt-2 text-xs text-white/80">Add Photo</span>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className={`w-full py-3 font-semibold text-white transition-all rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <Link
              to="/login"
              className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-all border border-white/30 rounded-lg hover:bg-white/10"
            >
              <FaSignInAlt /> Sign In Instead
            </Link>
          </div>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="px-4 text-sm text-white/60">or register with</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full gap-3 py-3 font-semibold text-white transition-all bg-white/10 rounded-lg hover:bg-white/20"
            type="button"
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={handleFacebookRegister}
            className="flex items-center justify-center w-full gap-3 py-3 font-semibold text-white transition-all bg-white/10 rounded-lg hover:bg-white/20"
            type="button"
          >
            <FaFacebookF /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
