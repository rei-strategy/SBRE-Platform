import React, { useState, useContext } from 'react';
import { InventoryProduct, InventoryRecord, Warehouse } from '../../types';
import {
    Box, ArrowRightLeft, Plus, Settings, Search, Truck, Building2,
    Save, Edit2, Trash2, DollarSign, History, AlertCircle, X,
    Check, TrendingUp, Filter, Eye, EyeOff, ClipboardCheck
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { StoreContext } from '../../store';

interface StockLevelsProps {
    products: InventoryProduct[];
    records: InventoryRecord[];
    warehouses: Warehouse[];
    onUpdateStock: (record: InventoryRecord) => void;
}

export const StockLevels: React.FC<StockLevelsProps> = ({ products, records, warehouses, onUpdateStock }) => {
    const store = useContext(StoreContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isAdjustOpen, setIsAdjustOpen] = useState(false);
    const [isLocationsOpen, setIsLocationsOpen] = useState(false);
    const [auditMode, setAuditMode] = useState(false);
    const [auditCounts, setAuditCounts] = useState<Record<string, number>>({});

    // Quick Edit State
    const [quickEdit, setQuickEdit] = useState<{ productId: string, warehouseId: string, currentQty: number } | null>(null);
    const [quickEditValue, setQuickEditValue] = useState<string>('');

    // Location Management State
    const [newLocationName, setNewLocationName] = useState('');
    const [newLocationType, setNewLocationType] = useState<'WAREHOUSE' | 'VEHICLE'>('VEHICLE');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStock = (productId: string, warehouseId: string) => {
        return records.find(r => r.productId === productId && r.warehouseId === warehouseId)?.quantity || 0;
    };

    const handleAuditChange = (productId: string, warehouseId: string, value: string) => {
        const key = `${productId}-${warehouseId}`;
        setAuditCounts(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    const saveAudit = () => {
        if (!store) return;
        Object.entries(auditCounts).forEach(([key, qty]) => {
            const [productId, warehouseId] = key.split('-');
            const existingRecord = records.find(r => r.productId === productId && r.warehouseId === warehouseId);

            const newRecord: InventoryRecord = {
                id: existingRecord?.id || crypto.randomUUID(),
                productId,
                warehouseId,
                quantity: qty,
                lastUpdated: new Date().toISOString(),
                lastUpdatedBy: store.currentUser.id
            };
            onUpdateStock(newRecord);
        });
        setAuditMode(false);
        setAuditCounts({});
    };

    const handleQuickEditSave = () => {
        if (!quickEdit || !store) return;
        const newQty = parseInt(quickEditValue);
        if (isNaN(newQty)) return;

        const existingRecord = records.find(r => r.productId === quickEdit.productId && r.warehouseId === quickEdit.warehouseId);
        const newRecord: InventoryRecord = {
            id: existingRecord?.id || crypto.randomUUID(),
            productId: quickEdit.productId,
            warehouseId: quickEdit.warehouseId,
            quantity: newQty,
            lastUpdated: new Date().toISOString(),
            lastUpdatedBy: store.currentUser.id
        };
        onUpdateStock(newRecord);
        setQuickEdit(null);
    };

    const handleAddLocation = () => {
        if (!store || !newLocationName) return;
        const newWh: Warehouse = {
            id: crypto.randomUUID(),
            name: newLocationName,
            type: newLocationType
        };
        store.addWarehouse(newWh);
        setNewLocationName('');
    };

    return (
        <div className="max-w-full mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Stock Levels</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Multi-location inventory matrix.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={auditMode ? "default" : "outline"}
                        onClick={() => auditMode ? saveAudit() : setAuditMode(true)}
                        className={auditMode ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-slate-300 dark:border-slate-600"}
                    >
                        {auditMode ? <Save className="w-4 h-4 mr-2" /> : <ClipboardCheck className="w-4 h-4 mr-2" />}
                        {auditMode ? "Save Audit" : "Audit Mode"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsLocationsOpen(true)} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <Settings className="w-4 h-4 mr-2" /> Locations
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
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
                                <th className="px-4 py-4 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">Product</th>
                                <th className="px-4 py-4 text-center bg-slate-100 dark:bg-slate-900/50 border-x border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">Total</th>
                                {warehouses.map(wh => (
                                    <th key={wh.id} className="px-4 py-4 text-center min-w-[100px]">
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-slate-900 dark:text-white">{wh.name}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400">{wh.type}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredProducts.map(product => {
                                const totalStock = records.filter(r => r.productId === product.id).reduce((acc, r) => acc + r.quantity, 0);
                                return (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-4 sticky left-0 bg-white dark:bg-slate-800 z-10 border-r border-slate-100 dark:border-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            <div className="font-bold text-slate-900 dark:text-white">{product.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{product.sku}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center bg-slate-50/50 dark:bg-slate-900/20 border-r border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                                            {totalStock}
                                        </td>
                                        {warehouses.map(wh => {
                                            const qty = getStock(product.id, wh.id);
                                            const isLow = qty <= (product.minStock / warehouses.length); // Rough heuristic

                                            if (auditMode) {
                                                return (
                                                    <td key={wh.id} className="px-2 py-2 text-center border-r border-slate-100 dark:border-slate-800 last:border-0">
                                                        <input
                                                            type="number"
                                                            className="w-16 text-center border rounded p-1 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                                                            placeholder={qty.toString()}
                                                            onChange={(e) => handleAuditChange(product.id, wh.id, e.target.value)}
                                                        />
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={wh.id} className="px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800 last:border-0 group cursor-pointer" onClick={() => {
                                                    setQuickEdit({ productId: product.id, warehouseId: wh.id, currentQty: qty });
                                                    setQuickEditValue(qty.toString());
                                                }}>
                                                    <span className={`font-mono font-medium ${qty === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {qty}
                                                    </span>
                                                    <Edit2 className="w-3 h-3 inline-ml-1 opacity-0 group-hover:opacity-50 ml-1" />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Edit Modal */}
            <Modal isOpen={!!quickEdit} onClose={() => setQuickEdit(null)} title="Quick Adjust Stock">
                <div className="p-4 space-y-4">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {products.find(p => p.id === quickEdit?.productId)?.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {warehouses.find(w => w.id === quickEdit?.warehouseId)?.name}
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" onClick={() => setQuickEditValue((parseInt(quickEditValue) - 1).toString())}>-</Button>
                        <input
                            type="number"
                            className="w-24 text-center text-2xl font-bold border-b-2 border-slate-200 dark:border-slate-700 bg-transparent outline-none"
                            value={quickEditValue}
                            onChange={e => setQuickEditValue(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => setQuickEditValue((parseInt(quickEditValue) + 1).toString())}>+</Button>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setQuickEdit(null)}>Cancel</Button>
                        <Button onClick={handleQuickEditSave}>Save</Button>
                    </div>
                </div>
            </Modal>

            {/* Locations Modal */}
            <Modal isOpen={isLocationsOpen} onClose={() => setIsLocationsOpen(false)} title="Manage Locations">
                <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded-lg p-2 bg-white dark:bg-slate-800"
                            placeholder="New Location Name"
                            value={newLocationName}
                            onChange={e => setNewLocationName(e.target.value)}
                        />
                        <select
                            className="border rounded-lg p-2 bg-white dark:bg-slate-800"
                            value={newLocationType}
                            onChange={e => setNewLocationType(e.target.value as any)}
                        >
                            <option value="WAREHOUSE">Warehouse</option>
                            <option value="VEHICLE">Vehicle</option>
                        </select>
                        <Button onClick={handleAddLocation}>Add</Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {warehouses.map(wh => (
                            <div key={wh.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    {wh.type === 'VEHICLE' ? <Truck className="w-4 h-4 text-slate-400" /> : <Building2 className="w-4 h-4 text-slate-400" />}
                                    <span className="font-medium text-slate-900 dark:text-white">{wh.name}</span>
                                </div>
                                <span className="text-xs text-slate-400 uppercase">{wh.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};