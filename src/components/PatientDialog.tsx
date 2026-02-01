'use client';

import React, { useState, useEffect } from 'react';
import { PatientData } from '@/actions/patients';

type PatientDialogProps = {
    open: boolean;
    onClose: () => void;
    patient?: PatientData | null;
    onSave: (data: PatientData) => Promise<void>;
};

const PatientDialog = ({ open, onClose, patient, onSave }: PatientDialogProps) => {
    const [formData, setFormData] = useState<PatientData>({
        nic: '',
        firstName: '',
        lastName: '',
        age: 0,
        gender: 'Male',
        address: '',
        occupation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (patient) {
            setFormData(patient);
        } else {
            setFormData({
                nic: '',
                firstName: '',
                lastName: '',
                age: 0,
                gender: 'Male',
                address: '',
                occupation: '',
            });
        }
    }, [patient, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to save patient.');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4 md:p-0">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-800 transition-all transform scale-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {patient ? 'Edit Patient' : 'Register Patient'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">NIC</label>
                        <input
                            type="text"
                            name="nic"
                            required
                            value={formData.nic}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            placeholder="National Identity Card"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
                            <select
                                name="age"
                                required
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            >
                                {Array.from({ length: 121 }, (_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <textarea
                            name="address"
                            rows={2}
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Occupation</label>
                        <input
                            type="text"
                            name="occupation"
                            required
                            value={formData.occupation}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientDialog;
