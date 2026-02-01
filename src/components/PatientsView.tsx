'use client';

import React, { useState } from 'react';
import { PatientData, createPatient, updatePatient, deletePatient } from '@/actions/patients';
import PatientDialog from './PatientDialog';

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
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
);

export default function PatientsView({ initialPatients }: { initialPatients: PatientData[] }) {
    const [patients, setPatients] = useState<PatientData[]>(initialPatients);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);

    // Sync state if initialPatients updates (from server revalidation)
    // Note: simpler to just use router.refresh() in actions but passing initialPatients is standard.
    // We'll rely on the parent (server component) passing updated list on re-render.
    React.useEffect(() => {
        setPatients(initialPatients);
    }, [initialPatients]);

    const handleCreate = async (data: PatientData) => {
        const res = await createPatient(data);
        if (!res.success) throw new Error(res.error);
        // Optimistic update or wait for server revalidation via parent
    };

    const handleUpdate = async (data: PatientData) => {
        const res = await updatePatient(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this patient?')) return;
        const res = await deletePatient(id);
        if (!res.success) alert(res.error);
    };

    const openCreateDialog = () => {
        setEditingPatient(null);
        setDialogOpen(true);
    };

    const openEditDialog = (patient: PatientData) => {
        setEditingPatient(patient);
        setDialogOpen(true);
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 transition-colors dark:bg-slate-900">
            {/* Top Header - Reusing design from Dashboard */}
            <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Patients</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage patient records</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="absolute inset-0 h-full w-64 bg-transparent pl-8 text-sm outline-none placeholder:text-transparent"
                        />
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <SearchIcon />
                            </div>
                            <input
                                type="search"
                                className="block w-full rounded-full border-none bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 dark:bg-slate-800 dark:text-white"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <button className="relative rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 hover:text-teal-600 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                        <BellIcon />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </button>
                </div>
            </header>

            <main className="p-8">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Registered Patients</h3>
                        <button
                            onClick={openCreateDialog}
                            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                        >
                            <UserPlusIcon />
                            Add Patient
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">NIC</th>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Age</th>
                                    <th className="px-6 py-4 font-medium">Gender</th>
                                    <th className="px-6 py-4 font-medium">Occupation</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No patients registered yet.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.nic}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {patient.firstName} {patient.lastName}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.age}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.gender}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.occupation}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditDialog(patient)}
                                                        className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => patient.id && handleDelete(patient.id)}
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

            <PatientDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                patient={editingPatient}
                onSave={editingPatient ? handleUpdate : handleCreate}
            />
        </div>
    );
}
