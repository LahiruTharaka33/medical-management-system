'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UnsavedChangesDialog from '@/components/UnsavedChangesDialog'

export default function ClinicalProfileClientWrapper({ children }: { children: React.ReactNode }) {
    const [isDirty, setIsDirty] = useState({ consultation: false, chronicIllness: false })
    const [showDialog, setShowDialog] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    // Listen for dirty state changes dispatched by both forms
    useEffect(() => {
        const handler = ((e: CustomEvent<{ source: string, dirty: boolean }>) => {
            setIsDirty(prev => ({ ...prev, [e.detail.source]: e.detail.dirty }))
        }) as EventListener
        window.addEventListener('unsaved-changes', handler)
        return () => window.removeEventListener('unsaved-changes', handler)
    }, [])

    // Browser tab close / refresh warning
    useEffect(() => {
        const anyDirty = isDirty.consultation || isDirty.chronicIllness
        if (!anyDirty) return

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [isDirty])

    // Intercept link clicks using capture phase (fires before Next.js Link handlers)
    useEffect(() => {
        const anyDirty = isDirty.consultation || isDirty.chronicIllness
        if (!anyDirty) return

        const handler = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a[href]')
            if (!anchor) return

            const href = anchor.getAttribute('href')
            if (!href) return
            // Allow hash links, javascript:, mailto:, new tabs, and downloads
            if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return
            if (anchor.getAttribute('target') === '_blank') return
            if (anchor.hasAttribute('download')) return

            // Intercept navigation
            e.preventDefault()
            e.stopPropagation()

            setPendingNavigation(href)
            setShowDialog(true)
        }

        window.addEventListener('click', handler, true) // capture phase
        return () => window.removeEventListener('click', handler, true)
    }, [isDirty])

    // Handle "Save Changes" — trigger saves for all dirty forms, wait, then navigate
    const handleSaveAndLeave = async () => {
        setIsSaving(true)
        const promises: Promise<boolean>[] = []

        if (isDirty.consultation) {
            promises.push(new Promise<boolean>((resolve) => {
                const handler = ((e: CustomEvent<{ success: boolean }>) => {
                    window.removeEventListener('save-complete-consultation', handler as any)
                    resolve(e.detail.success)
                }) as EventListener
                window.addEventListener('save-complete-consultation', handler)
            }))
            window.dispatchEvent(new CustomEvent('trigger-save-consultation'))
        }

        if (isDirty.chronicIllness) {
            promises.push(new Promise<boolean>((resolve) => {
                const handler = ((e: CustomEvent<{ success: boolean }>) => {
                    window.removeEventListener('save-complete-chronicIllness', handler as any)
                    resolve(e.detail.success)
                }) as EventListener
                window.addEventListener('save-complete-chronicIllness', handler)
            }))
            window.dispatchEvent(new CustomEvent('trigger-save-chronicIllness'))
        }

        const results = await Promise.all(promises)
        const allSuccess = results.every(r => r)

        setIsSaving(false)

        if (allSuccess && pendingNavigation) {
            setShowDialog(false)
            router.push(pendingNavigation)
        } else {
            // A save failed — stay on page so user can fix errors
            setShowDialog(false)
            setPendingNavigation(null)
        }
    }

    // Handle "Discard Changes" — clear drafts and navigate without saving
    const handleDiscardAndLeave = () => {
        window.dispatchEvent(new CustomEvent('discard-changes'))
        setShowDialog(false)
        if (pendingNavigation) {
            router.push(pendingNavigation)
        }
    }

    // Handle "Cancel" — close dialog, stay on page
    const handleCancel = () => {
        setShowDialog(false)
        setPendingNavigation(null)
    }

    return (
        <>
            {children}
            <UnsavedChangesDialog
                open={showDialog}
                isSaving={isSaving}
                onSave={handleSaveAndLeave}
                onDiscard={handleDiscardAndLeave}
                onCancel={handleCancel}
            />
        </>
    )
}
