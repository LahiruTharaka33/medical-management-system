"use client";

import React from 'react';

// Icons for Dashboard Content
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const HeartPulseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);
const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
);
const MoreHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
);

const Dashboard = () => {
    return (
        <div className="flex-1 min-h-screen bg-slate-50 transition-colors dark:bg-slate-900">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monday, 20 Jan 2026</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="absolute inset-0 h-full w-64 bg-transparent pl-8 text-sm outline-none placeholder:text-transparent"
                        /> {/* Hacky absolute mostly for layout, let's fix */}
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
                {/* Stats Grid */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { title: 'Total Patients', value: '1,284', change: '+12.5%', icon: <UserPlusIcon />, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { title: 'Appointments', value: '42', change: '+4.3%', icon: <ClockIcon />, color: 'text-violet-600', bg: 'bg-violet-50' },
                        { title: 'Operations', value: '12', change: '-2.1%', icon: <HeartPulseIcon />, color: 'text-rose-600', bg: 'bg-rose-50' },
                        { title: 'Satisfied', value: '98%', change: '+1.2%', icon: <HeartPulseIcon />, color: 'text-teal-600', bg: 'bg-teal-50' }, // Reusing heart for satisfaction
                    ].map((stat, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all dark:bg-slate-800 dark:ring-slate-700">
                            <div className="relative z-10 flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <h3 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className={`flex items-center font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {stat.change.startsWith('+') ? <ArrowUpIcon /> : <ArrowUpIcon />} {/* Assuming up arrow for both but rotating or coloring differently is better, here just color */}
                                    {stat.change}
                                </span>
                                <span className="ml-2 text-slate-400">vs last month</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Patients Table */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Appointments</h3>
                        <button className="text-sm font-medium text-teal-600 hover:text-teal-700">View all</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Patient Name</th>
                                    <th className="px-6 py-4 font-medium">Visit ID</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Doctor</th>
                                    <th className="px-6 py-4 font-medium">Condition</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {/* Rows */}
                                {[
                                    { name: 'Sarah Wilson', id: '#PAT-001', date: 'Oct 24, 2024', doctor: 'Dr. Smith', tag: 'Fever', tagColor: 'bg-rose-100 text-rose-700' },
                                    { name: 'James Rodri', id: '#PAT-002', date: 'Oct 23, 2024', doctor: 'Dr. Johnson', tag: 'Checkup', tagColor: 'bg-blue-100 text-blue-700' },
                                    { name: 'Anna Doe', id: '#PAT-003', date: 'Oct 22, 2024', doctor: 'Dr. Smith', tag: 'Dental', tagColor: 'bg-teal-100 text-teal-700' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {row.name.charAt(0)}
                                            </div>
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.id}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.date}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.doctor}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.tagColor}`}>
                                                {row.tag}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                <MoreHorizontalIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
