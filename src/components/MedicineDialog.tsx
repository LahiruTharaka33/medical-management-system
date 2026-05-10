'use client';

import React, { useState, useEffect } from 'react';
import { MedicineData, getMedicineTypes, createMedicineType, deleteMedicineType } from '@/actions/medicines';

type MedicineDialogProps = {
    open: boolean;
    onClose: () => void;
    medicine?: MedicineData | null;
    onSave: (data: MedicineData) => Promise<void>;
};

const MedicineDialog = ({ open, onClose, medicine, onSave }: MedicineDialogProps) => {
    const [formData, setFormData] = useState<MedicineData>({
        code: '',
        genericName: '',
        brand: '',
        type: '',
        strength: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [isAddingNewType, setIsAddingNewType] = useState(false);
    const [newType, setNewType] = useState('');
    const [addingTypeLoading, setAddingTypeLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) {
            fetchTypes();
        }
    }, [open]);

    const fetchTypes = async () => {
        const res = await getMedicineTypes();
        if (res.success && res.data) {
            const fetchedTypes = res.data.map(t => t.name);
            // Default types if table is empty
            const defaultTypes = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'];
            const allTypes = Array.from(new Set([...defaultTypes, ...fetchedTypes]));
            setTypes(allTypes.sort());
        }
    };

    const handleDeleteType = async (typeName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete the type "${typeName}"?`)) return;
        
        const res = await deleteMedicineType(typeName);
        if (res.success) {
            setTypes(prev => prev.filter(t => t !== typeName));
            if (formData.type === typeName) {
                setFormData(prev => ({ ...prev, type: '' }));
            }
        } else {
            // If it's a default type not in DB, we just filter it locally for the session
            setTypes(prev => prev.filter(t => t !== typeName));
        }
    };

    useEffect(() => {
        if (medicine) {
            setFormData(medicine);
        } else {
            setFormData({
                code: '',
                genericName: '',
                brand: '',
                type: '',
                strength: 0,
            });
        }
        setIsAddingNewType(false);
        setNewType('');
    }, [medicine, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'strength' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleAddNewType = async () => {
        if (!newType.trim()) return;
        setAddingTypeLoading(true);
        const res = await createMedicineType(newType.trim());
        if (res.success) {
            setTypes(prev => [...prev, newType.trim()].sort());
            setFormData(prev => ({ ...prev, type: newType.trim() }));
            setNewType('');
            setIsAddingNewType(false);
        } else {
            setError(res.error || 'Failed to add new type');
        }
        setAddingTypeLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save medicine.');
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
                        {medicine ? 'Edit Medicine' : 'Register Medicine'}
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
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Code</label>
                        <input
                            type="text"
                            name="code"
                            required
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            placeholder="Medicine Code (e.g., MED001)"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Generic Name</label>
                        <input
                            type="text"
                            name="genericName"
                            required
                            value={formData.genericName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            placeholder="Generic Name"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            required
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            placeholder="Brand Name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative" ref={dropdownRef}>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                            
                            {/* Custom Dropdown Trigger */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                                >
                                    <span>{formData.type || 'Select Type'}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute left-0 right-0 z-[60] mt-1 max-h-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                                        <div className="overflow-y-auto max-h-48 divide-y divide-slate-100 dark:divide-slate-700">
                                            {types.map((type) => (
                                                <div
                                                    key={type}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, type }));
                                                        setDropdownOpen(false);
                                                    }}
                                                    className={`group flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${formData.type === type ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}`}
                                                >
                                                    <span>{type}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteType(type, e)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
                                                        title="Delete type"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Dropdown Footer - Add New Type */}
                                        <div className="border-t border-slate-100 p-2 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                                            {isAddingNewType ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        autoFocus
                                                        value={newType}
                                                        onChange={(e) => setNewType(e.target.value)}
                                                        className="flex-1 rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                                                        placeholder="Type name..."
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddNewType();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddNewType}
                                                        disabled={addingTypeLoading}
                                                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                                                    >
                                                        {addingTypeLoading ? '...' : 'Add'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAddingNewType(false)}
                                                        className="text-slate-400 hover:text-slate-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingNewType(true)}
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                    Add New Type
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Strength (mg)</label>
                            <input
                                type="number"
                                name="strength"
                                step="0.01"
                                required
                                value={formData.strength}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
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
                            {loading ? 'Saving...' : 'Save Medicine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicineDialog;
