'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export type MedicineData = {
    id?: string
    code: string
    genericName: string
    brand: string
    type: string
    strength: number
    unit: string
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
            role: true,
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export async function getMedicines() {
    try {
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: true, data: [] }

        const medicines = await prisma.medicine.findMany({
            where: { accessGroupId: user.accessGroupId },
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
        const user = await getCurrentUser()
        if (!user.accessGroupId) {
            return { success: false, error: 'You must belong to an Access Group to register medicines.' }
        }

        const medicine = await prisma.medicine.create({
            data: {
                code: data.code,
                genericName: data.genericName,
                brand: data.brand,
                type: data.type,
                strength: data.strength,
                unit: data.unit,
                accessGroupId: user.accessGroupId,
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
        const user = await getCurrentUser()
        
        const existing = await prisma.medicine.findUnique({
            where: { id: data.id }
        })

        if (!existing || existing.accessGroupId !== user.accessGroupId) {
            return { success: false, error: 'Unauthorized' }
        }

        const medicine = await prisma.medicine.update({
            where: { id: data.id },
            data: {
                code: data.code,
                genericName: data.genericName,
                brand: data.brand,
                type: data.type,
                strength: data.strength,
                unit: data.unit,
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
        const user = await getCurrentUser()
        
        const existing = await prisma.medicine.findUnique({
            where: { id }
        })

        if (!existing || existing.accessGroupId !== user.accessGroupId) {
            return { success: false, error: 'Unauthorized' }
        }

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
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: true, data: [] }

        const types = await prisma.medicineType.findMany({
            where: { accessGroupId: user.accessGroupId },
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
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: false, error: 'Unauthorized' }

        const medicineType = await prisma.medicineType.create({
            data: { 
                name,
                accessGroupId: user.accessGroupId,
            },
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
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: false, error: 'Unauthorized' }

        await prisma.medicineType.delete({
            where: { 
                name_accessGroupId: {
                    name,
                    accessGroupId: user.accessGroupId
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.error('Error deleting medicine type:', error)
        return { success: false, error: 'Failed to delete type' }
    }
}

export async function getMedicineUnits() {
    try {
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: true, data: [] }

        const units = await prisma.medicineUnit.findMany({
            where: { accessGroupId: user.accessGroupId },
            orderBy: { name: 'asc' },
        })
        return { success: true, data: units }
    } catch (error) {
        console.error('Error fetching medicine units:', error)
        return { success: false, error: 'Failed to fetch medicine units' }
    }
}

export async function createMedicineUnit(name: string) {
    try {
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: false, error: 'Unauthorized' }

        const unit = await prisma.medicineUnit.create({
            data: { 
                name,
                accessGroupId: user.accessGroupId,
            },
        })
        return { success: true, data: unit }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'This unit already exists' }
        }
        console.error('Error creating medicine unit:', error)
        return { success: false, error: 'Failed to create unit' }
    }
}

export async function deleteMedicineUnit(name: string) {
    try {
        const user = await getCurrentUser()
        if (!user.accessGroupId) return { success: false, error: 'Unauthorized' }

        await prisma.medicineUnit.delete({
            where: { 
                name_accessGroupId: {
                    name,
                    accessGroupId: user.accessGroupId
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.error('Error deleting medicine unit:', error)
        return { success: false, error: 'Failed to delete unit' }
    }
}
