import React from 'react'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { getPatientById, getChronicIllnessHistory } from '@/actions/patients'
import { notFound } from 'next/navigation'
import HistoryPageDashboard from './HistoryPageDashboard'

export const dynamic = 'force-dynamic'

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
)

interface Props {
    params: Promise<{ id: string }>
    searchParams: Promise<{ section?: string }>
}

export default async function ChronicIllnessHistoryPage({ params, searchParams }: Props) {
    const { id } = await params
    const resolvedSearchParams = await searchParams
    const section = resolvedSearchParams.section || 'DIABETES'

    const patientResult = await getPatientById(id)

    if (!patientResult.success || !patientResult.data) {
        return notFound()
    }

    const patient = patientResult.data

    const historyResult = await getChronicIllnessHistory(id)
    const logs = historyResult.success && historyResult.data ? historyResult.data : []

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 md:ml-20 lg:ml-64">
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors p-8">
                    {/* Navigation */}
                    <Link
                        href={`/clinical-profile/${id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors mb-6 group"
                    >
                        <span className="p-1 rounded-full bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-teal-500 transition-all">
                            <ChevronLeftIcon />
                        </span>
                        Back to Clinical Profile
                    </Link>

                    {/* Patient Summary Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 mb-8 fade-in-up">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Chronic Illness History Log</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                                    {patient.firstName} {patient.lastName}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                                    <span className="font-medium text-slate-400 mr-1.5">NIC:</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{patient.nic}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                                    <span className="font-medium text-slate-400 mr-1.5">Age:</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{patient.age} Yrs</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                                    <span className="font-medium text-slate-400 mr-1.5">Gender:</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{patient.gender}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Logs Dashboard */}
                    <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
                        <HistoryPageDashboard logs={logs as any} patientId={id} initialSection={section} />
                    </div>
                </div>
            </div>
        </div>
    )
}
