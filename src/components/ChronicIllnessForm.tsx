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
    initialLdl
}: { 
    patientId: string, 
    initialFbs: number | null, 
    initialHba1c: number | null, 
    initialBloodPressure: string | null,
    initialTotalCholesterol: number | null,
    initialTriglycerides: number | null,
    initialHdl: number | null,
    initialLdl: number | null
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

    const hasChanges = fbs !== savedFbs || hba1c !== savedHba1c || bp !== savedBp || totalCholesterol !== savedTotalCholesterol || triglycerides !== savedTriglycerides || hdl !== savedHdl || ldl !== savedLdl
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
            ldl: ldlValue
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
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Diabetes</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                onChange={(e) => setFbs(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
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
                                onChange={(e) => setHba1c(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
                                placeholder="0.0"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="hba1c-unit">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HTN Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">HTN - Blood Pressure</h3>
                
                <div className="grid grid-cols-1 gap-6">
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
                                onChange={(e) => setBp(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
                                placeholder="120/80"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="bp-unit">mmHg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dyslipidemia Sub-section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Dyslipidemia - Cholesterol</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                                onChange={(e) => setTotalCholesterol(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
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
                                onChange={(e) => setTriglycerides(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
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
                                onChange={(e) => setHdl(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
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
                                onChange={(e) => setLdl(e.target.value)}
                                className="block w-full rounded-md border-0 py-2.5 pl-3 pr-16 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-teal-500 transition-shadow"
                                placeholder="0.0"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium" id="ldl-unit">mg/dL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                <div className="text-sm">
                    {message && <span className="text-teal-600 dark:text-teal-400 font-medium">{message}</span>}
                    {error && <span className="text-rose-600 dark:text-rose-400 font-medium">{error}</span>}
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
