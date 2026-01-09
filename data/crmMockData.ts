import {
  CrmAccount,
  CrmAsset,
  CrmCase,
  CrmContact,
  CrmInvoice,
  CrmJobProject,
  CrmLocation,
  CrmQuote,
  CrmServiceCategory,
  CrmTask,
  CrmTerritory,
  CrmPipelineConfig,
  CrmActivity,
  CrmPermissionPolicy,
  CrmSegment,
  ComplianceAuditLog,
} from '../types';

export const crmServiceCategories: CrmServiceCategory[] = [
  {
    id: 'svc-turnover-cleaning',
    name: 'Turnover Cleaning',
    description: 'Unit turns, deep clean, and amenity refresh.',
    industryFields: { jobTypes: ['Unit Turn', 'Deep Clean'] },
  },
  {
    id: 'svc-make-ready',
    name: 'Make-Ready Renovations',
    description: 'Paint, flooring, punch lists, and rehab scopes.',
    industryFields: { jobTypes: ['Paint', 'Flooring', 'Punch List'] },
  },
  {
    id: 'svc-hvac-electrical',
    name: 'HVAC + Electrical',
    description: 'Mechanical and electrical service for properties.',
    industryFields: { complianceTags: ['EPA-608'], licenseTypes: ['EL-01', 'TACLB-1234'] },
  },
];

export const crmTerritories: CrmTerritory[] = [
  {
    id: 'terr-austin-core',
    name: 'Austin Core',
    region: 'Downtown / East Austin',
    serviceCategoryIds: ['svc-turnover-cleaning', 'svc-make-ready', 'svc-hvac-electrical'],
  },
  {
    id: 'terr-north-atx',
    name: 'North Austin',
    region: 'Round Rock / Pflugerville',
    serviceCategoryIds: ['svc-turnover-cleaning', 'svc-hvac-electrical'],
  },
];

