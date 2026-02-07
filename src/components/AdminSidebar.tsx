"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Icons
const ActivityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Access Group", icon: <LockIcon />, href: "/admin/dashboard" },
    { name: "Users", icon: <UsersIcon />, href: "/admin/users" }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex-col bg-teal-900 text-white shadow-xl transition-all duration-300 z-50 hidden md:flex">
      {/* Logo Area */}
      <div className="flex h-20 items-center gap-3 px-8 text-2xl font-bold tracking-wide">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-teal-300 backdrop-blur-sm shadow-inner">
          <ActivityIcon />
        </div>
        <span>
          NewMed<span className="text-teal-300">Admin</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ease-in-out
                              ${isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-900/20 translate-x-1"
                  : "text-teal-100/70 hover:bg-white/5 hover:text-white hover:translate-x-1"
                }`}
            >
              <span
                className={`${isActive ? "text-white" : "text-teal-300/70 group-hover:text-teal-300"}`}
              >
                {item.icon}
              </span>
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* User Profile Snippet */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-xs font-bold ring-2 ring-teal-800">
            AU
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin User</span>
            <span className="text-xs text-teal-300/80">Super Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
