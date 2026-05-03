'use client'

import React, { useState } from 'react'
import { saveChronicIllnesses } from '@/actions/patients'
import { useRouter } from 'next/navigation'

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
    diabetesUpdatedAt,
    htnUpdatedAt,
    dyslipidemiaUpdatedAt
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
    diabetesUpdatedAt: Date | null,
    htnUpdatedAt: Date | null,
    dyslipidemiaUpdatedAt: Date | null
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

    const [diabetesTab, setDiabetesTab] = useState<'measurements' | 'details' | 'drugs' | 'sugarControl'>('measurements')
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

    const [htnTab, setHtnTab] = useState<'measurements' | 'details' | 'drugs'>('measurements')
    const [htnOnSetValue, setHtnOnSetValue] = useState(initialHtnOnSet || '')
    const [savedHtnOnSet, setSavedHtnOnSet] = useState(htnOnSetValue)
    const [htnIsOnDrugs, setHtnIsOnDrugs] = useState(initialHtnIsOnDrugs)
    const [savedHtnIsOnDrugs, setSavedHtnIsOnDrugs] = useState(htnIsOnDrugs)
    const [htnDrugsText, setHtnDrugsText] = useState(initialHtnDrugsText || '')
    const [savedHtnDrugsText, setSavedHtnDrugsText] = useState(htnDrugsText)

    const [dyslipidemiaTab, setDyslipidemiaTab] = useState<'measurements' | 'details' | 'drugs'>('measurements')
    const [dyslipidemiaOnSetValue, setDyslipidemiaOnSetValue] = useState(initialDyslipidemiaOnSet || '')
    const [savedDyslipidemiaOnSet, setSavedDyslipidemiaOnSet] = useState(dyslipidemiaOnSetValue)
    const [dyslipidemiaIsOnDrugs, setDyslipidemiaIsOnDrugs] = useState(initialDyslipidemiaIsOnDrugs)
    const [savedDyslipidemiaIsOnDrugs, setSavedDyslipidemiaIsOnDrugs] = useState(dyslipidemiaIsOnDrugs)
    const [dyslipidemiaDrugsText, setDyslipidemiaDrugsText] = useState(initialDyslipidemiaDrugsText || '')
    const [savedDyslipidemiaDrugsText, setSavedDyslipidemiaDrugsText] = useState(dyslipidemiaDrugsText)

    const [isDiabetesEditing, setIsDiabetesEditing] = useState(false)
    const [isHtnEditing, setIsHtnEditing] = useState(false)
    const [isDyslipidemiaEditing, setIsDyslipidemiaEditing] = useState(false)

    const hasChanges = fbs !== savedFbs || hba1c !== savedHba1c || bp !== savedBp || totalCholesterol !== savedTotalCholesterol || triglycerides !== savedTriglycerides || hdl !== savedHdl || ldl !== savedLdl || onSetValue !== savedOnSet || isOnDrugs !== savedIsOnDrugs || drugsText !== savedDrugsText || isSugarControl !== savedIsSugarControl || complicationsText !== savedComplicationsText || htnOnSetValue !== savedHtnOnSet || htnIsOnDrugs !== savedHtnIsOnDrugs || htnDrugsText !== savedHtnDrugsText || dyslipidemiaOnSetValue !== savedDyslipidemiaOnSet || dyslipidemiaIsOnDrugs !== savedDyslipidemiaIsOnDrugs || dyslipidemiaDrugsText !== savedDyslipidemiaDrugsText
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
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

        if (fbs && isNaN(fbsValue!)) return setError('FBS must be a number'), setIsSaving(false)
        if (hba1c && isNaN(hba1cValue!)) return setError('HbA1c must be a number'), setIsSaving(false)
        if (totalCholesterol && isNaN(tcValue!)) return setError('Total Cholesterol must be a number'), setIsSaving(false)
        if (triglycerides && isNaN(tgValue!)) return setError('Triglycerides must be a number'), setIsSaving(false)
        if (hdl && isNaN(hdlValue!)) return setError('HDL must be a number'), setIsSaving(false)
        if (ldl && isNaN(ldlValue!)) return setError('LDL must be a number'), setIsSaving(false)

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
            dyslipidemiaDrugsText: dyslipidemiaIsOnDrugs ? (dyslipidemiaDrugsText || null) : null
        })

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
            
            setIsDiabetesEditing(false)
            setIsHtnEditing(false)
            setIsDyslipidemiaEditing(false)
            
            router.refresh()
        } else {
            setError(result.error || 'Failed to save')
        }
        setIsSaving(false)

        setTimeout(() => setMessage(''), 3000)
    }

    return (
        <form onSubmit={handleSave} className="relative space-y-6">
            {/* Diabetes Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 gap-4">
                    <div className="flex items-center gap-6">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Diabetes</h3>
                        <div className="flex space-x-4">
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
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDiabetesEditing(!isDiabetesEditing)}
                            className={`transition-colors p-1.5 rounded-md ${isDiabetesEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isDiabetesEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        {diabetesUpdatedAt && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(diabetesUpdatedAt))}
                            </span>
                        )}
                    </div>
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
                </div>
            </div>

            {/* HTN Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-6">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">HTN - Blood Pressure</h3>
                        <div className="flex space-x-4">
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
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsHtnEditing(!isHtnEditing)}
                            className={`transition-colors p-1.5 rounded-md ${isHtnEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isHtnEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        {htnUpdatedAt && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(htnUpdatedAt))}
                            </span>
                        )}
                    </div>
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
                </div>
            </div>

            {/* Dyslipidemia Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-6">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Dyslipidemia - Cholesterol</h3>
                        <div className="flex space-x-4">
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
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDyslipidemiaEditing(!isDyslipidemiaEditing)}
                            className={`transition-colors p-1.5 rounded-md ${isDyslipidemiaEditing ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30' : 'text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={isDyslipidemiaEditing ? "Lock Section" : "Edit Section"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        {dyslipidemiaUpdatedAt && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                Last updated: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dyslipidemiaUpdatedAt))}
                            </span>
                        )}
                    </div>
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
                    disabled={isSaving || !hasChanges}
                    className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 bg-teal-600 text-white hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200 disabled:cursor-not-allowed disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:disabled:hover:bg-slate-800"
                >
                    {isSaving ? 'Saving...' : 'Save Data'}
                </button>
            </div>
        </form>
    )
}
