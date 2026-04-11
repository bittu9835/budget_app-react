import { db } from '../db';
import http from './http/http';
import moment from 'moment';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TransactionData {
    _id: string;
    amount: number;
    action: string; // 'income' | 'expence'
    category: string;
    description: string;
    paymentMethod: string;
    from: string;
    date: string;
    synced: boolean;
    edited: boolean;
    deleted: boolean;
    created_at?: string;
    created_by?: string;
    newCategory?: string;
}

export interface TransactionFilters {
    dateRange?: string;      // 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'custom'
    startDate?: string;      // ISO date string for custom range
    endDate?: string;        // ISO date string for custom range
    action?: string;         // 'income' | 'expence' | '' (all)
    category?: string;       // category name or '' (all)
    paymentMethod?: string;  // 'Cash' | 'Account' | 'Card' | '' (all)
    search?: string;         // search text
}

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
    transactionCount: number;
    barGraphData: any;
    lineGraphData: any;
    expenseByCategory: { category: string; amount: number }[];
    incomeByCategory: { category: string; amount: number }[];
}

// ─── Date Range Helpers ──────────────────────────────────────────────────────

const getDateRange = (dateRange?: string, startDate?: string, endDate?: string): { start: Date; end: Date } | null => {
    if (!dateRange || dateRange === 'all') return null;

    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (dateRange) {
        case 'thisMonth':
            return { start: new Date(now.getFullYear(), now.getMonth(), 1), end };
        case 'lastMonth': {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            return { start: lastMonth, end: lastMonthEnd };
        }
        case 'last3Months':
            return { start: new Date(now.getFullYear(), now.getMonth() - 2, 1), end };
        case 'last6Months':
            return { start: new Date(now.getFullYear(), now.getMonth() - 5, 1), end };
        case 'thisYear':
            return { start: new Date(now.getFullYear(), 0, 1), end };
        case 'custom':
            if (startDate && endDate) {
                return {
                    start: new Date(startDate),
                    end: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                };
            }
            return null;
        default:
            return null;
    }
};

// ─── Filter Transactions ─────────────────────────────────────────────────────

const applyFilters = (transactions: TransactionData[], filters: TransactionFilters): TransactionData[] => {
    let filtered = transactions.filter(t => t.deleted !== true);

    // Date range filter
    const range = getDateRange(filters.dateRange, filters.startDate, filters.endDate);
    if (range) {
        filtered = filtered.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= range.start && txDate <= range.end;
        });
    }

    // Action type filter
    if (filters.action) {
        filtered = filtered.filter(t => t.action === filters.action);
    }

    // Category filter
    if (filters.category) {
        filtered = filtered.filter(t => t.category === filters.category);
    }

    // Payment method filter
    if (filters.paymentMethod) {
        filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod);
    }

    // Search filter
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(t =>
            t.category?.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower) ||
            t.paymentMethod?.toLowerCase().includes(searchLower) ||
            t.from?.toLowerCase().includes(searchLower)
        );
    }

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
};

// ─── Get All Transactions from IndexedDB ─────────────────────────────────────

export const getAllTransactions = async (filters?: TransactionFilters): Promise<TransactionData[]> => {
    const allRecords = await db.transactions.toArray();
    const transactions = allRecords.map(record => ({
        ...record.data,
        _id: record.data._id || record.id,
        id: record.data._id || record.id
    }));

    if (filters) {
        return applyFilters(transactions, filters);
    }

    return transactions.filter(t => t.deleted !== true)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// ─── Get Unique Categories from IndexedDB ────────────────────────────────────

export const getUniqueCategories = async (action?: string): Promise<string[]> => {
    const allRecords = await db.transactions.toArray();
    const categories = new Set<string>();
    allRecords.forEach(record => {
        if (record.data?.deleted !== true && record.data?.category) {
            if (!action || record.data.action === action) {
                categories.add(record.data.category);
            }
        }
    });
    return Array.from(categories).sort();
};

// ─── Compute Dashboard Stats ─────────────────────────────────────────────────

const getLastNMonths = (n: number, format = 'MMM-YY'): { monthName: string; month: string; year: string }[] => {
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = moment().subtract(i, 'months');
        months.push({
            monthName: d.format(format),
            month: d.format('MM'),
            year: d.format('YYYY')
        });
    }
    return months;
};

