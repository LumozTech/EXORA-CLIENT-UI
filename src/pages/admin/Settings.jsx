import React, { useState } from "react";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Nimesha Perera",
    email: "nimesha@gmail.com",
    phone: "0771234567",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileMsg("Profile updated successfully!");
    setTimeout(() => setProfileMsg(""), 2000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setPasswordMsg("New passwords do not match!");
      return;
    }
    setPasswordMsg("Password updated successfully!");
    setPassword({ current: "", new: "", confirm: "" });
    setTimeout(() => setPasswordMsg(""), 2000);
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
          <AdminNavbar pageTitle="Settings" />
          <div
            className="max-w-2xl p-8 mx-auto mt-8 mb-10 border shadow-md rounded-2xl"
            style={{
              background: CARD_BG,
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <h2 className="mb-6 text-2xl font-bold" style={{ color: PRIMARY }}>
              Admin Settings
            </h2>
            {/* Profile Update */}
            <form onSubmit={handleProfileSubmit} className="mb-10">
              <h3
                className="mb-3 text-lg font-semibold"
                style={{ color: PRIMARY }}
              >
                Update Profile
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Update Profile
              </button>
              {profileMsg && (
                <div className="mt-2 font-semibold text-green-600">
                  {profileMsg}
                </div>
              )}
            </form>
            {/* Password Update */}
            <form onSubmit={handlePasswordSubmit}>
              <h3
                className="mb-3 text-lg font-semibold"
                style={{ color: PRIMARY }}
              >
                Change Password
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="font-semibold">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={password.current}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">New Password</label>
                  <input
                    type="password"
                    name="new"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={password.new}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Update Password
              </button>
              {passwordMsg && (
                <div className="mt-2 font-semibold text-green-600">
                  {passwordMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
