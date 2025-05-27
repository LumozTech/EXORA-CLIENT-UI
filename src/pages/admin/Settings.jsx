import React, { useState, useEffect, useRef } from "react";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { uploadMediaToSupabase, deleteMediaFromSupabase } from "../../utils/mediaUploads";
import adminBg from "../../assets/adminBg.jpg";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const fileInputRef = useRef(null);

  // Load user info from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const u = JSON.parse(userData);
      setProfile({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        profilePic: u.profilePic || "",
      });
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setProfile({
        firstName: res.data.user.firstName || "",
        lastName: res.data.user.lastName || "",
        email: res.data.user.email || "",
        profilePic: res.data.user.profilePic || "",
      });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile(prev => ({ ...prev, profilePic: reader.result }));
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

  const handleProfilePicClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicUrl = profile.profilePic;

      // If a new image was selected, upload it
      if (imageFile) {
        try {
          // Delete old profile picture if it exists and is from Supabase
          if (profile.profilePic && profile.profilePic.includes('supabase')) {
            await deleteMediaFromSupabase(profile.profilePic, 'profiles');
          }
          
          // Upload new profile picture
          profilePicUrl = await uploadMediaToSupabase(imageFile, 'profiles');
        } catch (uploadError) {
          console.error("Failed to handle profile picture:", uploadError);
          toast.error("Failed to update profile picture");
          return;
        }
      }

      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          profilePic: profilePicUrl,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          ...res.data.user,
        })
      );

      setImageFile(null);
      toast.success("Profile updated successfully!");
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      setProfileMsg("Failed to update profile!");
      setTimeout(() => setProfileMsg(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setPasswordMsg("New passwords do not match!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/password",
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setPasswordMsg("Password updated successfully!");
      setPassword({ current: "", new: "", confirm: "" });
      setTimeout(() => setPasswordMsg(""), 2000);
    } catch (err) {
      setPasswordMsg("Failed to update password!");
      setTimeout(() => setPasswordMsg(""), 2000);
    }
  };

  return (
    <div className="flex min-h-screen"
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="w-64 min-h-screen">
        <SlideBar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="bg-white/30 backdrop-blur-sm shadow-sm">
          <AdminNavbar pageTitle="Settings" />
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div 
              className="p-8 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30"
              style={{
                borderColor: CARD_BORDER,
                borderWidth: 1.5,
              }}
            >
              <h2 className="mb-6 text-2xl font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Admin Settings
              </h2>
              
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <form onSubmit={handleProfileSubmit} className="mb-8">
                    <h3 className="mb-4 text-lg font-semibold" style={{ color: PRIMARY }}>
                      Update Profile
                    </h3>
                    <div className="flex flex-col items-center gap-4 mb-4">
                      <div className="relative">
                        {profile.profilePic ? (
                          <img
                            src={profile.profilePic}
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
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 font-semibold">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={profile.firstName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={profile.lastName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={profile.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-4 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 px-6 rounded-lg transition"
                      >
                        Update Profile
                      </button>
                      {profileMsg && (
                        <div className="mt-2 font-semibold text-green-600">
                          {profileMsg}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                
                <div>
                  <form onSubmit={handlePasswordSubmit}>
                    <h3 className="mb-4 text-lg font-semibold" style={{ color: PRIMARY }}>
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 font-semibold">Current Password</label>
                        <input
                          type="password"
                          name="current"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={password.current}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">New Password</label>
                        <input
                          type="password"
                          name="new"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={password.new}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirm"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={password.confirm}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-4 bg-[#00796B] hover:bg-[#005B4F] text-white font-semibold py-2 px-6 rounded-lg transition"
                      >
                        Update Password
                      </button>
                      {passwordMsg && (
                        <div className={`mt-2 font-semibold ${
                          passwordMsg.includes("success") ? "text-green-600" : "text-red-600"
                        }`}>
                          {passwordMsg}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;