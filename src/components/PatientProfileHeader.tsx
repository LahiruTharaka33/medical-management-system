import React from 'react';
import { PatientData } from '@/actions/patients';

export default function PatientProfileHeader({ patient }: { patient: PatientData }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg ring-4 ring-teal-50 dark:ring-teal-900/50">
                    <span className="text-3xl font-bold text-white">
                        {patient.firstName.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {patient.firstName} {patient.lastName}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium dark:bg-slate-700 dark:text-slate-300">
                            Age: {patient.age}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium dark:bg-slate-700 dark:text-slate-300 capitalize">
                            {patient.gender}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium dark:bg-slate-700 dark:text-slate-300 font-mono">
                            NIC: {patient.nic}
                        </span>
                    </div>
                </div>

                {/* Optional Status or Actions (Placeholder for now) */}
                <div className="hidden md:block">
                    {/* Could add 'Last Visit' or 'Active' status here later */}
                </div>
            </div>
        </div>
    );
}
