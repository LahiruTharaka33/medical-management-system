'use client';

import React from 'react';

type Record = {
    id: string;
    createdAt: Date;
    diagnose: string | null;
};

export default function PatientHistoryNavigator({ records }: { records: Record[] }) {
    const handleNavigate = (timestamp: number) => {
        // 1. Switch tab to presentingComplain
        const switchEvent = new CustomEvent('switch-tab', { detail: { tabId: 'presentingComplain' } });
        window.dispatchEvent(switchEvent);

        // 2. Scroll to the element
        // Small delay to ensure tab has switched and element is rendered
        setTimeout(() => {
            const element = document.getElementById(`record-${timestamp}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Add a temporary highlight effect
                element.classList.add('ring-2', 'ring-teal-500', 'ring-offset-2');
                setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-teal-500', 'ring-offset-2');
                }, 2000);
            }
        }, 100);
    };

    return (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {records && records.length > 0 ? (
                records.map((record) => (
                    <button
                        key={record.id}
                        onClick={() => handleNavigate(new Date(record.createdAt).getTime())}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-sm hover:border-teal-200 dark:hover:border-teal-900/50 transition-all group"
                    >
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {new Date(record.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        {record.diagnose ? (
                            <div className="text-right flex-1 truncate">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 ring-1 ring-inset ring-green-600/20 truncate max-w-full group-hover:bg-green-200 dark:group-hover:bg-green-500/30 transition-colors">
                                    {record.diagnose}
                                </span>
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 italic text-right flex-1 truncate">No diagnosis</div>
                        )}
                    </button>
                ))
            ) : (
                <div className="text-sm text-slate-400 italic text-center py-8">
                    No history available.
                </div>
            )}
        </div>
    );
}
