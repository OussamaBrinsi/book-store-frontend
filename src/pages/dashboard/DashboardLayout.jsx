import axios from "axios";
import React from "react";

import Loading from "../../components/Loading";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { HiViewGridAdd } from "react-icons/hi";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineManageHistory } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <section className="flex min-h-screen bg-gray-100">
      {/* Static Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-purple-400 shadow-md hidden md:flex flex-col">
        <div className="h-24 flex flex-col items-center justify-center border-b border-purple-300">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2 border-4 border-purple-300">
            <span className="text-2xl font-bold text-purple-700">BO</span>
          </div>
          <span className="text-lg font-semibold text-white">
            Brinsi Oussama
          </span>
          <span className="text-xs text-purple-200">Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 mt-2">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-2 text-white hover:bg-purple-600 rounded-md transition-colors"
          >
            <AiFillHome className="mr-2 h-5 w-5" /> Dashboard
          </Link>
          <Link
            to="/dashboard/manage-books"
            className="flex items-center px-4 py-2 text-white hover:bg-purple-600 rounded-md transition-colors"
          >
            <MdOutlineManageHistory className="mr-2 h-5 w-5" /> Manage Books
          </Link>
          <Link
            to="/dashboard/orders"
            className="flex items-center px-4 py-2 text-white hover:bg-purple-600 rounded-md transition-colors"
          >
            <FaClipboardList className="mr-2 h-5 w-5" /> Orders
          </Link>
          <Link
            to="/dashboard/add-new-book"
            className="flex items-center px-4 py-2 text-white hover:bg-purple-600 rounded-md transition-colors"
          >
            <HiViewGridAdd className="mr-2 h-5 w-5" /> Add New Book
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-white hover:bg-red-500 rounded-md w-full transition-colors"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white shadow flex items-center px-6">
          <h1 className="text-2xl font-semibold text-purple-700">Dashboard</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
