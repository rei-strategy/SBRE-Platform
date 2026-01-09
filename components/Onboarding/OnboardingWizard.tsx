import React, { useState, useContext } from 'react';
import { StoreContext } from '../../store';
import { UserRole, JobTemplate } from '../../types';
import {
    Rocket, ChevronLeft, Wand2, ArrowRight,
    Users, Loader2, Clock, Briefcase, CheckCircle, Star,
    Building2, Mail, Copy, Check, Plus, Trash2, User
} from 'lucide-react';
import { Button } from '../Button';
import { INDUSTRY_OPTIONS } from '../../data/industryOptions';

const INDUSTRIES = INDUSTRY_OPTIONS.map((industry) => ({
    ...industry,
    icon: '🏠'
}));

export const OnboardingWizard: React.FC = () => {
    const store = useContext(StoreContext);

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);

    const [businessInfo, setBusinessInfo] = useState({
        companyName: store?.settings?.companyName || '',
        companyAddress: store?.settings?.companyAddress || '',
        hoursStart: '08:00',
        hoursEnd: '18:00',
        industry: ''
    });

    const [generatedTemplates, setGeneratedTemplates] = useState<JobTemplate[]>([]);

    // Invitation State
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.TECHNICIAN);
    const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [copiedCode, setCopiedCode] = useState(false);

    if (!store || !store.currentUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    const { currentUser, settings, updateSettings, completeOnboarding, addJobTemplate, inviteTeamMember, teamInvitations } = store;
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

    const handleIndustrySelect = (industryId: string) => {
        setBusinessInfo(prev => ({ ...prev, industry: industryId }));
        generateSmartTemplates(industryId);
    };

    const generateSmartTemplates = (industryId: string) => {
        let templates: JobTemplate[] = [];
        switch (industryId) {
            case 'property-management':
                templates = [
                    { id: crypto.randomUUID(), name: "Unit Turnover", description: "Vacant unit make-ready scope.", defaultPrice: 450, defaultDurationMinutes: 240, category: "Turnover" },
                    { id: crypto.randomUUID(), name: "Leasing Walkthrough", description: "Pre-leasing inspection.", defaultPrice: 125, defaultDurationMinutes: 60, category: "Inspection" }
                ];
                break;
            case 'multifamily':
                templates = [
                    { id: crypto.randomUUID(), name: "Amenity Refresh", description: "Pool, gym, and common area refresh.", defaultPrice: 750, defaultDurationMinutes: 360, category: "Amenities" },
                    { id: crypto.randomUUID(), name: "Work Order Bundle", description: "Batch maintenance for occupied units.", defaultPrice: 320, defaultDurationMinutes: 180, category: "Maintenance" }
                ];
                break;
            case 'single-family':
                templates = [
                    { id: crypto.randomUUID(), name: "Rental Turnover", description: "SFR turnover and punch list.", defaultPrice: 380, defaultDurationMinutes: 240, category: "Turnover" },
                    { id: crypto.randomUUID(), name: "Move-In Inspection", description: "Baseline inspection with photos.", defaultPrice: 150, defaultDurationMinutes: 90, category: "Inspection" }
                ];
                break;
            case 'commercial':
                templates = [
                    { id: crypto.randomUUID(), name: "Tenant Buildout Punch", description: "Punch list for tenant buildout.", defaultPrice: 980, defaultDurationMinutes: 480, category: "Project" },
                    { id: crypto.randomUUID(), name: "Preventative Maintenance", description: "Quarterly mechanical and electrical check.", defaultPrice: 420, defaultDurationMinutes: 180, category: "Maintenance" }
                ];
                break;
            case 'hoa':
                templates = [
                    { id: crypto.randomUUID(), name: "Community Grounds", description: "Common area upkeep.", defaultPrice: 260, defaultDurationMinutes: 180, category: "Grounds" },
                    { id: crypto.randomUUID(), name: "Violation Walk", description: "Compliance walk and notes.", defaultPrice: 120, defaultDurationMinutes: 90, category: "Inspection" }
                ];
                break;
            case 'construction':
                templates = [
                    { id: crypto.randomUUID(), name: "Scope Walkthrough", description: "Scope walkthrough and budget.", defaultPrice: 300, defaultDurationMinutes: 120, category: "Planning" },
                    { id: crypto.randomUUID(), name: "Draw Inspection", description: "Progress inspection for draw.", defaultPrice: 220, defaultDurationMinutes: 90, category: "Inspection" }
                ];
                break;
            default:
                templates = [
                    { id: crypto.randomUUID(), name: "Standard Service", description: "General real estate service call.", defaultPrice: 150, defaultDurationMinutes: 90, category: "General" }
                ];
        }
        setGeneratedTemplates(templates);
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
                onboardingStep: 99
            });

            for (const tmpl of generatedTemplates) {
                await addJobTemplate(tmpl);
            }

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
                    <div className="bg-emerald-500 h-1.5 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
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
                                        <input
                                            className="w-full border rounded-xl p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                                            value={businessInfo.companyAddress}
                                            onChange={e => setBusinessInfo({ ...businessInfo, companyAddress: e.target.value })}
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">Select Industry</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {INDUSTRIES.map(ind => (
                                            <button
                                                key={ind.id}
                                                onClick={() => handleIndustrySelect(ind.id)}
                                                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2
                                                ${businessInfo.industry === ind.id
                                                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100'
                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                                            >
                                                <span className="text-xl">{ind.icon}</span>
                                                <span className="text-sm font-medium">{ind.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SMART CUSTOMIZATION */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wand2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Setup</h2>
                                <p className="text-slate-500 dark:text-slate-400">Based on <strong>{INDUSTRIES.find(i => i.id === businessInfo.industry)?.label}</strong>, we've prepared these templates for you.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Recommended Services
                                </h3>
                                <div className="space-y-3">
                                    {generatedTemplates.map((tmpl, idx) => (
                                        <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{tmpl.name}</p>
                                                <p className="text-sm text-slate-500">{tmpl.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 dark:text-white">${tmpl.defaultPrice}</p>
                                                <p className="text-xs text-slate-500">{tmpl.defaultDurationMinutes} min</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: TEAM & COMPANY CODE */}
                    {step === 3 && (
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

                    {/* STEP 4: COMPLETION */}
                    {step === 4 && (
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
                    ) : <div></div>}

                    {step < 4 ? (
                        <Button onClick={handleNext} disabled={step === 1 && !businessInfo.industry}>
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
