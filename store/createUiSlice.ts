import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { AppSettings, Notification } from '../types';

const defaultSettings: AppSettings = {
    companyName: 'My Service Company',
    companyAddress: '',
    taxRate: 0.08,
    currency: 'USD',
    businessHoursStart: '08:00',
    businessHoursEnd: '18:00',
    lowStockThreshold: 5,
    enableAutoInvoice: false,
    smsTemplateOnMyWay: "Hi {{clientName}}, this is {{techName}} from {{companyName}}. I'm on my way to your location!",
    onboardingStep: 1,
    industry: '',
    regionalAccess: []
};

export const createUiSlice: StoreSlice<any> = (set, get) => ({
    theme: 'light',
    settings: defaultSettings,
    notifications: [],
    activityLog: [],

    toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        if (newTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    },

    addNotification: (notification: Notification) => {
        set((state) => {
            const existing = state.notifications.find((n) => n.id === notification.id);
            const next = existing ? { ...existing, ...notification, read: existing.read } : notification;
            return { notifications: [...state.notifications.filter((n) => n.id !== notification.id), next] };
        });
    },

    removeNotification: (id: string) => {
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
    },

    markNotificationRead: (id: string) => {
        set((state) => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    },

    markAllNotificationsRead: () => {
        set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }));
    },

    updateSettings: async (newSettings: Partial<AppSettings>) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        const { currentUser } = get();
        if (currentUser.companyId) {
            // Re-read settings from state to ensure full object is used if needed, 
            // but here we just construct from passed newSettings + existing state is better handled in component usually, but merging here is fine.
            // The method signature passes partial, but we merged it into state already.
            // Let's use the merged state settings to upsert.
            const s = { ...get().settings };

            const dbSettings = {
                company_id: currentUser.companyId,
                company_name: s.companyName,
                industry: s.industry,
                company_address: s.companyAddress,
                onboarding_step: s.onboardingStep,
                tax_rate: s.taxRate,
                business_hours_start: s.businessHoursStart,
                business_hours_end: s.businessHoursEnd,
                sms_template_on_my_way: s.smsTemplateOnMyWay,
                enable_auto_invoice: s.enableAutoInvoice
            };

            await supabase.from('settings').upsert(dbSettings, { onConflict: 'company_id' });
        }
    },

    getCurrentLocation: (): Promise<{ lat: number; lng: number; address: string }> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ lat: 0, lng: 0, address: 'Geolocation not supported' });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: 'GPS Coordinates Captured'
                    });
                },
                (error) => {
                    console.error("GPS Error:", error);
                    resolve({ lat: 0, lng: 0, address: 'GPS Error: ' + error.message });
                }
            );
        });
    }
});
