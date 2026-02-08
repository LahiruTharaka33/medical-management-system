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

        let whereClause: any = { createdById: user.id }

        if (user.accessGroupId) {
            // Get all user IDs in the same access group
            const groupUsers = await prisma.user.findMany({
                where: { accessGroupId: user.accessGroupId },
                select: { id: true }
            })
            const groupUserIds = groupUsers.map(u => u.id)

            // Show patients that belong to the access group OR created by any user in the group
            whereClause = {
                OR: [
                    { accessGroupId: user.accessGroupId },
                    { createdById: { in: groupUserIds } }
                ]
            }
        }

        const patients = await prisma.patient.findMany({
            where: whereClause,
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

        const patient = await prisma.patient.create({
            data: {
                nic: data.nic,
                firstName: data.firstName,
                lastName: data.lastName,
                age: data.age,
                gender: data.gender,
                address: data.address,
                occupation: data.occupation,
                accessGroupId: user.accessGroupId || null,
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

        // Verify user has access to this patient
        const existingPatient = await prisma.patient.findUnique({
            where: { id: data.id },
        })

        if (!existingPatient) {
            return { success: false, error: 'Patient not found' }
        }

        // Check access: either same access group or created by this user
        const hasAccess = user.accessGroupId
            ? existingPatient.accessGroupId === user.accessGroupId
            : existingPatient.createdById === user.id

        if (!hasAccess) {
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

        // Verify user has access to this patient
        const existingPatient = await prisma.patient.findUnique({
            where: { id },
        })

        if (!existingPatient) {
            return { success: false, error: 'Patient not found' }
        }

        // Check access: either same access group or created by this user
        const hasAccess = user.accessGroupId
            ? existingPatient.accessGroupId === user.accessGroupId
            : existingPatient.createdById === user.id

        if (!hasAccess) {
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

        const patient = await prisma.patient.findUnique({
            where: { id },
        })

        if (!patient) {
            return { success: false, error: 'Patient not found' }
        }

        let hasAccess = false

        if (user.accessGroupId) {
            // User is in a group
            // Access if patient belongs to group
            if (patient.accessGroupId === user.accessGroupId) {
                hasAccess = true
            } else {
                // OR if patient is personal record of a current group member
                const creator = await prisma.user.findUnique({
                    where: { id: patient.createdById },
                    select: { accessGroupId: true }
                })
                if (creator && creator.accessGroupId === user.accessGroupId) {
                    hasAccess = true;
                }
            }
        } else {
            // User is not in a group - only access their own patients
            if (patient.createdById === user.id) {
                hasAccess = true
            }
        }

        if (!hasAccess) {
            return { success: false, error: 'You do not have permission to view this patient' }
        }

        // Add creator info to response if needed, for now just patient data
        return { success: true, data: patient }
    } catch (error) {
        console.error('Error fetching patient:', error)
        return { success: false, error: 'Failed to fetch patient' }
    }
}
