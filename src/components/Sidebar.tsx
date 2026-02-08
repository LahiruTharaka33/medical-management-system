"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);


const ClinicalProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
);

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: <HomeIcon /> },
        { name: 'Patients', href: '/patients', icon: <UsersIcon /> },
        { name: 'Clinical Profile', href: '/clinical-profile', icon: <ClinicalProfileIcon /> },
        { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/' || pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 flex-col bg-teal-900 text-white shadow-xl transition-all duration-300 z-50 hidden md:flex">
            {/* Logo Area */}
            <div className="flex h-20 items-center gap-3 px-8 text-2xl font-bold tracking-wide">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-teal-300 backdrop-blur-sm shadow-inner">
                    <ActivityIcon />
                </div>
                <span>Medi<span className="text-teal-300">Care</span></span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ease-in-out
                                ${active
                                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-900/20 translate-x-1'
                                    : 'text-teal-100/70 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <span className={`${active ? 'text-white' : 'text-teal-300/70 group-hover:text-teal-300'}`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Snippet */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-xs font-bold ring-2 ring-teal-800">
                        DS
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Dr. Smith</span>
                        <span className="text-xs text-teal-300/80">Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
