'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePresentingComplain } from '@/actions/patients'

type PresentingComplainLog = {
    id: string;
    createdAt: Date;
    symptom: string | null;
    examination: string | null;
    investigation: string | null;
    diagnose: string | null;
}

export default function PresentingComplainForm({ patientId, savedLogs = [] }: { patientId: string, savedLogs?: PresentingComplainLog[] }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [symptom, setSymptom] = useState('')
    const [examination, setExamination] = useState('')
    const [investigation, setInvestigation] = useState('')
    const [diagnose, setDiagnose] = useState('')
    
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const hasContent = symptom.trim() !== '' || examination.trim() !== '' || investigation.trim() !== '' || diagnose.trim() !== ''

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hasContent) return

        setIsSaving(true)
        setMessage('')
        setError('')

        const result = await savePresentingComplain(patientId, {
            symptom: symptom.trim() || null,
            examination: examination.trim() || null,
            investigation: investigation.trim() || null,
            diagnose: diagnose.trim() || null
        })

        if (result.success) {
            setMessage('Presenting complain log saved successfully.')
            // Clear out fields for the next entry
            setSymptom('')
            setExamination('')
            setInvestigation('')
            setDiagnose('')
            router.refresh()
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage('')
            }, 3000)
        } else {
            setError(result.error || 'Failed to save presenting complain data')
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-6">
            {/* Form Section Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 transition-all duration-300">
                <div className={`flex items-center justify-between gap-4 ${isExpanded ? 'mb-6' : 'mb-0'}`}>
                    <button 
                        type="button" 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        Presenting Complain
                    </button>
                </div>
                
                {isExpanded && (
                    <form onSubmit={handleSave} className="space-y-6 fade-in-up">
                        {/* Symptom Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-6 mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Symptom</h3>
                </div>
                <div className="w-full">
                    <textarea
                        name="symptom"
                        id="symptom"
                        rows={4}
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                        placeholder="Enter symptoms details (markdown supported)..."
                    />
                </div>
            </div>

            {/* Examination Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-6 mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Examination</h3>
                </div>
                <div className="w-full">
                    <textarea
                        name="examination"
                        id="examination"
                        rows={4}
                        value={examination}
                        onChange={(e) => setExamination(e.target.value)}
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                        placeholder="Enter examination details (markdown supported)..."
                    />
                </div>
            </div>

            {/* Investigation Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-6 mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Investigation</h3>
                </div>
                <div className="w-full">
                    <textarea
                        name="investigation"
                        id="investigation"
                        rows={4}
                        value={investigation}
                        onChange={(e) => setInvestigation(e.target.value)}
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                        placeholder="Enter investigation details (markdown supported)..."
                    />
                </div>
            </div>

            {/* Diagnose Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-6 mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Diagnose</h3>
                </div>
                <div className="w-full">
                    <textarea
                        name="diagnose"
                        id="diagnose"
                        rows={4}
                        value={diagnose}
                        onChange={(e) => setDiagnose(e.target.value)}
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                        placeholder="Enter diagnose details (markdown supported)..."
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                <div className="text-sm">
                    {message && <span className="text-teal-600 dark:text-teal-400 font-medium mr-4">{message}</span>}
                    {error && <span className="text-rose-600 dark:text-rose-400 font-medium mr-4">{error}</span>}
                </div>
                <button
                    type="submit"
                    disabled={isSaving || !hasContent}
                    className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 bg-teal-600 text-white hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200 disabled:cursor-not-allowed disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:disabled:hover:bg-slate-800"
                >
                    {isSaving ? 'Saving...' : 'Save Data'}
                </button>
            </div>
        </form>
                )}
            </div>

            {/* Saved Logs Visualization Card */}
            {savedLogs.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 fade-in-up">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Saved Records</h2>
                    <div className="space-y-6">
                        {savedLogs.map((log) => (
                            <div key={log.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                                <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(log.createdAt))}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Symptom</h4>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{log.symptom || '—'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Examination</h4>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{log.examination || '—'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Investigation</h4>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{log.investigation || '—'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Diagnose</h4>
                                            {log.diagnose ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    {log.diagnose}
                                                </span>
                                            ) : (
                                                <p className="text-sm text-slate-800 dark:text-slate-200">—</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
