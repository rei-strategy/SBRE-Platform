
// ==============================================
// SECTION 2: FULL DATABASE SCHEMA (Types)
// ==============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  OFFICE = 'OFFICE',
  TECHNICIAN = 'TECHNICIAN',
  CLIENT = 'CLIENT',
}

export type PayrollType = 'HOURLY' | 'COMMISSION' | 'DAILY_RATE';

export enum JobStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export type PipelineStage =
  | 'LEAD'
  | 'ESTIMATE_SENT'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'INVOICED'
  | 'PAID'
  | 'ON_HOLD'
  | 'CANCELLED';

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  CONVERTED = 'CONVERTED'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  BAD_DEBT = 'BAD_DEBT'
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  type: 'ARRIVED' | 'COMPLETED' | 'STARTED' | 'CREATED' | 'UPDATED' | 'NOTE';
  description: string;
  timestamp: string;
  jobId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

// --- COMMUNICATION TYPES ---
export type ChatType = 'DIRECT' | 'GROUP';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  readBy: string[];
}

export interface Chat {
  id: string;
  type: ChatType;
  name?: string;
  participantIds: string[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

// --- INVENTORY MANAGEMENT TYPES ---

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand?: string;
  description?: string;
  unit: string;
  cost: number;
  price: number;
  minStock: number;
  trackSerial: boolean;
  image?: string;
  barcode?: string;
  supplierId?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'WAREHOUSE' | 'VEHICLE';
  assignedUserId?: string;
  address?: string;
}

export interface InventoryRecord {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  binLocation?: string;
  lastUpdated: string;
  lastUpdatedBy?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  paymentTerms?: string;
  rating?: number;
  leadTimeDays?: number;
}

export enum POStatus {
  DRAFT = 'DRAFT',
  ORDERED = 'ORDERED',
  PARTIAL = 'PARTIAL',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  status: POStatus;
  orderDate: string;
  expectedDate?: string;
  items: { productId: string; quantity: number; cost: number }[];
  total: number;
  notes?: string;
}

// --- TIMESHEET TYPES ---
export enum TimeEntryType {
  JOB = 'JOB',
  TRAVEL = 'TRAVEL',
  BREAK = 'BREAK',
  ADMIN = 'ADMIN'
}

export enum TimeEntryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface TimeEntry {
  id: string;
  userId: string;
  type: TimeEntryType;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  jobId?: string;
  notes?: string;
  status: TimeEntryStatus;
  gpsLocation?: { lat: number; lng: number; address: string };
}

export interface TimeOffRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  type: 'VACATION' | 'SICK' | 'PERSONAL';
}

// --- NEW ONBOARDING TYPES ---

export interface JobTemplate {
  id: string;
  name: string;
  description?: string;
  defaultPrice: number;
  defaultDurationMinutes: number;
  category?: string;
}

export interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyCode?: string;
  taxRate: number;
  taxName?: string;
  currency: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  lowStockThreshold: number;
  enableAutoInvoice: boolean;
  smsTemplateOnMyWay: string;
  serviceCategories?: string[];
  paymentMethods?: string[];
  defaultDepositRate?: number;
  brandColors?: { primary: string; secondary: string };
  messageTemplates?: Record<string, string>;
  onboardingStep?: number;
  industry?: string;
}

export interface TeamInvitation {
  id: string;
  companyId: string;
  email: string;
  name: string;
  role: UserRole;
  code: string;
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
}

// MARKETING TYPES

export interface AudienceSegment {
  id: string;
  companyId: string;
  name: string;
  type: 'DYNAMIC' | 'MANUAL'; // NEW
  description?: string;
  filters?: SegmentFilter[]; // Optional for MANUAL
  criteria?: { includedIds: string[] }; // NEW: For MANUAL
  estimatedCount: number;
  lastCalculatedAt?: string;
  createdAt: string;
}

export type SegmentFilter = {
  field: string; // e.g., 'total_spend', 'last_job_date', 'tags'
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
  value: any;
};

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'ARCHIVED' | 'PAUSED';

