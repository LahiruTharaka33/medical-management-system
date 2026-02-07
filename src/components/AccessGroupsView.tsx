'use client';

import React, { useState } from 'react';
import {
    AccessGroupWithUsers,
    createAccessGroup,
    updateAccessGroup,
    deleteAccessGroup,
    assignUserToGroup,
    removeUserFromGroup,
    getUnassignedUsers,
} from '@/actions/accessGroups';
import AccessGroupDialog from './AccessGroupDialog';
import { handleSignOut } from '@/actions/auth';

// Icons
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);

type AccessGroupViewProps = {
    initialAccessGroups: AccessGroupWithUsers[];
};

export default function AccessGroupsView({ initialAccessGroups }: AccessGroupViewProps) {
    const [accessGroups, setAccessGroups] = useState<AccessGroupWithUsers[]>(initialAccessGroups);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<AccessGroupWithUsers | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [showingUserDropdown, setShowingUserDropdown] = useState<string | null>(null);
    const [unassignedUsers, setUnassignedUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);

    React.useEffect(() => {
        setAccessGroups(initialAccessGroups);
    }, [initialAccessGroups]);

    const toggleExpand = (groupId: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupId)) {
            newExpanded.delete(groupId);
        } else {
            newExpanded.add(groupId);
        }
        setExpandedGroups(newExpanded);
    };

    const handleCreate = async (data: AccessGroupWithUsers) => {
        const res = await createAccessGroup(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleUpdate = async (data: AccessGroupWithUsers) => {
        const res = await updateAccessGroup(data);
        if (!res.success) throw new Error(res.error);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this access group? Users will be unassigned.')) return;
        const res = await deleteAccessGroup(id);
        if (!res.success) alert(res.error);
    };

    const openCreateDialog = () => {
        setEditingGroup(null);
        setDialogOpen(true);
    };

    const openEditDialog = (group: AccessGroupWithUsers) => {
        setEditingGroup(group);
        setDialogOpen(true);
    };

    const handleShowUserDropdown = async (groupId: string) => {
        if (showingUserDropdown === groupId) {
            setShowingUserDropdown(null);
            return;
        }

        const res = await getUnassignedUsers();
        if (res.success) {
            setUnassignedUsers(res.users);
            setShowingUserDropdown(groupId);
        }
    };

    const handleAssignUser = async (userId: string, groupId: string) => {
        const res = await assignUserToGroup(userId, groupId);
        if (!res.success) {
            alert(res.error);
        } else {
            setShowingUserDropdown(null);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (!confirm('Remove this user from the access group?')) return;
        const res = await removeUserFromGroup(userId);
        if (!res.success) alert(res.error);
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 transition-colors dark:bg-slate-900">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Access Groups</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage user access groups and permissions</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <SearchIcon />
                            </div>
                            <input
                                type="search"
                                className="block w-full rounded-full border-none bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 dark:bg-slate-800 dark:text-white"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <button className="relative rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 hover:text-teal-600 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                        <BellIcon />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </button>

                    <form action={handleSignOut}>
                        <button type="submit" className="relative rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700" title="Sign Out">
                            <LogOutIcon />
                        </button>
                    </form>
                </div>
            </header>

            <main className="p-8">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Access Groups</h3>
                        <button
                            onClick={openCreateDialog}
                            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                        >
                            <UserPlusIcon />
                            Add Access Group
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium w-12"></th>
                                    <th className="px-6 py-4 font-medium">Group ID</th>
                                    <th className="px-6 py-4 font-medium">Group Name</th>
                                    <th className="px-6 py-4 font-medium">Description</th>
                                    <th className="px-6 py-4 font-medium">Users</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {accessGroups.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No access groups created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    accessGroups.map((group) => {
                                        const isExpanded = expandedGroups.has(group.id!);
                                        return (
                                            <React.Fragment key={group.id}>
                                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => toggleExpand(group.id!)}
                                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-transform"
                                                            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)' }}
                                                        >
                                                            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{group.groupId}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{group.groupName}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{group.description || '-'}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                        <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                                                            {group.users.length} {group.users.length === 1 ? 'user' : 'users'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditDialog(group)}
                                                                className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <EditIcon />
                                                            </button>
                                                            <button
                                                                onClick={() => group.id && handleDelete(group.id)}
                                                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
                                                            <div className="pl-8 space-y-2">
                                                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Group Members</h4>
                                                                {group.users.length === 0 ? (
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">No users assigned to this group yet.</p>
                                                                ) : (
                                                                    <div className="space-y-2">
                                                                        {group.users.map((user) => (
                                                                            <div key={user.id} className="flex items-center justify-between bg-white dark:bg-slate-700 rounded-lg px-4 py-3 shadow-sm">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                                                                                        {user.name.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleRemoveUser(user.id)}
                                                                                    className="text-slate-400 hover:text-rose-600 transition-colors p-2"
                                                                                    title="Remove from group"
                                                                                >
                                                                                    <XIcon />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                                                                    {showingUserDropdown === group.id ? (
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select User to Add:</label>
                                                                                <button
                                                                                    onClick={() => setShowingUserDropdown(null)}
                                                                                    className="text-sm text-slate-500 hover:text-slate-700"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                            {unassignedUsers.length === 0 ? (
                                                                                <p className="text-sm text-slate-500 italic">No unassigned users available.</p>
                                                                            ) : (
                                                                                <select
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value) {
                                                                                            handleAssignUser(e.target.value, group.id!);
                                                                                        }
                                                                                    }}
                                                                                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                                                    defaultValue=""
                                                                                >
                                                                                    <option value="" disabled>Choose a user...</option>
                                                                                    {unassignedUsers.map((user) => (
                                                                                        <option key={user.id} value={user.id}>
                                                                                            {user.name} ({user.email})
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleShowUserDropdown(group.id!)}
                                                                            className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                                                        >
                                                                            <UserPlusIcon />
                                                                            Add User to Group
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <AccessGroupDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                accessGroup={editingGroup}
                onSave={editingGroup ? handleUpdate : handleCreate}
            />
        </div>
    );
}
