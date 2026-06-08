'use client'

import React, { useState, useMemo } from 'react'

type HistoryLog = {
    id: string
    patientId: string
    section: string
    field: string
    oldValue: string | null
    newValue: string | null
    createdAt: string | Date
}

interface Props {
    logs: HistoryLog[]
    patientId: string
    initialSection: string
}

const SECTIONS = [
    { key: 'DIABETES', label: 'Diabetes' },
    { key: 'HTN', label: 'HTN - Blood Pressure' },
    { key: 'DYSLIPIDEMIA', label: 'Dyslipidemia' },
    { key: 'DIET_LIFESTYLE', label: 'Diet and Life Style' },
    { key: 'ASSESS_COMPLICATIONS', label: 'Assess Complications' },
    { key: 'OTHER_CHRONIC_ILLNESSES', label: 'Other Chronic Illnesses' },
]

export default function HistoryPageDashboard({ logs, patientId, initialSection }: Props) {
    const [activeSection, setActiveSection] = useState(initialSection)
    const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())

    const filteredLogs = logs.filter(log => log.section === activeSection)

    const isMeasurementSection = ['DIABETES', 'HTN', 'DYSLIPIDEMIA'].includes(activeSection)

    // Get unique field names for current section
    const uniqueFields = useMemo(() => {
        const fields = new Set(filteredLogs.map(log => log.field))
        return Array.from(fields).sort()
    }, [filteredLogs])

    // Whether "All" is effectively active (no specific filter selected)
    const isAllSelected = selectedFields.size === 0

    // Apply field filter on top of section filter
    const displayedLogs = useMemo(() => {
        if (!isMeasurementSection || isAllSelected) return filteredLogs
        return filteredLogs.filter(log => selectedFields.has(log.field))
    }, [filteredLogs, selectedFields, isMeasurementSection, isAllSelected])

    const handleTabChange = (sectionKey: string) => {
        setActiveSection(sectionKey)
        setSelectedFields(new Set()) // Reset filter on tab switch
    }

    const handleToggleField = (field: string) => {
        setSelectedFields(prev => {
            const next = new Set(prev)
            if (next.has(field)) {
                next.delete(field)
            } else {
                next.add(field)
            }
            return next
        })
    }

    const handleSelectAll = () => {
        setSelectedFields(new Set())
    }

    const formatDateTime = (dateStr: string | Date) => {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(dateStr))
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 overflow-x-auto scrollbar-none">
                <div className="flex space-x-1 min-w-max">
                    {SECTIONS.map((sec) => (
                        <button
                            key={sec.key}
                            onClick={() => handleTabChange(sec.key)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                                activeSection === sec.key
                                    ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {sec.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Chips - Only for measurement sections with data */}
            {isMeasurementSection && uniqueFields.length > 1 && (
                <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                            Filter by:
                        </span>
                        {/* All chip */}
                        <button
                            onClick={handleSelectAll}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                                isAllSelected
                                    ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                                    : 'bg-white dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-600 hover:ring-teal-300 dark:hover:ring-teal-600 hover:text-teal-600 dark:hover:text-teal-400'
                            }`}
                        >
                            {isAllSelected && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            )}
                            All
                        </button>
                        {/* Individual field chips */}
                        {uniqueFields.map((field) => {
                            const isSelected = selectedFields.has(field)
                            return (
                                <button
                                    key={field}
                                    onClick={() => handleToggleField(field)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                                        isSelected
                                            ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                                            : 'bg-white dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-600 hover:ring-teal-300 dark:hover:ring-teal-600 hover:text-teal-600 dark:hover:text-teal-400'
                                    }`}
                                >
                                    {isSelected && (
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    )}
                                    {field}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="p-6">
                {displayedLogs.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700/50 text-slate-400 dark:text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                            {!isAllSelected ? 'No records match the selected filter' : 'No history records found'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                            {!isAllSelected
                                ? 'Try selecting a different field or click "All" to view all records.'
                                : 'Changes saved for this section will be logged and displayed here.'}
                        </p>
                    </div>
                ) : isMeasurementSection ? (
                    /* Measurements Logs - Elegant Table */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Date & Time</th>
                                    <th className="py-3 px-4">Field Name</th>
                                    <th className="py-3 px-4">Previous Value</th>
                                    <th className="py-3 px-2"></th>
                                    <th className="py-3 px-4">New Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {displayedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="py-4 px-4 font-medium whitespace-nowrap text-slate-500 dark:text-slate-400">
                                            {formatDateTime(log.createdAt)}
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-slate-800 dark:text-white">
                                            {log.field}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 line-through text-slate-500 dark:text-slate-400 font-mono text-xs">
                                                {log.oldValue}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m13 5 7 7-7 7M5 5l7 7-7 7" />
                                            </svg>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 font-semibold font-mono text-xs ring-1 ring-inset ring-teal-600/10 dark:ring-teal-400/20">
                                                {log.newValue}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Text Section Logs - Card Timeline / Comparison View */
                    <div className="space-y-6">
                        {displayedLogs.map((log) => (
                            <div key={log.id} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                                {/* Card Header */}
                                <div className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <span className="font-semibold text-slate-800 dark:text-white text-sm">
                                        {log.field} Update
                                    </span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {formatDateTime(log.createdAt)}
                                    </span>
                                </div>
                                {/* Card Comparison Body */}
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                    {/* Left Side: Old Value */}
                                    <div className="p-5 bg-slate-50/20 dark:bg-slate-800/10">
                                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Previous Text</span>
                                        <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-mono bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
                                            {log.oldValue === '-' ? (
                                                <span className="text-slate-400 italic">No previous content</span>
                                            ) : (
                                                log.oldValue
                                            )}
                                        </div>
                                    </div>
                                    {/* Right Side: New Value */}
                                    <div className="p-5">
                                        <span className="block text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">New Text</span>
                                        <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-mono bg-teal-50/10 dark:bg-teal-950/10 p-3.5 rounded-lg border border-teal-50 dark:border-teal-950/20">
                                            {log.newValue === '-' ? (
                                                <span className="text-slate-400 italic">Content cleared</span>
                                            ) : (
                                                log.newValue
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

