import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { Quote, Invoice, QuoteStatus } from '../types';

export const createFinanceSlice: StoreSlice<any> = (set, get) => ({
    quotes: [],
    invoices: [],

    addQuote: async (quote: Quote) => {
        const { currentUser } = get();
        if (!currentUser.companyId) return;
        const payload = {
            id: quote.id,
            company_id: currentUser.companyId,
            client_id: quote.clientId,
            property_id: quote.propertyId,
            subtotal: quote.subtotal,
            tax: quote.tax,
            total: quote.total,
            status: quote.status,
            issued_date: quote.issuedDate,
            expiry_date: quote.expiryDate
        };
        const { error } = await supabase.from('quotes').insert(payload);
        if (error) { console.error(error); return; }

        if (quote.items.length > 0) {
            const items = quote.items.map(i => ({
                company_id: currentUser.companyId,
                quote_id: quote.id,
                description: i.description,
                quantity: i.quantity,
                unit_price: i.unitPrice,
                total: i.total
            }));
            await supabase.from('line_items').insert(items);
        }
        set((state) => ({ quotes: [...state.quotes, quote] }));

        if (quote.status === QuoteStatus.SENT) {
            get().triggerAutomation('QUOTE_SENT', quote.id, { quote });
        }
    },

    updateQuote: async (quote: Quote) => {
        await supabase.from('quotes').update({ status: quote.status }).eq('id', quote.id);
        set((state) => ({ quotes: state.quotes.map(q => q.id === quote.id ? quote : q) }));
    },

    updateQuoteStatus: (id: string, status: QuoteStatus) => {
        supabase.from('quotes').update({ status }).eq('id', id).then(() => {
            set((state) => ({ quotes: state.quotes.map(q => q.id === id ? { ...q, status } : q) }));

            if (status === QuoteStatus.APPROVED) {
                const quote = get().quotes.find(q => q.id === id);
                if (quote) {
                    get().triggerAutomation('QUOTE_ACCEPTED', id, { quote });
                }
            }
        });
    },

    createInvoice: async (invoice: Invoice) => {
        const { currentUser } = get();
        if (!currentUser.companyId) return;
        const payload = {
            id: invoice.id,
            company_id: currentUser.companyId,
            client_id: invoice.clientId,
            job_id: invoice.jobId,
            subtotal: invoice.subtotal,
            tax: invoice.tax,
            total: invoice.total,
            balance_due: invoice.balanceDue,
            status: invoice.status,
            due_date: invoice.dueDate,
            issued_date: invoice.issuedDate
        };
        const { error } = await supabase.from('invoices').insert(payload);
        if (error) { console.error(error); return; }

        if (invoice.items.length > 0) {
            const items = invoice.items.map(i => ({
                company_id: currentUser.companyId,
                invoice_id: invoice.id,
                description: i.description,
                quantity: i.quantity,
                unit_price: i.unitPrice,
                total: i.total
            }));
            await supabase.from('line_items').insert(items);
        }
        set((state) => ({ invoices: [...state.invoices, invoice] }));
    },

    updateInvoice: async (invoice: Invoice) => {
        const payload = {
            status: invoice.status,
            balance_due: invoice.balanceDue
        };
        await supabase.from('invoices').update(payload).eq('id', invoice.id);
        set((state) => ({ invoices: state.invoices.map(i => i.id === invoice.id ? invoice : i) }));
    }
});
