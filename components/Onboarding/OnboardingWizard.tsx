import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../store';
import { UserRole, VerificationDocument } from '../../types';
import {
    Rocket, ChevronLeft, ArrowRight,
    Users, Loader2,
    Mail, Copy, Check, Plus, User, MapPin, Upload, X, ShieldCheck
} from 'lucide-react';
import { Button } from '../Button';
import { AddressAutocomplete, AddressSuggestion } from '../AddressAutocomplete';

const VENDOR_CATEGORY_GROUPS = [
    {
        label: 'Maintain & Fix',
        options: ['Contractors', 'Construction & Design Services', 'Property Managers', 'Cleaning Crews']
    },
    {
        label: 'Improve & Upgrade',
        options: ['Construction & Design Services', 'Geotechnical Services', 'Solar Installers', 'Landscapers']
    },
    {
        label: 'Buy & Sell',
        options: ['Geotechnical Services', 'Realtors', 'Inspectors', 'Photographers', 'Stagers']
    },
    {
        label: 'Finance & Structure',
        options: ['Lenders', 'Appraisers']
    },
    {
        label: 'Move & Logistics',
        options: ['Logistics & FF&E']
    }
];

export const OnboardingWizard: React.FC = () => {
    const store = useContext(StoreContext);

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [businessInfo, setBusinessInfo] = useState({
        companyName: store?.settings?.companyName || '',
        companyAddress: store?.settings?.companyAddress || '',
        hoursStart: '08:00',
        hoursEnd: '18:00',
        industry: '',
        serviceCategories: [] as string[],
        coverageAreas: store?.settings?.coverageAreas || store?.settings?.regionalAccess || [],
        verificationDocuments: (store?.settings?.verificationDocuments || []) as VerificationDocument[]
    });
    const [selectedVendorGroup, setSelectedVendorGroup] = useState('');
    const [coverageInput, setCoverageInput] = useState('');

        // Invitation State
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.TECHNICIAN);
    const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [copiedCode, setCopiedCode] = useState(false);

    if (!store || !store.currentUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    const { currentUser, settings, updateSettings, completeOnboarding, inviteTeamMember, teamInvitations } = store;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to the Team!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        You've joined <strong>{settings?.companyName || 'your company'}</strong>.
                    </p>
                    <Button onClick={() => completeOnboarding()} className="w-full h-12 text-lg">Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => Math.max(1, prev - 1));

    useEffect(() => {
        const pendingCoverage = localStorage.getItem('pendingVendorCoverageAreas');
        if (!pendingCoverage) return;
        try {
            const parsed = JSON.parse(pendingCoverage) as string[];
            if (Array.isArray(parsed) && parsed.length > 0) {
                setBusinessInfo((prev) => ({
                    ...prev,
                    coverageAreas: Array.from(new Set([...prev.coverageAreas, ...parsed]))
                }));
            }
        } catch (error) {
            console.error('Failed to parse pending coverage areas:', error);
        } finally {
            localStorage.removeItem('pendingVendorCoverageAreas');
        }
    }, []);

    const handleIndustrySelect = (category: string) => {
        setBusinessInfo(prev => {
            const exists = prev.serviceCategories.includes(category);
            const nextCategories = exists
                ? prev.serviceCategories.filter(item => item !== category)
                : [...prev.serviceCategories, category];
            return { ...prev, serviceCategories: nextCategories };
        });
    };

    const handleAddCoverageArea = () => {
        const normalized = coverageInput.trim();
        if (!normalized) return;
        if (businessInfo.coverageAreas.includes(normalized)) {
            setCoverageInput('');
            return;
        }
        setBusinessInfo((prev) => ({ ...prev, coverageAreas: [...prev.coverageAreas, normalized] }));
        setCoverageInput('');
    };

    const handleRemoveCoverageArea = (area: string) => {
        setBusinessInfo((prev) => ({
            ...prev,
            coverageAreas: prev.coverageAreas.filter((item) => item !== area)
        }));
    };

    const readFileAsDataUrl = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });

    const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            const uploaded = await Promise.all(
                files.map(async (file) => ({
                    id: crypto.randomUUID(),
                    name: file.name,
                    fileType: file.type || 'application/octet-stream',
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString(),
                    dataUrl: await readFileAsDataUrl(file)
                }))
            );
            setBusinessInfo((prev) => ({
                ...prev,
                verificationDocuments: [...prev.verificationDocuments, ...uploaded]
            }));
        } catch (error) {
            console.error('Failed to upload verification documents:', error);
        } finally {
            e.target.value = '';
        }
    };

    const handleRemoveVerificationDoc = (id: string) => {
        setBusinessInfo((prev) => ({
            ...prev,
            verificationDocuments: prev.verificationDocuments.filter((doc) => doc.id !== id)
        }));
    };

    const handleInvite = async () => {
        if (!inviteEmail || !inviteName) return;
        setInviteStatus('sending');
        await inviteTeamMember(inviteEmail, inviteName, inviteRole);
        setInviteStatus('sent');
        setTimeout(() => {
            setInviteEmail('');
            setInviteName('');
            setInviteRole(UserRole.TECHNICIAN);
            setInviteStatus('idle');
        }, 1000);
    };

    const copyCode = () => {
        if (settings?.companyCode) {
            navigator.clipboard.writeText(settings.companyCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        try {
            await updateSettings({
                companyName: businessInfo.companyName,
                companyAddress: businessInfo.companyAddress,
                businessHoursStart: businessInfo.hoursStart,
                businessHoursEnd: businessInfo.hoursEnd,
                industry: businessInfo.industry,
                serviceCategories: businessInfo.serviceCategories,
                coverageAreas: businessInfo.coverageAreas,
                regionalAccess: businessInfo.coverageAreas,
                verificationDocuments: businessInfo.verificationDocuments,
                verifiedBusinessBadge: businessInfo.verificationDocuments.length > 0,
                onboardingStep: 99
            });

            await completeOnboarding();
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[85vh]">

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5">
                    <div className="bg-emerald-500 h-1.5 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">

                    {/* STEP 1: COMPANY INFO & INDUSTRY */}
                    {step === 1 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Tell us about your business</h1>
                                <p className="text-slate-500 dark:text-slate-400">We'll tailor your experience based on your industry.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Company Name</label>
                                        <input
                                            className="w-full border rounded-xl p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                                            value={businessInfo.companyName}
                                            onChange={e => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
                                            placeholder="e.g. Acme Services"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Location</label>
                                        <AddressAutocomplete
                                            value={businessInfo.companyAddress}
                                            onChange={(value) => setBusinessInfo({ ...businessInfo, companyAddress: value })}
                                            onSelect={(suggestion: AddressSuggestion) => {
                                                setBusinessInfo({
                                                    ...businessInfo,
                                                    companyAddress: suggestion.label
                                                });
                                            }}
                                            inputClassName="w-full border rounded-xl p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                                            placeholder="City, State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Coverage Areas</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                className="flex-1 border rounded-xl p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                                                value={coverageInput}
                                                onChange={(e) => setCoverageInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ',') {
                                                        e.preventDefault();
                                                        handleAddCoverageArea();
                                                    }
                                                }}
                                                placeholder="Add city, ZIP, or region"
                                            />
                                            <Button type="button" onClick={handleAddCoverageArea} className="shrink-0">
                                                <MapPin className="w-4 h-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {businessInfo.coverageAreas.length === 0 ? (
                                                <span className="text-xs text-slate-500">No coverage areas added yet.</span>
                                            ) : (
                                                businessInfo.coverageAreas.map((area) => (
                                                    <span key={area} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold">
                                                        {area}
                                                        <button type="button" onClick={() => handleRemoveCoverageArea(area)} className="text-emerald-600 hover:text-emerald-800">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">Service Categories</label>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Parent Category</label>
                                            <select
                                                value={selectedVendorGroup}
                                                onChange={(e) => {
                                                    setSelectedVendorGroup(e.target.value);
                                                    setBusinessInfo(prev => ({
                                                        ...prev,
                                                        industry: e.target.value,
                                                        serviceCategories: []
                                                    }));
                                                }}
                                                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            >
                                                <option value="">Select a category group</option>
                                                {VENDOR_CATEGORY_GROUPS.map(group => (
                                                    <option key={group.label} value={group.label}>{group.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Child Categories (multi-select)</label>
                                            <div className={`mt-2 space-y-2 max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl p-3 ${!selectedVendorGroup ? 'opacity-60 pointer-events-none' : ''}`}>
                                                {(VENDOR_CATEGORY_GROUPS.find(group => group.label === selectedVendorGroup)?.options || []).map(option => {
                                                    const selected = businessInfo.serviceCategories.includes(option);
                                                    return (
                                                        <label key={option} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                            <input
                                                                type="checkbox"
                                                                checked={selected}
                                                                onChange={() => handleIndustrySelect(option)}
                                                            />
                                                            {option}
                                                        </label>
                                                    );
                                                })}
                                                {!selectedVendorGroup && (
                                                    <div className="text-xs text-slate-500">Select a parent category to see options.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">Verification Documents</div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Upload license, insurance, or tax docs to enable a verified business badge.</p>
                                            </div>
                                            <ShieldCheck className={`w-5 h-5 ${businessInfo.verificationDocuments.length > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        </div>
                                        <label className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            Upload files
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,image/*"
                                                className="hidden"
                                                onChange={handleVerificationUpload}
                                            />
                                        </label>
                                        <div className="mt-3 space-y-2">
                                            {businessInfo.verificationDocuments.length === 0 ? (
                                                <p className="text-xs text-slate-500">No documents uploaded yet.</p>
                                            ) : (
                                                businessInfo.verificationDocuments.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800">
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{doc.name}</p>
                                                            <p className="text-[11px] text-slate-500">{Math.round(doc.fileSize / 1024)} KB</p>
                                                        </div>
                                                        <button type="button" onClick={() => handleRemoveVerificationDoc(doc.id)} className="text-slate-400 hover:text-red-500">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TEAM & COMPANY CODE */}
                    {step === 2 && (
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Grow your Team</h2>
                                <p className="text-slate-500 dark:text-slate-400">Invite technicians or share your unique company code.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* LEFT: Invite Form */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Send Invitation
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Name</label>
                                                <input
                                                    className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 dark:border-slate-600 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                                    placeholder="John Doe"
                                                    value={inviteName}
                                                    onChange={e => setInviteName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Email</label>
                                                <input
                                                    className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 dark:border-slate-600 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                                    placeholder="john@example.com"
                                                    value={inviteEmail}
                                                    onChange={e => setInviteEmail(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Role</label>
                                                <select
                                                    className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 dark:border-slate-600 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                                    value={inviteRole}
                                                    onChange={e => setInviteRole(e.target.value as UserRole)}
                                                >
                                                    <option value={UserRole.TECHNICIAN}>Technician</option>
                                                    <option value={UserRole.OFFICE}>Office Staff</option>
                                                    <option value={UserRole.ASSISTANT}>Assistant</option>
                                                    <option value={UserRole.MARKETING}>Marketing Only</option>
                                                    <option value={UserRole.ADMIN}>Admin</option>
                                                </select>
                                            </div>
                                            <Button
                                                onClick={handleInvite}
                                                disabled={!inviteEmail || !inviteName || inviteStatus !== 'idle'}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                                            >
                                                {inviteStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Add to Team</>}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Company Code Card */}
                                    <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-24 bg-purple-500/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
                                        <div className="relative z-10">
                                            <p className="text-purple-200 font-medium mb-2 uppercase tracking-wider text-xs">Company Code</p>
                                            <div className="flex items-center justify-between gap-4 bg-white/10 p-3 rounded-lg">
                                                <span className="font-mono font-bold tracking-widest text-xl">{settings?.companyCode || '-------'}</span>
                                                <button onClick={copyCode} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                                    {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-white" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Pending List */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[300px]">
                                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Pending Invites
                                            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">
                                                {teamInvitations.length}
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                        {teamInvitations.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                                <User className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="text-sm">No pending invites.</p>
                                                <p className="text-xs opacity-70">Add team members to see them here.</p>
                                            </div>
                                        ) : (
                                            teamInvitations.map((invite) => (
                                                <div key={invite.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                                                            {invite.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{invite.name}</p>
                                                            <p className="text-xs text-slate-500">{invite.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{invite.role}</span>
                                                        <span className="text-xs text-amber-500 font-medium">{invite.status}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: COMPLETION */}
                    {step === 3 && (
                        <div className="max-w-lg mx-auto text-center pt-10">
                            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <Rocket className="w-12 h-12" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">You're all set!</h1>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                                Your workspace is ready. Let's start managing your jobs and team.
                            </p>

                            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 text-left">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Next Steps:</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">1</div>
                                        Create your first job
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</div>
                                        Add your customers
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">3</div>
                                        Download the mobile app
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>

                {/* Navigation Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                    {step > 1 ? (
                        <button onClick={handleBack} className="flex items-center text-slate-500 font-bold px-4 py-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={async () => {
                                await store.logout();
                                window.location.href = `${window.location.origin}/#/`;
                            }}
                            className="flex items-center text-slate-500 font-bold px-4 py-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext} disabled={step === 1 && businessInfo.serviceCategories.length === 0}>
                            Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleFinish} size="lg" className="shadow-xl shadow-emerald-500/20 w-full md:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Go to Dashboard 🚀'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
