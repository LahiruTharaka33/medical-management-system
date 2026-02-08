import React from 'react';
import Sidebar from "@/components/Sidebar";
import { getPatientById } from "@/actions/patients";
import { getLatestVitalSigns } from "@/actions/vitalSigns";
import { notFound, redirect } from "next/navigation";
import Link from 'next/link';

// Component Imports
import PatientProfileHeader from '@/components/PatientProfileHeader';
import VitalSignsSection from '@/components/VitalSignsSection';

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);

export const dynamic = 'force-dynamic';

export default async function ClinicalProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [patientResult, vitalsResult] = await Promise.all([
        getPatientById(id),
        getLatestVitalSigns(id)
    ]);

    if (!patientResult.success || !patientResult.data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Patient Not Found</h1>
                    <p className="text-slate-500 mb-4">{patientResult.error || "The requested patient could not be found."}</p>
                    <Link href="/clinical-profile" className="text-teal-600 hover:underline">
                        Back to List
                    </Link>
                </div>
            </div>
        );
    }

    const patient = patientResult.data;
    // Serialize date for client component
    const initialVitals = vitalsResult.success && vitalsResult.data ? {
        ...vitalsResult.data,
        recordedAt: vitalsResult.data.recordedAt.toISOString()
    } : null;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 md:ml-64">
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors p-8">
                    {/* Navigation */}
                    <Link
                        href="/clinical-profile"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors mb-6 group"
                    >
                        <span className="p-1 rounded-full bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-teal-500 transition-all">
                            <ChevronLeftIcon />
                        </span>
                        Back to Patient Registry
                    </Link>

                    {/* Header */}
                    <div className="fade-in-up">
                        <PatientProfileHeader patient={patient as any} />
                    </div>

                    {/* Vitals Section */}
                    <div className="fade-in-up delay-100">
                        <VitalSignsSection patientId={patient.id} initialVitals={initialVitals} />
                    </div>

                    {/* Content Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main History */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 h-96 flex items-center justify-center text-slate-400">
                                History Content Coming Soon...
                            </div>
                        </div>

                        {/* Right Column - Notes/Other */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 h-64 flex items-center justify-center text-slate-400">
                                Notes Content Coming Soon...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
