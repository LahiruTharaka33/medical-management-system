import Sidebar from "@/components/Sidebar";
import MedicinesView from "@/components/MedicinesView";
import { getMedicines } from "@/actions/medicines";

export const dynamic = 'force-dynamic';

export default async function MedicinesPage() {
    const result = await getMedicines();
    const medicines = result.success ? result.data : [];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 md:ml-20 lg:ml-64">
                <MedicinesView initialMedicines={medicines || []} />
            </div>
        </div>
    );
}
