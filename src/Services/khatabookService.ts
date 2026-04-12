import { db } from '../db';
import http from './http/http';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomerData {
    _id: string;
    name: string;
    phone: string;
    address?: string;
    isActive: boolean;
    synced: boolean;
    deleted: boolean;
    created_at?: string;
    created_by?: string;
    countInSummary?: boolean; // local-only: whether this customer is included in the summary totals
}

export interface LedgerEntry {
    _id: string;
    customerId: string;
    amount: number;
    type: 'credit' | 'debit';
    note?: string;
    deleted: boolean;
    synced: boolean;
    timestamp: string;
    created_by?: string;
}

export interface CustomerSummary {
    totalCredit: number;
    totalDebit: number;
    netBalance: number;
}

export interface DashboardTotals {
    totalYouWillGet: number;
    totalYouWillGive: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = (): string =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2);

// Decode JWT payload (no verification — trust the server-issued token)
const getCurrentUserId = (): string => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return '';
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || '';
    } catch {
        return '';
    }
};

// ─── Customer Operations ──────────────────────────────────────────────────────

export const addCustomer = async (values: { name: string; phone: string; address?: string }): Promise<string> => {
    const id = generateId();
    const customerData: CustomerData = {
        ...values,
        _id: id,
        isActive: true,
        synced: false,
        deleted: false,
    };

    await db.khatabookCustomers.add({ id, data: customerData });

    try {
        const res: any = await http({ url: '/khatabook/create', method: 'post', data: customerData });
        if (res?.data?.code === 'SUCCESS_200') {
            await db.khatabookCustomers.update(id, { data: { ...customerData, synced: true } });
        }
    } catch (err) {
        console.error('Customer sync failed, will retry later:', err);
    }

    return id;
};

export const getCustomers = async (): Promise<CustomerData[]> => {
    const currentUserId = getCurrentUserId();
    const all = await db.khatabookCustomers.toArray();
    return all
        .map(r => r.data as CustomerData)
        .filter(c =>
            !c.deleted &&
            c.isActive !== false &&
            (!c.created_by || c.created_by === currentUserId)
        );
};

export const editCustomer = async (id: string, values: { name: string; phone: string; address?: string }): Promise<void> => {
    const existing = await db.khatabookCustomers.get(id);
    if (!existing) return;
    const updated: CustomerData = { ...existing.data, ...values, synced: false };
    await db.khatabookCustomers.update(id, { data: updated });

    try {
        const res: any = await http({ url: '/khatabook/edit', method: 'put', data: { _id: id, ...values } });
        if (res?.data?.code === 'SUCCESS_200') {
            await db.khatabookCustomers.update(id, { data: { ...updated, synced: true } });
        }
    } catch (err) {
        console.error('Customer edit sync failed, will retry later:', err);
    }
};

export const deleteCustomer = async (id: string): Promise<void> => {
    const existing = await db.khatabookCustomers.get(id);
    if (!existing) return;
    await db.khatabookCustomers.update(id, { data: { ...existing.data, deleted: true, isActive: false, synced: false } });

    // Soft-delete all entries for this customer in IndexedDB
    const entries = await db.khatabookTransactions.toArray();
    for (const entry of entries) {
        if (entry.data?.customerId === id) {
            await db.khatabookTransactions.update(entry.id, { data: { ...entry.data, deleted: true, synced: false } });
        }
    }

    try {
        await http({ url: '/khatabook/delete', method: 'delete', data: { _id: id } });
    } catch (err) {
        console.error('Customer delete sync failed, will retry later:', err);
    }
};

export const toggleCountInSummary = async (id: string, value: boolean): Promise<void> => {
    const existing = await db.khatabookCustomers.get(id);
    if (!existing) return;
    await db.khatabookCustomers.update(id, { data: { ...existing.data, countInSummary: value } });
};

// ─── Ledger Entry Operations ──────────────────────────────────────────────────

