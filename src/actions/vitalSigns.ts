'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { getPatientById } from './patients'

const prisma = new PrismaClient()

export type VitalSignsData = {
    patientId: string
    systolicBP?: number
    diastolicBP?: number
    heartRate?: number
    respiratoryRate?: number
    temperature?: number
    oxygenSaturation?: number
}

async function getCurrentUser() {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error('Not authenticated')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export async function addVitalSigns(data: VitalSignsData) {
    try {
        const user = await getCurrentUser()

        // 1. Verify Access to Patient
        // We reuse the robust access logic from getPatientById
        const accessCheck = await getPatientById(data.patientId);
        if (!accessCheck.success) {
            return { success: false, error: accessCheck.error || 'Access denied' }
        }

        // 2. Create Record
        const vitalSigns = await prisma.vitalSigns.create({
            data: {
                patientId: data.patientId,
                systolicBP: data.systolicBP,
                diastolicBP: data.diastolicBP,
                heartRate: data.heartRate,
                respiratoryRate: data.respiratoryRate,
                temperature: data.temperature,
                oxygenSaturation: data.oxygenSaturation,
                recordedById: user.id,
            }
        })

        revalidatePath(`/clinical-profile/${data.patientId}`)
        return { success: true, data: vitalSigns }

    } catch (error) {
        console.error('Error adding vital signs:', error)
        return { success: false, error: 'Failed to add vital signs' }
    }
}

export async function getLatestVitalSigns(patientId: string) {
    try {
        // Access check
        const accessCheck = await getPatientById(patientId);
        if (!accessCheck.success) {
            return { success: false, error: accessCheck.error }
        }

        const latest = await prisma.vitalSigns.findFirst({
            where: { patientId },
            orderBy: { recordedAt: 'desc' },
        })

        return { success: true, data: latest }

    } catch (error) {
        console.error('Error fetching vital signs:', error)
        return { success: false, error: 'Failed to fetch vital signs' }
    }
}
