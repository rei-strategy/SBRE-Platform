import React, { useState } from 'react';
import { InventoryProduct, Vendor } from '../../types';
import { Package, Search, Plus, Filter, MoreHorizontal, Barcode, Edit2, Trash2, Image as ImageIcon, Truck, CheckSquare, Square } from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

interface ProductsProps {
    products: InventoryProduct[];
    vendors: Vendor[];
    onAddProduct: (product: InventoryProduct) => void;
    onUpdateProduct: (product: InventoryProduct) => Promise<void>;
    onDeleteProduct: (id: string) => Promise<{ error: any }>;
}

export const Products: React.FC<ProductsProps> = ({ products, vendors, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState<Partial<InventoryProduct>>({
        trackSerial: false,
        minStock: 5
    });
    const [isEditing, setIsEditing] = useState(false);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setFormData({ trackSerial: false, minStock: 5 });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: InventoryProduct) => {
        setFormData(product);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await onDeleteProduct(id);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Delete ${selectedIds.size} products?`)) {
            for (const id of selectedIds) {
                await onDeleteProduct(id);
            }
            setSelectedIds(new Set());
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.sku) return;

        const productData: InventoryProduct = {
            id: formData.id || crypto.randomUUID(),
            sku: formData.sku!,
            name: formData.name!,
            category: formData.category || 'General',
            brand: formData.brand || '',
            description: formData.description || '',
            unit: formData.unit || 'Each',
            cost: Number(formData.cost) || 0,
            price: Number(formData.price) || 0,
            minStock: Number(formData.minStock) || 0,
            trackSerial: formData.trackSerial || false,
            supplierId: formData.supplierId,
            image: formData.image,
            barcode: formData.barcode
        };

        if (isEditing) {
            await onUpdateProduct(productData);
        } else {
            onAddProduct(productData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Product Master Data</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage SKUs, pricing, and item details.</p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete ({selectedIds.size})
                        </Button>
                    )}
                    <Button onClick={handleOpenCreate} className="shadow-lg shadow-emerald-500/20">
                        <Plus className="w-4 h-4 mr-2" /> New Product
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
                                <th className="px-4 py-4 w-10">
                                    <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600">
                                        {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                    </button>
                                </th>
                                <th className="px-4 py-4">Product</th>
                                <th className="px-4 py-4">Category</th>
                                <th className="px-4 py-4">Supplier</th>
                                <th className="px-4 py-4 text-right">Cost</th>
                                <th className="px-4 py-4 text-right">Price</th>
                                <th className="px-4 py-4 text-center">Min Stock</th>
                                <th className="px-4 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredProducts.map(product => {
                                const vendor = vendors.find(v => v.id === product.supplierId);
                                return (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <td className="px-4 py-4">
                                            <button onClick={() => toggleSelection(product.id)} className={`text-slate-400 hover:text-slate-600 ${selectedIds.has(product.id) ? 'text-emerald-500' : ''}`}>
                                                {selectedIds.has(product.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">{product.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        {product.sku}
                                                        {product.barcode && <Barcode className="w-3 h-3 ml-1 opacity-50" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{product.category}</td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                                            {vendor ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Truck className="w-3 h-3 opacity-50" />
                                                    {vendor.name}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-right font-mono text-slate-600 dark:text-slate-400">${product.cost.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-right font-mono font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-bold">
                                                {product.minStock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenEdit(product)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Product" : "Add New Product"} footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>{isEditing ? "Update Product" : "Save Product"}</Button></>}>
                <div className="space-y-4 p-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                            <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Microfiber Towel" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                            <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="MF-001" />
                        </div>
                    </div>

                    {/* New Fields: Image & Barcode */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input className="w-full pl-9 border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Barcode</label>
                            <div className="relative">
                                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input className="w-full pl-9 border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.barcode || ''} onChange={e => setFormData({ ...formData, barcode: e.target.value })} placeholder="Scan..." />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <input className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Cleaning" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
                            <select
                                className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                value={formData.supplierId || ''}
                                onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                            >
                                <option value="">Select Supplier...</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cost ($)</label>
                            <input type="number" className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.cost || ''} onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                            <input type="number" className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Stock</label>
                            <input type="number" className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.minStock || ''} onChange={e => setFormData({ ...formData, minStock: parseFloat(e.target.value) })} />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};