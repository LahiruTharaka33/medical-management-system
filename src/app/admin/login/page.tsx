import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section - Admin themed */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-10 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-teal-500/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-teal-400/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                </div>
                <h1 className="text-3xl font-bold">
                  NewMed <span className="text-teal-400">Admin</span>
                </h1>
              </div>
              <p className="text-slate-300 text-sm">Administrative Portal</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Admin Access
              </h2>
              <p className="text-slate-500 text-sm">
                Sign in with your administrator credentials
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                </div>
              }
            >
              <LoginForm redirectTo="/admin/dashboard" />
            </Suspense>
          </div>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium"
              >
                ← User Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-slate-400 mt-6">
          © 2026 NewMed. All rights reserved.
        </p>
      </div>
    </main>
  );
}
