"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

const MedicineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCollapsedTablet, setIsCollapsedTablet] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Sync collapsed state with localStorage and document body
    useEffect(() => {
        const stored = localStorage.getItem('sidebar-collapsed-tablet');
        if (stored === 'true') {
            setIsCollapsedTablet(true);
            document.body.classList.add('sidebar-collapsed-tablet');
        }
    }, []);

    // Listen to sync events from other sidebar instances
    useEffect(() => {
        const handleSync = (e: CustomEvent<boolean>) => {
            setIsCollapsedTablet(e.detail);
        };
        window.addEventListener('sidebar-collapsed-change', handleSync as any);
        return () => window.removeEventListener('sidebar-collapsed-change', handleSync as any);
    }, []);

    const toggleCollapseTablet = () => {
        const nextState = !isCollapsedTablet;
        setIsCollapsedTablet(nextState);
        localStorage.setItem('sidebar-collapsed-tablet', nextState ? 'true' : 'false');
        if (nextState) {
            document.body.classList.add('sidebar-collapsed-tablet');
        } else {
            document.body.classList.remove('sidebar-collapsed-tablet');
        }
        window.dispatchEvent(new CustomEvent('sidebar-collapsed-change', { detail: nextState }));
    };

    const userName = session?.user?.name || session?.user?.email || 'User';
    const displayName = `Dr. ${userName}`;
    const initials = getInitials(userName);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: <HomeIcon /> },
        { name: 'Patients', href: '/patients', icon: <UsersIcon /> },
        { name: 'Clinical Profile', href: '/clinical-profile', icon: <ClinicalProfileIcon /> },
        { name: 'Medicine Registry', href: '/medicines', icon: <MedicineIcon /> },
        { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/' || pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    // Close expanded sidebar on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isExpanded && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded]);

    // Close expanded sidebar on route change
    useEffect(() => {
        setIsExpanded(false);
    }, [pathname]);

    return (
        <>
            {/* Overlay backdrop when expanded on tablet */}
            {isExpanded && !isCollapsedTablet && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" />
            )}

            {/* Floating button on the left edge of the screen when sidebar is collapsed on tablet */}
            {isCollapsedTablet && (
                <button
                    onClick={toggleCollapseTablet}
                    className="fixed left-0 top-1/2 z-50 -translate-y-1/2 rounded-r-xl bg-teal-900 p-3 text-teal-300 shadow-lg border border-l-0 border-teal-800 hover:bg-teal-800 hover:text-white transition-all hidden md:flex"
                    title="Show sidebar"
                >
                    <ChevronRightIcon />
                </button>
            )}

            <aside
                ref={sidebarRef}
                className={`fixed left-0 top-0 h-screen flex-col bg-teal-900 text-white shadow-xl z-50 hidden md:flex transition-all duration-300
                    ${isCollapsedTablet ? 'md:w-0 md:-translate-x-full overflow-hidden' : (isExpanded ? 'w-64' : 'md:w-20 lg:w-64')}`}
            >
                {/* Logo Area */}
                <div className="flex h-20 items-center gap-3 px-4 lg:px-8 text-2xl font-bold tracking-wide">
                    <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-white/10 text-teal-300 backdrop-blur-sm shadow-inner">
                        <ActivityIcon />
                    </div>
                    <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'hidden lg:inline opacity-0 lg:opacity-100'}`}>
                        Medi<span className="text-teal-300">Care</span>
                    </span>
                </div>

                {/* Hamburger toggle — visible only on md, hidden on lg */}
                <div className={`px-4 pb-1 ${isExpanded ? 'hidden' : 'block lg:hidden'}`}>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex w-full items-center justify-center rounded-lg p-2 text-teal-300 hover:bg-white/10 transition-colors"
                        title="Expand sidebar"
                    >
                        <MenuIcon />
                    </button>
                </div>

                {/* Collapse button to hide sidebar on tablet — visible only on md, hidden on lg */}
                <div className={`px-4 pb-2 ${isExpanded ? 'hidden' : 'block lg:hidden'}`}>
                    <button
                        onClick={toggleCollapseTablet}
                        className="flex w-full items-center justify-center rounded-lg p-2 text-teal-300 hover:bg-white/10 transition-colors"
                        title="Hide sidebar completely"
                    >
                        <ChevronLeftIcon />
                    </button>
                </div>

                {/* Close button when expanded on tablet */}
                {isExpanded && (
                    <div className="px-4 pb-2 lg:hidden">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="flex w-full items-center justify-center rounded-lg p-2 text-teal-300 hover:bg-white/10 transition-colors"
                            title="Collapse sidebar drawer"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 space-y-2 px-3 lg:px-4 py-6">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={item.name}
                                className={`group flex w-full items-center gap-4 rounded-xl px-3 lg:px-4 py-3.5 text-sm font-medium transition-all duration-200 ease-in-out
                                    ${isExpanded ? 'px-4' : ''}
                                    ${active
                                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-900/20 translate-x-1'
                                        : 'text-teal-100/70 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <span className={`min-w-[20px] ${active ? 'text-white' : 'text-teal-300/70 group-hover:text-teal-300'}`}>
                                    {item.icon}
                                </span>
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'hidden lg:inline opacity-0 lg:opacity-100'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Snippet */}
                <div className="border-t border-white/10 p-3 lg:p-4">
                    <div className={`flex items-center gap-3 rounded-xl bg-white/5 p-2 lg:p-3 hover:bg-white/10 transition-colors cursor-pointer ${isExpanded ? 'p-3' : ''}`}>
                        <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-xs font-bold ring-2 ring-teal-800">
                            {initials}
                        </div>
                        <div className={`flex flex-col transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'hidden lg:flex opacity-0 lg:opacity-100'}`}>
                            <span className="text-sm font-semibold">{displayName}</span>
                            <span className="text-xs text-teal-300/80">User</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
