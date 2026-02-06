import AdminSidebar from "@/components/AdminSidebar";
import AdminAccessGroup from "@/components/AdminAccessGroup";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminSidebar />
      {/* Main Content Wrapper - Shifted by sidebar width on desktop */}
      <div className="flex-1 transition-all duration-300 md:ml-64">
        <AdminAccessGroup />
      </div>
    </div>
  );
}
