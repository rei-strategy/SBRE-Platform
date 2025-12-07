
import React, { useState, useMemo } from 'react';
import { PurchaseOrder, Vendor, POStatus, InventoryProduct } from '../../types';
import { FileText, Plus, Calendar, Filter, CheckCircle, AlertCircle, Clock, ChevronRight, Search, Truck, Phone, Mail, Printer, Trash2, Edit2, Download } from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

interface PurchaseOrdersProps {
    orders: PurchaseOrder[];
    vendors: Vendor[];
    products: InventoryProduct[];
    onCreatePO: (po: PurchaseOrder) => void;
    onAddVendor: (vendor: Vendor) => Promise<void>;
    onUpdateVendor: (vendor: Vendor) => Promise<void>;
    onDeleteVendor: (id: string) => Promise<{ error: any }>;
}

export const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ orders, vendors, products, onCreatePO, onAddVendor, onUpdateVendor, onDeleteVendor }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'vendors'>('orders');
    const [isPOModalOpen, setIsPOModalOpen] = useState(false);
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // PO Form State
    const [poFormData, setPoFormData] = useState<{
        vendorId: string;
        expectedDate: string;
        items: { productId: string; quantity: number; cost: number }[];
        notes: string;
    }>({ vendorId: '', expectedDate: '', items: [], notes: '' });

    // Vendor Form State
    const [vendorFormData, setVendorFormData] = useState<Partial<Vendor>>({});
    const [isEditingVendor, setIsEditingVendor] = useState(false);

    const filteredOrders = orders.filter(po => statusFilter === 'ALL' || po.status === statusFilter);
    const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const getStatusBadge = (status: POStatus) => {
        const styles = {
            DRAFT: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600',
            ORDERED: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            PARTIAL: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            RECEIVED: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            CANCELLED: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    // Vendor Actions
    const handleOpenAddVendor = () => {
        setVendorFormData({});
        setIsEditingVendor(false);
        setIsVendorModalOpen(true);
    };

    const handleOpenEditVendor = (v: Vendor) => {
        setVendorFormData(v);
        setIsEditingVendor(true);
        setIsVendorModalOpen(true);
    };

    const handleVendorSubmit = async () => {
        if (!vendorFormData.name) return;

        const vendor: Vendor = {
            id: vendorFormData.id || crypto.randomUUID(),
            name: vendorFormData.name,
            email: vendorFormData.email || '',
            phone: vendorFormData.phone || '',
            contactPerson: vendorFormData.contactPerson || '',
            paymentTerms: vendorFormData.paymentTerms || 'Net 30',
            leadTimeDays: Number(vendorFormData.leadTimeDays) || 0,
            rating: Number(vendorFormData.rating) || 0
        };

        if (isEditingVendor) {
            await onUpdateVendor(vendor);
        } else {
            await onAddVendor(vendor);
        }
        setIsVendorModalOpen(false);
    };

    const handleDeleteVendor = async (id: string) => {
        if (window.confirm('Delete this vendor?')) {
            await onDeleteVendor(id);
        }
    };

    // PO Actions
    const handleAddItem = () => {
        setPoFormData(prev => ({
            ...prev,
            items: [...prev.items, { productId: '', quantity: 1, cost: 0 }]
        }));
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...poFormData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-fill cost if product selected
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                newItems[index].cost = product.cost;
            }
        }
        setPoFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleRemoveItem = (index: number) => {
        setPoFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSmartFill = () => {
        if (!poFormData.vendorId) return;
        const vendorProducts = products.filter(p => p.supplierId === poFormData.vendorId && p.minStock > 0); // Logic could be better if we had current stock here
        // Since we don't have current stock in this component easily (it's in records), we'll just add all products from this vendor for now
        // Or we can pass records to this component too. For now, let's just add all products from vendor.

        const newItems = vendorProducts.map(p => ({
            productId: p.id,
            quantity: p.minStock, // Default to min stock
            cost: p.cost
        }));

        setPoFormData(prev => ({ ...prev, items: newItems }));
    };

    const handlePOSubmit = () => {
        if (!poFormData.vendorId || poFormData.items.length === 0) return;

        const total = poFormData.items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

        const newPO: PurchaseOrder = {
            id: crypto.randomUUID(),
            vendorId: poFormData.vendorId,
            status: POStatus.DRAFT,
            orderDate: new Date().toISOString(),
            expectedDate: poFormData.expectedDate,
            items: poFormData.items,
            total: total,
            notes: poFormData.notes
        };

        onCreatePO(newPO);
        setIsPOModalOpen(false);
        setPoFormData({ vendorId: '', expectedDate: '', items: [], notes: '' });
    };

    const poTotal = poFormData.items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Purchasing</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage orders and suppliers.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? "shadow-lg shadow-blue-500/20" : ""}>
                        <FileText className="w-4 h-4 mr-2" /> Orders
                    </Button>
                    <Button variant={activeTab === 'vendors' ? 'default' : 'outline'} onClick={() => setActiveTab('vendors')} className={activeTab === 'vendors' ? "shadow-lg shadow-purple-500/20" : ""}>
                        <Truck className="w-4 h-4 mr-2" /> Vendors
                    </Button>
                    {activeTab === 'orders' ? (
                        <Button onClick={() => setIsPOModalOpen(true)} className="ml-2 shadow-lg shadow-emerald-500/20">
                            <Plus className="w-4 h-4 mr-2" /> Create PO
                        </Button>
                    ) : (
                        <Button onClick={handleOpenAddVendor} className="ml-2 shadow-lg shadow-emerald-500/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Vendor
                        </Button>
                    )}
                </div>
            </div>

            {activeTab === 'orders' ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4 overflow-x-auto">
                        {['ALL', POStatus.DRAFT, POStatus.ORDERED, POStatus.RECEIVED].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${statusFilter === status ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                {status === 'ALL' ? 'All Orders' : status}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">PO Number</th>
                                    <th className="px-6 py-4">Vendor</th>
                                    <th className="px-6 py-4">Date Ordered</th>
                                    <th className="px-6 py-4">Expected</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                    <th className="px-6 py-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredOrders.map(po => {
                                    const vendor = vendors.find(v => v.id === po.vendorId);
                                    return (
                                        <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{po.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{vendor?.name}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(po.orderDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(po.status)}</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">${po.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right flex gap-2">
                                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Print PO" onClick={(e) => { e.stopPropagation(); window.print(); }}>
                                                    <Printer className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Vendor Name</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Lead Time</th>
                                    <th className="px-6 py-4 w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredVendors.map(v => (
                                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{v.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{v.contactPerson}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{v.email}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{v.phone}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{v.leadTimeDays} days</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleOpenEditVendor(v)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteVendor(v.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create PO Modal */}
            <Modal isOpen={isPOModalOpen} onClose={() => setIsPOModalOpen(false)} title="New Purchase Order" maxWidth="4xl">
                <div className="space-y-6 p-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor</label>
                            <select
                                className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                                value={poFormData.vendorId}
                                onChange={e => setPoFormData({ ...poFormData, vendorId: e.target.value })}
                            >
                                <option value="">Select Vendor...</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Date</label>
                            <input
                                type="date"
                                className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                                value={poFormData.expectedDate}
                                onChange={e => setPoFormData({ ...poFormData, expectedDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Order Items</label>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleSmartFill} disabled={!poFormData.vendorId}>
                                    <CheckCircle className="w-3 h-3 mr-1" /> Smart Fill
                                </Button>
                                <Button size="sm" onClick={handleAddItem}>
                                    <Plus className="w-3 h-3 mr-1" /> Add Item
                                </Button>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                                    <tr>
                                        <th className="px-4 py-2">Product</th>
                                        <th className="px-4 py-2 w-24">Qty</th>
                                        <th className="px-4 py-2 w-32">Unit Cost</th>
                                        <th className="px-4 py-2 w-32 text-right">Total</th>
                                        <th className="px-4 py-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {poFormData.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="p-2">
                                                <select
                                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white"
                                                    value={item.productId}
                                                    onChange={e => handleUpdateItem(index, 'productId', e.target.value)}
                                                >
                                                    <option value="">Select Product...</option>
                                                    {products.filter(p => !poFormData.vendorId || p.supplierId === poFormData.vendorId).map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    className="w-full bg-transparent border rounded p-1 text-center"
                                                    value={item.quantity}
                                                    onChange={e => handleUpdateItem(index, 'quantity', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    className="w-full bg-transparent border rounded p-1 text-right"
                                                    value={item.cost}
                                                    onChange={e => handleUpdateItem(index, 'cost', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2 text-right font-mono">
                                                ${(item.quantity * item.cost).toFixed(2)}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button onClick={() => handleRemoveItem(index)} className="text-slate-400 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {poFormData.items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                                                No items added. Click "Add Item" or "Smart Fill".
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-slate-100 dark:bg-slate-800 font-bold">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 text-right">Total Amount:</td>
                                        <td className="px-4 py-2 text-right text-emerald-600 dark:text-emerald-400">${poTotal.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                        <textarea
                            className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 h-20"
                            value={poFormData.notes}
                            onChange={e => setPoFormData({ ...poFormData, notes: e.target.value })}
                            placeholder="Delivery instructions, payment terms, etc."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsPOModalOpen(false)}>Cancel</Button>
                    <Button onClick={handlePOSubmit} disabled={!poFormData.vendorId || poFormData.items.length === 0}>Create Purchase Order</Button>
                </div>
            </Modal>

            {/* Vendor Modal */}
            <Modal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} title={isEditingVendor ? "Edit Vendor" : "Add New Vendor"}>
                <div className="space-y-4 p-2">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                        <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={vendorFormData.name || ''} onChange={e => setVendorFormData({ ...vendorFormData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
                            <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={vendorFormData.contactPerson || ''} onChange={e => setVendorFormData({ ...vendorFormData, contactPerson: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={vendorFormData.email || ''} onChange={e => setVendorFormData({ ...vendorFormData, email: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                            <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={vendorFormData.phone || ''} onChange={e => setVendorFormData({ ...vendorFormData, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Lead Time (Days)</label>
                            <input type="number" className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={vendorFormData.leadTimeDays || ''} onChange={e => setVendorFormData({ ...vendorFormData, leadTimeDays: parseFloat(e.target.value) })} />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsVendorModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleVendorSubmit}>Save Vendor</Button>
                </div>
            </Modal>
        </div>
    );
};
