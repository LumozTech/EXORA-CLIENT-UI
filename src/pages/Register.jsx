import React, { useState } from "react";
import Banner from "../assets/website/orange-pattern.jpg";
import Logo from "../assets/women/women4.jpg";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  const handleGoogleRegister = () => {
    alert("Google register clicked");
  };

  const handleFacebookRegister = () => {
    alert("Facebook register clicked");
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
              className="w-full py-2 font-semibold text-white transition-colors rounded bg-primary hover:bg-secondary"
            >
              Register
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
