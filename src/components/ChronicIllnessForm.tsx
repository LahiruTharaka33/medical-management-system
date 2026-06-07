'use client'

import React, { useState, useEffect, useRef } from 'react'
import { saveChronicIllnesses } from '@/actions/patients'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type HistoryLog = {
    id: string
    patientId: string
    section: string
    field: string
    oldValue: string | null
    newValue: string | null
    createdAt: Date
}

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
)

const HistoryLogView = ({ logs, sectionKey, patientId }: { logs: HistoryLog[], sectionKey: string, patientId: string }) => {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-sm text-slate-400 dark:text-slate-500 italic py-6 text-center">
                No history logs recorded yet.
            </div>
        )
    }

    const displayedLogs = logs.slice(0, 5)

    return (
        <div className="space-y-1">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedLogs.map((log) => (
                    <div key={log.id} className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-1.5 first:pt-0 last:pb-0 text-sm gap-1.5">
                        <div className="flex items-center flex-wrap gap-1.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{log.field}</span>
                            <span className="text-slate-500 dark:text-slate-400 line-through text-xs bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded max-w-[200px] truncate" title={log.oldValue || ''}>{log.oldValue}</span>
                            <span className="text-slate-400 dark:text-slate-600">→</span>
                            <span className="text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-950/30 px-1.5 py-0.5 rounded max-w-[200px] truncate" title={log.newValue || ''}>{log.newValue}</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                ))}
            </div>
            {logs.length > 5 && (
                <div className="pt-2 text-right border-t border-slate-100 dark:border-slate-800">
                    <Link
                        href={`/clinical-profile/${patientId}/history?section=${sectionKey}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 hover:underline inline-flex items-center gap-1 transition-all"
                    >
                        See more
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function ChronicIllnessForm({ 
    patientId, 
    initialFbs, 
    initialHba1c, 
    initialBloodPressure,
    initialTotalCholesterol,
    initialTriglycerides,
    initialHdl,
    initialLdl,
    initialDiabetesOnSet,
    initialDiabetesIsOnDrugs,
    initialDiabetesDrugsText,
    initialDiabetesSugarControl,
    initialDiabetesComplications,
    initialHtnOnSet,
    initialHtnIsOnDrugs,
    initialHtnDrugsText,
    initialDyslipidemiaOnSet,
    initialDyslipidemiaIsOnDrugs,
    initialDyslipidemiaDrugsText,
    initialDietAndLifestyleText,
    initialAssessOfComplicationsText,
    initialOtherChronicIllnessesText,
    diabetesUpdatedAt,
    htnUpdatedAt,
    dyslipidemiaUpdatedAt,
    dietAndLifestyleUpdatedAt,
    assessOfComplicationsUpdatedAt,
    otherChronicIllnessesUpdatedAt,
    historyLogs = []
}: { 
    patientId: string, 
    initialFbs: number | null, 
    initialHba1c: number | null, 
    initialBloodPressure: string | null,
    initialTotalCholesterol: number | null,
    initialTriglycerides: number | null,
    initialHdl: number | null,
    initialLdl: number | null,
    initialDiabetesOnSet: string | null,
    initialDiabetesIsOnDrugs: boolean,
    initialDiabetesDrugsText: string | null,
    initialDiabetesSugarControl: boolean,
    initialDiabetesComplications: string | null,
    initialHtnOnSet: string | null,
    initialHtnIsOnDrugs: boolean,
    initialHtnDrugsText: string | null,
    initialDyslipidemiaOnSet: string | null,
    initialDyslipidemiaIsOnDrugs: boolean,
    initialDyslipidemiaDrugsText: string | null,
    initialDietAndLifestyleText: string | null,
    initialAssessOfComplicationsText: string | null,
    initialOtherChronicIllnessesText: string | null,
    diabetesUpdatedAt: Date | null,
    htnUpdatedAt: Date | null,
    dyslipidemiaUpdatedAt: Date | null,
    dietAndLifestyleUpdatedAt: Date | null,
    assessOfComplicationsUpdatedAt: Date | null,
    otherChronicIllnessesUpdatedAt: Date | null,
    historyLogs?: HistoryLog[]
}) {
    const [fbs, setFbs] = useState(initialFbs ? String(initialFbs) : '')
    const [hba1c, setHba1c] = useState(initialHba1c ? String(initialHba1c) : '')
    const [bp, setBp] = useState(initialBloodPressure || '')
    const [totalCholesterol, setTotalCholesterol] = useState(initialTotalCholesterol ? String(initialTotalCholesterol) : '')
    const [triglycerides, setTriglycerides] = useState(initialTriglycerides ? String(initialTriglycerides) : '')
    const [hdl, setHdl] = useState(initialHdl ? String(initialHdl) : '')
    const [ldl, setLdl] = useState(initialLdl ? String(initialLdl) : '')
    
    const [savedFbs, setSavedFbs] = useState(fbs)
    const [savedHba1c, setSavedHba1c] = useState(hba1c)
    const [savedBp, setSavedBp] = useState(bp)
    const [savedTotalCholesterol, setSavedTotalCholesterol] = useState(totalCholesterol)
    const [savedTriglycerides, setSavedTriglycerides] = useState(triglycerides)
    const [savedHdl, setSavedHdl] = useState(hdl)
    const [savedLdl, setSavedLdl] = useState(ldl)

    const [diabetesTab, setDiabetesTab] = useState<'measurements' | 'details' | 'drugs' | 'sugarControl' | 'history'>('measurements')
    const [onSetValue, setOnSetValue] = useState(initialDiabetesOnSet || '')
    const [savedOnSet, setSavedOnSet] = useState(onSetValue)
    
    const [isOnDrugs, setIsOnDrugs] = useState(initialDiabetesIsOnDrugs)
    const [savedIsOnDrugs, setSavedIsOnDrugs] = useState(isOnDrugs)
    
    const [drugsText, setDrugsText] = useState(initialDiabetesDrugsText || '')
    const [savedDrugsText, setSavedDrugsText] = useState(drugsText)

    const [isSugarControl, setIsSugarControl] = useState(initialDiabetesSugarControl)
    const [savedIsSugarControl, setSavedIsSugarControl] = useState(isSugarControl)

    const [complicationsText, setComplicationsText] = useState(initialDiabetesComplications || '')
    const [savedComplicationsText, setSavedComplicationsText] = useState(complicationsText)

    const [htnTab, setHtnTab] = useState<'measurements' | 'details' | 'drugs' | 'history'>('measurements')
    const [htnOnSetValue, setHtnOnSetValue] = useState(initialHtnOnSet || '')
    const [savedHtnOnSet, setSavedHtnOnSet] = useState(htnOnSetValue)
    const [htnIsOnDrugs, setHtnIsOnDrugs] = useState(initialHtnIsOnDrugs)
    const [savedHtnIsOnDrugs, setSavedHtnIsOnDrugs] = useState(htnIsOnDrugs)
    const [htnDrugsText, setHtnDrugsText] = useState(initialHtnDrugsText || '')
    const [savedHtnDrugsText, setSavedHtnDrugsText] = useState(htnDrugsText)

    const [dyslipidemiaTab, setDyslipidemiaTab] = useState<'measurements' | 'details' | 'drugs' | 'history'>('measurements')
    const [dyslipidemiaOnSetValue, setDyslipidemiaOnSetValue] = useState(initialDyslipidemiaOnSet || '')
    const [savedDyslipidemiaOnSet, setSavedDyslipidemiaOnSet] = useState(dyslipidemiaOnSetValue)
    const [dyslipidemiaIsOnDrugs, setDyslipidemiaIsOnDrugs] = useState(initialDyslipidemiaIsOnDrugs)
    const [savedDyslipidemiaIsOnDrugs, setSavedDyslipidemiaIsOnDrugs] = useState(dyslipidemiaIsOnDrugs)
    const [dyslipidemiaDrugsText, setDyslipidemiaDrugsText] = useState(initialDyslipidemiaDrugsText || '')
    const [savedDyslipidemiaDrugsText, setSavedDyslipidemiaDrugsText] = useState(dyslipidemiaDrugsText)

    const [dietAndLifestyleText, setDietAndLifestyleText] = useState(initialDietAndLifestyleText || '')
    const [savedDietAndLifestyleText, setSavedDietAndLifestyleText] = useState(dietAndLifestyleText)
    const [dietAndLifestyleTab, setDietAndLifestyleTab] = useState<'form' | 'history'>('form')

    const [assessOfComplicationsText, setAssessOfComplicationsText] = useState(initialAssessOfComplicationsText || '')
    const [savedAssessOfComplicationsText, setSavedAssessOfComplicationsText] = useState(assessOfComplicationsText)
    const [assessOfComplicationsTab, setAssessOfComplicationsTab] = useState<'form' | 'history'>('form')

    const [otherChronicIllnessesText, setOtherChronicIllnessesText] = useState(initialOtherChronicIllnessesText || '')
    const [savedOtherChronicIllnessesText, setSavedOtherChronicIllnessesText] = useState(otherChronicIllnessesText)
    const [otherChronicIllnessesTab, setOtherChronicIllnessesTab] = useState<'form' | 'history'>('form')

    const [isDiabetesEditing, setIsDiabetesEditing] = useState(false)
    const [isHtnEditing, setIsHtnEditing] = useState(false)
    const [isDyslipidemiaEditing, setIsDyslipidemiaEditing] = useState(false)
    const [isDietAndLifestyleEditing, setIsDietAndLifestyleEditing] = useState(false)
    const [isDietAndLifestyleExpanded, setIsDietAndLifestyleExpanded] = useState(false)
    const [isAssessOfComplicationsEditing, setIsAssessOfComplicationsEditing] = useState(false)
    const [isAssessOfComplicationsExpanded, setIsAssessOfComplicationsExpanded] = useState(false)
    const [isOtherChronicIllnessesEditing, setIsOtherChronicIllnessesEditing] = useState(false)
    const [isOtherChronicIllnessesExpanded, setIsOtherChronicIllnessesExpanded] = useState(false)

    const diabetesLogs = historyLogs.filter(log => log.section === 'DIABETES')
    const htnLogs = historyLogs.filter(log => log.section === 'HTN')
    const dyslipidemiaLogs = historyLogs.filter(log => log.section === 'DYSLIPIDEMIA')
    const dietAndLifestyleLogs = historyLogs.filter(log => log.section === 'DIET_LIFESTYLE')
    const assessOfComplicationsLogs = historyLogs.filter(log => log.section === 'ASSESS_COMPLICATIONS')
    const otherChronicIllnessesLogs = historyLogs.filter(log => log.section === 'OTHER_CHRONIC_ILLNESSES')

    const hasChanges = fbs !== savedFbs || hba1c !== savedHba1c || bp !== savedBp || totalCholesterol !== savedTotalCholesterol || triglycerides !== savedTriglycerides || hdl !== savedHdl || ldl !== savedLdl || onSetValue !== savedOnSet || isOnDrugs !== savedIsOnDrugs || drugsText !== savedDrugsText || isSugarControl !== savedIsSugarControl || complicationsText !== savedComplicationsText || htnOnSetValue !== savedHtnOnSet || htnIsOnDrugs !== savedHtnIsOnDrugs || htnDrugsText !== savedHtnDrugsText || dyslipidemiaOnSetValue !== savedDyslipidemiaOnSet || dyslipidemiaIsOnDrugs !== savedDyslipidemiaIsOnDrugs || dyslipidemiaDrugsText !== savedDyslipidemiaDrugsText || dietAndLifestyleText !== savedDietAndLifestyleText || assessOfComplicationsText !== savedAssessOfComplicationsText || otherChronicIllnessesText !== savedOtherChronicIllnessesText
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const performSave = async (): Promise<boolean> => {
        setIsSaving(true)
        setMessage('')
        setError('')

        const fbsValue = fbs ? parseFloat(fbs) : null
        const hba1cValue = hba1c ? parseFloat(hba1c) : null
        const bpValue = bp.trim() ? bp.trim() : null
        const tcValue = totalCholesterol ? parseFloat(totalCholesterol) : null
        const tgValue = triglycerides ? parseFloat(triglycerides) : null
        const hdlValue = hdl ? parseFloat(hdl) : null
        const ldlValue = ldl ? parseFloat(ldl) : null

        if (fbs && isNaN(fbsValue!)) { setError('FBS must be a number'); setIsSaving(false); return false }
        if (hba1c && isNaN(hba1cValue!)) { setError('HbA1c must be a number'); setIsSaving(false); return false }
        if (totalCholesterol && isNaN(tcValue!)) { setError('Total Cholesterol must be a number'); setIsSaving(false); return false }
        if (triglycerides && isNaN(tgValue!)) { setError('Triglycerides must be a number'); setIsSaving(false); return false }
        if (hdl && isNaN(hdlValue!)) { setError('HDL must be a number'); setIsSaving(false); return false }
        if (ldl && isNaN(ldlValue!)) { setError('LDL must be a number'); setIsSaving(false); return false }

        const result = await saveChronicIllnesses(patientId, { 
            fbs: fbsValue, 
            hba1c: hba1cValue, 
            bloodPressure: bpValue,
            totalCholesterol: tcValue,
            triglycerides: tgValue,
            hdl: hdlValue,
            ldl: ldlValue,
            diabetesOnSet: onSetValue || null,
            diabetesIsOnDrugs: isOnDrugs,
            diabetesDrugsText: isOnDrugs ? (drugsText || null) : null,
            diabetesSugarControl: isSugarControl,
            diabetesComplications: isSugarControl ? (complicationsText || null) : null,
            htnOnSet: htnOnSetValue || null,
            htnIsOnDrugs: htnIsOnDrugs,
            htnDrugsText: htnIsOnDrugs ? (htnDrugsText || null) : null,
            dyslipidemiaOnSet: dyslipidemiaOnSetValue || null,
            dyslipidemiaIsOnDrugs: dyslipidemiaIsOnDrugs,
            dyslipidemiaDrugsText: dyslipidemiaIsOnDrugs ? (dyslipidemiaDrugsText || null) : null,
            dietAndLifestyleText: dietAndLifestyleText || null,
            assessOfComplicationsText: assessOfComplicationsText || null,
            otherChronicIllnessesText: otherChronicIllnessesText || null
        })

        let success = false
        if (result.success) {
            setMessage('Saved successfully!')
            setSavedFbs(fbs)
            setSavedHba1c(hba1c)
            setSavedBp(bp)
            setSavedTotalCholesterol(totalCholesterol)
            setSavedTriglycerides(triglycerides)
            setSavedHdl(hdl)
            setSavedLdl(ldl)
            setSavedOnSet(onSetValue)
            setSavedIsOnDrugs(isOnDrugs)
            setSavedDrugsText(isOnDrugs ? drugsText : '')
            setSavedIsSugarControl(isSugarControl)
            setSavedComplicationsText(isSugarControl ? complicationsText : '')
            setSavedHtnOnSet(htnOnSetValue)
            setSavedHtnIsOnDrugs(htnIsOnDrugs)
            setSavedHtnDrugsText(htnIsOnDrugs ? htnDrugsText : '')
            setSavedDyslipidemiaOnSet(dyslipidemiaOnSetValue)
            setSavedDyslipidemiaIsOnDrugs(dyslipidemiaIsOnDrugs)
            setSavedDyslipidemiaDrugsText(dyslipidemiaIsOnDrugs ? dyslipidemiaDrugsText : '')
            setSavedDietAndLifestyleText(dietAndLifestyleText)
            setSavedAssessOfComplicationsText(assessOfComplicationsText)
            setSavedOtherChronicIllnessesText(otherChronicIllnessesText)
            
            setIsDiabetesEditing(false)
            setIsHtnEditing(false)
            setIsDyslipidemiaEditing(false)
            setIsDietAndLifestyleEditing(false)
            setIsAssessOfComplicationsEditing(false)
            setIsOtherChronicIllnessesEditing(false)
            
            router.refresh()
            success = true
        } else {
            setError(result.error || 'Failed to save')
        }
        setIsSaving(false)
        setTimeout(() => setMessage(''), 3000)
        return success
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        await performSave()
    }

    // --- Unsaved changes alert integration ---
    const performSaveRef = useRef<() => Promise<boolean>>(() => Promise.resolve(false))
    performSaveRef.current = performSave

    // Dispatch dirty state to parent wrapper
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('unsaved-changes', {
            detail: { source: 'chronicIllness', dirty: hasChanges }
        }))
    }, [hasChanges])

    // Listen for external save trigger (from ClinicalProfileClientWrapper)
    useEffect(() => {
        const handler = async () => {
            const success = await performSaveRef.current()
            window.dispatchEvent(new CustomEvent('save-complete-chronicIllness', {
                detail: { success }
            }))
        }
        window.addEventListener('trigger-save-chronicIllness', handler)
        return () => window.removeEventListener('trigger-save-chronicIllness', handler)
    }, [])

    // Cleanup: mark as not dirty on unmount
    useEffect(() => {
        return () => {
            window.dispatchEvent(new CustomEvent('unsaved-changes', {
                detail: { source: 'chronicIllness', dirty: false }
            }))
        }
    }, [])

    return (
        <form onSubmit={handleSave} className="relative space-y-6">
            {/* Diabetes Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-wrap items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 gap-4">
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Diabetes</h3>
                        
                        {/* Tab buttons for desktop (lg) */}
                        <div className="hidden lg:flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setDiabetesTab('measurements')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${diabetesTab === 'measurements' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                Measurements
                            </button>
                            <button
                                type="button"
                                onClick={() => setDiabetesTab('details')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${diabetesTab === 'details' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                On Set
                            </button>
                            <button
                                type="button"
                                onClick={() => setDiabetesTab('drugs')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${diabetesTab === 'drugs' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                On Drugs
                            </button>
                            <button
                                type="button"
                                onClick={() => setDiabetesTab('sugarControl')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${diabetesTab === 'sugarControl' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                Sugar Control
                            </button>
                        </div>

                        {/* Tab Dropdown for tablet/mobile (< lg) */}
                        <div className="lg:hidden block">
                            <select
                                value={diabetesTab}
                                onChange={(e) => setDiabetesTab(e.target.value as any)}
                                className="block w-36 sm:w-44 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 focus:border-teal-500 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="measurements">Measurements</option>
                                <option value="details">On Set</option>
                                <option value="drugs">On Drugs</option>
                                <option value="sugarControl">Sugar Control</option>
                                <option value="history">History Log</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsDiabetesEditing(!isDiabetesEditing)
                                if (diabetesTab === 'history') setDiabetesTab('measurements')
                            }}
                            className={`transition-colors p-1.5 rounded-md ${isDiabetesEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isDiabetesEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setDiabetesTab(diabetesTab === 'history' ? 'measurements' : 'history')
                                if (isDiabetesEditing) setIsDiabetesEditing(false)
                            }}
                            className={`transition-colors p-1.5 rounded-md ${diabetesTab === 'history' ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="View History Log"
                        >
                            <HistoryIcon />
                        </button>
                        {diabetesUpdatedAt && (
                            <span className="hidden lg:inline text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(diabetesUpdatedAt))}
                            </span>
                        )}
                    </div>

                    {/* Timestamp stacked row for below lg */}
                    {diabetesUpdatedAt && (
                        <div className="w-full lg:hidden -mt-2">
                            <span className="text-slate-500 dark:text-slate-400 text-xs">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(diabetesUpdatedAt))}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="min-h-[170px] md:min-h-[80px]">
                    {diabetesTab === 'measurements' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {/* Fasting Blood Sugar */}
                        <div>
                            <label htmlFor="fbs" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Fasting Blood Sugar
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="fbs"
                                    id="fbs"
                                    value={fbs}
                                    onChange={(e) => isDiabetesEditing && setFbs(e.target.value)}
                                    readOnly={!isDiabetesEditing}
                                    className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isDiabetesEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                    placeholder="0.00"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="fbs-unit">mg/dL</span>
                                </div>
                            </div>
                        </div>

                        {/* HbA1c */}
                        <div>
                            <label htmlFor="hba1c" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                HbA1c
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="hba1c"
                                    id="hba1c"
                                    value={hba1c}
                                    onChange={(e) => isDiabetesEditing && setHba1c(e.target.value)}
                                    readOnly={!isDiabetesEditing}
                                    className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isDiabetesEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                    placeholder="0.0"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="hba1c-unit">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {diabetesTab === 'details' && (
                    <div className="space-y-4 pt-2">
                        <div className="flex space-x-6">
                            {['YO', 'EO', 'P'].map((val) => (
                                <label key={val} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="onSet"
                                        value={val}
                                        checked={onSetValue === val}
                                        onChange={(e) => isDiabetesEditing && setOnSetValue(e.target.value)}
                                        className={`h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-teal-500 ${isDiabetesEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {diabetesTab === 'drugs' && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 w-full h-full pt-1">
                            <label className={`flex items-center space-x-3 pt-1 ${isDiabetesEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient already on drugs</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={isOnDrugs}
                                        onChange={(e) => isDiabetesEditing && setIsOnDrugs(e.target.checked)}
                                        disabled={!isDiabetesEditing}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${isOnDrugs ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isOnDrugs ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                            </label>

                            <div className="flex-1 w-full">
                                <label htmlFor="drugsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Drugs</label>
                                <textarea
                                    name="drugsText"
                                    id="drugsText"
                                    rows={3}
                                    value={drugsText}
                                    onChange={(e) => isDiabetesEditing && setDrugsText(e.target.value)}
                                    disabled={!isOnDrugs}
                                    readOnly={!isDiabetesEditing}
                                    className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isDiabetesEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                    placeholder="Enter drugs..."
                                />
                            </div>
                        </div>
                    )}

                    {diabetesTab === 'sugarControl' && (
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 w-full h-full pt-1">
                            <label className={`flex items-center space-x-3 pt-1 ${isDiabetesEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sugar control</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={isSugarControl}
                                        onChange={(e) => isDiabetesEditing && setIsSugarControl(e.target.checked)}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${isSugarControl ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSugarControl ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                            </label>

                            <div className="flex-1 w-full">
                                <label htmlFor="complicationsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Complications</label>
                                <textarea
                                    name="complicationsText"
                                    id="complicationsText"
                                    rows={3}
                                    value={complicationsText}
                                    onChange={(e) => isDiabetesEditing && setComplicationsText(e.target.value)}
                                    disabled={!isSugarControl}
                                    readOnly={!isDiabetesEditing}
                                    className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isDiabetesEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                    placeholder="Enter complications..."
                                />
                            </div>
                        </div>
                    )}

                    {diabetesTab === 'history' && (
                        <div className="pt-2">
                            <HistoryLogView logs={diabetesLogs} sectionKey="DIABETES" patientId={patientId} />
                        </div>
                    )}
                </div>
            </div>

            {/* HTN Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">HTN - Blood Pressure</h3>
                        
                        {/* Tab buttons for desktop (lg) */}
                        <div className="hidden lg:flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setHtnTab('measurements')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${htnTab === 'measurements' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                Measurements
                            </button>
                            <button
                                type="button"
                                onClick={() => setHtnTab('details')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${htnTab === 'details' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                On Set
                            </button>
                            <button
                                type="button"
                                onClick={() => setHtnTab('drugs')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${htnTab === 'drugs' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                On Drugs
                            </button>
                        </div>

                        {/* Tab Dropdown for tablet/mobile (< lg) */}
                        <div className="lg:hidden block">
                            <select
                                value={htnTab}
                                onChange={(e) => setHtnTab(e.target.value as any)}
                                className="block w-36 sm:w-44 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 focus:border-teal-500 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="measurements">Measurements</option>
                                <option value="details">On Set</option>
                                <option value="drugs">On Drugs</option>
                                <option value="history">History Log</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsHtnEditing(!isHtnEditing)
                                if (htnTab === 'history') setHtnTab('measurements')
                            }}
                            className={`transition-colors p-1.5 rounded-md ${isHtnEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isHtnEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setHtnTab(htnTab === 'history' ? 'measurements' : 'history')
                                if (isHtnEditing) setIsHtnEditing(false)
                            }}
                            className={`transition-colors p-1.5 rounded-md ${htnTab === 'history' ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="View History Log"
                        >
                            <HistoryIcon />
                        </button>
                        {htnUpdatedAt && (
                            <span className="hidden lg:inline text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(htnUpdatedAt))}
                            </span>
                        )}
                    </div>

                    {/* Timestamp stacked row for below lg */}
                    {htnUpdatedAt && (
                        <div className="w-full lg:hidden -mt-4">
                            <span className="text-slate-500 dark:text-slate-400 text-xs">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(htnUpdatedAt))}
                            </span>
                        </div>
                    )}
                </div>

                <div className="min-h-[170px] md:min-h-[80px]">
                    {htnTab === 'measurements' && (
                        <div className="grid grid-cols-1 gap-6 w-full">
                            {/* Blood Pressure */}
                            <div>
                                <label htmlFor="bp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Blood Pressure
                                </label>
                                <div className="relative rounded-md shadow-sm max-w-sm">
                                    <input
                                        type="text"
                                        name="bp"
                                        id="bp"
                                        value={bp}
                                        onChange={(e) => isHtnEditing && setBp(e.target.value)}
                                        readOnly={!isHtnEditing}
                                        className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isHtnEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                        placeholder="120/80"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="bp-unit">mmHg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {htnTab === 'details' && (
                        <div className="space-y-4 pt-2">
                            <div className="flex space-x-6">
                                {['YO', 'EO', 'P'].map((val) => (
                                    <label key={val} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="htnOnSet"
                                            value={val}
                                            checked={htnOnSetValue === val}
                                            onChange={(e) => isHtnEditing && setHtnOnSetValue(e.target.value)}
                                            className={`h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-teal-500 ${isHtnEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {htnTab === 'drugs' && (
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 w-full h-full pt-1">
                            <label className={`flex items-center space-x-3 pt-1 ${isHtnEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient already on drugs</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={htnIsOnDrugs}
                                        onChange={(e) => isHtnEditing && setHtnIsOnDrugs(e.target.checked)}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${htnIsOnDrugs ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${htnIsOnDrugs ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                            </label>

                            <div className="flex-1 w-full">
                                <label htmlFor="htnDrugsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Drugs</label>
                                <textarea
                                    name="htnDrugsText"
                                    id="htnDrugsText"
                                    rows={3}
                                    value={htnDrugsText}
                                    onChange={(e) => isHtnEditing && setHtnDrugsText(e.target.value)}
                                    disabled={!htnIsOnDrugs}
                                    readOnly={!isHtnEditing}
                                    className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isHtnEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                    placeholder="Enter drugs..."
                                />
                            </div>
                        </div>
                    )}

                    {htnTab === 'history' && (
                        <div className="pt-2">
                            <HistoryLogView logs={htnLogs} sectionKey="HTN" patientId={patientId} />
                        </div>
                    )}
                </div>
            </div>

            {/* Dyslipidemia Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Dyslipidemia - Cholesterol</h3>
                        
                        {/* Tab buttons for desktop (lg) */}
                        <div className="hidden lg:flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setDyslipidemiaTab('measurements')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${dyslipidemiaTab === 'measurements' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                Measurements
                            </button>
                            <button
                                type="button"
                                onClick={() => setDyslipidemiaTab('details')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${dyslipidemiaTab === 'details' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                On Set
                            </button>
                            <button
                                type="button"
                                onClick={() => setDyslipidemiaTab('drugs')}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${dyslipidemiaTab === 'drugs' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            >
                                On Drugs
                            </button>
                        </div>

                        {/* Tab Dropdown for tablet/mobile (< lg) */}
                        <div className="lg:hidden block">
                            <select
                                value={dyslipidemiaTab}
                                onChange={(e) => setDyslipidemiaTab(e.target.value as any)}
                                className="block w-36 sm:w-44 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 focus:border-teal-500 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="measurements">Measurements</option>
                                <option value="details">On Set</option>
                                <option value="drugs">On Drugs</option>
                                <option value="history">History Log</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsDyslipidemiaEditing(!isDyslipidemiaEditing)
                                if (dyslipidemiaTab === 'history') setDyslipidemiaTab('measurements')
                            }}
                            className={`transition-colors p-1.5 rounded-md ${isDyslipidemiaEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isDyslipidemiaEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setDyslipidemiaTab(dyslipidemiaTab === 'history' ? 'measurements' : 'history')
                                if (isDyslipidemiaEditing) setIsDyslipidemiaEditing(false)
                            }}
                            className={`transition-colors p-1.5 rounded-md ${dyslipidemiaTab === 'history' ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="View History Log"
                        >
                            <HistoryIcon />
                        </button>
                        {dyslipidemiaUpdatedAt && (
                            <span className="hidden lg:inline text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dyslipidemiaUpdatedAt))}
                            </span>
                        )}
                    </div>

                    {/* Timestamp stacked row for below lg */}
                    {dyslipidemiaUpdatedAt && (
                        <div className="w-full lg:hidden -mt-4">
                            <span className="text-slate-500 dark:text-slate-400 text-xs">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dyslipidemiaUpdatedAt))}
                            </span>
                        </div>
                    )}
                </div>

                <div className="min-h-[170px] md:min-h-[80px]">
                    {dyslipidemiaTab === 'measurements' && (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                            {/* Total Cholesterol */}
                            <div>
                                <label htmlFor="totalCholesterol" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 truncate" title="Total Cholesterol">
                                    Total Cholesterol
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="totalCholesterol"
                                        id="totalCholesterol"
                                        value={totalCholesterol}
                                        onChange={(e) => isDyslipidemiaEditing && setTotalCholesterol(e.target.value)}
                                        readOnly={!isDyslipidemiaEditing}
                                        className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isDyslipidemiaEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                        placeholder="0.0"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="tc-unit">mg/dL</span>
                                    </div>
                                </div>
                            </div>

                            {/* Triglycerides */}
                            <div>
                                <label htmlFor="triglycerides" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 truncate" title="Triglycerides">
                                    Triglycerides
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="triglycerides"
                                        id="triglycerides"
                                        value={triglycerides}
                                        onChange={(e) => isDyslipidemiaEditing && setTriglycerides(e.target.value)}
                                        readOnly={!isDyslipidemiaEditing}
                                        className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isDyslipidemiaEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                        placeholder="0.0"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="tg-unit">mg/dL</span>
                                    </div>
                                </div>
                            </div>

                            {/* HDL */}
                            <div>
                                <label htmlFor="hdl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 truncate" title="HDL">
                                    HDL
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="hdl"
                                        id="hdl"
                                        value={hdl}
                                        onChange={(e) => isDyslipidemiaEditing && setHdl(e.target.value)}
                                        readOnly={!isDyslipidemiaEditing}
                                        className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isDyslipidemiaEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                        placeholder="0.0"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="hdl-unit">mg/dL</span>
                                    </div>
                                </div>
                            </div>

                            {/* LDL */}
                            <div>
                                <label htmlFor="ldl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 truncate" title="LDL">
                                    LDL
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="ldl"
                                        id="ldl"
                                        value={ldl}
                                        onChange={(e) => isDyslipidemiaEditing && setLdl(e.target.value)}
                                        readOnly={!isDyslipidemiaEditing}
                                        className={`block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow ${isDyslipidemiaEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700'}`}
                                        placeholder="0.0"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="ldl-unit">mg/dL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {dyslipidemiaTab === 'details' && (
                        <div className="space-y-4 pt-2">
                            <div className="flex space-x-6">
                                {['YO', 'EO', 'P'].map((val) => (
                                    <label key={val} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="dyslipidemiaOnSet"
                                            value={val}
                                            checked={dyslipidemiaOnSetValue === val}
                                            onChange={(e) => isDyslipidemiaEditing && setDyslipidemiaOnSetValue(e.target.value)}
                                            className={`h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-teal-500 ${isDyslipidemiaEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {dyslipidemiaTab === 'drugs' && (
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 w-full h-full pt-1">
                            <label className={`flex items-center space-x-3 pt-1 ${isDyslipidemiaEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient already on drugs</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={dyslipidemiaIsOnDrugs}
                                        onChange={(e) => isDyslipidemiaEditing && setDyslipidemiaIsOnDrugs(e.target.checked)}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${dyslipidemiaIsOnDrugs ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${dyslipidemiaIsOnDrugs ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                            </label>

                            <div className="flex-1 w-full">
                                <label htmlFor="dyslipidemiaDrugsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Drugs</label>
                                <textarea
                                    name="dyslipidemiaDrugsText"
                                    id="dyslipidemiaDrugsText"
                                    rows={3}
                                    value={dyslipidemiaDrugsText}
                                    onChange={(e) => isDyslipidemiaEditing && setDyslipidemiaDrugsText(e.target.value)}
                                    disabled={!dyslipidemiaIsOnDrugs}
                                    readOnly={!isDyslipidemiaEditing}
                                    className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isDyslipidemiaEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                    placeholder="Enter drugs..."
                                />
                            </div>
                        </div>
                    )}

                    {dyslipidemiaTab === 'history' && (
                        <div className="pt-2">
                            <HistoryLogView logs={dyslipidemiaLogs} sectionKey="DYSLIPIDEMIA" patientId={patientId} />
                        </div>
                    )}
                </div>
            </div>

            {/* Diet and Life Style Sub-section */}
            <div className={`border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30 transition-all duration-300`}>
                <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${isDietAndLifestyleExpanded ? 'mb-6' : 'mb-0'}`}>
                    <div className="flex items-center gap-6">
                        <button 
                            type="button" 
                            onClick={() => setIsDietAndLifestyleExpanded(!isDietAndLifestyleExpanded)} 
                            className="flex items-center gap-2 text-lg font-medium text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform duration-200 ${isDietAndLifestyleExpanded ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                            Diet and Life Style
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsDietAndLifestyleEditing(!isDietAndLifestyleEditing)
                                if (dietAndLifestyleTab === 'history') setDietAndLifestyleTab('form')
                                if (!isDietAndLifestyleExpanded) setIsDietAndLifestyleExpanded(true)
                            }}
                            className={`transition-colors p-1.5 rounded-md ${isDietAndLifestyleEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isDietAndLifestyleEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const newTab = dietAndLifestyleTab === 'history' ? 'form' : 'history'
                                setDietAndLifestyleTab(newTab)
                                if (newTab === 'history') {
                                    setIsDietAndLifestyleExpanded(true)
                                }
                                if (isDietAndLifestyleEditing) {
                                    setIsDietAndLifestyleEditing(false)
                                }
                            }}
                            className={`transition-colors p-1.5 rounded-md ${dietAndLifestyleTab === 'history' ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="View History Log"
                        >
                            <HistoryIcon />
                        </button>
                        {dietAndLifestyleUpdatedAt && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dietAndLifestyleUpdatedAt))}
                            </span>
                        )}
                    </div>
                </div>

                {isDietAndLifestyleExpanded && (
                    <div className="w-full">
                        {dietAndLifestyleTab === 'form' ? (
                            <textarea
                                name="dietAndLifestyleText"
                                id="dietAndLifestyleText"
                                rows={4}
                                value={dietAndLifestyleText}
                                onChange={(e) => isDietAndLifestyleEditing && setDietAndLifestyleText(e.target.value)}
                                readOnly={!isDietAndLifestyleEditing}
                                className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isDietAndLifestyleEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                placeholder="Enter diet and lifestyle recommendations..."
                            />
                        ) : (
                            <div className="pt-1">
                                <HistoryLogView logs={dietAndLifestyleLogs} sectionKey="DIET_LIFESTYLE" patientId={patientId} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Assess of Complications Sub-section */}
            <div className={`border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30 transition-all duration-300`}>
                <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${isAssessOfComplicationsExpanded ? 'mb-6' : 'mb-0'}`}>
                    <div className="flex items-center gap-6">
                        <button 
                            type="button" 
                            onClick={() => setIsAssessOfComplicationsExpanded(!isAssessOfComplicationsExpanded)} 
                            className="flex items-center gap-2 text-lg font-medium text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform duration-200 ${isAssessOfComplicationsExpanded ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                            Assess of Complications
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAssessOfComplicationsEditing(!isAssessOfComplicationsEditing)
                                if (assessOfComplicationsTab === 'history') setAssessOfComplicationsTab('form')
                                if (!isAssessOfComplicationsExpanded) setIsAssessOfComplicationsExpanded(true)
                            }}
                            className={`transition-colors p-1.5 rounded-md ${isAssessOfComplicationsEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isAssessOfComplicationsEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const newTab = assessOfComplicationsTab === 'history' ? 'form' : 'history'
                                setAssessOfComplicationsTab(newTab)
                                if (newTab === 'history') {
                                    setIsAssessOfComplicationsExpanded(true)
                                }
                                if (isAssessOfComplicationsEditing) {
                                    setIsAssessOfComplicationsEditing(false)
                                }
                            }}
                            className={`transition-colors p-1.5 rounded-md ${assessOfComplicationsTab === 'history' ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="View History Log"
                        >
                            <HistoryIcon />
                        </button>
                        {assessOfComplicationsUpdatedAt && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(assessOfComplicationsUpdatedAt))}
                            </span>
                        )}
                    </div>
                </div>

                {isAssessOfComplicationsExpanded && (
                    <div className="w-full">
                        {assessOfComplicationsTab === 'form' ? (
                            <textarea
                                name="assessOfComplicationsText"
                                id="assessOfComplicationsText"
                                rows={4}
                                value={assessOfComplicationsText}
                                onChange={(e) => isAssessOfComplicationsEditing && setAssessOfComplicationsText(e.target.value)}
                                readOnly={!isAssessOfComplicationsEditing}
                                className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isAssessOfComplicationsEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                placeholder="Enter assess of complications..."
                            />
                        ) : (
                            <div className="pt-1">
                                <HistoryLogView logs={assessOfComplicationsLogs} sectionKey="ASSESS_COMPLICATIONS" patientId={patientId} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Other Chronic Illnesses Sub-section */}
            <div className={`border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30 transition-all duration-300`}>
                <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${isOtherChronicIllnessesExpanded ? 'mb-6' : 'mb-0'}`}>
                    <div className="flex items-center gap-6">
                        <button 
                            type="button" 
                            onClick={() => setIsOtherChronicIllnessesExpanded(!isOtherChronicIllnessesExpanded)} 
                            className="flex items-center gap-2 text-lg font-medium text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform duration-200 ${isOtherChronicIllnessesExpanded ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                            Other Chronic Illnesses
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOtherChronicIllnessesEditing(!isOtherChronicIllnessesEditing)
                                if (otherChronicIllnessesTab === 'history') setOtherChronicIllnessesTab('form')
                                if (!isOtherChronicIllnessesExpanded) setIsOtherChronicIllnessesExpanded(true)
                            }}
                            className={`transition-colors p-1.5 rounded-md ${isOtherChronicIllnessesEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isOtherChronicIllnessesEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const newTab = otherChronicIllnessesTab === 'history' ? 'form' : 'history'
                                setOtherChronicIllnessesTab(newTab)
                                if (newTab === 'history') {
                                    setIsOtherChronicIllnessesExpanded(true)
                                }
                                if (isOtherChronicIllnessesEditing) {
                                    setIsOtherChronicIllnessesEditing(false)
                                }
                            }}
                            className={`transition-colors p-1.5 rounded-md ${otherChronicIllnessesTab === 'history' ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="View History Log"
                        >
                            <HistoryIcon />
                        </button>
                        {otherChronicIllnessesUpdatedAt && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(otherChronicIllnessesUpdatedAt))}
                            </span>
                        )}
                    </div>
                </div>

                {isOtherChronicIllnessesExpanded && (
                    <div className="w-full">
                        {otherChronicIllnessesTab === 'form' ? (
                            <textarea
                                name="otherChronicIllnessesText"
                                id="otherChronicIllnessesText"
                                rows={4}
                                value={otherChronicIllnessesText}
                                onChange={(e) => isOtherChronicIllnessesEditing && setOtherChronicIllnessesText(e.target.value)}
                                readOnly={!isOtherChronicIllnessesEditing}
                                className={`block w-full rounded-md border-0 py-2 pl-3 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:text-white dark:focus:ring-teal-500 transition-shadow disabled:text-slate-500 disabled:ring-slate-200 dark:disabled:text-slate-400 dark:disabled:ring-slate-700 resize-none ${isOtherChronicIllnessesEditing ? 'bg-white dark:bg-slate-900 ring-teal-500/50 dark:ring-teal-400/50 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 ring-slate-200 dark:ring-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80'}`}
                                placeholder="Enter other chronic illnesses..."
                            />
                        ) : (
                            <div className="pt-1">
                                <HistoryLogView logs={otherChronicIllnessesLogs} sectionKey="OTHER_CHRONIC_ILLNESSES" patientId={patientId} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                <div className="text-sm">
                    {message && <span className="text-teal-600 dark:text-teal-400 font-medium mr-4">{message}</span>}
                    {error && <span className="text-rose-600 dark:text-rose-400 font-medium mr-4">{error}</span>}
                </div>
                <button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                    className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 bg-teal-600 text-white hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200 disabled:cursor-not-allowed disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:disabled:hover:bg-slate-800"
                >
                    {isSaving ? 'Saving...' : 'Save Data'}
                </button>
            </div>
        </form>
    )
}
