import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-10 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">NewMed</h1>
            </div>
            <p className="text-teal-100 text-sm">Medical Management System</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm">
                Please sign in to your account
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium"
              >
                Admin Login →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          © 2026 NewMed. All rights reserved.
        </p>
      </div>
    </main>
  );
}