export const crmAccounts: CrmAccount[] = [
  {
    id: 'acct-pm-blue-ridge',
    name: 'Blue Ridge Property Group',
    type: 'CUSTOMER',
    primaryContactId: 'contact-blue-ridge-prop',
    billingAddress: {
      street: '4800 Riverside Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78741',
    },
    tags: ['Portfolio', 'Multi-site'],
    serviceCategoryIds: ['svc-turnover-cleaning', 'svc-hvac-electrical'],
    territoryIds: ['terr-austin-core'],
    industryFields: { jobTypes: ['Turnover', 'Emergency'] },
    createdAt: '2024-11-10T10:15:00Z',
  },
  {
    id: 'acct-reit-lonestar',
    name: 'Lone Star REIT',
    type: 'CUSTOMER',
    primaryContactId: 'contact-lonestar-asset',
    billingAddress: {
      street: '700 Congress Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    tags: ['Commercial', 'Class A'],
    serviceCategoryIds: ['svc-make-ready', 'svc-hvac-electrical'],
    territoryIds: ['terr-austin-core', 'terr-north-atx'],
    industryFields: { complianceTags: ['ADA', 'Fire Code'] },
    createdAt: '2024-10-03T09:45:00Z',
  },
  {
    id: 'acct-summit-vendor',
    name: 'Summit Maintenance Co.',
    type: 'VENDOR',
    primaryContactId: 'contact-summit-owner',
    billingAddress: {
      street: '1200 Lamar Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78703',
    },
    tags: ['Preferred', '24-7'],
    serviceCategoryIds: ['svc-hvac-electrical', 'svc-turnover-cleaning'],
    territoryIds: ['terr-austin-core', 'terr-north-atx'],
    industryFields: { licenseTypes: ['TACLB-1234'], complianceTags: ['OSHA-10'] },
    createdAt: '2024-12-02T15:30:00Z',
  },
];

export const crmContacts: CrmContact[] = [
  {
    id: 'contact-summit-owner',
    accountId: 'acct-summit-vendor',
    name: 'Maya Patel',
    title: 'Owner / Principal',
    email: 'maya@summitfs.com',
    phone: '+1 (512) 555-0101',
    tags: ['Decision Maker'],
    preferredContact: 'PHONE',
    createdAt: '2024-12-02T15:32:00Z',
  },
  {
    id: 'contact-blue-ridge-prop',
    accountId: 'acct-pm-blue-ridge',
    name: 'Leo Williams',
    title: 'Property Manager',
    email: 'leo@blueridgepg.com',
    phone: '+1 (512) 555-0144',
    tags: ['Ops'],
    preferredContact: 'EMAIL',
    createdAt: '2024-11-10T10:20:00Z',
  },
  {
    id: 'contact-lonestar-asset',
    accountId: 'acct-reit-lonestar',
    name: 'Sierra Clark',
    title: 'Asset Manager',
    email: 'sierra@lonestarreit.com',
    phone: '+1 (512) 555-0188',
    tags: ['Budget Owner'],
    preferredContact: 'EMAIL',
    createdAt: '2024-10-03T09:50:00Z',
  },
];

export const crmLocations: CrmLocation[] = [
  {
    id: 'loc-eastside-lofts',
    accountId: 'acct-pm-blue-ridge',
    name: 'Eastside Lofts',
    address: {
      street: '1100 E 6th St',
      city: 'Austin',
      state: 'TX',
      zip: '78702',
    },
    territoryId: 'terr-austin-core',
    notes: 'Gate code 4321. Leasing office open 9-6.',
  },
  {
    id: 'loc-tech-hub',
    accountId: 'acct-reit-lonestar',
    name: 'Tech Hub Plaza',
    address: {
      street: '900 Congress Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    territoryId: 'terr-austin-core',
  },
  {
    id: 'loc-northview',
    accountId: 'acct-pm-blue-ridge',
    name: 'Northview Flats',
    address: {
      street: '2400 Parker Ln',
      city: 'Austin',
      state: 'TX',
      zip: '78741',
    },
    territoryId: 'terr-north-atx',
  },
];

export const crmAssets: CrmAsset[] = [
  {
    id: 'asset-hvac-001',
    accountId: 'acct-pm-blue-ridge',
    locationId: 'loc-eastside-lofts',
    name: 'Rooftop HVAC Unit A',
    type: 'HVAC',
    status: 'ACTIVE',
    serialNumber: 'HV-AX-3321',
    serviceCategoryIds: ['svc-hvac-electrical'],
    installedAt: '2021-05-20',
    warrantyEndsAt: '2026-05-20',
    industryFields: { complianceTags: ['EPA-608'] },
  },
  {
    id: 'asset-panel-002',
    accountId: 'acct-reit-lonestar',
    locationId: 'loc-tech-hub',
    name: 'Main Electrical Panel',
    type: 'Electrical',
    status: 'ACTIVE',
    serialNumber: 'EL-PNL-887',
    serviceCategoryIds: ['svc-hvac-electrical'],
    installedAt: '2019-08-12',
    industryFields: { licenseTypes: ['EL-01'] },
  },
  {
    id: 'asset-unit-304',
    accountId: 'acct-pm-blue-ridge',
    locationId: 'loc-eastside-lofts',
    name: 'Unit 304',
    type: 'Apartment Unit',
    status: 'ACTIVE',
    serialNumber: 'UNIT-304',
    serviceCategoryIds: ['svc-turnover-cleaning', 'svc-make-ready'],
    industryFields: { jobTypes: ['Turnover'] },
  },
];

export const crmJobs: CrmJobProject[] = [
  {
    id: 'job-1001',
    accountId: 'acct-pm-blue-ridge',
    locationId: 'loc-eastside-lofts',
    assetId: 'asset-unit-304',
    title: 'Unit 304 Turnover',
    description: 'Make-ready scope for vacant unit.',
    status: 'SCHEDULED',
    jobType: 'Turnover',
    assignedUserIds: ['user-tech-01'],
    scheduledStart: '2025-01-15T15:00:00Z',
    scheduledEnd: '2025-01-15T17:00:00Z',
    quoteId: 'quote-2001',
    invoiceId: 'inv-3001',
  },
  {
    id: 'job-1002',
    accountId: 'acct-reit-lonestar',
    locationId: 'loc-tech-hub',
    assetId: 'asset-panel-002',
    title: 'Electrical Panel Inspection',
    description: 'Annual inspection for compliance.',
    status: 'PLANNED',
    jobType: 'Inspection',
    assignedUserIds: ['user-tech-02'],
    scheduledStart: '2025-01-20T16:00:00Z',
    scheduledEnd: '2025-01-20T18:00:00Z',
  },
];

export const crmQuotes: CrmQuote[] = [
  {
    id: 'quote-2001',
    accountId: 'acct-pm-blue-ridge',
    locationId: 'loc-eastside-lofts',
    jobId: 'job-1001',
    status: 'APPROVED',
    amount: 1850,
    currency: 'USD',
    issuedDate: '2025-01-05',
    expiryDate: '2025-02-05',
    industryFields: { jobTypes: ['Turnover'] },
  },
];

export const crmInvoices: CrmInvoice[] = [
  {
    id: 'inv-3001',
    accountId: 'acct-pm-blue-ridge',
    jobId: 'job-1001',
    status: 'SENT',
    amount: 1850,
    balanceDue: 1850,
    issuedDate: '2025-01-16',
    dueDate: '2025-02-15',
  },
];

export const crmTasks: CrmTask[] = [
  {
    id: 'task-4001',
    accountId: 'acct-summit-vendor',
    relatedTo: { type: 'ACCOUNT', id: 'acct-pm-blue-ridge' },
    title: 'Confirm lockbox code for Eastside Lofts',
    status: 'OPEN',
    priority: 'HIGH',
    dueDate: '2025-01-14',
    assigneeId: 'user-ops-01',
  },
  {
    id: 'task-4002',
    accountId: 'acct-reit-lonestar',
    relatedTo: { type: 'LOCATION', id: 'loc-tech-hub' },
    title: 'Upload COI for Summit Maintenance',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '2025-01-18',
    assigneeId: 'user-ops-02',
  },
];

export const crmCases: CrmCase[] = [
  {
    id: 'case-5001',
    accountId: 'acct-pm-blue-ridge',
    relatedTo: { type: 'JOB', id: 'job-1001' },
    jobId: 'job-1001',
    vendorAccountId: 'acct-summit-vendor',
    customerAccountId: 'acct-pm-blue-ridge',
    subject: 'Punch list callback',
    description: 'Resident reported paint touch-up needed in Unit 304.',
    status: 'PENDING',
    priority: 'MEDIUM',
    severity: 'MEDIUM',
    openedAt: '2025-01-16T18:10:00Z',
    tags: ['Turnover', 'Quality'],
    resolutionSteps: [
      { id: 'step-1', label: 'Review photos and scope', status: 'COMPLETED' },
      { id: 'step-2', label: 'Schedule touch-up', status: 'IN_PROGRESS' },
      { id: 'step-3', label: 'Confirm resolution with client', status: 'PENDING' },
    ],
    auditTrail: [
      {
        id: 'audit-1',
        timestamp: '2025-01-16T18:12:00Z',
        actorId: 'user-ops-01',
        action: 'Case created',
        detail: 'Case opened from tenant feedback form.'
      },
      {
        id: 'audit-2',
        timestamp: '2025-01-17T09:05:00Z',
        actorId: 'user-ops-02',
        action: 'Vendor notified',
        detail: 'Summit Maintenance alerted for touch-up.'
      }
    ],
  },
];

export const crmPipelineConfigs: CrmPipelineConfig[] = [
  {
    id: 'pipeline-real-estate',
    industryId: 'property-management',
    name: 'Property Management Pipeline',
    stages: [
      {
        id: 'inquiry',
        name: 'Inquiry',
        order: 1,
        slaHours: 2,
        automationTriggers: [
          { id: 'trigger-assign-owner', stageId: 'inquiry', action: 'ASSIGN_OWNER' },
          { id: 'trigger-sla-inquiry', stageId: 'inquiry', action: 'SET_SLA_TIMER', params: { hours: 2 } },
        ],
      },
      {
        id: 'qualified',
        name: 'Qualified',
        order: 2,
        slaHours: 24,
        automationTriggers: [
          { id: 'trigger-create-quote', stageId: 'qualified', action: 'CREATE_QUOTE' },
        ],
      },
      {
        id: 'quote',
        name: 'Quote Sent',
        order: 3,
        slaHours: 48,
      },
      {
        id: 'work-order',
        name: 'Work Order',
        order: 4,
        slaHours: 72,
        automationTriggers: [
          { id: 'trigger-create-work-order', stageId: 'work-order', action: 'CREATE_WORK_ORDER' },
        ],
      },
      {
        id: 'completion',
        name: 'Completion',
        order: 5,
        slaHours: 72,
      },
      {
        id: 'review',
        name: 'Review',
        order: 6,
        slaHours: 168,
        automationTriggers: [
          { id: 'trigger-review-request', stageId: 'review', action: 'SEND_REVIEW_REQUEST' },
        ],
      },
    ],
  },
];

export const crmActivities: CrmActivity[] = [
  {
    id: 'activity-1001',
    accountId: 'acct-pm-blue-ridge',
    relatedTo: { type: 'JOB', id: 'job-1001' },
    channel: 'STATUS',
    direction: 'INTERNAL',
    subject: 'Stage moved to Work Order',
    detail: 'Qualified scope approved by asset manager.',
    createdAt: '2025-01-12T14:05:00Z',
    statusFrom: 'Qualified',
    statusTo: 'Work Order',
  },
  {
    id: 'activity-1002',
    accountId: 'acct-pm-blue-ridge',
    relatedTo: { type: 'CONTACT', id: 'contact-blue-ridge-prop' },
    channel: 'EMAIL',
    direction: 'OUTBOUND',
    subject: 'Quote sent for Unit 304 turnover',
    detail: 'Sent quote and scope summary via email.',
    createdAt: '2025-01-05T16:30:00Z',
  },
  {
    id: 'activity-1003',
    accountId: 'acct-pm-blue-ridge',
    relatedTo: { type: 'JOB', id: 'job-1001' },
    channel: 'SMS',
    direction: 'INBOUND',
    subject: 'Access instructions received',
    detail: 'Gate code confirmed for Eastside Lofts.',
    createdAt: '2025-01-13T09:10:00Z',
  },
  {
    id: 'activity-1004',
    accountId: 'acct-reit-lonestar',
    relatedTo: { type: 'LOCATION', id: 'loc-tech-hub' },
    channel: 'CALL',
    direction: 'OUTBOUND',
    subject: 'Compliance walkthrough call',
    detail: 'Discussed annual inspection schedule.',
    createdAt: '2025-01-08T18:20:00Z',
    callRecordingUrl: 'recording://calls/tech-hub-0108',
    consent: {
      required: true,
      granted: false,
      method: 'VERBAL',
    },
  },
  {
    id: 'activity-1005',
    accountId: 'acct-reit-lonestar',
    relatedTo: { type: 'ASSET', id: 'asset-panel-002' },
    channel: 'NOTE',
    direction: 'INTERNAL',
    subject: 'Inspection checklist updated',
    detail: 'Added arc-fault test to panel checklist.',
    createdAt: '2025-01-09T11:45:00Z',
  },
  {
    id: 'activity-1006',
    accountId: 'acct-pm-blue-ridge',
    relatedTo: { type: 'JOB', id: 'job-1001' },
    channel: 'FILE',
    direction: 'INTERNAL',
    subject: 'Move-out inspection photos',
    detail: 'Uploaded 8 photos to turnover folder.',
    createdAt: '2025-01-11T13:00:00Z',
  },
];

export const crmPermissions: CrmPermissionPolicy[] = [
  { role: 'ADMIN', object: 'CASE', actions: ['VIEW', 'EDIT', 'EXPORT'] },
  { role: 'OFFICE', object: 'CASE', actions: ['VIEW', 'EDIT'] },
  { role: 'TECHNICIAN', object: 'CASE', actions: ['VIEW'] },
  { role: 'CLIENT', object: 'CASE', actions: ['VIEW'] },
  { role: 'ADMIN', object: 'JOB', actions: ['VIEW', 'EDIT', 'EXPORT'] },
  { role: 'OFFICE', object: 'JOB', actions: ['VIEW', 'EDIT'] },
  { role: 'TECHNICIAN', object: 'JOB', actions: ['VIEW'] },
  { role: 'CLIENT', object: 'JOB', actions: ['VIEW'] },
  { role: 'ADMIN', object: 'INVOICE', actions: ['VIEW', 'EDIT', 'EXPORT'] },
  { role: 'OFFICE', object: 'INVOICE', actions: ['VIEW', 'EDIT'] },
  { role: 'CLIENT', object: 'INVOICE', actions: ['VIEW'] },
];

export const crmSegments: CrmSegment[] = [
  {
    id: 'seg-austin',
    name: 'Austin Core',
    territoryIds: ['terr-austin-core'],
    description: 'Downtown and East Austin portfolio.'
  },
  {
    id: 'seg-north',
    name: 'North Austin',
    territoryIds: ['terr-north-atx'],
    description: 'Round Rock and Pflugerville sites.'
  }
];

export const crmComplianceLogs: ComplianceAuditLog[] = [
  {
    id: 'audit-case-1',
    actorId: 'user-ops-01',
    action: 'Case created',
    entityType: 'CASE',
    entityId: 'case-5001',
    timestamp: '2025-01-16T18:12:00Z',
    detail: 'Initial dispute logged.'
  }
];
