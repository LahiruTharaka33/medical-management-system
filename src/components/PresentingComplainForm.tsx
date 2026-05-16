'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { savePresentingComplain } from '@/actions/patients'
import { getMedicines, MedicineData, getDayPatterns, createDayPattern } from '@/actions/medicines'

type PresentingComplainLog = {
    id: string;
    createdAt: Date;
    symptom: string | null;
    examination: string | null;
    investigation: string | null;
    diagnose: string | null;
    prescriptions?: {
        id: string;
        medicine: MedicineData;
        dosage: string;
        dayPattern: string;
    }[];
}

export default function PresentingComplainForm({ patientId, savedLogs = [] }: { patientId: string, savedLogs?: PresentingComplainLog[] }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPresentingExpanded, setIsPresentingExpanded] = useState(true)
    const [symptom, setSymptom] = useState('')
    const [examination, setExamination] = useState('')
    const [investigation, setInvestigation] = useState('')
    const [diagnose, setDiagnose] = useState('')
    
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    // Prescription States
    const [isPrescriptionExpanded, setIsPrescriptionExpanded] = useState(true)
    const [prescriptions, setPrescriptions] = useState<{ id: string, medicineId: string, dosage: string, dayPattern: string }[]>([])
    const [availableMedicines, setAvailableMedicines] = useState<MedicineData[]>([])
    const [availablePatterns, setAvailablePatterns] = useState<string[]>([])
    const [isAddingNewPattern, setIsAddingNewPattern] = useState(false)
    const [newPattern, setNewPattern] = useState('')
    const [addingPatternLoading, setAddingPatternLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const medRes = await getMedicines()
            if (medRes.success && medRes.data) {
                setAvailableMedicines(medRes.data)
            }
            const patRes = await getDayPatterns()
            const defaultPatterns = ['n', 'm', 'bd', 'tds', 'qds']
            if (patRes.success && patRes.data) {
                const fetchedPatterns = patRes.data.map(p => p.name)
                setAvailablePatterns(Array.from(new Set([...defaultPatterns, ...fetchedPatterns])))
            } else {
                setAvailablePatterns(defaultPatterns)
            }
        }
        fetchData()
    }, [])

    const handleAddMedicine = () => {
        setPrescriptions([...prescriptions, { id: Math.random().toString(36).substr(2, 9), medicineId: '', dosage: '', dayPattern: 'n' }])
    }

    const handleRemoveMedicine = (id: string) => {
        setPrescriptions(prescriptions.filter(p => p.id !== id))
    }

    const handlePrescriptionChange = (id: string, field: string, value: string) => {
        setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, [field]: value } : p))
    }

    const handleAddNewPattern = async () => {
        if (!newPattern.trim()) return
        setAddingPatternLoading(true)
        const res = await createDayPattern(newPattern.trim())
        if (res.success) {
            setAvailablePatterns(prev => Array.from(new Set([...prev, newPattern.trim()])))
            setNewPattern('')
            setIsAddingNewPattern(false)
        }
        setAddingPatternLoading(false)
    }

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
            diagnose: diagnose.trim() || null,
            prescriptions: prescriptions.filter(p => p.medicineId).map(p => ({
                medicineId: p.medicineId,
                dosage: p.dosage,
                dayPattern: p.dayPattern
            }))
        })

        if (result.success) {
            setMessage('Presenting complain log saved successfully.')
            // Clear out fields for the next entry
            setSymptom('')
            setExamination('')
            setInvestigation('')
            setDiagnose('')
            setPrescriptions([])
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
                        Patient Consultation
                    </button>
                </div>
                
                {isExpanded && (
                    <form onSubmit={handleSave} className="space-y-6 fade-in-up">
                        {/* Combined Form Card */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="p-6">
                                <div className={`flex items-center justify-between gap-4 ${isPresentingExpanded ? 'mb-6' : 'mb-0'}`}>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsPresentingExpanded(!isPresentingExpanded)} 
                                        className="flex items-center gap-2 group transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-all duration-200 ${isPresentingExpanded ? 'rotate-180' : ''}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Presenting Complain</h3>
                                    </button>
                                </div>

                                {isPresentingExpanded && (
                                    <div className="space-y-8 fade-in-up">
                                {/* Symptom Sub-section */}
                                <div>
                                    <div className="flex items-center gap-6 mb-3">
                                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Symptom</h3>
                                    </div>
                                    <div className="w-full">
                                        <textarea
                                            name="symptom"
                                            id="symptom"
                                            rows={3}
                                            value={symptom}
                                            onChange={(e) => setSymptom(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                                            placeholder="Enter symptoms details (markdown supported)..."
                                        />
                                    </div>
                                </div>

                                {/* Examination Sub-section */}
                                <div>
                                    <div className="flex items-center gap-6 mb-3">
                                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Examination</h3>
                                    </div>
                                    <div className="w-full">
                                        <textarea
                                            name="examination"
                                            id="examination"
                                            rows={3}
                                            value={examination}
                                            onChange={(e) => setExamination(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                                            placeholder="Enter examination details (markdown supported)..."
                                        />
                                    </div>
                                </div>

                                {/* Investigation Sub-section */}
                                <div>
                                    <div className="flex items-center gap-6 mb-3">
                                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Investigation</h3>
                                    </div>
                                    <div className="w-full">
                                        <textarea
                                            name="investigation"
                                            id="investigation"
                                            rows={3}
                                            value={investigation}
                                            onChange={(e) => setInvestigation(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                                            placeholder="Enter investigation details (markdown supported)..."
                                        />
                                    </div>
                                </div>

                                {/* Diagnose Sub-section */}
                                <div>
                                    <div className="flex items-center gap-6 mb-3">
                                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Diagnose</h3>
                                    </div>
                                    <div className="w-full">
                                        <textarea
                                            name="diagnose"
                                            id="diagnose"
                                            rows={3}
                                            value={diagnose}
                                            onChange={(e) => setDiagnose(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:focus:ring-teal-500 shadow-sm ring-slate-200 dark:ring-slate-700"
                                            placeholder="Enter diagnose details (markdown supported)..."
                                        />
                                    </div>
                                </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prescription Section Card */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="p-6">
                                <div className={`flex items-center justify-between gap-4 ${isPrescriptionExpanded ? 'mb-6' : 'mb-0'}`}>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsPrescriptionExpanded(!isPrescriptionExpanded)} 
                                        className="flex items-center gap-2 group transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-all duration-200 ${isPrescriptionExpanded ? 'rotate-180' : ''}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Prescription</h3>
                                    </button>
                                    {isPrescriptionExpanded && (
                                        <button
                                            type="button"
                                            onClick={handleAddMedicine}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                            </svg>
                                            Add Medicine
                                        </button>
                                    )}
                                </div>

                                {isPrescriptionExpanded && (
                                    <div className="space-y-4 fade-in-up">
                                        {prescriptions.length === 0 ? (
                                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">No medicines added yet.</p>
                                                <button
                                                    type="button"
                                                    onClick={handleAddMedicine}
                                                    className="mt-2 text-xs font-semibold text-teal-600 hover:text-teal-500"
                                                >
                                                    Click here to add one
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <table className="w-full text-left table-fixed border-separate border-spacing-y-2">
                                                    <thead>
                                                        <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                            <th className="pb-3 px-2 w-[45%]">Medicine</th>
                                                            <th className="pb-3 px-2 w-[20%]">Dosage</th>
                                                            <th className="pb-3 px-2 w-[25%]">Day Pattern</th>
                                                            <th className="pb-3 px-2 w-[10%] text-right"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {prescriptions.map((prescription) => (
                                                            <PrescriptionRow 
                                                                key={prescription.id}
                                                                prescription={prescription}
                                                                availableMedicines={availableMedicines}
                                                                availablePatterns={availablePatterns}
                                                                onPatternAdded={(newP) => {
                                                                    setAvailablePatterns(prev => Array.from(new Set([...prev, newP])))
                                                                }}
                                                                onPatternDeleted={(delP) => {
                                                                    setAvailablePatterns(prev => prev.filter(p => p !== delP))
                                                                }}
                                                                onRemove={() => handleRemoveMedicine(prescription.id)}
                                                                onChange={(field, value) => handlePrescriptionChange(prescription.id, field, value)}
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Saved Records</h2>
                    <div className="space-y-6">
                        {savedLogs.map((log) => (
                            <SavedRecordCard key={log.id} log={log} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function SavedRecordCard({ log }: { log: PresentingComplainLog }) {
    const [activeTab, setActiveTab] = useState<'consultation' | 'medicine'>('consultation')
    const hasPrescriptions = log.prescriptions && log.prescriptions.length > 0

    return (
        <div 
            id={`record-${new Date(log.createdAt).getTime()}`}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden scroll-mt-24"
        >
            <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-8">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(log.createdAt))}
                </span>
                
                {/* Mini Tabs */}
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('consultation')}
                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'consultation' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Consultation
                    </button>
                    <button
                        onClick={() => setActiveTab('medicine')}
                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'medicine' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Prescription {hasPrescriptions ? `(${log.prescriptions?.length})` : ''}
                    </button>
                </div>
            </div>

            <div className="p-5">
                {activeTab === 'consultation' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-up">
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
                ) : (
                    <div className="fade-in-up">
                        {!hasPrescriptions ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-slate-500 dark:text-slate-400">No medicines prescribed in this consultation.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700/50">
                                            <th className="pb-2 px-2">Medicine</th>
                                            <th className="pb-2 px-2">Dosage</th>
                                            <th className="pb-2 px-2">Day Pattern</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                                        {log.prescriptions?.map((p) => (
                                            <tr key={p.id} className="text-sm">
                                                <td className="py-1.5 px-2">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{p.medicine.genericName}</span>
                                                </td>
                                                <td className="py-1.5 px-2 text-slate-600 dark:text-slate-300">
                                                    {p.dosage} <span className="text-xs opacity-70">{p.medicine.unit}</span>
                                                </td>
                                                <td className="py-1.5 px-2">
                                                    <span className="inline-flex items-center rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                                                        {p.dayPattern}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function PrescriptionRow({ 
    prescription, 
    availableMedicines, 
    availablePatterns,
    onPatternAdded,
    onPatternDeleted,
    onRemove,
    onChange
}: { 
    prescription: any, 
    availableMedicines: MedicineData[], 
    availablePatterns: string[],
    onPatternAdded: (newP: string) => void,
    onPatternDeleted: (delP: string) => void,
    onRemove: () => void,
    onChange: (field: string, value: string) => void
}) {
    const selectedMedicine = availableMedicines.find(m => m.id === prescription.medicineId)

    return (
        <tr className="group">
            <td className="py-2 px-2 align-top">
                <MedicineCombobox 
                    value={prescription.medicineId} 
                    options={availableMedicines} 
                    onChange={(val) => onChange('medicineId', val)} 
                />
            </td>
            <td className="py-2 px-2 align-top">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={prescription.dosage}
                        onChange={(e) => onChange('dosage', e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm dark:bg-slate-900 dark:text-white dark:ring-slate-700 h-[38px]"
                        placeholder="0"
                    />
                    {selectedMedicine && (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap min-w-[30px]">
                            {selectedMedicine.unit}
                        </span>
                    )}
                </div>
            </td>
            <td className="py-2 px-2 align-top">
                <DayPatternSelect
                    value={prescription.dayPattern}
                    options={availablePatterns}
                    onChange={(val) => onChange('dayPattern', val)}
                    onPatternAdded={onPatternAdded}
                    onPatternDeleted={onPatternDeleted}
                />
            </td>
            <td className="py-2 px-2 align-top text-right">
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove medicine"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </td>
        </tr>
    )
}

function DayPatternSelect({ 
    value, 
    options, 
    onChange, 
    onPatternAdded,
    onPatternDeleted,
}: { 
    value: string, 
    options: string[], 
    onChange: (val: string) => void,
    onPatternAdded: (newP: string) => void,
    onPatternDeleted: (delP: string) => void,
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [newPattern, setNewPattern] = useState('')
    const [addingPatternLoading, setAddingPatternLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const defaultPatterns = ['n', 'm', 'bd', 'tds', 'qds']

    const handleDelete = async (pattern: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (defaultPatterns.includes(pattern)) {
            // Locally hide default patterns for this session if requested, 
            // but usually we don't delete defaults from DB
            onPatternDeleted(pattern)
            return
        }
        if (!confirm(`Are you sure you want to delete the pattern "${pattern}"?`)) return
        
        const { deleteDayPattern } = await import('@/actions/medicines')
        const res = await deleteDayPattern(pattern)
        if (res.success) {
            onPatternDeleted(pattern)
            if (value === pattern) onChange('')
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setIsAdding(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleAddNew = async () => {
        if (!newPattern.trim()) return
        setAddingPatternLoading(true)
        const res = await createDayPattern(newPattern.trim())
        if (res.success) {
            onPatternAdded(newPattern.trim())
            onChange(newPattern.trim())
            setNewPattern('')
            setIsAdding(false)
            setIsOpen(false)
        }
        setAddingPatternLoading(false)
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm dark:bg-slate-900 dark:text-white dark:ring-slate-700 h-[38px]"
            >
                <span className="truncate">{value || 'Select Pattern'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>

            {isOpen && (
                <div className="absolute z-[110] mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    <div className="overflow-y-auto max-h-48 divide-y divide-slate-100 dark:divide-slate-700">
                        {options.map((pattern) => (
                            <div
                                key={pattern}
                                onClick={() => {
                                    onChange(pattern)
                                    setIsOpen(false)
                                }}
                                className={`group/item flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${value === pattern ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}`}
                            >
                                <span>{pattern}</span>
                                <button
                                    type="button"
                                    onClick={(e) => handleDelete(pattern, e)}
                                    className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
                                    title="Delete pattern"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 p-2 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                        {isAdding ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    autoFocus
                                    value={newPattern}
                                    onChange={(e) => setNewPattern(e.target.value)}
                                    className="flex-1 rounded border border-teal-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                                    placeholder="Pattern..."
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            await handleAddNew()
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddNew}
                                    disabled={addingPatternLoading}
                                    className="rounded bg-teal-600 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {addingPatternLoading ? '...' : 'Add'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAdding(true)}
                                className="flex w-full items-center justify-center gap-2 rounded py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Add New Pattern
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function MedicineCombobox({ value, options, onChange }: { value: string, options: MedicineData[], onChange: (val: string) => void }) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const filteredOptions = query === '' 
        ? options 
        : options.filter((option) => {
            return option.genericName.toLowerCase().includes(query.toLowerCase()) || 
                   option.brand.toLowerCase().includes(query.toLowerCase()) ||
                   option.code.toLowerCase().includes(query.toLowerCase())
        })

    const selectedOption = options.find(o => o.id === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm dark:bg-slate-900 dark:text-white dark:ring-slate-700 h-[38px]"
                    placeholder="Search medicine..."
                    value={isOpen ? query : (selectedOption ? `${selectedOption.genericName} (${selectedOption.brand})` : '')}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Zm-3.76 9.2a.75.75 0 0 1 1.06.04l2.7 2.908 2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 .04-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-slate-800 dark:ring-slate-700">
                    {filteredOptions.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-slate-700 dark:text-slate-400">
                            Nothing found.
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-teal-600 hover:text-white transition-colors ${value === option.id ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30' : 'text-slate-900 dark:text-slate-200'}`}
                                onClick={() => {
                                    onChange(option.id!)
                                    setQuery('')
                                    setIsOpen(false)
                                }}
                            >
                                <div className="flex flex-col">
                                    <span className="block truncate font-medium">{option.genericName}</span>
                                    <span className="block truncate text-xs opacity-70">{option.brand} - {option.code}</span>
                                </div>
                                {value === option.id && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-teal-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
