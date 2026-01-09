import React, { createContext, useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState } from './store/types';

import { createAuthSlice } from './store/createAuthSlice';
import { createJobSlice } from './store/createJobSlice';
import { createClientSlice } from './store/createClientSlice';
import { createFinanceSlice } from './store/createFinanceSlice';
import { createInventorySlice } from './store/createInventorySlice';
import { createMarketingSlice } from './store/createMarketingSlice';
import { createCommunicationSlice } from './store/createCommunicationSlice';
import { createCrmSlice } from './store/createCrmSlice';
import { createCategorySlice } from './store/createCategorySlice';
import { createUiSlice } from './store/createUiSlice';
import { createDataSlice } from './store/createDataSlice';

// Create the Zustand store
export const useZustandStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createAuthSlice(...a),
            ...createJobSlice(...a),
            ...createClientSlice(...a),
            ...createFinanceSlice(...a),
            ...createInventorySlice(...a),
            ...createMarketingSlice(...a),
            ...createCommunicationSlice(...a),
            ...createCrmSlice(...a),
            ...createCategorySlice(...a),
            ...createUiSlice(...a),
            ...createDataSlice(...a),
        }),
        {
            name: 'app-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist these fields as per original logic
                jobs: state.jobs,
                clients: state.clients,
                users: state.users,
                timeEntries: state.timeEntries,
                syncQueue: state.syncQueue,
                crmPipelineConfigs: state.crmPipelineConfigs,
                crmActivities: state.crmActivities,
                categoryLibrary: state.categoryLibrary,
                techAvailability: state.techAvailability,
                routePlans: state.routePlans,
                complianceAuditLogs: state.complianceAuditLogs,
                settings: state.settings, // Often good to persist settings too
            }),
        }
    )
);

// Legacy Context for backward compatibility
// We keep this because many components likely use useContext(StoreContext)
export const StoreContext = createContext<AppState | null>(null);

// Wrapper hook to mimic the original useAppStore behavior (initialization + returning state)
export const useAppStore = (): AppState => {
    const store = useZustandStore();

    // Initialization Logic
    useEffect(() => {
        // Run session check on mount if not already done/doing
        // We use a ref or check state to avoid double execution in strict mode, 
        // though checkSession handles safe returns usually.
        // Original code simply called checkSession() on mount.
        const init = async () => {
            // Access the raw function from the store to avoid dependency issues in useEffect
            const { checkSession, isAuthenticated, isLoading } = useZustandStore.getState();

            // Simple check to ensure we don't spam. 
            // Note: Original store ran checkSession on every mount of App, which is once.
            // But if this hook is used elsewhere, it might be an issue.
            // Assumption: useAppStore is ONLY used in App.tsx to provide context/init.
            // If used elsewhere, this useEffect will run again. 
            // NOTE: Ideally we should move this to a separate generic <AppInitializer> component,
            // but to keep 'store.ts' as a drop-in replacement, we put it here.
            // To be safe, we can check if we are already authenticated or loading?
            // Actually, original code ran it unconditionally on mount of the Provider component.
            // Let's assume it's fine or add a basic check.
            if (!isAuthenticated) {
                checkSession();
            }
        };

        init();
    }, []);

    return store;
};
