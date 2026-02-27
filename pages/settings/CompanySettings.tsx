import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Copy, FileText, MapPin, Plus, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { VerificationDocument } from '../../types';

interface CompanySettingsProps {
    settings: any;
    updateSettings: (settings: any) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ settings, updateSettings }) => {
    const [coverageInput, setCoverageInput] = useState('');
    const coverageAreas: string[] = settings.coverageAreas || settings.regionalAccess || [];
    const verificationDocuments: VerificationDocument[] = settings.verificationDocuments || [];

    const copyInviteCode = () => {
        if (settings.companyCode) {
            navigator.clipboard.writeText(settings.companyCode);
            alert("Invite code copied to clipboard!");
        }
    };

    const addCoverageArea = () => {
        const normalized = coverageInput.trim();
        if (!normalized || coverageAreas.includes(normalized)) {
            setCoverageInput('');
            return;
        }
        const nextCoverage = [...coverageAreas, normalized];
        updateSettings({ coverageAreas: nextCoverage, regionalAccess: nextCoverage });
        setCoverageInput('');
    };

    const removeCoverageArea = (area: string) => {
        const nextCoverage = coverageAreas.filter((item) => item !== area);
        updateSettings({ coverageAreas: nextCoverage, regionalAccess: nextCoverage });
    };

    const readFileAsDataUrl = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });

    const uploadVerificationDocuments = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        try {
            const uploadedDocs: VerificationDocument[] = await Promise.all(
                files.map(async (file) => ({
                    id: crypto.randomUUID(),
                    name: file.name,
                    fileType: file.type || 'application/octet-stream',
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString(),
                    dataUrl: await readFileAsDataUrl(file)
                }))
            );
            const nextDocuments = [...verificationDocuments, ...uploadedDocs];
            updateSettings({
                verificationDocuments: nextDocuments,
                verifiedBusinessBadge: nextDocuments.length > 0
            });
        } catch (error) {
            console.error('Failed to upload verification documents:', error);
        } finally {
            e.target.value = '';
        }
    };

    const removeVerificationDocument = (id: string) => {
        const nextDocuments = verificationDocuments.filter((doc) => doc.id !== id);
        updateSettings({
            verificationDocuments: nextDocuments,
            verifiedBusinessBadge: nextDocuments.length > 0
        });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Company Profile</h2>

            {/* Invite Code Box */}
            <div className="bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Team Invite Code</p>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">
                        {settings.companyCode || '-------'}
                    </span>
                    <button
                        onClick={copyInviteCode}
                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-500"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Share this code with your employees to let them join your team.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                <input
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={settings.companyName}
                    onChange={(e) => updateSettings({ companyName: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Address</label>
                <input
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={settings.companyAddress}
                    onChange={(e) => updateSettings({ companyAddress: e.target.value })}
                />
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Coverage Areas</label>
                <div className="flex gap-2">
                    <input
                        className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={coverageInput}
                        onChange={(e) => setCoverageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                addCoverageArea();
                            }
                        }}
                        placeholder="City, ZIP, or region"
                    />
                    <Button type="button" variant="outline" onClick={addCoverageArea}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {coverageAreas.length === 0 ? (
                        <p className="text-xs text-slate-500">No coverage areas selected yet.</p>
                    ) : (
                        coverageAreas.map((area) => (
                            <span key={area} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <MapPin className="w-3.5 h-3.5" />
                                {area}
                                <button type="button" onClick={() => removeCoverageArea(area)} className="text-emerald-700 hover:text-emerald-900">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verification Documents</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Upload business license, insurance, or identity docs.</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${settings.verifiedBusinessBadge ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {settings.verifiedBusinessBadge ? 'Verified Badge Enabled' : 'Badge Locked'}
                    </span>
                </div>

                <label className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Documents
                    <input
                        type="file"
                        multiple
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={uploadVerificationDocuments}
                    />
                </label>

                <div className="space-y-2">
                    {verificationDocuments.length === 0 ? (
                        <p className="text-xs text-slate-500">No verification documents uploaded yet.</p>
                    ) : (
                        verificationDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{doc.name}</p>
                                    <p className="text-[11px] text-slate-500">{Math.round(doc.fileSize / 1024)} KB</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {doc.dataUrl ? (
                                        <a href={doc.dataUrl} download={doc.name} className="text-slate-500 hover:text-emerald-600" title="Download">
                                            <FileText className="w-4 h-4" />
                                        </a>
                                    ) : null}
                                    <button type="button" onClick={() => removeVerificationDocument(doc.id)} className="text-slate-500 hover:text-red-500" title="Remove">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="pt-4">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">Save Changes</Button>
            </div>
        </div>
    );
};
