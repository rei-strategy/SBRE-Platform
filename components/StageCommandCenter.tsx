import React, { useMemo, useState } from 'react';
import { Job, Client, User, Invoice, PipelineStage } from '../types';
import { Button } from './Button';
import { X, Phone, Mail, Clock, CheckCircle2, AlertTriangle, Play, Pause, DollarSign, Send, User as UserIcon } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

interface StageCommandCenterProps {
    isOpen: boolean;
    onClose: () => void;
    stage: PipelineStage;
    jobs: Job[];
    clients: Client[];
    users: User[];
    invoices: Invoice[];
}

export const StageCommandCenter: React.FC<StageCommandCenterProps> = ({ isOpen, onClose, stage, jobs, clients, users, invoices }) => {
    const [blitzIndex, setBlitzIndex] = useState(0);
    const [isBlitzMode, setIsBlitzMode] = useState(false);

    const relevantJobs = useMemo(() => {
        return jobs.filter(j => j.pipelineStage === stage);
    }, [jobs, stage]);

    if (!isOpen) return null;

    // --- VIEW 1: WAR ROOM (LEAD) ---
    const renderWarRoom = () => {
        const uncontactedLeads = relevantJobs; // In reality, filter by 'lastContacted'
        const currentLead = uncontactedLeads[blitzIndex];
        const client = currentLead ? clients.find(c => c.id === currentLead.clientId) : null;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="bg-blue-600 p-2 rounded-lg"><Phone className="w-5 h-5 text-white" /></span>
                            The War Room
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Blitz through your uncontacted leads.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-sm">{blitzIndex + 1} / {uncontactedLeads.length}</span>
                        <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700" onClick={() => setBlitzIndex(Math.max(0, blitzIndex - 1))}>Prev</Button>
                        <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => setBlitzIndex(Math.min(uncontactedLeads.length - 1, blitzIndex + 1))}>Next</Button>
                    </div>
                </div>

                {currentLead && client ? (
                    <div className="bg-slate-800 rounded-xl p-8 border border-slate-600 shadow-2xl flex flex-col items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-blue-900/50 rounded-full flex items-center justify-center border-2 border-blue-500 text-blue-400">
                            <UserIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">{client.firstName} {client.lastName}</h3>
                            <p className="text-slate-400 text-lg mt-1">{currentLead.title} • {client.properties[0].city}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/20" onClick={() => alert('Mock: Dialing...')}>
                                <Phone className="w-5 h-5" /> Call Now
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold text-lg transition-all border border-slate-600" onClick={() => alert('Mock: Opening SMS...')}>
                                <Mail className="w-5 h-5" /> Text
                            </button>
                        </div>
                        <div className="w-full bg-slate-900/50 p-4 rounded-lg text-left">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Lead Notes</p>
                            <p className="text-slate-300 text-sm italic">"{currentLead.description || 'No notes provided.'}"</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">No leads found directly in this stage.</div>
                )}
            </div>
        );
    };

    // --- VIEW 2: DEAL CLOSER (ESTIMATE_SENT) ---
    const renderDealCloser = () => {
        // Sort by 'staleness' (mock: random for now, or assume oldest first)
        const staleEstimates = [...relevantJobs].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        return (
            <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="bg-sky-600 p-2 rounded-lg"><Send className="w-5 h-5 text-white" /></span>
                        The Deal Closer
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Review and nudge stale estimates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {staleEstimates.map(job => {
                        const client = clients.find(c => c.id === job.clientId);
                        const daysOpen = differenceInDays(new Date(), parseISO(job.start)); // Proxy for created date

                        return (
                            <div key={job.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-sky-500/50 transition-colors flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{client?.firstName} {client?.lastName}</h4>
                                        <p className="text-sky-400 text-sm font-medium">{job.title}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${daysOpen > 7 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
                                        {daysOpen} days old
                                    </span>
                                </div>
                                <div className="mt-auto grid grid-cols-2 gap-2">
                                    <button className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 py-2 rounded-lg text-sm font-bold transition-colors border border-sky-600/30" onClick={() => alert(`Nudging ${client?.firstName}...`)}>
                                        👋 Nudge
                                    </button>
                                    <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm font-bold transition-colors" onClick={() => alert('Resending email...')}>
                                        📧 Resend
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- VIEW 3: LIVE OPS (IN_PROGRESS) ---
    const renderLiveOps = () => {
        // Mock tech status
        const techStatuses = users.filter(u => u.role === 'TECHNICIAN').map(t => ({
            ...t,
            status: Math.random() > 0.3 ? 'WORKING' : (Math.random() > 0.5 ? 'DRIVING' : 'IDLE'),
            currentJob: relevantJobs.find(j => j.assignedTechIds.includes(t.id))
        }));

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="bg-orange-600 p-2 rounded-lg"><Clock className="w-5 h-5 text-white" /></span>
                            Live Ops View
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Real-time technician tracking.</p>
                    </div>
                    <Button variant="danger" className="bg-red-600 border-none hover:bg-red-700" onClick={() => alert('Broadcasting SOS...')}>
                        📢 SOS Broadcast
                    </Button>
                </div>

                <div className="space-y-3">
                    {techStatuses.map(tech => (
                        <div key={tech.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                            <div className="relative">
                                <img src={tech.avatarUrl || `https://ui-avatars.com/api/?name=${tech.name}`} className="w-12 h-12 rounded-full border-2 border-slate-600" />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${tech.status === 'WORKING' ? 'bg-emerald-500' :
                                    tech.status === 'DRIVING' ? 'bg-blue-500' : 'bg-red-500'
                                    }`} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{tech.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${tech.status === 'WORKING' ? 'bg-emerald-500/20 text-emerald-400' :
                                        tech.status === 'DRIVING' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {tech.status}
                                    </span>
                                    {tech.currentJob && <span className="text-xs text-slate-400 truncate">• {tech.currentJob.title}</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white" title="Call"><Phone className="w-4 h-4" /></button>
                                <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white" title="Message"><Mail className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    };

    // --- VIEW 4: CASH COLLECTOR (INVOICED) ---
    const renderCashCollector = () => {
        // Filter for UNPAID/OVERDUE invoices
        const pendingInvoices = invoices.filter(i => i.status !== 'PAID');

        const buckets = {
            '0-7 Days': pendingInvoices.filter(i => differenceInDays(new Date(), parseISO(i.issueDate)) <= 7),
            '7-30 Days': pendingInvoices.filter(i => {
                const age = differenceInDays(new Date(), parseISO(i.issueDate));
                return age > 7 && age <= 30;
            }),
            '30+ Days': pendingInvoices.filter(i => differenceInDays(new Date(), parseISO(i.issueDate)) > 30),
        };

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="bg-rose-600 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-white" /></span>
                            The Cash Collector
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Manage accounts receivable.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(buckets).map(([bucketName, invs]) => (
                        <div key={bucketName} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                            <div className={`text-sm font-bold uppercase tracking-wider mb-3 ${bucketName === '30+ Days' ? 'text-red-400' : bucketName === '7-30 Days' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {bucketName}
                            </div>
                            <div className="text-3xl font-bold text-white mb-4">
                                ${invs.reduce((sum, i) => sum + i.total, 0).toLocaleString()}
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {invs.length === 0 && <p className="text-slate-500 text-xs italic">All good here.</p>}
                                {invs.map(inv => {
                                    const client = clients.find(c => c.id === inv.clientId);
                                    return (
                                        <div key={inv.id} className="bg-slate-900/50 p-2 rounded border border-slate-700/50 flex justify-between items-center">
                                            <div className="truncate pr-2">
                                                <div className="text-sm text-slate-300 font-medium truncate">{client?.firstName} {client?.lastName}</div>
                                                <div className="text-[10px] text-slate-500">#{inv.id.slice(0, 6)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">${inv.total}</div>
                                                <button className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase" onClick={() => alert('Reminding...')}>Remind</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {invs.length > 0 && (
                                <button className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded transition-colors" onClick={() => alert(`Reminding all in ${bucketName}`)}>
                                    Remind All
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    };

    // --- VIEW 5: THE AUTOPSY ROOM (CANCELLED) ---
    const renderAutopsyRoom = () => {
        const cancelledJobs = jobs.filter(j => j.status === 'CANCELLED');

        // Calculate "Why" Stats
        const reasonCounts = cancelledJobs.reduce((acc, job) => {
            const reason = job.cancellationReason || 'Unknown';
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalCancelled = cancelledJobs.length;

        const reasons = Object.entries(reasonCounts)
            .map(([label, count]) => ({
                label,
                value: totalCancelled > 0 ? Math.round((count / totalCancelled) * 100) : 0,
                color: label === 'Too Expensive' ? 'text-rose-500' :
                    label === 'Competitor' ? 'text-blue-500' :
                        label === 'Scheduling Issue' ? 'text-amber-500' : 'text-slate-500',
                bg: label === 'Too Expensive' ? 'bg-rose-500' :
                    label === 'Competitor' ? 'bg-blue-500' :
                        label === 'Scheduling Issue' ? 'bg-amber-500' : 'bg-slate-500',
                count
            }))
            .sort((a, b) => b.value - a.value);

        // Calculate Competitor Intel
        const competitorJobs = cancelledJobs
            .filter(j => j.cancellationReason === 'Competitor')
            .map(j => ({
                name: j.competitorName || (j.cancellationNote ? (j.cancellationNote.length > 15 ? j.cancellationNote.substring(0, 15) + '...' : j.cancellationNote) : 'Unknown'),
                location: [j.competitorCity, j.competitorState].filter(Boolean).join(', ') || 'Unknown Area',
                type: j.competitorType || 'Unknown Type',
                lost: 1,
                lastLost: differenceInDays(new Date(), parseISO(j.start || new Date().toISOString())) + ' days ago',
                fullNote: j.cancellationNote
            }));


        // Simple SVG Pie Chart Calculation
        let cumulativePercent = 0;
        const coordinates = reasons.map(r => {
            const startX = Math.cos(2 * Math.PI * (cumulativePercent / 100));
            const startY = Math.sin(2 * Math.PI * (cumulativePercent / 100));
            cumulativePercent += r.value;
            const endX = Math.cos(2 * Math.PI * (cumulativePercent / 100));
            const endY = Math.sin(2 * Math.PI * (cumulativePercent / 100));
            const largeArcFlag = r.value > 50 ? 1 : 0;
            const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
            return { path: pathData, color: r.bg };
        });

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="bg-slate-700 p-2 rounded-lg"><AlertTriangle className="w-5 h-5 text-white" /></span>
                            The Autopsy Room
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Analyze lost revenue and learn from defeats.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* The "Why" Pie Chart */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-white mb-6 w-full px-2">Why We Lost</h3>
                        <div className="flex items-center gap-8 w-full justify-center">
                            <div className="relative w-48 h-48">
                                <svg viewBox="-1.1 -1.1 2.2 2.2" className="transform -rotate-90 w-full h-full drop-shadow-xl">
                                    {coordinates.map((slice, i) => (
                                        <path key={i} d={slice.path} className={`${reasons[i].color.replace('text', 'fill')} hover:opacity-90 transition-opacity cursor-pointer`} />
                                    ))}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {reasons.map(r => (
                                    <div key={r.label} className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${r.bg}`}></div>
                                        <div className="text-sm font-medium text-slate-300">{r.label}</div>
                                        <div className="text-xs font-bold text-slate-500">{r.value}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Competitor Intel Log */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4">Competitor Intel Log</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {competitorJobs.length === 0 && <p className="text-slate-500 text-sm italic">No competitor losses recorded yet.</p>}
                            {competitorJobs.map((comp, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-700 w-8 h-8 rounded flex items-center justify-center font-bold text-white text-xs">#{i + 1}</div>
                                        <div className="overflow-hidden">
                                            <div className="font-bold text-white text-sm truncate" title={comp.fullNote}>{comp.name}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                {comp.type !== 'Unknown Type' && <span className="bg-slate-700 px-1.5 rounded">{comp.type}</span>}
                                                <span>{comp.location}</span>
                                                <span>•</span>
                                                <span>{comp.lastLost}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-rose-400 font-bold text-xs">Lost Deal</div>
                                        <button className="text-[10px] text-slate-400 hover:text-white underline mt-1" onClick={() => alert(comp.fullNote)}>View Note</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    let content = null;
    switch (stage) {
        case 'LEAD': content = renderWarRoom(); break;
        case 'ESTIMATE_SENT': content = renderDealCloser(); break;
        case 'IN_PROGRESS': content = renderLiveOps(); break;
        case 'INVOICED': content = renderCashCollector(); break;
        case 'CANCELLED': content = renderAutopsyRoom(); break;
        default: return null; // Shouldn't happen if logic in parent is correct
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl relative border border-slate-700 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {content}
                </div>
            </div>
        </div>
    );
};
