"use client";

import React, { useEffect, useContext, useState } from 'react';
import { StoreContext } from '../store';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';

const OfflineSyncManager: React.FC = () => {
    const store = useContext(StoreContext);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [queueLength, setQueueLength] = useState(0);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            processSyncQueue();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        checkQueue();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const checkQueue = () => {
        try {
            const queue = localStorage.getItem('syncQueue');
            if (queue) {
                const parsed = JSON.parse(queue);
                setQueueLength(parsed.length);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Poll queue length for UI updates
    useEffect(() => {
        const interval = setInterval(checkQueue, 2000);
        return () => clearInterval(interval);
    }, []);

    const processSyncQueue = async () => {
        const queueStr = localStorage.getItem('syncQueue');
        if (!queueStr) return;

        const queue = JSON.parse(queueStr);
        if (queue.length === 0) return;

        setIsSyncing(true);
        console.log(`Syncing ${queue.length} items...`);

        const remainingQueue = [];

        for (const item of queue) {
            try {
                let error = null;

                if (item.type === 'UPDATE_JOB_STATUS') {
                    const { id, status } = item.payload;
                    const res = await supabase.from('jobs').update({ status }).eq('id', id);
                    error = res.error;
                }
                // Add other types here (CLOCK_IN, CLOCK_OUT, etc.)

                if (error) {
                    console.error("Sync failed for item:", item, error);
                    remainingQueue.push(item); // Keep in queue if failed
                }
            } catch (e) {
                console.error("Sync error:", e);
                remainingQueue.push(item);
            }
        }

        localStorage.setItem('syncQueue', JSON.stringify(remainingQueue));
        setQueueLength(remainingQueue.length);
        setIsSyncing(false);

        if (remainingQueue.length === 0) {
            console.log("Sync Complete!");
            // Optionally trigger a global refresh
            window.location.reload();
        }
    };

    if (isOnline && queueLength === 0) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 animate-in slide-in-from-bottom-4">
            {!isOnline && (
                <div className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold">
                    <WifiOff className="w-4 h-4 text-red-400" />
                    <span>You are offline. Changes saved locally.</span>
                </div>
            )}

            {isOnline && queueLength > 0 && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold">
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing changes...' : `${queueLength} unsynced changes`}</span>
                </div>
            )}
        </div>
    );
};

export default OfflineSyncManager;
