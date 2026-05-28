import React from 'react';
import Sidebar from "@/components/Sidebar";
import { getPatientById } from "@/actions/patients";
import { notFound, redirect } from "next/navigation";
import Link from 'next/link';

import PatientHistoryNavigator from '@/components/PatientHistoryNavigator';

// Component Imports
import PatientProfileHeader from '@/components/PatientProfileHeader';
import ChronicIllnessForm from '@/components/ChronicIllnessForm';
import PresentingComplainForm from '@/components/PresentingComplainForm';
import ProfileTabs from '@/components/ProfileTabs';

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);

export const dynamic = 'force-dynamic';

export default async function ClinicalProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const patientResult = await getPatientById(id);

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

                    {/* Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main History */}
                        <div className="lg:col-span-2 space-y-6">
                            <ProfileTabs
                                presentingComplain={
                                    <PresentingComplainForm patientId={patient.id} savedLogs={(patient as any).presentingComplains || []} />
                                }
                                chronicIllness={
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6">
                                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Chronic Illness</h2>
                                        
                                        {/* Chronic Illness Forms */}
                                        <ChronicIllnessForm 
                                            patientId={patient.id} 
                                            initialFbs={(patient as any).chronicIllnessProfile?.fbs || null} 
                                            initialHba1c={(patient as any).chronicIllnessProfile?.hba1c || null} 
                                            initialBloodPressure={(patient as any).chronicIllnessProfile?.bloodPressure || null}
                                            initialTotalCholesterol={(patient as any).chronicIllnessProfile?.totalCholesterol || null}
                                            initialTriglycerides={(patient as any).chronicIllnessProfile?.triglycerides || null}
                                            initialHdl={(patient as any).chronicIllnessProfile?.hdl || null}
                                            initialLdl={(patient as any).chronicIllnessProfile?.ldl || null}
                                            initialDiabetesOnSet={(patient as any).chronicIllnessProfile?.diabetesOnSet || null}
                                            initialDiabetesIsOnDrugs={(patient as any).chronicIllnessProfile?.diabetesIsOnDrugs || false}
                                            initialDiabetesDrugsText={(patient as any).chronicIllnessProfile?.diabetesDrugsText || null}
                                            initialDiabetesSugarControl={(patient as any).chronicIllnessProfile?.diabetesSugarControl || false}
                                            initialDiabetesComplications={(patient as any).chronicIllnessProfile?.diabetesComplications || null}
                                            initialHtnOnSet={(patient as any).chronicIllnessProfile?.htnOnSet || null}
                                            initialHtnIsOnDrugs={(patient as any).chronicIllnessProfile?.htnIsOnDrugs || false}
                                            initialHtnDrugsText={(patient as any).chronicIllnessProfile?.htnDrugsText || null}
                                            initialDyslipidemiaOnSet={(patient as any).chronicIllnessProfile?.dyslipidemiaOnSet || null}
                                            initialDyslipidemiaIsOnDrugs={(patient as any).chronicIllnessProfile?.dyslipidemiaIsOnDrugs || false}
                                            initialDyslipidemiaDrugsText={(patient as any).chronicIllnessProfile?.dyslipidemiaDrugsText || null}
                                            initialDietAndLifestyleText={(patient as any).chronicIllnessProfile?.dietAndLifestyleText || null}
                                            initialAssessOfComplicationsText={(patient as any).chronicIllnessProfile?.assessOfComplicationsText || null}
                                            initialOtherChronicIllnessesText={(patient as any).chronicIllnessProfile?.otherChronicIllnessesText || null}
                                            diabetesUpdatedAt={(patient as any).chronicIllnessProfile?.diabetesUpdatedAt || null}
                                            htnUpdatedAt={(patient as any).chronicIllnessProfile?.htnUpdatedAt || null}
                                            dyslipidemiaUpdatedAt={(patient as any).chronicIllnessProfile?.dyslipidemiaUpdatedAt || null}
                                            dietAndLifestyleUpdatedAt={(patient as any).chronicIllnessProfile?.dietAndLifestyleUpdatedAt || null}
                                            assessOfComplicationsUpdatedAt={(patient as any).chronicIllnessProfile?.assessOfComplicationsUpdatedAt || null}
                                            otherChronicIllnessesUpdatedAt={(patient as any).chronicIllnessProfile?.otherChronicIllnessesUpdatedAt || null}
                                            historyLogs={(patient as any).chronicIllnessHistories || []}
                                        />
                                    </div>
                                }
                            />
                        </div>

                        {/* Right Column - Patient History */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 max-h-[800px] flex flex-col">
                                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Patient History</h3>
                                <PatientHistoryNavigator records={(patient as any).presentingComplains || []} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
