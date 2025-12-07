import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { InventoryProduct, InventoryRecord, Warehouse, Vendor, PurchaseOrder } from '../types';

export const createInventorySlice: StoreSlice<any> = (set, get) => ({
    inventoryProducts: [],
    inventoryRecords: [],
    warehouses: [],
    vendors: [],
    purchaseOrders: [],

    addProduct: async (p: InventoryProduct) => {
        const { currentUser } = get();
        const payload = {
            id: p.id,
            company_id: currentUser.companyId,
            sku: p.sku,
            name: p.name,
            category: p.category,
            brand: p.brand,
            cost: p.cost,
            price: p.price,
            min_stock: p.minStock,
            track_serial: p.trackSerial
        };
        await supabase.from('inventory_products').insert(payload);
        set((state) => ({ inventoryProducts: [...state.inventoryProducts, p] }));
    },

    updateProduct: async (p: InventoryProduct) => {
        const payload = {
            sku: p.sku,
            name: p.name,
            category: p.category,
            brand: p.brand,
            cost: p.cost,
            price: p.price,
            min_stock: p.minStock,
            track_serial: p.trackSerial,
            image_url: p.image,
            barcode: p.barcode,
            description: p.description,
            supplier_id: p.supplierId
        };
        await supabase.from('inventory_products').update(payload).eq('id', p.id);
        set((state) => ({
            inventoryProducts: state.inventoryProducts.map(prod => prod.id === p.id ? p : prod)
        }));
    },

    deleteProduct: async (id: string) => {
        const { error } = await supabase.from('inventory_products').delete().eq('id', id);
        if (!error) {
            set((state) => ({ inventoryProducts: state.inventoryProducts.filter(p => p.id !== id) }));
        }
        return { error };
    },

    updateStock: async (r: InventoryRecord) => {
        const { currentUser } = get();
        const payload = {
            id: r.id,
            company_id: currentUser.companyId,
            product_id: r.productId,
            warehouse_id: r.warehouseId,
            quantity: r.quantity,
            last_updated: r.lastUpdated
        };
        await supabase.from('inventory_stock').upsert(payload);
        set((state) => ({
            inventoryRecords: [...state.inventoryRecords.filter(rec => rec.id !== r.id), r]
        }));
    },

    addWarehouse: async (w: Warehouse) => {
        const { currentUser } = get();
        await supabase.from('warehouses').insert({
            id: w.id,
            company_id: currentUser.companyId,
            name: w.name,
            type: w.type
        });
        set((state) => ({ warehouses: [...state.warehouses, w] }));
    },

    updateWarehouse: async (w: Warehouse) => {
        await supabase.from('warehouses').update({
            name: w.name,
            type: w.type
        }).eq('id', w.id);
        set((state) => ({ warehouses: state.warehouses.map(wh => wh.id === w.id ? w : wh) }));
    },

    addVendor: async (v: Vendor) => {
        const { currentUser } = get();
        const payload = {
            id: v.id,
            company_id: currentUser.companyId,
            name: v.name,
            email: v.email,
            phone: v.phone,
            contact_person: v.contactPerson,
            payment_terms: v.paymentTerms,
            lead_time_days: v.leadTimeDays,
            rating: v.rating
        };
        await supabase.from('vendors').insert(payload);
        set((state) => ({ vendors: [...state.vendors, v] }));
    },

    updateVendor: async (v: Vendor) => {
        const payload = {
            name: v.name,
            email: v.email,
            phone: v.phone,
            contact_person: v.contactPerson,
            payment_terms: v.paymentTerms,
            lead_time_days: v.leadTimeDays,
            rating: v.rating
        };
        await supabase.from('vendors').update(payload).eq('id', v.id);
        set((state) => ({ vendors: state.vendors.map(ven => ven.id === v.id ? v : ven) }));
    },

    deleteVendor: async (id: string) => {
        const { error } = await supabase.from('vendors').delete().eq('id', id);
        if (!error) {
            set((state) => ({ vendors: state.vendors.filter(v => v.id !== id) }));
        }
        return { error };
    },

    createPO: (po: PurchaseOrder) => set((state) => ({ purchaseOrders: [...state.purchaseOrders, po] }))
});
