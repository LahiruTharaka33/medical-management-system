'use client';

import React, { useState } from 'react';
import { PatientData } from '@/actions/patients';
import { useRouter } from 'next/navigation';
import { handleSignOut } from '@/actions/auth';

// Icons
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

export default function ClinicalProfileView({ initialPatients }: { initialPatients: PatientData[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState<PatientData[]>(initialPatients);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

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

    const handleViewProfile = (id: string) => {
        router.push(`/clinical-profile/${id}`);
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
            if (selectedPatient && selectedPatient.id) {
                handleViewProfile(selectedPatient.id);
            }
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 transition-colors dark:bg-slate-900">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Clinical Profile</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">View and update patient medical history</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block w-96">
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

                    <form action={handleSignOut}>
                        <button type="submit" className="relative rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700" title="Sign Out">
                            <LogOutIcon />
                        </button>
                    </form>
                </div>
            </header>

            <main className="p-8">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Patient Registry</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">↓</kbd>
                                <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">↑</kbd>
                                <span className="text-xs text-slate-400 ml-1">to navigate</span>
                            </div>
                            <div className="flex gap-1 ml-3">
                                <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">Enter</kbd>
                                <span className="text-xs text-slate-400 ml-1">to select</span>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">NIC</th>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Age</th>
                                    <th className="px-6 py-4 font-medium">Gender</th>
                                    <th className="px-6 py-4 font-medium">Address</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            {searchQuery ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-lg font-medium text-slate-900 dark:text-white">No patients found</span>
                                                    <span className="text-slate-500">No matches for "{searchQuery}"</span>
                                                </div>
                                            ) : (
                                                "No patients found."
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPatients.map((patient, index) => {
                                        const isSelected = index === selectedIndex;
                                        return (
                                            <tr
                                                key={patient.id}
                                                onClick={() => patient.id && handleViewProfile(patient.id)}
                                                className={`transition-colors cursor-pointer group ${isSelected
                                                    ? 'bg-teal-50 dark:bg-teal-900/30 ring-1 ring-inset ring-teal-500/50'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">
                                                    {searchQuery ? (
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: patient.nic.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark class="bg-yellow-200 text-slate-900 rounded-sm">$1</mark>')
                                                        }} />
                                                    ) : patient.nic}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected
                                                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                                            : 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300'
                                                        }`}>
                                                        {patient.firstName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        {searchQuery ? (
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: `${patient.firstName} ${patient.lastName}`.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark class="bg-yellow-200 text-slate-900 rounded-sm">$1</mark>')
                                                            }} />
                                                        ) : (
                                                            `${patient.firstName} ${patient.lastName}`
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.age}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">{patient.gender}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">{patient.address || '-'}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <span className={`inline-flex items-center gap-1 text-teal-600 font-medium transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                            }`}>
                                                            View Profile <ChevronRightIcon />
                                                        </span>
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
        </div>
    );
}
