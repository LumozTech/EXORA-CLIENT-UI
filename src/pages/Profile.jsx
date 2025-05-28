import React, { useState } from "react";
import Banner from "../assets/website/orange-pattern.jpg";
import Logo from "../assets/women/women4.jpg";
import {
  FaUserEdit,
  FaSave,
  FaTimes,
  FaGoogle,
  FaFacebookF,
} from "react-icons/fa";

const initialProfile = {
  email: "nimesha@gmail.com",
  firstName: "Nimesha",
  lastName: "Perera",
  password: "********",
  profilePic: Logo,
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(profile);

  const handleEdit = () => {
    setEditMode(true);
    setForm(profile);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(profile);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(form);
    setEditMode(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col items-center w-full max-w-2xl p-8 mx-auto shadow-2xl rounded-3xl bg-white/95 dark:bg-gray-900/95 md:p-12">
        {/* Profile Avatar */}
        <div className="relative flex flex-col items-center mb-8">
          <img
            src={profile.profilePic}
            alt="Profile"
            className="object-cover w-32 h-32 border-4 rounded-full shadow-lg border-primary"
          />
          <div className="mt-4 text-2xl font-bold text-center text-primary">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-center text-gray-500 dark:text-gray-300">
            {profile.email}
          </div>
          {!editMode && (
            <button
              onClick={handleEdit}
              className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 mt-2 text-white transition-all rounded-full shadow bg-primary hover:bg-secondary"
              style={{ fontSize: 16 }}
            >
              <FaUserEdit /> Edit
            </button>
          )}
        </div>
        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          className="w-full max-w-md mx-auto space-y-6"
          autoComplete="off"
        >
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800"
              value={editMode ? form.email : profile.email}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-primary">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800"
                value={editMode ? form.firstName : profile.firstName}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-primary">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800"
                value={editMode ? form.lastName : profile.lastName}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-primary">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800"
              value={editMode ? form.password : profile.password}
              onChange={handleChange}
              disabled={!editMode}
              required
              autoComplete="new-password"
            />
          </div>
          {editMode && (
            <div>
              <label className="block mb-1 text-sm font-semibold text-primary">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800"
                value={form.confirmPassword || ""}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          )}
          {editMode && (
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-white transition-all rounded-lg bg-primary hover:bg-secondary"
              >
                <FaSave /> Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-white transition-all bg-gray-400 rounded-lg hover:bg-red-500"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </form>
        {/* Social Connections */}
        {/* Removed Google and Facebook buttons */}
      </div>
    </div>
  );
};

export default Profile;