export interface EmailCampaign {
  id: string;
  companyId: string;
  name: string;
  subject: string;
  previewText?: string;
  fromName?: string;
  content: string;
  templateId?: string;
  audienceId?: string;
  audienceFilter?: SegmentFilter[];
  scheduleTime?: string;
  status: CampaignStatus;
  settings: {
    abTest?: boolean;
    abSubject?: string;
    trackOpens?: boolean;
    trackClicks?: boolean;
  };
  sentCount: number;
  deliveredCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
}

// AUTOMATION V2 TYPES

export type AutomationTriggerType =
  | 'NEW_CLIENT'
  | 'NEW_JOB'
  | 'JOB_SCHEDULED'
  | 'JOB_STATUS_CHANGED'
  | 'JOB_COMPLETED'
  | 'TECH_ON_MY_WAY'
  | 'NEW_QUOTE'
  | 'QUOTE_SENT'
  | 'QUOTE_APPROVED'
  | 'QUOTE_ACCEPTED'
  | 'NEW_INVOICE'
  | 'INVOICE_PAID'
  | 'CLIENT_BIRTHDAY'
  | 'CLIENT_ANNIVERSARY'
  | 'CLIENT_INACTIVE_30'
  | 'CLIENT_INACTIVE_60'
  | 'CLIENT_INACTIVE_90';

export type ConditionOperator =
  | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  | 'gt' | 'lt' | 'gte' | 'lte'
  | 'is_empty' | 'is_not_empty'
  | 'is_true' | 'is_false'
  | 'starts_with' | 'ends_with';

export interface AutomationCondition {
  id: string;
  resource: 'client' | 'job' | 'quote' | 'invoice' | 'technician';
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface ConditionGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: (AutomationCondition | ConditionGroup)[];
}

export type ActionType =
  | 'SEND_EMAIL'
  | 'SEND_SMS'
  | 'ASSIGN_TECHNICIAN'
  | 'UPDATE_JOB_STATUS'
  | 'ADD_TAG'
  | 'REMOVE_TAG'
  | 'ADD_NOTE_CLIENT'
  | 'ADD_NOTE_JOB'
  | 'CREATE_TASK'
  | 'DELAY'
  | 'WAIT_UNTIL'
  | 'STOP_AUTOMATION';

export interface AutomationAction {
  id: string;
  type: ActionType;
  config: any; // Flexible config based on type
  conditions?: ConditionGroup; // Optional step-level conditions
}

export interface MarketingAutomation {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  triggerType: AutomationTriggerType;
  triggerConfig?: {
    conditions?: ConditionGroup; // Root condition group
  };
  steps: AutomationAction[];
  isActive: boolean;
  stats: {
    runs: number;
    completed: number;
  };
  createdAt: string;
}



export interface EmailLog {
  id: string;
  companyId: string;
  campaignId?: string;
  automationId?: string;
  recipientEmail: string;
  recipientId?: string;
  status: 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED';
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  sentAt: string;
}

export interface MarketingTemplate {
  id: string;
  companyId?: string; // Null if system template
  name: string;
  subject?: string;
  content: string;
  category: 'NEWSLETTER' | 'PROMOTION' | 'TRANSACTIONAL' | 'OTHER';
  thumbnailUrl?: string;
  createdAt: string;
}

export interface User {
  id: string;
  companyId: string;
  companyCode?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  color?: string;
  skills?: string[];
  rating?: number;
  joinDate?: string;
  lat?: number;
  lng?: number;
  onboardingComplete: boolean;
  enableTimesheets: boolean;
  payrollType: PayrollType;
  payRate: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
}

export interface Property {
  id: string;
  clientId: string;
  address: Address;
  accessInstructions?: string;
}

