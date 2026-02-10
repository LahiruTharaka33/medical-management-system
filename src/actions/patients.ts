'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export type PatientData = {
    id?: string
    nic: string
    firstName: string
    lastName: string
    age: number
    gender: string
    address?: string | null
    occupation?: string | null
}

async function getCurrentUser() {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error('Not authenticated')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            accessGroupId: true,
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export async function getPatients() {
    try {
        const user = await getCurrentUser()

        if (!user.accessGroupId) {
            return { success: true, data: [] }
        }

        const patients = await prisma.patient.findMany({
            where: { accessGroupId: user.accessGroupId },
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, data: patients }
    } catch (error) {
        console.error('Error fetching patients:', error)
        return { success: false, error: 'Failed to fetch patients' }
    }
}

export async function createPatient(data: PatientData) {
    try {
        const user = await getCurrentUser()

        if (!user.accessGroupId) {
            return { success: false, error: 'You must belong to an Access Group to create a patient.' }
        }

        const patient = await prisma.patient.create({
            data: {
                nic: data.nic,
                firstName: data.firstName,
                lastName: data.lastName,
                age: data.age,
                gender: data.gender,
                address: data.address,
                occupation: data.occupation,
                accessGroupId: user.accessGroupId,
                createdById: user.id,
            },
        })
        revalidatePath('/patients')
        return { success: true, data: patient }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'This patient is already exist' }
        }
        console.error('Error creating patient:', error)
        return { success: false, error: 'Failed to create patient' }
    }
}

export async function updatePatient(data: PatientData) {
    if (!data.id) return { success: false, error: 'Patient ID is required' }
    try {
        const user = await getCurrentUser()

        if (!user.accessGroupId) {
            return { success: false, error: 'You do not have permission to edit patients.' }
        }

        // Verify user has access to this patient
        const existingPatient = await prisma.patient.findUnique({
            where: { id: data.id },
        })

        if (!existingPatient) {
            return { success: false, error: 'Patient not found' }
        }

        // Check access: strict access group match
        if (existingPatient.accessGroupId !== user.accessGroupId) {
            return { success: false, error: 'You do not have permission to edit this patient' }
        }

        const patient = await prisma.patient.update({
            where: { id: data.id },
            data: {
                nic: data.nic,
                firstName: data.firstName,
                lastName: data.lastName,
                age: data.age,
                gender: data.gender,
                address: data.address,
                occupation: data.occupation,
            },
        })
        revalidatePath('/patients')
        return { success: true, data: patient }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'This patient is already exist' }
        }
        console.error('Error updating patient:', error)
        return { success: false, error: 'Failed to update patient' }
    }
}

export async function deletePatient(id: string) {
    try {
        const user = await getCurrentUser()

        if (!user.accessGroupId) {
            return { success: false, error: 'You do not have permission to delete patients.' }
        }

        // Verify user has access to this patient
        const existingPatient = await prisma.patient.findUnique({
            where: { id },
        })

        if (!existingPatient) {
            return { success: false, error: 'Patient not found' }
        }

        // Check access: strict access group match
        if (existingPatient.accessGroupId !== user.accessGroupId) {
            return { success: false, error: 'You do not have permission to delete this patient' }
        }

        await prisma.patient.delete({
            where: { id },
        })
        revalidatePath('/patients')
        return { success: true }
    } catch (error) {
        console.error('Error deleting patient:', error)
        return { success: false, error: 'Failed to delete patient' }
    }
}

export async function getPatientById(id: string) {
    try {
        const user = await getCurrentUser()

        if (!user.accessGroupId) {
            return { success: false, error: 'You do not have permission to view patients.' }
        }

        const patient = await prisma.patient.findUnique({
            where: { id },
        })

        if (!patient) {
            return { success: false, error: 'Patient not found' }
        }

        // Strict Access Group Check
        if (patient.accessGroupId !== user.accessGroupId) {
            return { success: false, error: 'You do not have permission to view this patient' }
        }

        // Add creator info to response if needed, for now just patient data
        return { success: true, data: patient }
    } catch (error) {
        console.error('Error fetching patient:', error)
        return { success: false, error: 'Failed to fetch patient' }
    }
}
