'use client';
import React, { useState } from 'react';

export default function ProfileTabs({ 
    presentingComplain, 
    chronicIllness 
}: { 
    presentingComplain: React.ReactNode, 
    chronicIllness: React.ReactNode 
}) {
    // Presenting Complain is the first tab, so default to it
    const [activeTab, setActiveTab] = useState('presentingComplain');

    return (
        <div className="w-full">
            <div className="flex space-x-2 mb-6 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('presentingComplain')}
                    className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'presentingComplain' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'}`}
                >
                    Presenting Complain
                </button>
                <button
                    onClick={() => setActiveTab('chronicIllness')}
                    className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'chronicIllness' ? 'border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'}`}
                >
                    Chronic Illness
                </button>
            </div>
            
            <div className="fade-in-up">
                {activeTab === 'presentingComplain' && presentingComplain}
                {activeTab === 'chronicIllness' && chronicIllness}
            </div>
        </div>
    );
}