export const addLedgerEntry = async (
    customerId: string,
    type: 'credit' | 'debit',
    amount: number,
    note: string,
    date?: string
): Promise<void> => {
    const id = generateId();
    const entryData: LedgerEntry = {
        _id: id,
        customerId,
        amount,
        type,
        note: note || '',
        deleted: false,
        synced: false,
        timestamp: date ? new Date(date).toISOString() : new Date().toISOString(),
    };

    await db.khatabookTransactions.add({ id, data: entryData });

    try {
        const res: any = await http({ url: '/khatabook/addEntry', method: 'post', data: entryData });
        if (res?.data?.code === 'SUCCESS_200') {
            await db.khatabookTransactions.update(id, { data: { ...entryData, synced: true } });
        }
    } catch (err) {
        console.error('Ledger entry sync failed, will retry later:', err);
    }
};

export const getLedgerEntries = async (customerId: string): Promise<LedgerEntry[]> => {
    const all = await db.khatabookTransactions.toArray();
    return all
        .map(r => r.data as LedgerEntry)
        .filter(e => e.customerId === customerId && !e.deleted)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const deleteLedgerEntry = async (id: string): Promise<void> => {
    const existing = await db.khatabookTransactions.get(id);
    if (!existing) return;
    await db.khatabookTransactions.update(id, { data: { ...existing.data, deleted: true, synced: false } });

    try {
        await http({ url: '/khatabook/deleteEntry', method: 'delete', data: { _id: id } });
    } catch (err) {
        console.error('Ledger entry delete sync failed, will retry later:', err);
    }
};

// ─── Balance Calculations (client-side) ───────────────────────────────────────

export const getCustomerSummary = async (customerId: string): Promise<CustomerSummary> => {
    const entries = await getLedgerEntries(customerId);
    const totalCredit = entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
    const totalDebit = entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
    return { totalCredit, totalDebit, netBalance: totalCredit - totalDebit };
};

export const getDashboardTotals = async (): Promise<DashboardTotals> => {
    const customers = await getCustomers();
    let totalYouWillGet = 0;
    let totalYouWillGive = 0;

    for (const customer of customers) {
        if (customer.countInSummary === false) continue;
        const summary = await getCustomerSummary(customer._id);
        if (summary.netBalance > 0) {
            totalYouWillGet += summary.netBalance;
        } else {
            totalYouWillGive += Math.abs(summary.netBalance);
        }
    }

    return { totalYouWillGet, totalYouWillGive };
};

// ─── Sync from Server ─────────────────────────────────────────────────────────

export const syncKhatabookFromServer = async (): Promise<void> => {
    try {
        const [customersRes, entriesRes]: any[] = await Promise.all([
            http({ url: '/khatabook/getCustomers', method: 'get', data: {} }),
            http({ url: '/khatabook/getEntries', method: 'get', data: {} }),
        ]);

        if (customersRes?.data?.code === 'SUCCESS_200') {
            const serverCustomers: any[] = customersRes.data.data || [];
            for (const sc of serverCustomers) {
                const local = await db.khatabookCustomers.get(sc._id);
                if (!local || local.data?.synced) {
                    await db.khatabookCustomers.put({
                        id: sc._id,
                        data: {
                            ...sc,
                            synced: true,
                            deleted: false,
                            // Preserve local-only preference — never overwrite with server value
                            countInSummary: local?.data?.countInSummary ?? true,
                        },
                    });
                }
            }
        }

        if (entriesRes?.data?.code === 'SUCCESS_200') {
            const serverEntries: any[] = entriesRes.data.data || [];
            for (const se of serverEntries) {
                const local = await db.khatabookTransactions.get(se._id);
                if (!local || local.data?.synced) {
                    await db.khatabookTransactions.put({
                        id: se._id,
                        data: { ...se, synced: true, deleted: false },
                    });
                }
            }
        }
    } catch (err) {
        console.error('Khatabook sync from server failed:', err);
    }
};

export const pushUnsyncedKhatabookToServer = async (): Promise<void> => {
    try {
        const allCustomers = await db.khatabookCustomers.toArray();
        for (const c of allCustomers) {
            if (!c.data?.synced) {
                try {
                    if (c.data?.deleted) {
                        await http({ url: '/khatabook/delete', method: 'delete', data: { _id: c.id } });
                    } else {
                        await http({ url: '/khatabook/create', method: 'post', data: c.data });
                    }
                    await db.khatabookCustomers.update(c.id, { data: { ...c.data, synced: true } });
                } catch (_) {}
            }
        }

        const allEntries = await db.khatabookTransactions.toArray();
        for (const e of allEntries) {
            if (!e.data?.synced) {
                try {
                    if (e.data?.deleted) {
                        await http({ url: '/khatabook/deleteEntry', method: 'delete', data: { _id: e.id } });
                    } else {
                        await http({ url: '/khatabook/addEntry', method: 'post', data: e.data });
                    }
                    await db.khatabookTransactions.update(e.id, { data: { ...e.data, synced: true } });
                } catch (_) {}
            }
        }
    } catch (err) {
        console.error('Khatabook push unsynced failed:', err);
    }
};

// ─── Manual Sync: push + pull with stats ─────────────────────────────────────

export interface KhatabookSyncStats {
    pushed: number;
    failed: number;
    pending: number;
}

export const getKhatabookPendingCount = async (): Promise<number> => {
    const customers = await db.khatabookCustomers.toArray();
    const entries   = await db.khatabookTransactions.toArray();
    // Total non-deleted local records — what will be force-pushed on manual sync
    return (
        customers.filter(r => r.data?.deleted !== true).length +
        entries.filter(r => r.data?.deleted !== true).length
    );
};

export const manualSyncKhatabook = async (): Promise<KhatabookSyncStats> => {
    let pushed = 0;
    let failed = 0;

    // ── Customers ──────────────────────────────────────────────────────────────
    const allCustomers = await db.khatabookCustomers.toArray();
    // Force-push ALL non-deleted customers regardless of synced flag
    const unsyncedCustomers = allCustomers.filter(c => c.data?.deleted !== true);

    for (const c of unsyncedCustomers) {
        try {
            let res: any;
            if (c.data?.deleted) {
                res = await http({ url: '/khatabook/delete', method: 'delete', data: { _id: c.id } });
            } else if (c.data?.edited) {
                res = await http({ url: '/khatabook/editCustomer', method: 'put', data: c.data });
            } else {
                res = await http({ url: '/khatabook/create', method: 'post', data: c.data });
            }
            if (res?.data?.code === 'SUCCESS_200') {
                if (c.data?.deleted) {
                    await db.khatabookCustomers.delete(c.id);
                } else {
                    await db.khatabookCustomers.update(c.id, { data: { ...c.data, synced: true, edited: false } });
                }
                pushed++;
            } else { failed++; }
        } catch (err: any) {
            // Duplicate key — already on server, mark as synced
            if (err?.response?.data?.code === 11000 || err?.message?.includes('11000')) {
                await db.khatabookCustomers.update(c.id, { data: { ...c.data, synced: true } });
                pushed++;
            } else { failed++; }
        }
    }

    // ── Ledger Entries ─────────────────────────────────────────────────────────
    const allEntries = await db.khatabookTransactions.toArray();
    // Force-push ALL non-deleted entries regardless of synced flag
    const unsyncedEntries = allEntries.filter(e => e.data?.deleted !== true);

    for (const e of unsyncedEntries) {
        try {
            let res: any;
            if (e.data?.deleted) {
                res = await http({ url: '/khatabook/deleteEntry', method: 'delete', data: { _id: e.id } });
            } else {
                res = await http({ url: '/khatabook/addEntry', method: 'post', data: e.data });
            }
            if (res?.data?.code === 'SUCCESS_200') {
                if (e.data?.deleted) {
                    await db.khatabookTransactions.delete(e.id);
                } else {
                    await db.khatabookTransactions.update(e.id, { data: { ...e.data, synced: true } });
                }
                pushed++;
            } else { failed++; }
        } catch (err: any) {
            if (err?.response?.data?.code === 11000 || err?.message?.includes('11000')) {
                await db.khatabookTransactions.update(e.id, { data: { ...e.data, synced: true } });
                pushed++;
            } else { failed++; }
        }
    }

    // Pull latest from server
    await syncKhatabookFromServer();

    const pending = await getKhatabookPendingCount();
    return { pushed, failed, pending };
};
