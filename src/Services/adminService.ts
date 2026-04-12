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
    // IndexedDB counts
    idbTransactions: number;
    idbAccounts: number;
    idbCustomers: number;
    idbLedgerEntries: number;
    // MongoDB counts
    deletedTransactions: number;
    deletedAccounts: number;
    deletedCustomers: number;
    deletedLedgerEntries: number;
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

// ── Step 1 of 3: wipe all records for userId from the local IndexedDB ──────────
const purgeIndexedDb = async (userId: string): Promise<{
    idbTransactions: number;
    idbAccounts: number;
    idbCustomers: number;
    idbLedgerEntries: number;
}> => {
    const [allTx, allAcc, allCust, allLedger] = await Promise.all([
        db.transactions.toArray(),
        db.accounts.toArray(),
        db.khatabookCustomers.toArray(),
        db.khatabookTransactions.toArray(),
    ]);

    // Collect customer IDs that belong to this user so ledger entries
    // without a created_by field are still caught
    const userCustomerIds = new Set(
        allCust.filter(r => r.data?.created_by === userId).map(r => r.id)
    );

    const txIds      = allTx.filter(r => r.data?.created_by === userId).map(r => r.id);
    const accIds     = allAcc.filter(r => r.data?.created_by === userId).map(r => r.id);
    const custIds    = Array.from(userCustomerIds);
    const ledgerIds  = allLedger.filter(r =>
        r.data?.created_by === userId || userCustomerIds.has(r.data?.customerId)
    ).map(r => r.id);

    // Delete each store separately (not bundled) for explicit isolation
    if (txIds.length)     await db.transactions.bulkDelete(txIds);
    if (accIds.length)    await db.accounts.bulkDelete(accIds);
    if (custIds.length)   await db.khatabookCustomers.bulkDelete(custIds);
    if (ledgerIds.length) await db.khatabookTransactions.bulkDelete(ledgerIds);

    return {
        idbTransactions:  txIds.length,
        idbAccounts:      accIds.length,
        idbCustomers:     custIds.length,
        idbLedgerEntries: ledgerIds.length,
    };
};

// ── Full delete: 3 sequential, separate steps ─────────────────────────────────
// onStep(n) fires before each step begins: 1 = IndexedDB, 2 = MongoDB data, 3 = MongoDB user
export const deleteUserAndData = async (
    userId: string,
    onStep: (step: number) => void = () => {}
): Promise<DeleteResult> => {

    // ── Step 1: IndexedDB — wipe local cache first ───────────────────────────
    onStep(1);
    const idbCounts = await purgeIndexedDb(userId);

    // ── Step 2: MongoDB — delete all records (transactions, accounts,
    //            khatabook customers & entries) — user account NOT touched yet
    onStep(2);
    const dataRes = await http({ url: `/admin/users/${userId}/data`, method: 'delete' });
    const mongoCounts = dataRes.data.data;

    // ── Step 3: MongoDB — remove the user account itself (last step) ─────────
    onStep(3);
    await http({ url: `/admin/users/${userId}`, method: 'delete' });

    return {
        ...idbCounts,
        deletedTransactions:  mongoCounts.deletedTransactions,
        deletedAccounts:      mongoCounts.deletedAccounts,
        deletedCustomers:     mongoCounts.deletedCustomers,
        deletedLedgerEntries: mongoCounts.deletedLedgerEntries,
    };
};
