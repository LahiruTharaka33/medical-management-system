import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { getPatientsCount } from "@/actions/patients";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getPatientsCount();
  const count = result.success ? result.data : 0;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      {/* Main Content Wrapper - Shifted by sidebar width on desktop */}
      <div className="flex-1 transition-all duration-300 md:ml-20 lg:ml-64">
        <Dashboard totalPatients={count} />
      </div>
    </div>
  );
}
