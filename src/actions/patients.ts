'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

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

export async function getPatients() {
    try {
        const patients = await prisma.patient.findMany({
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
        const patient = await prisma.patient.create({
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
        console.error('Error creating patient:', error)
        return { success: false, error: 'Failed to create patient' }
    }
}

export async function updatePatient(data: PatientData) {
    if (!data.id) return { success: false, error: 'Patient ID is required' }
    try {
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
