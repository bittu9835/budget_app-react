import { useState, useEffect, useCallback, useRef } from 'react';
import { syncFromServer } from '../Services/transactionService';
import { toast } from 'react-toastify';
import axios from 'axios';

interface NetworkStatus {
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncTime: Date | null;
    triggerSync: () => Promise<void>;
}

export const useNetworkStatus = (onSyncComplete?: () => void): NetworkStatus => {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [wasOffline, setWasOffline] = useState<boolean>(false);
    const isOnlineRef = useRef<boolean>(true); // For synchronous access in interval

    const checkBackendStatus = async (): Promise<boolean> => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:4000';
            const response = await axios.get(`${baseUrl}/ping`, { timeout: 3000 });
            return response.status === 200 && response.data?.message === 'pong';
        } catch (error) {
            return false;
        }
    };

    const triggerSync = useCallback(async () => {
        setIsSyncing(true);
        try {
            const success = await syncFromServer();
            if (success) {
                setLastSyncTime(new Date());
                onSyncComplete?.();
            }
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [onSyncComplete]);

    useEffect(() => {
        let pollInterval: NodeJS.Timeout;

        const pollStatus = async () => {
            const currentlyOnline = navigator.onLine ? await checkBackendStatus() : false;

            if (currentlyOnline && !isOnlineRef.current) {
                // We just came back online
                setIsOnline(true);
                isOnlineRef.current = true;

                toast.success('🟢 You are back online! Syncing data to DB...', {
                    autoClose: 3000,
                    position: 'top-center',
                    className: 'online-toast',
                });

                triggerSync();
            } else if (!currentlyOnline && isOnlineRef.current) {
                // We just went offline
                setIsOnline(false);
                isOnlineRef.current = false;
                setWasOffline(true);

                toast.warn('📡 Offline mode. DB is disconnected. Changes will be saved locally.', {
                    autoClose: 4000,
                    position: 'top-center',
                    className: 'offline-toast',
                });
            }
        };

        // Initial check
        pollStatus();

        // Poll every 5 seconds
        pollInterval = setInterval(pollStatus, 5000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [triggerSync]);

    return { isOnline, isSyncing, lastSyncTime, triggerSync };
};
