'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export type MedicineData = {
    id?: string
    code: string
    genericName: string
    brand: string
    type: string
    strength: number
}

export async function getMedicines() {
    try {
        const medicines = await prisma.medicine.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, data: medicines }
    } catch (error) {
        console.error('Error fetching medicines:', error)
        return { success: false, error: 'Failed to fetch medicines' }
    }
}

export async function createMedicine(data: MedicineData) {
    try {
        const medicine = await prisma.medicine.create({
            data: {
                code: data.code,
                genericName: data.genericName,
                brand: data.brand,
                type: data.type,
                strength: data.strength,
            },
        })
        revalidatePath('/medicines')
        return { success: true, data: medicine }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'This medicine code already exists' }
        }
        console.error('Error creating medicine:', error)
        return { success: false, error: 'Failed to create medicine' }
    }
}

export async function updateMedicine(data: MedicineData) {
    if (!data.id) return { success: false, error: 'Medicine ID is required' }
    try {
        const medicine = await prisma.medicine.update({
            where: { id: data.id },
            data: {
                code: data.code,
                genericName: data.genericName,
                brand: data.brand,
                type: data.type,
                strength: data.strength,
            },
        })
        revalidatePath('/medicines')
        return { success: true, data: medicine }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'This medicine code already exists' }
        }
        console.error('Error updating medicine:', error)
        return { success: false, error: 'Failed to update medicine' }
    }
}

export async function deleteMedicine(id: string) {
    try {
        await prisma.medicine.delete({
            where: { id },
        })
        revalidatePath('/medicines')
        return { success: true }
    } catch (error) {
        console.error('Error deleting medicine:', error)
        return { success: false, error: 'Failed to delete medicine' }
    }
}

export async function getMedicineTypes() {
    try {
        const types = await prisma.medicineType.findMany({
            orderBy: { name: 'asc' },
        })
        return { success: true, data: types }
    } catch (error) {
        console.error('Error fetching medicine types:', error)
        return { success: false, error: 'Failed to fetch medicine types' }
    }
}

export async function createMedicineType(name: string) {
    try {
        const medicineType = await prisma.medicineType.create({
            data: { name },
        })
        return { success: true, data: medicineType }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'This type already exists' }
        }
        console.error('Error creating medicine type:', error)
        return { success: false, error: 'Failed to create type' }
    }
}

export async function deleteMedicineType(name: string) {
    try {
        await prisma.medicineType.delete({
            where: { name },
        })
        return { success: true }
    } catch (error) {
        console.error('Error deleting medicine type:', error)
        return { success: false, error: 'Failed to delete type' }
    }
}
