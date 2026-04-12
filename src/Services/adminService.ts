import http from './http/http';
import { db } from '../db';

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    googleId?: string;
    img_url?: string;
    isActive?: boolean;
    createdAt?: string;
}

export interface DeleteResult {
    deletedLedgerEntries: number;
    deletedCustomers: number;
    deletedTransactions: number;
    deletedAccounts: number;
}

export const getAllUsers = async (): Promise<AdminUser[]> => {
    const res = await http({ url: '/admin/users', method: 'get' });
    return res.data.data;
};

export const blockUser = async (userId: string): Promise<void> => {
    await http({ url: `/admin/users/${userId}/block`, method: 'put' });
};

export const unblockUser = async (userId: string): Promise<void> => {
    await http({ url: `/admin/users/${userId}/unblock`, method: 'put' });
};

export const deleteUserAndData = async (userId: string): Promise<DeleteResult> => {
    // Delete from MongoDB via backend
    const res = await http({ url: `/admin/users/${userId}`, method: 'delete' });
    const result: DeleteResult = res.data.data;

    // Clean up local IndexedDB — filter by created_by matching userId
    const [allTransactions, allAccounts, allCustomers, allLedger] = await Promise.all([
        db.transactions.toArray(),
        db.accounts.toArray(),
        db.khatabookCustomers.toArray(),
        db.khatabookTransactions.toArray(),
    ]);

    const txIds = allTransactions.filter(r => r.data?.created_by === userId).map(r => r.id);
    const accIds = allAccounts.filter(r => r.data?.created_by === userId).map(r => r.id);
    const custIds = allCustomers.filter(r => r.data?.created_by === userId).map(r => r.id);
    const ledgerIds = allLedger.filter(r => r.data?.created_by === userId).map(r => r.id);

    await Promise.all([
        txIds.length > 0 ? db.transactions.bulkDelete(txIds) : Promise.resolve(),
        accIds.length > 0 ? db.accounts.bulkDelete(accIds) : Promise.resolve(),
        custIds.length > 0 ? db.khatabookCustomers.bulkDelete(custIds) : Promise.resolve(),
        ledgerIds.length > 0 ? db.khatabookTransactions.bulkDelete(ledgerIds) : Promise.resolve(),
    ]);

    return result;
};
