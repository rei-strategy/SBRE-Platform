import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { UserRole, Property, User, EmailCampaign, MarketingAutomation, PurchaseOrder } from '../types';

export const createDataSlice: StoreSlice<any> = (set, get) => ({
    syncQueue: [], // Keeping placeholder for offline sync

    loadCompanyData: async (companyId: string) => {
        try {
            const [
                settingsRes, clientsRes, jobsRes, quotesRes, invoicesRes,
                campaignsRes, automationsRes, productsRes, recordsRes,
                warehousesRes, chatsRes, messagesRes, profilesRes, invitesRes, audienceSegmentsRes
            ] = await Promise.all([
                supabase.from('settings').select('*').eq('company_id', companyId).single(),
                supabase.from('clients').select('*, properties(*)').eq('company_id', companyId),
                supabase.from('jobs').select('*, line_items(*), checklists(*), job_photos(*)').eq('company_id', companyId),
                supabase.from('quotes').select('*, line_items(*)').eq('company_id', companyId),
                supabase.from('invoices').select('*, line_items(*), payments(*)').eq('company_id', companyId),
                supabase.from('email_campaigns').select('*').eq('company_id', companyId),
                supabase.from('marketing_automations').select('*').eq('company_id', companyId),
                supabase.from('inventory_products').select('*').eq('company_id', companyId),
                supabase.from('inventory_stock').select('*').eq('company_id', companyId),
                supabase.from('warehouses').select('*').eq('company_id', companyId),
                supabase.from('chats').select('*').eq('company_id', companyId),
                supabase.from('messages').select('*').eq('company_id', companyId),
                supabase.from('profiles').select('*').eq('company_id', companyId),
                supabase.from('team_invitations').select('*').eq('company_id', companyId),
                supabase.from('audience_segments').select('*').eq('company_id', companyId)
            ]);

            const updates: any = {};

            if (settingsRes.data) {
                const s = settingsRes.data;
                updates.settings = {
                    companyName: s.company_name,
                    companyAddress: s.company_address || '',
                    companyCode: s.company_code,
                    taxRate: s.tax_rate,
                    currency: s.currency,
                    businessHoursStart: s.business_hours_start,
                    businessHoursEnd: s.business_hours_end,
                    lowStockThreshold: s.low_stock_threshold,
                    enableAutoInvoice: s.enable_auto_invoice,
                    smsTemplateOnMyWay: s.sms_template_on_my_way,
                    serviceCategories: s.service_categories || [],
                    paymentMethods: s.payment_methods || [],
                    onboardingStep: s.onboarding_step,
                    industry: s.industry
                };
            }

            if (clientsRes.data) {
                updates.clients = clientsRes.data.map((c: any) => ({
                    id: c.id,
                    firstName: c.first_name,
                    lastName: c.last_name,
                    email: c.email,
                    phone: c.phone,
                    companyName: c.company_name,
                    billingAddress: typeof c.billing_address === 'string' ? JSON.parse(c.billing_address) : c.billing_address,
                    properties: (c.properties || []).map((p: any) => ({
                        ...p,
                        address: typeof p.address === 'string' ? JSON.parse(p.address) : p.address,
                        accessInstructions: p.access_instructions
                    })),
                    tags: c.tags || [],
                    createdAt: c.created_at
                }));

                // Global Self-Healing: Check for missing coordinates
                // We call get().updateProperty which is in ClientSlice
                clientsRes.data.forEach((c: any) => {
                    if (c.properties) {
                        c.properties.forEach((p: any) => {
                            const address = typeof p.address === 'string' ? JSON.parse(p.address) : p.address;
                            if (!address.lat || !address.lng) {
                                console.log(`Global Self-Healing: Fixing coordinates for property ${p.id}`);
                                const propertyObj: Property = {
                                    id: p.id,
                                    clientId: c.id,
                                    address: address,
                                    accessInstructions: p.access_instructions
                                };
                                get().updateProperty(propertyObj);
                            }
                        });
                    }
                });
            }

            if (jobsRes.data) {
                updates.jobs = jobsRes.data.map((j: any) => ({
                    id: j.id,
                    clientId: j.client_id,
                    propertyId: j.property_id,
                    assignedTechIds: j.assigned_tech_ids || [],
                    title: j.title,
                    description: j.description,
                    start: j.start_time,
                    end: j.end_time,
                    status: j.status,
                    priority: j.priority,
                    vehicleDetails: j.vehicle_details,
                    items: (j.line_items || []).map((li: any) => ({ ...li, unitPrice: li.unit_price })),
                    checklists: (j.checklists || []).map((cl: any) => ({ ...cl, isCompleted: cl.is_completed })),
                    photos: (j.job_photos || []).map((jp: any) => ({ ...jp, uploadedAt: jp.uploaded_at })),
                    pipelineStage: j.pipeline_stage || 'LEAD'
                }));
            }

            if (quotesRes.data) {
                updates.quotes = quotesRes.data.map((q: any) => ({
                    id: q.id,
                    clientId: q.client_id,
                    propertyId: q.property_id,
                    items: (q.line_items || []).map((li: any) => ({ ...li, unitPrice: li.unit_price })),
                    subtotal: q.subtotal,
                    tax: q.tax,
                    total: q.total,
                    status: q.status,
                    issuedDate: q.issued_date,
                    expiryDate: q.expiry_date
                }));
            }

            if (invoicesRes.data) {
                updates.invoices = invoicesRes.data.map((i: any) => ({
                    id: i.id,
                    clientId: i.client_id,
                    jobId: i.job_id,
                    items: (i.line_items || []).map((li: any) => ({ ...li, unitPrice: li.unit_price })),
                    subtotal: i.subtotal,
                    tax: i.tax,
                    total: i.total,
                    balanceDue: i.balance_due,
                    status: i.status,
                    dueDate: i.due_date,
                    issuedDate: i.issued_date,
                    payments: (i.payments || []).map((p: any) => ({ ...p, invoiceId: p.invoice_id }))
                }));
            }

            if (profilesRes.data) {
                updates.users = profilesRes.data.map((p: any) => ({
                    id: p.id,
                    companyId: p.company_id,
                    name: p.full_name,
                    email: p.email,
                    role: p.role,
                    avatarUrl: p.avatar_url,
                    onboardingComplete: p.onboarding_complete,
                    enableTimesheets: p.enable_timesheets ?? true,
                    payrollType: p.payroll_type || 'HOURLY',
                    payRate: p.pay_rate || 0
                }));
            }

            if (productsRes.data) updates.inventoryProducts = productsRes.data.map((p: any) => ({ ...p, minStock: p.min_stock, trackSerial: p.track_serial, supplierId: p.supplier_id }));
            if (recordsRes.data) updates.inventoryRecords = recordsRes.data.map((r: any) => ({ ...r, productId: r.product_id, warehouseId: r.warehouse_id, lastUpdated: r.last_updated }));
            if (warehousesRes.data) updates.warehouses = warehousesRes.data;
            if (campaignsRes.data) {
                updates.marketingCampaigns = campaignsRes.data.map((c: any) => ({
                    id: c.id,
                    companyId: c.company_id,
                    name: c.name,
                    subject: c.subject,
                    previewText: c.preview_text,
                    fromName: c.from_name,
                    content: c.content,
                    templateId: c.template_id,
                    audienceId: c.audience_id,
                    audienceFilter: c.audience_filter,
                    scheduleTime: c.schedule_time,
                    status: c.status,
                    settings: c.settings || {},
                    sentCount: c.sent_count,
                    openCount: c.open_count,
                    clickCount: c.click_count,
                    createdAt: c.created_at
                }));
            }
            if (automationsRes.data) {
                updates.marketingAutomations = automationsRes.data.map((a: any) => ({
                    id: a.id,
                    companyId: a.company_id,
                    name: a.name,
                    description: a.description,
                    triggerType: a.trigger_type,
                    triggerConfig: a.trigger_config,
                    steps: a.steps || [],
                    isActive: a.is_active,
                    stats: a.stats || { runs: 0, completed: 0 },
                    createdAt: a.created_at
                }));
            }
            if (chatsRes.data) updates.chats = chatsRes.data.map((c: any) => ({ ...c, participantIds: c.participant_ids }));
            if (messagesRes.data) updates.messages = messagesRes.data.map((m: any) => ({ ...m, chatId: m.chat_id, senderId: m.sender_id, readBy: m.read_by }));
            if (invitesRes.data) updates.teamInvitations = invitesRes.data.map((i: any) => ({
                id: i.id,
                companyId: i.company_id,
                email: i.email,
                createdAt: i.created_at
            }));
            if (audienceSegmentsRes.data) {
                updates.marketingAudiences = audienceSegmentsRes.data.map((s: any) => ({
                    id: s.id,
                    companyId: s.company_id,
                    name: s.name,
                    description: s.description,
                    filters: s.filters,
                    estimatedCount: s.estimated_count,
                    lastCalculatedAt: s.last_calculated_at,
                    createdAt: s.created_at
                }));
            }

            set(updates);

        } catch (error) {
            console.error("Error loading company data", error);
            // Fallback could be implemented here as well
        }
    }
});
