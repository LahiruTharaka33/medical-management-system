'use client';

import React, { useState } from 'react';
import { PatientData, createPatient, updatePatient, deletePatient } from '@/actions/patients';
import PatientDialog from './PatientDialog';
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
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
);
const ColumnsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="12" x2="12" y1="3" y2="21" /><line x1="3" x2="21" y1="12" y2="12" /></svg>
);

export default function PatientsView({ initialPatients }: { initialPatients: PatientData[] }) {
    const [patients, setPatients] = useState<PatientData[]>(initialPatients);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);
    const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAllColumns, setShowAllColumns] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Sync state if initialPatients updates (from server revalidation)
    React.useEffect(() => {
        setPatients(initialPatients);
    }, [initialPatients]);

    const filteredPatients = React.useMemo(() => {
        if (!searchQuery.trim()) return patients;

        const lowerQuery = searchQuery.toLowerCase().trim();
        return patients.filter((patient) =>
            patient.firstName.toLowerCase().includes(lowerQuery) ||
            patient.lastName.toLowerCase().includes(lowerQuery) ||
            patient.nic.toLowerCase().includes(lowerQuery) ||
            (patient.address && patient.address.toLowerCase().includes(lowerQuery)) ||
            (patient.occupation && patient.occupation.toLowerCase().includes(lowerQuery))
        );
    }, [patients, searchQuery]);

    // Reset selected index when search changes
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    const handleCreate = async (data: PatientData) => {
        const res = await createPatient(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleUpdate = async (data: PatientData) => {
        const res = await updatePatient(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleDelete = async () => {
        if (!deletingPatientId) return;
        setIsDeleting(true);
        const res = await deletePatient(deletingPatientId);
        setIsDeleting(false);
        if (res.success) {
            setDeletingPatientId(null);
        } else {
            alert(res.error);
            setDeletingPatientId(null);
        }
    };

    const openCreateDialog = () => {
        setEditingPatient(null);
        setDialogOpen(true);
    };

    const openEditDialog = (patient: PatientData) => {
        setEditingPatient(patient);
        setDialogOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (filteredPatients.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < filteredPatients.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedPatient = filteredPatients[selectedIndex];
            if (selectedPatient) {
                openEditDialog(selectedPatient);
            }
        }
    };

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-slate-900 rounded-sm">$1</mark>');
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 transition-colors dark:bg-slate-900">
            {/* Top Header - Reusing design from Dashboard */}
            <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-6 lg:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Patients</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage patient records</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block md:w-56 lg:w-96">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <SearchIcon />
                            </div>
                            <input
                                type="search"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="block w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm"
                                placeholder="Search by Name, NIC, Address..."
                            />
                            {searchQuery && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                        {filteredPatients.length} found
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="relative rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 hover:text-teal-600 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                        <BellIcon />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-6 lg:p-8">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-3 lg:px-6 py-4 lg:py-5 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Registered Patients</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowAllColumns(!showAllColumns)}
                                className={`lg:hidden flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${showAllColumns ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:ring-teal-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
                                title={showAllColumns ? 'Show fewer columns' : 'Show all columns'}
                            >
                                <ColumnsIcon />
                                {showAllColumns ? 'Fewer' : 'All Cols'}
                            </button>
                            <div className="flex gap-1">
                                <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">↓</kbd>
                                <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">↑</kbd>
                                <span className="text-xs text-slate-400 ml-1">to navigate</span>
                            </div>
                            <div className="flex gap-1 ml-3">
                                <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">Enter</kbd>
                                <span className="text-xs text-slate-400 ml-1">to edit</span>
                            </div>
                            <button
                                onClick={openCreateDialog}
                                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors ml-3"
                            >
                                <UserPlusIcon />
                                <span className="hidden sm:inline">Add Patient</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-3 py-3 lg:px-6 lg:py-4 font-medium">NIC</th>
                                    <th className="px-3 py-3 lg:px-6 lg:py-4 font-medium">Name</th>
                                    <th className="px-3 py-3 lg:px-6 lg:py-4 font-medium">Age</th>
                                    <th className="px-3 py-3 lg:px-6 lg:py-4 font-medium">Gender</th>
                                    <th className={`px-3 py-3 lg:px-6 lg:py-4 font-medium ${showAllColumns ? '' : 'hidden lg:table-cell'}`}>Address</th>
                                    <th className={`px-3 py-3 lg:px-6 lg:py-4 font-medium ${showAllColumns ? '' : 'hidden lg:table-cell'}`}>Occupation</th>
                                    <th className="px-3 py-3 lg:px-6 lg:py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            {searchQuery ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-lg font-medium text-slate-900 dark:text-white">No patients found</span>
                                                    <span className="text-slate-500">No matches for "{searchQuery}"</span>
                                                </div>
                                            ) : (
                                                "No patients registered yet."
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPatients.map((patient, index) => {
                                        const isSelected = index === selectedIndex;
                                        return (
                                            <tr
                                                key={patient.id}
                                                onClick={() => openEditDialog(patient)}
                                                className={`transition-colors cursor-pointer group ${isSelected
                                                    ? 'bg-teal-50 dark:bg-teal-900/30 ring-1 ring-inset ring-teal-500/50'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                    }`}
                                            >
                                                <td className="px-3 py-3 lg:px-6 lg:py-4 text-slate-600 dark:text-slate-400 font-mono">
                                                    {searchQuery ? (
                                                        <span dangerouslySetInnerHTML={{ __html: highlightText(patient.nic, searchQuery) }} />
                                                    ) : patient.nic}
                                                </td>
                                                <td className="px-3 py-3 lg:px-6 lg:py-4 font-medium text-slate-900 dark:text-white">
                                                    {searchQuery ? (
                                                        <span dangerouslySetInnerHTML={{ __html: highlightText(`${patient.firstName} ${patient.lastName}`, searchQuery) }} />
                                                    ) : `${patient.firstName} ${patient.lastName}`}
                                                </td>
                                                <td className="px-3 py-3 lg:px-6 lg:py-4 text-slate-600 dark:text-slate-400">{patient.age}</td>
                                                <td className="px-3 py-3 lg:px-6 lg:py-4 text-slate-600 dark:text-slate-400 capitalize">{patient.gender}</td>
                                                <td className={`px-3 py-3 lg:px-6 lg:py-4 text-slate-600 dark:text-slate-400 truncate max-w-xs ${showAllColumns ? '' : 'hidden lg:table-cell'}`} title={patient.address || ''}>
                                                    {patient.address ? (
                                                        searchQuery ? (
                                                            <span dangerouslySetInnerHTML={{ __html: highlightText(patient.address, searchQuery) }} />
                                                        ) : patient.address
                                                    ) : '-'}
                                                </td>
                                                <td className={`px-3 py-3 lg:px-6 lg:py-4 text-slate-600 dark:text-slate-400 ${showAllColumns ? '' : 'hidden lg:table-cell'}`}>
                                                    {patient.occupation ? (
                                                        searchQuery ? (
                                                            <span dangerouslySetInnerHTML={{ __html: highlightText(patient.occupation, searchQuery) }} />
                                                        ) : patient.occupation
                                                    ) : '-'}
                                                </td>
                                                <td className="px-3 py-3 lg:px-6 lg:py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditDialog(patient);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                patient.id && setDeletingPatientId(patient.id);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
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

            <ConfirmDeleteDialog
                open={!!deletingPatientId}
                isDeleting={isDeleting}
                title="Delete Patient"
                message="This will permanently delete this patient and all associated records. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeletingPatientId(null)}
            />
        </div>
    );
}
