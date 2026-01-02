import { StateCreator } from 'zustand';
import {
    User, Job, Client, Quote, Invoice, ActivityLogItem,
    Notification, InventoryProduct, InventoryRecord,
    Warehouse, Vendor, PurchaseOrder, TimeEntry,
    EmailCampaign, MarketingAutomation, AudienceSegment,
    Chat, ChatMessage, AppSettings, JobTemplate, TeamInvitation,
    UserRole, JobStatus, InvoiceStatus, QuoteStatus, POStatus,
    TimeEntryStatus, LineItem, ChecklistItem, JobPhoto, AutomationTriggerType, ConditionGroup, AutomationCondition, TimeEntryType, Property
} from '../types';

// Define the shape of each slice
export interface AuthSlice {
    isAuthenticated: boolean;
    isLoading: boolean;
    currentUser: User;
    users: User[];
    teamInvitations: TeamInvitation[];
    login: (email: string, pass: string) => Promise<{ error: any }>;
    signup: (email: string, pass: string, name: string, type: 'create' | 'join' | 'browse', joinCode?: string) => Promise<{ error: any, companyCode?: string }>;
    logout: () => void;
    switchUser: (role: UserRole) => void;
    checkSession: () => Promise<void>;
    loadUserData: (userId: string) => Promise<void>;
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => Promise<{ error: any }>;
    deleteAccount: () => Promise<{ error: any }>;
    completeOnboarding: () => Promise<void>;
    inviteTeamMember: (email: string, name: string, role: UserRole) => Promise<{ error: any }>;
    resendInvitation: (id: string) => Promise<{ error: any }>;
}

export interface JobSlice {
    jobs: Job[];
    addJob: (job: Job) => Promise<void>;
    updateJob: (job: Job) => Promise<void>;
    deleteJob: (id: string) => Promise<{ error: any }>;
    updateJobStatus: (id: string, status: JobStatus) => Promise<void>;
    updateJobStage: (id: string, stage: any) => Promise<void>;
    assignJob: (jobId: string, techId: string, job: Job) => void;
    cancelJob: (id: string, reason: string) => void;
    moveJob: (jobId: string, start: string, end: string, assignedTechIds?: string[]) => void;
    unscheduleJob: (jobId: string) => void;
    addJobTemplate: (template: JobTemplate) => void;
    // Time Entries often relate to jobs, but we can put them here or in a TimeSlice. 
    // Given the monolithic interdependencies, putting them here or separate is a choice.
    // Let's create a TimeSlice for them? Or just bundle with Jobs since technicians work on jobs.
    // store.ts had them top-level.
    timeEntries: TimeEntry[];
    addTimeEntry: (entry: TimeEntry) => void;
    updateTimeEntry: (entry: TimeEntry) => void;
    approveTimeEntry: (id: string) => void;
    clockIn: (jobId?: string) => void;
    clockOut: () => void;
    createTrackingLink: (jobId: string) => Promise<string | null>;
}

export interface ClientSlice {
    clients: Client[];
    addClient: (client: Client) => Promise<void>;
    updateClient: (client: Client) => Promise<void>;
    updateProperty: (property: Property) => Promise<void>;
    deleteClient: (id: string) => Promise<{ error: any }>;
}

export interface FinanceSlice {
    quotes: Quote[];
    invoices: Invoice[];
    addQuote: (quote: Quote) => void;
    updateQuote: (quote: Quote) => void;
    updateQuoteStatus: (id: string, status: QuoteStatus) => void;
    createInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
}

export interface InventorySlice {
    inventoryProducts: InventoryProduct[];
    inventoryRecords: InventoryRecord[];
    warehouses: Warehouse[];
    vendors: Vendor[];
    purchaseOrders: PurchaseOrder[];
    addProduct: (product: InventoryProduct) => void;
    updateProduct: (product: InventoryProduct) => Promise<void>;
    deleteProduct: (id: string) => Promise<{ error: any }>;
    updateStock: (record: InventoryRecord) => void;
    addWarehouse: (warehouse: Warehouse) => void;
    updateWarehouse: (warehouse: Warehouse) => void;
    createPO: (po: PurchaseOrder) => void;
    addVendor: (vendor: Vendor) => Promise<void>;
    updateVendor: (vendor: Vendor) => Promise<void>;
    deleteVendor: (id: string) => Promise<{ error: any }>;
}

export interface MarketingSlice {
    marketingCampaigns: EmailCampaign[];
    marketingAutomations: MarketingAutomation[];
    marketingAudiences: AudienceSegment[];
    setMarketingAutomations: React.Dispatch<React.SetStateAction<MarketingAutomation[]>>; // Keeping signature compatibility is hard for useState setters. 
    // We should change this to a regular setter function.
    // Originally: setMarketingAutomations: React.Dispatch<React.SetStateAction<MarketingAutomation[]>>;
    // We will change it to: updateMarketingAutomationsList(automations: MarketingAutomation[])
    // BUT to keep interface compatibility for consumers who might call it (unlikely consumers call setX directly from context, usually it's internal).
    // Actually, looking at StoreContextType, it EXPORTS setMarketingAutomations.
    // We will implement a compatible signature if possible, or just a direct setter.

    addCampaign: (campaign: EmailCampaign) => Promise<{ error?: any }>;
    updateCampaign: (campaign: EmailCampaign) => Promise<{ error?: any }>;
    deleteCampaign: (id: string) => Promise<{ error: any }>;
    retryCampaign: (campaignId: string) => Promise<void>;

    addAutomation: (automation: Omit<MarketingAutomation, 'id' | 'createdAt' | 'stats'>) => Promise<{ data?: MarketingAutomation; error?: any } | void>;
    updateAutomation: (automation: MarketingAutomation) => Promise<void>;
    deleteAutomation: (id: string) => Promise<{ error: any }>;
    triggerAutomation: (triggerType: AutomationTriggerType, entityId: string, context?: any) => Promise<void>;

    addAudienceSegment: (segment: AudienceSegment) => Promise<{ error?: any }>;
    deleteAudienceSegment: (id: string) => Promise<{ error?: any }>;
}

export interface CommunicationSlice {
    chats: Chat[];
    messages: ChatMessage[];
    sendMessage: (chatId: string, content: string, senderId?: string) => void;
    createChat: (participantIds: string[], name?: string) => void;
    deleteChat: (chatId: string) => void;
}

export interface UiSlice {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    notifications: Notification[];
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    activityLog: ActivityLogItem[];
    // settings could be here or its own
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    getCurrentLocation: () => Promise<{ lat: number; lng: number; address: string }>;
}

export interface DataSlice {
    loadCompanyData: (companyId: string) => Promise<void>;
    syncQueue: any[]; // For offline
}

// Combine all slices
export type AppState = AuthSlice & JobSlice & ClientSlice & FinanceSlice & InventorySlice & MarketingSlice & CommunicationSlice & UiSlice & DataSlice;

export type StoreSlice<T> = StateCreator<AppState, [], [], T>;
