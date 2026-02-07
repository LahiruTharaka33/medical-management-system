'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export type AccessGroupData = {
    id?: string;
    groupId: string;
    groupName: string;
    description?: string;
};

export type AccessGroupWithUsers = AccessGroupData & {
    users: Array<{
        id: string;
        name: string;
        email: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
};

// Create Access Group
export async function createAccessGroup(data: AccessGroupData) {
    try {
        // Check if groupId already exists
        const existing = await prisma.accessGroup.findUnique({
            where: { groupId: data.groupId },
        });

        if (existing) {
            return { success: false, error: 'This access group is already exist' };
        }

        await prisma.accessGroup.create({
            data: {
                groupId: data.groupId,
                groupName: data.groupName,
                description: data.description || null,
            },
        });

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to create access group:', error);
        return { success: false, error: 'Failed to create access group.' };
    }
}

// Update Access Group
export async function updateAccessGroup(data: AccessGroupData) {
    try {
        if (!data.id) {
            return { success: false, error: 'Access Group ID is required.' };
        }

        // Check if groupId is being changed and if it already exists
        const existing = await prisma.accessGroup.findUnique({
            where: { groupId: data.groupId },
        });

        if (existing && existing.id !== data.id) {
            return { success: false, error: 'Access Group with this Group ID already exists.' };
        }

        await prisma.accessGroup.update({
            where: { id: data.id },
            data: {
                groupId: data.groupId,
                groupName: data.groupName,
                description: data.description || null,
            },
        });

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to update access group:', error);
        return { success: false, error: 'Failed to update access group.' };
    }
}

// Delete Access Group
export async function deleteAccessGroup(id: string) {
    try {
        await prisma.accessGroup.delete({
            where: { id },
        });

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete access group:', error);
        return { success: false, error: 'Failed to delete access group.' };
    }
}

// Assign User to Access Group
export async function assignUserToGroup(userId: string, groupId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { accessGroupId: groupId },
        });

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to assign user to group:', error);
        return { success: false, error: 'Failed to assign user to group.' };
    }
}

// Remove User from Access Group
export async function removeUserFromGroup(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { accessGroupId: null },
        });

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to remove user from group:', error);
        return { success: false, error: 'Failed to remove user from group.' };
    }
}

// Get unassigned users (for dropdown)
export async function getUnassignedUsers() {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
                accessGroupId: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return { success: true, users };
    } catch (error) {
        console.error('Failed to fetch unassigned users:', error);
        return { success: false, error: 'Failed to fetch unassigned users.', users: [] };
    }
}