export interface VehicleDetails {
  make: string;
  model: string;
  year: string;
  color: string;
  type: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  billingAddress: Address;
  properties: Property[];
  tags: string[];
  dateOfBirth?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  cost?: number;
  total: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface JobPhoto {
  id: string;
  url: string;
  uploadedAt: string;
  type?: 'BEFORE' | 'AFTER' | 'GENERAL'; // NEW
}

export interface Job {
  id: string;
  clientId: string;
  propertyId: string;
  assignedTechIds: string[];
  title: string;
  description: string;
  start: string;
  end: string;
  status: JobStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  vehicleDetails?: VehicleDetails;
  items: LineItem[];
  checklists: ChecklistItem[];
  photos: JobPhoto[];
  notes?: string;
  pipelineStage?: PipelineStage;
  recurrence?: { // NEW
    frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    parentJobId?: string;
  };
  costs?: { // NEW
    supplies: number;
    labor: number;
  };
  lastStageChange?: string; // ISO Date for "Rotting" functionality
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'; // For AI Sentiment Analysis
  cancellationReason?: string; // New for Cancellation Intelligence
  cancellationNote?: string;   // New for Cancellation Intelligence
  competitorName?: string;     // New for Competitor Intel
  competitorCity?: string;     // New for Competitor Intel
  competitorState?: string;    // New for Competitor Intel
  competitorType?: string;     // New for Competitor Intel
}

export interface Quote {
  id: string;
  clientId: string;
  propertyId: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: QuoteStatus;
  issuedDate: string;
  expiryDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'CASH' | 'CHECK' | 'TRANSFER';
  date: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  jobId?: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  payments: Payment[];
  taxRate?: number;
  taxLabel?: string;
  receiptId?: string;
  milestones?: InvoiceMilestone[];
}

export type MilestoneStatus = 'PENDING' | 'FUNDED' | 'RELEASED';

export interface InvoiceMilestone {
  id: string;
  label: string;
  amount: number;
  status: MilestoneStatus;
  dueDate?: string;
}

export interface RoutePlan {
  techId: string;
  date: string;
  jobIds: string[];
  totalDistanceKm?: number;
  generatedAt: string;
}

// ==============================================
// CRM (INDUSTRY-AGNOSTIC) TYPES
// ==============================================

export type CrmAccountType = 'CUSTOMER' | 'VENDOR' | 'PARTNER' | 'INTERNAL';
export type CrmEntityType =
  | 'ACCOUNT'
  | 'CONTACT'
  | 'LOCATION'
  | 'ASSET'
  | 'JOB'
  | 'QUOTE'
  | 'INVOICE'
  | 'TASK'
  | 'CASE';

export type CrmJobStatus = 'PLANNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type CrmQuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'DECLINED' | 'CONVERTED';
export type CrmInvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'BAD_DEBT';
export type CrmTaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type CrmCaseStatus = 'OPEN' | 'PENDING' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export type CrmPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CrmIndustryFields {
  licenseTypes?: string[];
  jobTypes?: string[];
  complianceTags?: string[];
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface CrmEntityRef {
  type: CrmEntityType;
  id: string;
}

export interface CrmServiceCategory {
  id: string;
  name: string;
  description?: string;
  industryFields?: CrmIndustryFields;
}

export interface CrmTerritory {
  id: string;
  name: string;
  region?: string;
  serviceCategoryIds: string[];
}

export interface CrmAccount {
  id: string;
  name: string;
  type: CrmAccountType;
  primaryContactId?: string;
  billingAddress?: Address;
  tags: string[];
  serviceCategoryIds: string[];
  territoryIds: string[];
  industryFields?: CrmIndustryFields;
  createdAt: string;
}

export interface CrmContact {
  id: string;
  accountId: string;
  locationId?: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  tags: string[];
  preferredContact?: 'EMAIL' | 'PHONE' | 'SMS';
  industryFields?: CrmIndustryFields;
  createdAt: string;
}

export interface CrmLocation {
  id: string;
  accountId: string;
  name: string;
  address: Address;
  territoryId?: string;
  notes?: string;
  industryFields?: CrmIndustryFields;
}

export interface CrmAsset {
  id: string;
  accountId: string;
  locationId: string;
  name: string;
  type: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'RETIRED';
  serialNumber?: string;
  serviceCategoryIds: string[];
  installedAt?: string;
  warrantyEndsAt?: string;
  industryFields?: CrmIndustryFields;
}

export interface CrmJobProject {
  id: string;
  accountId: string;
  locationId: string;
  assetId?: string;
  title: string;
  description?: string;
  status: CrmJobStatus;
  jobType?: string;
  assignedUserIds: string[];
  scheduledStart?: string;
  scheduledEnd?: string;
  quoteId?: string;
  invoiceId?: string;
  industryFields?: CrmIndustryFields;
}

export interface CrmQuote {
  id: string;
  accountId: string;
  locationId?: string;
  jobId?: string;
  status: CrmQuoteStatus;
  amount: number;
  currency: string;
  issuedDate: string;
  expiryDate?: string;
  industryFields?: CrmIndustryFields;
}

export interface CrmInvoice {
  id: string;
  accountId: string;
  jobId?: string;
  status: CrmInvoiceStatus;
  amount: number;
  balanceDue: number;
  issuedDate: string;
  dueDate?: string;
  industryFields?: CrmIndustryFields;
}

export interface CrmTask {
  id: string;
  accountId: string;
  relatedTo?: CrmEntityRef;
  title: string;
  description?: string;
  status: CrmTaskStatus;
  priority: CrmPriority;
  dueDate?: string;
  assigneeId?: string;
}

export type CrmCaseSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CrmCaseResolutionStep {
  id: string;
  label: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  ownerId?: string;
  dueDate?: string;
}

export interface CrmCaseAuditEvent {
  id: string;
  timestamp: string;
  actorId?: string;
  action: string;
  detail?: string;
}

export interface CrmCase {
  id: string;
  accountId: string;
  relatedTo?: CrmEntityRef;
  jobId?: string;
  vendorAccountId?: string;
  customerAccountId?: string;
  subject: string;
  description?: string;
  status: CrmCaseStatus;
  priority: CrmPriority;
  severity: CrmCaseSeverity;
  openedAt: string;
  closedAt?: string;
  tags?: string[];
  resolutionSteps?: CrmCaseResolutionStep[];
  auditTrail?: CrmCaseAuditEvent[];
  industryFields?: CrmIndustryFields;
}

export type CrmPipelineTriggerAction =
  | 'CREATE_QUOTE'
  | 'CREATE_WORK_ORDER'
  | 'SEND_REVIEW_REQUEST'
  | 'ASSIGN_OWNER'
  | 'SET_SLA_TIMER';

export interface CrmPipelineTrigger {
  id: string;
  stageId: string;
  action: CrmPipelineTriggerAction;
  params?: Record<string, string | number | boolean>;
}

export interface CrmPipelineStage {
  id: string;
  name: string;
  order: number;
  slaHours?: number;
  automationTriggers?: CrmPipelineTrigger[];
}

export interface CrmPipelineConfig {
  id: string;
  industryId: string;
  name: string;
  stages: CrmPipelineStage[];
}

export type CrmActivityChannel = 'EMAIL' | 'SMS' | 'CALL' | 'NOTE' | 'FILE' | 'STATUS';
export type CrmActivityDirection = 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
export type CrmConsentMethod = 'VERBAL' | 'WRITTEN' | 'DIGITAL';

export interface CrmConsentRecord {
  required: boolean;
  granted: boolean;
  method?: CrmConsentMethod;
  recordedAt?: string;
}

export interface CrmActivity {
  id: string;
  accountId: string;
  relatedTo?: CrmEntityRef;
  channel: CrmActivityChannel;
  direction: CrmActivityDirection;
  subject: string;
  detail?: string;
  createdAt: string;
  createdBy?: string;
  statusFrom?: string;
  statusTo?: string;
  callRecordingUrl?: string;
  consent?: CrmConsentRecord;
}

export type CategoryApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface ServiceCategory {
  id: string;
  name: string;
  industryId: string;
  description?: string;
  tags: string[];
  synonyms: string[];
  skillRequirements: string[];
  requiredDocuments: string[];
  status: CategoryApprovalStatus;
  requestedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ==============================================
// MARKETING & ADS INTELLIGENCE TYPES
// ==============================================

export type AdPlatform = 'GOOGLE' | 'META';
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT';

export type AdSubChannel =
  | 'GOOGLE_SEARCH'
  | 'GOOGLE_DISPLAY'
  | 'YOUTUBE_ADS'
  | 'GOOGLE_DISCOVERY'
  | 'GOOGLE_PMAX'
  | 'GOOGLE_SHOPPING'
  | 'GOOGLE_LOCAL_SERVICES'
  | 'GOOGLE_GMAIL'
  | 'GOOGLE_MIX'
  | 'META_IG_FEED'
  | 'META_IG_REELS'
  | 'META_IG_STORIES'
  | 'META_IG_ALL'
  | 'META_FB_FEED'
  | 'META_FB_REELS'
  | 'META_FB_STORIES'
  | 'META_FB_ALL'
  | 'META_AUDIENCE_NETWORK'
  | 'META_MIX';

export interface AdCampaign {
  id: string;
  platform: AdPlatform;
  subChannel?: AdSubChannel; // NEW
  name: string;
  status: AdStatus;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate?: string;
  // Extended Metrics
  cpc?: number;
  ctr?: number;
  costPerLead?: number;
  frequency?: number; // Meta
  relevanceScore?: number; // Meta (1-10)
  qualityScore?: number; // Google (1-10)
  details?: any; // JSON blob for full wizard data (targeting, creatives, etc)
}

// ... (AdSet interface unchanged replaced with actual)
export interface AdSet {
  id: string;
  campaignId: string;
  name: string;
  status: AdStatus;
  targeting?: string;
}

export interface Ad {
  id: string;
  adSetId: string;
  name: string;
  status: AdStatus;
  creativeUrl?: string; // Image
  headline?: string;
  primaryText?: string;
  clicks: number;
  ctr: number;
  cpc: number;
}

export interface AdCreative {
  id: string;
  userId: string;
  type: 'IMAGE' | 'COPY';
  content: string;
  promptUsed?: string;
  tags?: string[];
  createdAt: string;
}

export interface AdComposition {
  id: string;
  userId: string;
  name: string;
  platform: AdPlatform;
  imageUrl?: string;
  headline?: string;
  description?: string;
  primaryText?: string;
  status: 'DRAFT' | 'SAVED';
  createdAt: string;
}

export interface AttributionRecord {
  id: string;
  source: string; // Friendly name e.g. "Instagram Reels"
  subChannel?: AdSubChannel; // NEW
  platform?: AdPlatform | 'ORGANIC' | 'DIRECT' | 'REFERRAL'; // NEW
  leadsCount: number;
  jobsBooked: number;
  revenue: number;
  costPerLead: number;
  costPerAcquisition: number;
  // New Fields
  assistedConversions?: number;
  spend?: number;
  roi?: number;
  avgTouchpoints?: number;
}

export type AttributionModel = 'LAST_TOUCH' | 'FIRST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AttributionKPIs {
  totalLeads: number;
  totalJobs: number;
  totalRevenue: number;
  cac: number;
  avgJobValue: number;
  roas: number;
  assistedConversions: number;
  avgTouchpoints: number;
  timeToConversion: number; // days
}

export interface CustomerJourneyPath {
  id: string;
  path: string[]; // e.g. ["Google Ads", "Direct", "Organic"]
  conversions: number;
  revenue: number;
  avgDays: number;
}

export interface ChannelEducation {
  id: string; // matches AdSubChannel
  icon: any;
  title: string;
  description: string;
  bestFor: string[];
  creativeRequirements: string[];
  technicalSpecs: string[];
  proTip: string;
}

export interface ChannelConfig {
  id: string; // AdSubChannel
  label: string;
  education: ChannelEducation;
  kpis: {
    label: string;
    value: string;
    trend: 'up' | 'down';
    trendValue: string;
    color: string; // tailwind color class e.g. 'blue'
  }[];
  funnelData: {
    stage: string;
    value: string;
    percent: number;
  }[];
  aiInsights: {
    type: 'OPPORTUNITY' | 'WARNING' | 'SUCCESS';
    text: string;
    impact?: string;
  }[];
  creativeGallery: {
    id: string;
    thumbnail: string;
    metric: string;
    value: string;
  }[];
  // Specific extra data
  keywords?: { term: string; clicks: number; cpc: string; ctr: string; score: number }[]; // Search
  retentionCurve?: { time: string; pct: number }[]; // YouTube/Video
  audiences?: { name: string; performance: string; roas: number }[];
}

// --- ADS CREATIVE SUITE TYPES ---

export interface BrandKit {
  id: string;
  name: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  tagline: string;
  industry: string;
  tone: 'Professional' | 'Friendly' | 'Luxury' | 'Bold' | 'Minimal' | 'High-Energy';
}

export type PlatformFormat = 'INSTAGRAM_FEED' | 'INSTAGRAM_STORY' | 'INSTAGRAM_REE' | 'FACEBOOK_FEED' | 'GOOGLE_DISPLAY_SQUARE' | 'GOOGLE_DISPLAY_WIDE' | 'YOUTUBE_THUMBNAIL';

export interface ImageGenerationConfig {
  prompt: string;
  stylePreset: string; // e.g., 'Luxury', 'Minimal', 'UGC'
  formats: PlatformFormat[];
  useBrandKit: boolean;
  aspectRatio?: string;
  textOverlay?: {
    enabled: boolean;
    text?: string;
    position?: 'top' | 'center' | 'bottom';
  };
}

export interface CopyGenerationConfig {
  productName: string;
  description: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'GOOGLE_SEARCH' | 'GOOGLE_DISPLAY' | 'LINKEDIN';
  tone: string;
  goal: 'AWARENESS' | 'CONVERSION' | 'ENGAGEMENT';
  includeEmoji: boolean;
}

export interface CopyVariant {
  id: string;
  text: string;
  type: 'HEADLINE' | 'PRIMARY_TEXT' | 'CAPTION' | 'HOOK';
  score: number; // AI quality score
  tags: string[]; // e.g., 'Short', 'Punchy', 'Question'
}

export interface GeneratedImage {
  id: string;
  url: string;
  format: PlatformFormat;
  prompt: string;
  createdAt: string;
}

export interface MarketCompetitor {
  name: string;
  status: string;
  threat: 'High' | 'Med' | 'Low';
}

export interface MarketIntelligenceData {
  competitors: MarketCompetitor[];
  trendingKeywords: string[];
  insight: string;
  opportunityScore: number;
  opportunityGrade: string;
  adCostSavingPercentage: number;
}

// --- RESEARCH MODULE ---

export type ResearchToolType =
  | 'competitor-insights'
  | 'market-trends'
  | 'keyword-discovery'
  | 'business-audit'
  | 'pricing-benchmarks'
  | 'seo-audit'
  | 'opportunity-finder'
  | 'growth-plan-generator';

export interface ResearchRequest {
  tool: ResearchToolType;
  inputs: Record<string, string>; // e.g., { city: 'Austin', service: 'Plumbing' }
}

export interface ResearchResult {
  id: string; // From database
  toolType: ResearchToolType;
  data: any; // Structured JSON output specific to the tool
  createdAt: string;
}

// Specific Result Interfaces
export interface CompetitorInsightResult {
  competitors: Array<{
    name: string;
    ads_running: boolean;
    offers: string;
    differentiators: string;
    weaknesses: string;
    website_quality: string;
    sentiment: string;
    price_indicator: string;
  }>;
  opportunities: string[];
}

export interface MarketTrendResult {
  short_term_trends: string[];
  long_term_trends: string[];
  seasonality: string;
  demand_shift: string;
  recommendations: string[];
}

// ... (We can add more specific interfaces as needed, or use 'any' for flexibility during dev)
export interface AdAudienceSegment {
  id: string;
  name: string;
  size: string;
  matchRate?: string;
  type: 'LOOKALIKE' | 'INTEREST' | 'RETARGETING' | 'CUSTOMER_LIST';
  roas: number;
}

export interface AttributionInsight {
  id: string;
  type: 'OPPORTUNITY' | 'WARNING' | 'INFO';
  message: string;
  impact?: string;
}
