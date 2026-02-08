'use client';

import React, { useState } from 'react';
import { addVitalSigns, getLatestVitalSigns } from '@/actions/vitalSigns';

type VitalSignsInputs = {
    systolicBP: string
    diastolicBP: string
    heartRate: string
    respiratoryRate: string
    temperature: string
    oxygenSaturation: string
}

export default function VitalSignsSection({ patientId, initialVitals }: { patientId: string, initialVitals: any }) {
    const [latestVitals, setLatestVitals] = useState(initialVitals);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Form State
    const [formData, setFormData] = useState<VitalSignsInputs>({
        systolicBP: '',
        diastolicBP: '',
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        oxygenSaturation: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Allow only numbers and one decimal point for temperature
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        // Convert strings to numbers
        const data = {
            patientId,
            systolicBP: formData.systolicBP ? parseInt(formData.systolicBP) : undefined,
            diastolicBP: formData.diastolicBP ? parseInt(formData.diastolicBP) : undefined,
            heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
            respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : undefined,
            temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
            oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : undefined,
        };

        const result = await addVitalSigns(data);

        if (result.success) {
            setLatestVitals(result.data);
            setIsExpanded(false);
            setFormData({
                systolicBP: '',
                diastolicBP: '',
                heartRate: '',
                respiratoryRate: '',
                temperature: '',
                oxygenSaturation: ''
            });
        } else {
            setError(result.error || 'Failed to save vital signs');
        }
        setIsSaving(false);
    };

    return (
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    Vital Signs
                </h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition-colors"
                >
                    {isExpanded ? 'Cancel' : 'Add New Record'}
                </button>
            </div>

            {/* Latest Readings Display */}
            {!isExpanded && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <span className="block text-xs uppercase text-slate-500 font-semibold mb-1">Blood Pressure</span>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {latestVitals?.systolicBP && latestVitals?.diastolicBP
                                ? `${latestVitals.systolicBP}/${latestVitals.diastolicBP}`
                                : '--/--'}
                        </div>
                        <span className="text-xs text-slate-400">mmHg</span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <span className="block text-xs uppercase text-slate-500 font-semibold mb-1">Heart Rate</span>
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {latestVitals?.heartRate || '--'}
                        </div>
                        <span className="text-xs text-slate-400">bpm</span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <span className="block text-xs uppercase text-slate-500 font-semibold mb-1">Resp. Rate</span>
                        <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                            {latestVitals?.respiratoryRate || '--'}
                        </div>
                        <span className="text-xs text-slate-400">bpm</span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <span className="block text-xs uppercase text-slate-500 font-semibold mb-1">Temperature</span>
                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {latestVitals?.temperature || '--'}
                        </div>
                        <span className="text-xs text-slate-400">°C</span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <span className="block text-xs uppercase text-slate-500 font-semibold mb-1">SpO₂</span>
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {latestVitals?.oxygenSaturation || '--'}
                        </div>
                        <span className="text-xs text-slate-400">%</span>
                    </div>

                    <div className="hidden lg:flex flex-col justify-center items-center text-xs text-slate-400 italic p-4">
                        {latestVitals?.recordedAt
                            ? `Last updated: ${new Date(latestVitals.recordedAt).toLocaleDateString()}`
                            : 'No records yet'}
                    </div>
                </div>
            )}

            {/* Entry Form */}
            {isExpanded && (
                <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Blood Pressure Group */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Blood Pressure</label>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="systolicBP"
                                        value={formData.systolicBP}
                                        onChange={handleInputChange}
                                        placeholder="Sys (120)"
                                        className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:ring-slate-700 dark:text-white"
                                    />
                                </div>
                                <span className="text-slate-400">/</span>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="diastolicBP"
                                        value={formData.diastolicBP}
                                        onChange={handleInputChange}
                                        placeholder="Dia (80)"
                                        className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:ring-slate-700 dark:text-white"
                                    />
                                </div>
                                <span className="text-xs text-slate-500">mmHg</span>
                            </div>
                        </div>

                        {/* Heart Rate */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Heart Rate</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="heartRate"
                                    value={formData.heartRate}
                                    onChange={handleInputChange}
                                    placeholder="bpm (e.g. 72)"
                                    className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:ring-slate-700 dark:text-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400">bpm</div>
                            </div>
                        </div>

                        {/* Respiratory Rate */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Respiratory Rate</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="respiratoryRate"
                                    value={formData.respiratoryRate}
                                    onChange={handleInputChange}
                                    placeholder="bpm (e.g. 16)"
                                    className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:ring-slate-700 dark:text-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400">br/min</div>
                            </div>
                        </div>

                        {/* Body Temperature */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Body Temperature</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleInputChange}
                                    placeholder="°C (e.g. 36.6)"
                                    className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:ring-slate-700 dark:text-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400">°C</div>
                            </div>
                        </div>

                        {/* Oxygen Saturation */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Oxygen Saturation (SpO₂)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="oxygenSaturation"
                                    value={formData.oxygenSaturation}
                                    onChange={handleInputChange}
                                    placeholder="% (e.g. 98)"
                                    className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:ring-slate-700 dark:text-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400">%</div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={isSaving}
                        >
                            {isSaving && (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            Save Vitals
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
