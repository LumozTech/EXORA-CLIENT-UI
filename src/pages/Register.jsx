import React, { useState, useRef } from "react";
import axios from "axios";
import { getApiUrl } from '../config/api';
import Banner from "../assets/website/orange-pattern.jpg";
import Logo from "../assets/women/women4.jpg";
import { FaGoogle, FaFacebookF, FaCamera, FaTimes } from "react-icons/fa";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
          setForm(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
        
        // Store file for later upload
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
      // Validate passwords match
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

      let profilePicUrl = "";
      
      // Upload profile picture if one was selected
      if (imageFile) {
        try {
          profilePicUrl = await uploadMediaToSupabase(imageFile, 'profiles');
        } catch (uploadError) {
          console.error("Failed to upload profile picture:", uploadError);
          toast.error("Failed to upload profile picture");
          return;
        }
      }

      // Register user
      const response = await axios.post(getApiUrl("/api/users/register"), {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        profilePic: profilePicUrl || undefined // Only send if we have a URL
      });

      if (response.data) {
        toast.success("Registration successful! Please login.");
        // Reset form
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        profilePic: "",
      });
        setImageFile(null);
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/login";
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
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ToastContainer position="top-right" />
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg shadow-lg bg-white/90 dark:bg-gray-900/90">
        {/* Left Side - Image & Logo */}
        <div className="flex-col items-center justify-center hidden py-12 md:flex md:w-1/2 bg-white/0">
          <img
            src={Logo}
            alt="Logo"
            className="object-contain w-40 h-40 mb-6 drop-shadow-lg"
          />
        </div>
        {/* Right Side - Form */}
        <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold text-center text-primary">
            Register
          </h2>
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              {form.profilePic ? (
                <>
                  <img
                    src={form.profilePic}
                    alt="Profile"
                    className="object-cover w-20 h-20 border-2 rounded-full border-primary"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-white rounded-full shadow hover:text-red-600"
                    onClick={handleRemoveProfilePic}
                    title="Remove"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleProfilePicClick}
                  type="button"
                  className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-primary rounded-full bg-white hover:bg-[#E0F2F1] transition"
                  title="Add Profile Picture"
                >
                  <FaCamera className="text-2xl text-primary" />
                  <span className="mt-1 text-xs text-primary">Add Photo</span>
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
            <span className="mt-2 text-xs text-gray-500">
              Profile Picture (optional)
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 font-semibold text-white transition-colors rounded bg-primary hover:bg-secondary flex items-center justify-center ${
                loading ? "opacity-60 cursor-not-allowed" : ""
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleRegister}
              className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-white transition-colors bg-red-500 rounded hover:bg-red-600"
              type="button"
            >
              <FaGoogle /> Continue with Google
            </button>
            <button
              onClick={handleFacebookRegister}
              className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
              type="button"
            >
              <FaFacebookF /> Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
