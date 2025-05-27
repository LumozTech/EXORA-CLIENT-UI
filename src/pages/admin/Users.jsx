import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaPlus,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import adminBg from "../../assets/adminBg.jpg";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const USERS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setUsers(res.data.list || []);
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Add User navigation
  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  // Toggle user block status
  const handleToggleStatus = async (id, isBlocked) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/users/${id}`,
        { isBlocked: !isBlocked },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: !isBlocked } : user
        )
      );
      toast.success("User status updated!");
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  // Filtered and paginated users
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Reset to page 1 on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Modal close handler
  const closeModal = () => setSelectedUser(null);

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
      {/* Sidebar */}
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Users" />
          <div
            className="p-6 mt-8 mb-10 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30"
            style={{
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                User Information
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    style={{ minWidth: 200 }}
                  />
                  <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                </div>
                {/* Add User Button */}
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow bg-[#00796B] hover:bg-[#005B4F] transition ml-0 sm:ml-4"
                >
                  <FaPlus /> Add User
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Blocked</th>
                    <th className="px-4 py-2">Profile Pic</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-6 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, idx) => (
                      <tr
                        key={user._id}
                        className="border-t cursor-pointer hover:bg-[#E0F2F1]/60 transition"
                        style={{ borderColor: CARD_BORDER }}
                        onClick={() => setSelectedUser(user)}
                      >
                        <td
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="font-semibold">
                            {(page - 1) * USERS_PER_PAGE + idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          {user.firstName}
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          {user.lastName}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">{user.type}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isBlocked
                                ? "bg-gray-300 text-gray-700"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.firstName}
                              className="inline-block object-cover border border-gray-300 rounded-full w-9 h-9"
                            />
                          ) : (
                            <FaUserCircle className="inline text-2xl text-primary" />
                          )}
                        </td>
                        <td
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              handleToggleStatus(user._id, user.isBlocked)
                            }
                            className={`flex items-center gap-1 px-3 py-1 rounded transition text-xs font-semibold ${
                              user.isBlocked
                                ? "bg-green-200 text-green-800 hover:bg-green-300"
                                : "bg-gray-300 text-gray-700 hover:bg-red-200"
                            }`}
                            title={
                              user.isBlocked ? "Set Active" : "Set Blocked"
                            }
                          >
                            {user.isBlocked ? (
                              <>
                                <FaCheck /> Activate
                              </>
                            ) : (
                              <>
                                <FaTimes /> Block
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded font-semibold ${
                    page === i + 1
                      ? "bg-[#00796B] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
              className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-2xl"
              style={{ border: `2px solid ${CARD_BORDER}` }}
            >
              <button
                className="absolute text-2xl text-gray-500 top-3 right-3 hover:text-red-500"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center gap-3">
                {selectedUser.profilePic ? (
                  <img
                    src={selectedUser.profilePic}
                    alt={selectedUser.firstName}
                    className="object-cover w-20 h-20 border border-gray-300 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-primary" />
                )}
                <h3 className="mt-2 mb-1 text-2xl font-bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope /> <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">Role:</span>
                  <span>{selectedUser.type}</span>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.isBlocked
                        ? "bg-gray-300 text-gray-700"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
