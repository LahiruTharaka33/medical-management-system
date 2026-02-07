'use client';

import React, { useState, useEffect } from 'react';
import { AccessGroupWithUsers } from '@/actions/accessGroups';

type AccessGroupDialogProps = {
    open: boolean;
    onClose: () => void;
    accessGroup: AccessGroupWithUsers | null;
    onSave: (data: AccessGroupWithUsers) => Promise<void>;
};

export default function AccessGroupDialog({ open, onClose, accessGroup, onSave }: AccessGroupDialogProps) {
    const [formData, setFormData] = useState({
        groupId: '',
        groupName: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (accessGroup) {
            setFormData({
                groupId: accessGroup.groupId,
                groupName: accessGroup.groupName,
                description: accessGroup.description || '',
            });
        } else {
            setFormData({
                groupId: '',
                groupName: '',
                description: '',
            });
        }
        setError('');
    }, [accessGroup, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSave({
                id: accessGroup?.id,
                groupId: formData.groupId,
                groupName: formData.groupName,
                description: formData.description,
                users: accessGroup?.users || [],
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save access group');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 text-white">
                    <h2 className="text-xl font-bold">
                        {accessGroup ? 'Edit Access Group' : 'Create Access Group'}
                    </h2>
                    <p className="text-sm text-teal-100 mt-1">
                        {accessGroup ? 'Update access group details' : 'Add a new access group'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Group ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.groupId}
                            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                            disabled={!!accessGroup}
                            readOnly={!!accessGroup}
                            className={`block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white ${accessGroup ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''
                                }`}
                            placeholder="e.g., AG001"
                        />
                        {accessGroup && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Group ID cannot be changed after creation
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Group Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.groupName}
                            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="e.g., Doctors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="Brief description of this access group..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 shadow-lg shadow-teal-600/30"
                        >
                            {loading ? 'Saving...' : accessGroup ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
