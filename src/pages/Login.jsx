import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiUrl } from '../config/api';
import StoreBackground from "../assets/exora1.jpg";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.type);

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
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${StoreBackground})`,
      }}
    >
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md p-8 mx-4 backdrop-blur-sm bg-white/10 rounded-2xl shadow-2xl">
        <h2 className="mb-6 text-4xl font-bold text-center text-white">
          Welcome Back
        </h2>
        <p className="mb-8 text-center text-gray-300">
          Sign in to continue shopping
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-300 hover:text-white"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <Link
              to="/register"
              className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-all border border-white/30 rounded-lg hover:bg-white/10"
            >
              <FaUserPlus /> Create Account
            </Link>
          </div>
        </form>
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="px-4 text-sm text-white/60">or continue with</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full gap-3 py-3 font-semibold text-white transition-all bg-white/10 rounded-lg hover:bg-white/20"
            type="button"
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={handleFacebookLogin}
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

export default Login;
