'use client';

import React, { useState } from 'react';
import { MedicineData, createMedicine, updateMedicine, deleteMedicine } from '@/actions/medicines';
import MedicineDialog from './MedicineDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

// Icons
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const PillPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /><line x1="16" y1="5" x2="22" y2="5" /><line x1="19" y1="2" x2="19" y2="8" /></svg>
);

export default function MedicinesView({ initialMedicines }: { initialMedicines: MedicineData[] }) {
    const [medicines, setMedicines] = useState<MedicineData[]>(initialMedicines);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<MedicineData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingMedicineId, setDeletingMedicineId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    React.useEffect(() => {
        setMedicines(initialMedicines);
    }, [initialMedicines]);

    const filteredMedicines = medicines.filter(m => 
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (data: MedicineData) => {
        const res = await createMedicine(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleUpdate = async (data: MedicineData) => {
        const res = await updateMedicine(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleDelete = async () => {
        if (!deletingMedicineId) return;
        setIsDeleting(true);
        const res = await deleteMedicine(deletingMedicineId);
        setIsDeleting(false);
        if (res.success) {
            setDeletingMedicineId(null);
        } else {
            alert(res.error);
            setDeletingMedicineId(null);
        }
    };

    const openCreateDialog = () => {
        setEditingMedicine(null);
        setDialogOpen(true);
    };

    const openEditDialog = (medicine: MedicineData) => {
        setEditingMedicine(medicine);
        setDialogOpen(true);
    };

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-slate-900 rounded-sm">$1</mark>');
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 transition-colors dark:bg-slate-900">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Medicine Registry</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage medicine inventory and catalog</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block w-72">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <SearchIcon />
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-full border-none bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 dark:bg-slate-800 dark:text-white"
                            placeholder="Search code, name or brand..."
                        />
                    </div>
                </div>
            </header>

            <main className="p-8">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Registered Medicines</h3>
                        <button
                            onClick={openCreateDialog}
                            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                        >
                            <PillPlusIcon />
                            Add Medicine
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Code</th>
                                    <th className="px-6 py-4 font-medium">Generic Name</th>
                                    <th className="px-6 py-4 font-medium">Brand</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Strength</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredMedicines.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            {searchQuery ? 'No medicines match your search.' : 'No medicines registered yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedicines.map((medicine) => (
                                        <tr key={medicine.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">
                                                <span dangerouslySetInnerHTML={{ __html: highlightText(medicine.code, searchQuery) }} />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                <span dangerouslySetInnerHTML={{ __html: highlightText(medicine.genericName, searchQuery) }} />
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                <span dangerouslySetInnerHTML={{ __html: highlightText(medicine.brand, searchQuery) }} />
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-700">
                                                    {medicine.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{medicine.strength} {medicine.unit}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditDialog(medicine)}
                                                        className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => medicine.id && setDeletingMedicineId(medicine.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <MedicineDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                medicine={editingMedicine}
                onSave={editingMedicine ? handleUpdate : handleCreate}
            />

            <ConfirmDeleteDialog
                open={!!deletingMedicineId}
                isDeleting={isDeleting}
                title="Delete Medicine"
                message="This will permanently delete this medicine from the registry. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeletingMedicineId(null)}
            />
        </div>
    );
}