const CHART_COLORS = {
    income: 'rgba(75, 192, 92, 1)',
    expence: 'rgba(255, 99, 132, 1)',
    balance: 'rgba(75, 192, 192, 1)',
};

export const computeDashboardStats = (transactions: TransactionData[]): DashboardStats => {
    const active = transactions.filter(t => t.deleted !== true);

    // Totals
    const totalIncome = active
        .filter(t => t.action === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = active
        .filter(t => t.action === 'expence')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Expense by category
    const expenseByCat: Record<string, number> = {};
    active.filter(t => t.action === 'expence').forEach(t => {
        expenseByCat[t.category] = (expenseByCat[t.category] || 0) + (t.amount || 0);
    });
    const expenseByCategory = Object.entries(expenseByCat).map(([category, amount]) => ({ category, amount }));

    // Income by category
    const incomeByCat: Record<string, number> = {};
    active.filter(t => t.action === 'income').forEach(t => {
        incomeByCat[t.category] = (incomeByCat[t.category] || 0) + (t.amount || 0);
    });
    const incomeByCategory = Object.entries(incomeByCat).map(([category, amount]) => ({ category, amount }));

    // Bar graph — monthly income vs expense
    const months = getLastNMonths(12);
    const monthlyIncome: Record<string, number> = {};
    const monthlyExpense: Record<string, number> = {};

    active.forEach(t => {
        const d = moment(t.date);
        const key = d.format('YYYY-MM');
        if (t.action === 'income') {
            monthlyIncome[key] = (monthlyIncome[key] || 0) + (t.amount || 0);
        } else if (t.action === 'expence') {
            monthlyExpense[key] = (monthlyExpense[key] || 0) + (t.amount || 0);
        }
    });

    const barGraphData = {
        labels: months.map(m => m.monthName),
        datasets: [
            {
                label: 'income',
                data: months.map(m => monthlyIncome[`${m.year}-${m.month}`] || 0),
                backgroundColor: CHART_COLORS.income,
            },
            {
                label: 'expence',
                data: months.map(m => monthlyExpense[`${m.year}-${m.month}`] || 0),
                backgroundColor: CHART_COLORS.expence,
            }
        ]
    };

    // Line graph — monthly total balance
    const lineGraphData = {
        labels: months.map(m => m.monthName),
        datasets: [
            {
                label: 'Total Balance',
                data: months.map(m => {
                    const key = `${m.year}-${m.month}`;
                    const inc = monthlyIncome[key] || 0;
                    const exp = monthlyExpense[key] || 0;
                    return inc - exp;
                }),
                backgroundColor: 'rgba(75,192,192,0.2)',
            }
        ]
    };

    return {
        totalIncome,
        totalExpense,
        totalBalance: totalIncome - totalExpense,
        transactionCount: active.length,
        barGraphData,
        lineGraphData,
        expenseByCategory,
        incomeByCategory,
    };
};

// ─── Sync: Pull server data into IndexedDB ───────────────────────────────────

export const syncFromServer = async (): Promise<boolean> => {
    try {
        const response: any = await http({
            url: '/transaction/getTransactionsForDashboard',
            method: 'get',
        });

        if (response?.data?.code === 'SUCCESS_200') {
            const serverTransactions = response.data.data || [];

            for (const txn of serverTransactions) {
                const existing = await db.transactions.get(txn._id);
                if (!existing) {
                    // Add from server
                    await db.transactions.put({
                        id: txn._id,
                        data: { ...txn, synced: true }
                    });
                } else if (existing.data?.synced === true) {
                    // Update from server only if local copy is already synced
                    await db.transactions.put({
                        id: txn._id,
                        data: { ...txn, synced: true }
                    });
                }
                // If local is unsynced, keep local version (it's newer)
            }

            // Push unsynced local transactions to server
            await pushUnsyncedToServer();

            // Also sync accounts/cards and categories
            await syncAccountsFromServer();
            await syncCategoriesFromServer();

            return true;
        }
        return false;
    } catch (error) {
        console.error('Sync from server failed:', error);
        return false;
    }
};

// ─── Account / Card: Read from IndexedDB ─────────────────────────────────────

export const getAllAccountsFromDB = async (type?: 'bank' | 'card'): Promise<any[]> => {
    const all = await db.accounts.toArray();
    const active = all
        .filter(r => r.data?.deleted !== true)
        .map(r => ({ ...r.data, _id: r.data._id || r.id }));
    if (type) return active.filter((a: any) => a.type === type);
    return active;
};

export const getOneAccountFromDB = async (_id: string): Promise<any | null> => {
    const record = await db.accounts.get(_id);
    return record ? { ...record.data, _id: record.data._id || record.id } : null;
};

// ─── Account / Card: Sync from Server into IndexedDB ─────────────────────────

export const syncAccountsFromServer = async (): Promise<boolean> => {
    try {
        const [accountsRes, cardsRes]: any[] = await Promise.all([
            http({ url: '/account/gatAccount', method: 'get' }),
            http({ url: '/account/gatCard', method: 'get' }),
        ]);

        const accounts: any[] = accountsRes?.data?.data || [];
        const cards: any[] = cardsRes?.data?.data || [];

        for (const item of [...accounts, ...cards]) {
            const existing = await db.accounts.get(item._id);
            // Only overwrite if no pending local changes
            if (!existing || existing.data?.synced === true) {
                await db.accounts.put({
                    id: item._id,
                    data: { ...item, synced: true, deleted: false, edited: false }
                });
            }
        }

        // Push any offline changes back to server
        await pushUnsyncedAccounts();
        return true;
    } catch (error) {
        console.error('Account sync failed:', error);
        return false;
    }
};

// ─── Account / Card: Push unsynced local changes to server ───────────────────

const pushUnsyncedAccounts = async () => {
    const all = await db.accounts.toArray();

    // New accounts (created offline)
    for (const record of all.filter(r => !r.data?.synced && !r.data?.edited && !r.data?.deleted)) {
        try {
            const res: any = await http({ url: '/account/createAccount', method: 'post', data: record.data });
            if (res?.data?.code === 'SUCCESS_200') {
                await db.accounts.update(record.id, { data: { ...record.data, synced: true } });
            }
        } catch { /* retry next sync */ }
    }

    // Edited accounts
    for (const record of all.filter(r => r.data?.edited && !r.data?.synced && !r.data?.deleted)) {
        try {
            const res: any = await http({ url: '/account/editAccountCard', method: 'put', data: record.data });
            if (res?.data?.code === 'SUCCESS_200') {
                await db.accounts.update(record.id, { data: { ...record.data, synced: true, edited: false } });
            }
        } catch { /* retry next sync */ }
    }

    // Deleted accounts
    for (const record of all.filter(r => r.data?.deleted && !r.data?.synced)) {
        try {
            const res: any = await http({ url: '/account/deleteAccountCard', method: 'delete', data: { _id: record.id } });
            if (res?.data?.code === 'SUCCESS_200') {
                await db.accounts.delete(record.id);
            }
        } catch { /* retry next sync */ }
    }
};

// ─── Account / Card: Add (Dual Write) ────────────────────────────────────────

export const addAccount = async (values: any): Promise<{ success: boolean; serverId?: string }> => {
    const tempId = crypto.randomUUID ? crypto.randomUUID() : 'tmp-' + Date.now();
    const data = { ...values, _id: tempId, synced: false, deleted: false, edited: false };

    await db.accounts.add({ id: tempId, data });

    try {
        const res: any = await http({ url: '/account/createAccount', method: 'post', data: values });
        if (res?.data?.code === 'SUCCESS_200') {
            const serverId = res.data?.data?._id;
            // Replace temp record with server-assigned _id
            await db.accounts.delete(tempId);
            if (serverId) {
                await db.accounts.put({
                    id: serverId,
                    data: { ...res.data.data, synced: true, deleted: false, edited: false }
                });
            }
            return { success: true, serverId };
        }
    } catch (error) {
        console.error('Account save failed, will sync later:', error);
    }

    return { success: true };
};

// ─── Account / Card: Edit (Dual Write) ───────────────────────────────────────

export const editAccount = async (values: any): Promise<boolean> => {
    const id = values._id;
    const data = { ...values, synced: false, edited: true, deleted: false };

    await db.accounts.put({ id, data });

    try {
        const res: any = await http({ url: '/account/editAccountCard', method: 'put', data: values });
        if (res?.data?.code === 'SUCCESS_200') {
            await db.accounts.update(id, { data: { ...data, synced: true, edited: false } });
        }
    } catch (error) {
        console.error('Account edit failed, will sync later:', error);
    }

    return true;
};

// ─── Account / Card: Delete (Dual Write) ─────────────────────────────────────

export const deleteAccount = async (_id: string): Promise<boolean> => {
    const record = await db.accounts.get(_id);
    if (record) {
        await db.accounts.update(_id, { data: { ...record.data, deleted: true, synced: false } });
    }

    try {
        const res: any = await http({ url: '/account/deleteAccountCard', method: 'delete', data: { _id } });
        if (res?.data?.code === 'SUCCESS_200') {
            await db.accounts.delete(_id);
        }
    } catch (error) {
        console.error('Account delete failed, will sync later:', error);
    }

    return true;
};

// ─── Categories: Sync from Server into IndexedDB ─────────────────────────────

export const syncCategoriesFromServer = async (): Promise<boolean> => {
    try {
        const [incomeRes, expenceRes]: any[] = await Promise.all([
            http({ url: '/category/getIncomeCategory', method: 'get' }),
            http({ url: '/category/getExpenceCategory', method: 'get' }),
        ]);

        const income: any[] = incomeRes?.data?.code === 'SUCCESS_200' ? incomeRes.data.data : [];
        const expence: any[] = expenceRes?.data?.code === 'SUCCESS_200' ? expenceRes.data.data : [];

        for (const cat of [...income, ...expence]) {
            await db.categories.put({ id: cat._id, data: cat });
        }
        return true;
    } catch (error) {
        console.error('Category sync failed:', error);
        return false;
    }
};

// ─── Categories: Read from IndexedDB ─────────────────────────────────────────

export const getAllCategoriesFromDB = async (action?: string): Promise<string[]> => {
    const all = await db.categories.toArray();
    const filtered = action
        ? all.filter(r => r.data?.action === action)
        : all;
    return filtered.map(r => r.data?.category).filter(Boolean).sort();
};

// ─── Push unsynced local data to server ──────────────────────────────────────

const pushUnsyncedToServer = async () => {
    const allRecords = await db.transactions.toArray();
    const unsynced = allRecords.filter(r => r.data?.synced === false && r.data?.deleted !== true);
    const unsyncedEdited = allRecords.filter(r => r.data?.edited === true && r.data?.synced === false && r.data?.deleted !== true);
    const unsyncedDeleted = allRecords.filter(r => r.data?.deleted === true && r.data?.synced === false);

    // Push new transactions
    for (const record of unsynced) {
        if (!record.data?.edited) {
            try {
                const response: any = await http({
                    url: '/transaction/addTransaction',
                    method: 'post',
                    data: record.data
                });
                if (response?.data?.code === 'SUCCESS_200') {
                    await db.transactions.update(record.id, {
                        data: { ...record.data, synced: true }
                    });
                }
            } catch (error) {
                console.error('Failed to push transaction:', record.id, error);
            }
        }
    }

    // Push edited transactions
    for (const record of unsyncedEdited) {
        try {
            const response: any = await http({
                url: '/transaction/editTransactions',
                method: 'put',
                data: record.data
            });
            if (response?.data?.code === 'SUCCESS_200') {
                await db.transactions.update(record.id, {
                    data: { ...record.data, synced: true, edited: false }
                });
            }
        } catch (error) {
            console.error('Failed to push edit:', record.id, error);
        }
    }

    // Push deleted transactions
    for (const record of unsyncedDeleted) {
        try {
            const response: any = await http({
                url: '/transaction/deleteTransaction',
                method: 'delete',
                data: [record.id]
            });
            if (response?.data?.code === 'SUCCESS_200') {
                await db.transactions.delete(record.id);
            }
        } catch (error) {
            console.error('Failed to push delete:', record.id, error);
        }
    }
};

// ─── Add Transaction (Dual Write) ────────────────────────────────────────────

export const addTransaction = async (values: any): Promise<boolean> => {
    const id = crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);

    if (values.paymentMethod === 'Cash') {
        values.from = 'Cash';
    }
    if (values.category === 'addNewCategory') {
        values.category = values.newCategory;
    }

    const txnData: TransactionData = {
        ...values,
        _id: id,
        synced: false,
        deleted: false,
        edited: false,
    };

    // Write to IndexedDB first (instant)
    await db.transactions.add({
        id: id,
        data: txnData
    });

    // Try to write to backend (non-blocking)
    try {
        const response: any = await http({
            url: '/transaction/addTransaction',
            method: 'post',
            data: txnData
        });
        if (response?.data?.code === 'SUCCESS_200') {
            await db.transactions.update(id, {
                data: { ...txnData, synced: true }
            });
        }
    } catch (error) {
        console.error('Backend save failed, will sync later:', error);
        // Data is safe in IndexedDB — will sync on next load
    }

    return true;
};

