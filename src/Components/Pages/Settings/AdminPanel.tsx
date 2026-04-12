import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTrash, FaUser, FaBan, FaCheckCircle } from 'react-icons/fa';
import { getAllUsers, deleteUserAndData, blockUser, unblockUser, AdminUser } from '../../../Services/adminService';

type ActionId = string | null;

const DELETE_STEPS = [
    'Clearing local cache (IndexedDB)…',
    'Deleting records from server (MongoDB)…',
    'Removing user account…',
];

function AdminPanel() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<ActionId>(null);
    const [deleteStep, setDeleteStep] = useState(0);         // 0 = idle, 1-3 = active step
    const [togglingId, setTogglingId] = useState<ActionId>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<ActionId>(null);

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(() => toast.error('Failed to load users.'))
            .finally(() => setLoading(false));
    }, []);

    const handleToggleBlock = async (user: AdminUser) => {
        setTogglingId(user._id);
        try {
            if (user.isActive === false) {
                await unblockUser(user._id);
                setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: true } : u));
                toast.success(`${user.name} has been unblocked.`);
            } else {
                await blockUser(user._id);
                setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: false } : u));
                toast.success(`${user.name} has been blocked.`);
            }
        } catch {
            toast.error('Failed to update user status. Please try again.');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (user: AdminUser) => {
        setDeletingId(user._id);
        setDeleteStep(1);
        setConfirmDeleteId(null);
        try {
            // adminService drives the 3 steps internally; we mirror progress here
            // by hooking into a thin wrapper that emits step callbacks
            const result = await deleteUserAndData(user._id, (step: number) => setDeleteStep(step));
            setUsers(prev => prev.filter(u => u._id !== user._id));
            toast.success(
                `✓ ${user.name} fully deleted.\n` +
                `IndexedDB — ${result.idbTransactions} tx, ${result.idbAccounts} acc, ` +
                `${result.idbCustomers} customers, ${result.idbLedgerEntries} ledger.\n` +
                `MongoDB — ${result.deletedTransactions} tx, ${result.deletedAccounts} acc, ` +
                `${result.deletedCustomers} customers, ${result.deletedLedgerEntries} ledger.`
            );
        } catch {
            toast.error('Deletion failed. Check console and retry.');
        } finally {
            setDeletingId(null);
            setDeleteStep(0);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const activeCount   = users.filter(u => u.isActive !== false).length;
    const blockedCount  = users.filter(u => u.isActive === false).length;

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Admin Panel</h3>
                <div className="flex gap-2">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                        {activeCount} active
                    </span>
                    {blockedCount > 0 && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
                            {blockedCount} blocked
                        </span>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500">
                Block a user to immediately revoke all access. Delete permanently removes all their data.
            </p>

            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No users found.</div>
            ) : (
                <div className="space-y-2">
                    {users.map(user => {
                        const isBlocked  = user.isActive === false;
                        const isBusy     = deletingId === user._id || togglingId === user._id;
                        const isConfirm  = confirmDeleteId === user._id;

                        return (
                            <div key={user._id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    isBlocked
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}>

                                {/* Avatar */}
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isBlocked ? 'opacity-50' : ''
                                }`}
                                    style={{
                                        background: isBlocked
                                            ? 'linear-gradient(135deg,#9ca3af,#6b7280)'
                                            : 'linear-gradient(135deg,#60a5fa,#2563eb)'
                                    }}>
                                    {user.img_url
                                        ? <img src={user.img_url} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                                        : <FaUser className="text-white text-sm" />
                                    }
                                </div>

                                {/* Info + status badge */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-semibold truncate ${isBlocked ? 'text-gray-400' : 'text-gray-800'}`}>
                                            {user.name}
                                        </p>
                                        {isBlocked && (
                                            <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-500 bg-red-100 px-1.5 py-0.5 rounded">
                                                Blocked
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs truncate ${isBlocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {user.email}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                {/* Deletion in progress — show current step */}
                                {deletingId === user._id ? (
                                    <div className="flex items-center gap-2 flex-shrink-0 max-w-[160px]">
                                        <div className="w-3.5 h-3.5 flex-shrink-0 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-[10px] text-red-500 font-medium leading-tight">
                                            {deleteStep > 0 ? DELETE_STEPS[deleteStep - 1] : 'Deleting…'}
                                        </span>
                                    </div>
                                ) : isConfirm ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-gray-500">Sure?</span>
                                        <button
                                            onClick={() => handleDelete(user)}
                                            disabled={isBusy}
                                            className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            Yes, delete
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="px-2 py-1 text-xs font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {/* Block / Unblock */}
                                        <button
                                            onClick={() => handleToggleBlock(user)}
                                            disabled={isBusy}
                                            title={isBlocked ? `Unblock ${user.name}` : `Block ${user.name}`}
                                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-40 ${
                                                isBlocked
                                                    ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
                                                    : 'text-orange-400 hover:bg-orange-50 hover:text-orange-600'
                                            }`}
                                        >
                                            {togglingId === user._id
                                                ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                : isBlocked
                                                    ? <FaCheckCircle className="text-sm" />
                                                    : <FaBan className="text-sm" />
                                            }
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => setConfirmDeleteId(user._id)}
                                            disabled={isBusy}
                                            title={`Delete ${user.name}`}
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
