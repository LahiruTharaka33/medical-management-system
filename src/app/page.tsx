import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      {/* Main Content Wrapper - Shifted by sidebar width on desktop */}
      <div className="flex-1 transition-all duration-300 md:ml-64">
        <Dashboard />
      </div>
    </div>
  );
}
