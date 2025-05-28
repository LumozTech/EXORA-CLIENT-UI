import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Banner from "../assets/website/orange-pattern.jpg";
import Logo from "../assets/women/women4.jpg";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiUrl } from '../config/api';

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(getApiUrl("/api/users/login"), {
        email: form.email,
        password: form.password,
      });
      if (res.data.success) {
        // Save token and user type if needed
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.type); // <-- use "role" instead of "userType"

        toast.success(res.data.message || "Login successful!", {
          onClose: () => {
            if (res.data.user.type === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
            }
          },
          autoClose: 1200,
        });
        setForm({ email: "", password: "" });
      } else {
        toast.error(res.data.message || "Login failed.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login clicked");
  };

  const handleFacebookLogin = () => {
    toast.info("Facebook login clicked");
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
            Login
          </h2>
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
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-white transition-colors bg-red-500 rounded hover:bg-red-600"
              type="button"
            >
              <FaGoogle /> Continue with Google
            </button>
            <button
              onClick={handleFacebookLogin}
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

export default Login;