// ─── Edit Transaction (Dual Write) ───────────────────────────────────────────

export const editTransaction = async (id: string, values: any): Promise<boolean> => {
    if (values.paymentMethod === 'Cash') {
        values.from = 'Cash';
    }
    if (values.category === 'addNewCategory') {
        values.category = values.newCategory;
    }

    const txnData = {
        ...values,
        _id: id,
        synced: false,
        deleted: false,
        edited: true,
    };

    // Update IndexedDB
    await db.transactions.update(id, {
        data: txnData
    });

    // Try to update backend
    try {
        const response: any = await http({
            url: '/transaction/editTransactions',
            method: 'put',
            data: txnData
        });
        if (response?.data?.code === 'SUCCESS_200') {
            await db.transactions.update(id, {
                data: { ...txnData, synced: true, edited: false }
            });
        }
    } catch (error) {
        console.error('Backend edit failed, will sync later:', error);
    }

    return true;
};

// ─── Delete Transactions (Dual Write) ────────────────────────────────────────

export const deleteTransactions = async (selectedItems: any[]): Promise<boolean> => {
    // Soft delete in IndexedDB
    for (const item of selectedItems) {
        const record = await db.transactions.get(item.id);
        if (record) {
            await db.transactions.update(item.id, {
                data: { ...record.data, deleted: true, synced: false }
            });
        }
    }

    // Try to delete on backend
    try {
        const ids = selectedItems.map(item => item.id);
        const response: any = await http({
            url: '/transaction/deleteTransaction',
            method: 'delete',
            data: ids
        });
        if (response?.data?.code === 'SUCCESS_200') {
            // Remove from IndexedDB after backend confirms
            for (const item of selectedItems) {
                await db.transactions.delete(item.id);
            }
        }
    } catch (error) {
        console.error('Backend delete failed, will sync later:', error);
    }

    return true;
};
