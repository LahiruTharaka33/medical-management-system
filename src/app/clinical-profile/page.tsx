import Sidebar from "@/components/Sidebar";
import ClinicalProfileView from "@/components/ClinicalProfileView";
import { getPatients } from "@/actions/patients";

export const dynamic = 'force-dynamic';

export default async function ClinicalProfilePage() {
    // Reusing the same filtering logic as the Patients page
    const result = await getPatients();
    const patients = result.success ? result.data : [];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 md:ml-64">
                <ClinicalProfileView initialPatients={patients || []} />
            </div>
        </div>
    );
}
