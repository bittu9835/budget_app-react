import { useContext, useEffect, useCallback } from 'react';
import { DataContext } from '../Context/DataProvider';
import http from '../Services/http/http';
import { db } from '../db';
import useNetworkStatus from './useNetworkStatus';
import { toast } from 'react-toastify';

const useSync = () => {
    const { setDbStatus, setRender } = useContext(DataContext);
    const isOnline = useNetworkStatus();
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    const checkDatabaseConnection = useCallback(async () => {
        try {
            const response: any = await http({
                url: `/auth/ping`,
                method: 'get',
                data: {
                    email: userDetails.email
                }
            }, true);
            if (response?.data?.code === 'SUCCESS_200') {
                setDbStatus(true);
                return true;
            } else {
                setDbStatus(false);
                return false;
            }
        } catch (error) {
            setDbStatus(false);
            return false;
        }
    }, [setDbStatus, userDetails.email]);

    const syncData = useCallback(async () => {
        if (!isOnline) return;
        const isConnected = await checkDatabaseConnection();
        if (!isConnected) return;

        const pullTransactions = async () => {
            try {
                const response: any = await http({
                    url: `/transaction/getTransaction`,
                    method: 'get',
                    data: { search: '' }
                });

                if (response?.data?.code === 'SUCCESS_200') {
                    const serverTransactions = response?.data?.data || [];
                    const unsyncedItems = await db.transactions.filter(t => t.data.synced === false).toArray();
                    const unsyncedIds = new Set(unsyncedItems.map(t => t.id));

                    const newItems = serverTransactions.map((t: any) => ({
                        id: t._id,
                        data: { ...t, synced: true, deleted: false, edited: false }
                    })).filter((t: any) => !unsyncedIds.has(t.id));

                    await db.transaction('rw', db.transactions, async () => {
                        const allItems = await db.transactions.toArray();
                        const syncedIds = allItems.filter(t => t.data.synced !== false).map(t => t.id);
                        await db.transactions.bulkDelete(syncedIds);
                        await db.transactions.bulkPut(newItems);
                    });
                }
            } catch (error) {
                console.error("Pull transactions failed", error);
            }
        };

        const pullCategoriesAndAccounts = async () => {
            try {
                const incomeRes: any = await http({ url: `/category/getIncomeCategory`, method: 'get' });
                const expenseRes: any = await http({ url: `/category/getExpenceCategory`, method: 'get' });

                let categories: any[] = [];
                if (incomeRes?.data?.code === 'SUCCESS_200') {
                    categories = [...categories, ...incomeRes.data.data.map((c: any) => ({...c, __type: 'income'}))];
                }
                if (expenseRes?.data?.code === 'SUCCESS_200') {
                    categories = [...categories, ...expenseRes.data.data.map((c: any) => ({...c, __type: 'expense'}))];
                }

                if (categories.length > 0) {
                    await db.categories.clear();
                    await db.categories.bulkPut(categories.map(c => ({ id: c._id, data: c })));
                }

                const accountRes: any = await http({ url: `/account/gatAccount`, method: 'get' });
                const cardRes: any = await http({ url: `/account/gatCard`, method: 'get' });

                let accounts: any[] = [];
                if (accountRes?.data?.code === 'SUCCESS_200') {
                    accounts = [...accounts, ...accountRes.data.data.map((a: any) => ({...a, __type: 'account'}))];
                }
                if (cardRes?.data?.code === 'SUCCESS_200') {
                    accounts = [...accounts, ...cardRes.data.data.map((a: any) => ({...a, __type: 'card'}))];
                }

                if (accounts.length > 0) {
                    await db.accounts.clear();
                    await db.accounts.bulkPut(accounts.map(a => ({ id: a._id, data: a })));
                }
            } catch (error) {
                console.error("Pull categories/accounts failed", error);
            }
        };

        try {
            const unsyncedTransactions = await db.transactions.filter(t => t.data.synced === false).toArray();

            const toDelete = unsyncedTransactions.filter(t => t.data.deleted === true);
            const toAdd = unsyncedTransactions.filter(t => t.data.deleted !== true && t.data.edited !== true);
            const toEdit = unsyncedTransactions.filter(t => t.data.deleted !== true && t.data.edited === true);

            if (toDelete.length > 0) {
                 try {
                     await http({
                        url: `/transaction/deleteTransaction`,
                        method: 'delete',
                        data: toDelete.map(t => t.data)
                    });
                    // For deleted items, we remove them locally upon success.
                    await db.transactions.bulkDelete(toDelete.map(t => t.id));
                 } catch (e) {
                     console.error("Sync delete failed", e);
                 }
            }

            for (const txn of toAdd) {
                try {
                     const res: any = await http({
                        url: `/transaction/addTransaction`,
                        method: 'post',
                        data: txn.data
                    });
                    if (res?.data?.code === 'SUCCESS_200') {
                        // Mark as synced locally
                        await db.transactions.update(txn.id, { data: { ...txn.data, synced: true } });
                    }
                } catch (e) {
                    console.error("Sync add failed", e);
                }
            }

            for (const txn of toEdit) {
                try {
                     const res: any = await http({
                        url: `/transaction/editTransactions`,
                        method: 'put',
                        data: txn.data
                    });
                    if (res?.data?.code === 'SUCCESS_200') {
                        // Mark as synced locally
                        // Clear 'edited' flag?
                         await db.transactions.update(txn.id, { data: { ...txn.data, synced: true, edited: false } });
                    }
                } catch (e) {
                    console.error("Sync edit failed", e);
                }
            }

            await pullTransactions();
            await pullCategoriesAndAccounts();

            if (unsyncedTransactions.length > 0) {
                toast.success("Data synchronized successfully");
            }

            setRender((prev: boolean) => !prev);

        } catch (error) {
            console.error("Sync failed", error);
        }
    }, [isOnline, checkDatabaseConnection, setRender]);

    useEffect(() => {
        if (isOnline) {
            syncData();
        }

        const interval = setInterval(() => {
            if (isOnline) {
                checkDatabaseConnection();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isOnline, syncData, checkDatabaseConnection]);

    return { syncData, checkDatabaseConnection };
};

export default useSync;
