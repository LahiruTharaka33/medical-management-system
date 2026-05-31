'use client'

import React, { useEffect } from 'react'

type UnsavedChangesDialogProps = {
    open: boolean
    isSaving: boolean
    onSave: () => void
    onDiscard: () => void
    onCancel: () => void
}

export default function UnsavedChangesDialog({ open, isSaving, onSave, onDiscard, onCancel }: UnsavedChangesDialogProps) {
    // Handle Escape key to cancel
    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSaving) onCancel()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, isSaving, onCancel])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4 md:p-0"
            onClick={() => !isSaving && onCancel()}
        >
            <div
                className="relative w-full max-w-sm rounded-lg bg-white shadow-lg dark:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 pt-5 pb-4">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Unsaved Changes
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Save your changes before leaving?
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2 px-5 pb-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onDiscard}
                        disabled={isSaving}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-50"
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}
