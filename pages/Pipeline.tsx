
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Job, Client, User, PipelineStage, Invoice } from '../types';
import {
  DollarSign, Calendar, User as UserIcon, Clock, AlertCircle,
  CheckCircle2, FileText, PauseCircle, ChevronRight, ZoomIn, ZoomOut,
  Flame, Snowflake, Sun, Zap, Send, MousePointerClick, Phone, MoreHorizontal, CloudRain, Smile, Frown, Gem, CalendarPlus, Ban
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInDays, differenceInHours, parseISO } from 'date-fns';
import { StageCommandCenter } from '../components/StageCommandCenter';
import { StoreContext } from '../store';

interface PipelineProps {
  jobs: Job[];
  clients: Client[];
  users: User[];
  invoices: Invoice[]; // Added invoices prop
  onUpdateStage: (jobId: string, stage: PipelineStage) => void;
}

// Temperature Configuration
// Gradient: Blue (Cold) -> Yellow (Warm) -> Orange (Hot) -> Red (Urgent) -> Green (Done)
const STAGES: {
  id: PipelineStage;
  label: string;
  containerClass: string;
  headerClass: string;
  accentClass: string;
  icon: React.ReactNode;
}[] = [
    {
      id: 'LEAD',
      label: 'Lead',
      containerClass: 'bg-blue-50/50 border-blue-100',
      headerClass: 'bg-blue-100 text-blue-700',
      accentClass: 'border-l-blue-500',
      icon: <Snowflake className="w-3 h-3 text-blue-400" />
    },
    {
      id: 'ESTIMATE_SENT',
      label: 'Estimate Sent',
      containerClass: 'bg-sky-50/50 border-sky-100',
      headerClass: 'bg-sky-100 text-sky-700',
      accentClass: 'border-l-sky-500',
      icon: <FileText className="w-3 h-3 text-sky-500" />
    },
    {
      id: 'APPROVED',
      label: 'Approved',
      containerClass: 'bg-cyan-50/50 border-cyan-100',
      headerClass: 'bg-cyan-100 text-cyan-700',
      accentClass: 'border-l-cyan-500',
      icon: <CheckCircle2 className="w-3 h-3 text-cyan-500" />
    },
    {
      id: 'SCHEDULED',
      label: 'Scheduled',
      containerClass: 'bg-yellow-50/50 border-yellow-100',
      headerClass: 'bg-yellow-100 text-yellow-700',
      accentClass: 'border-l-yellow-500',
      icon: <Calendar className="w-3 h-3 text-yellow-600" />
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      containerClass: 'bg-orange-50/50 border-orange-100',
      headerClass: 'bg-orange-100 text-orange-700',
      accentClass: 'border-l-orange-500',
      icon: <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
    },
    {
      id: 'COMPLETED',
      label: 'Completed',
      containerClass: 'bg-red-50/50 border-red-100',
      headerClass: 'bg-red-100 text-red-700',
      accentClass: 'border-l-red-500',
      icon: <Zap className="w-3 h-3 text-red-500 fill-red-500" />
    },
    {
      id: 'INVOICED',
      label: 'Invoiced',
      containerClass: 'bg-rose-50/50 border-rose-100',
      headerClass: 'bg-rose-100 text-rose-700',
      accentClass: 'border-l-rose-500',
      icon: <DollarSign className="w-3 h-3 text-rose-500" />
    },
    {
      id: 'PAID',
      label: 'Paid',
      containerClass: 'bg-emerald-50/50 border-emerald-100',
      headerClass: 'bg-emerald-100 text-emerald-700',
      accentClass: 'border-l-emerald-500',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />
    },
    {
      id: 'CANCELLED',
      label: 'Cancelled',
      containerClass: 'bg-slate-50/50 border-slate-100',
      headerClass: 'bg-slate-100 text-slate-700', // Grey/Reddish could also work, using slate for neutral cancelled
      accentClass: 'border-l-slate-400',
      icon: <AlertCircle className="w-3 h-3 text-slate-400" />
    },
    {
      id: 'ON_HOLD',
      label: 'On Hold',
      containerClass: 'bg-slate-100/50 border-slate-200',
      headerClass: 'bg-slate-200 text-slate-700',
      accentClass: 'border-l-slate-500',
      icon: <PauseCircle className="w-3 h-3 text-slate-500" />
    },
  ];

// Helper to calculate distance between two points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat1)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export const Pipeline: React.FC<PipelineProps> = ({ jobs, clients, users, invoices, onUpdateStage }) => {
  const store = useContext(StoreContext);
  const [draggingJobId, setDraggingJobId] = useState<string | null>(null);
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [commandCenterStage, setCommandCenterStage] = useState<PipelineStage | null>(null);

  // Initialize zoom level from local storage or default to 1
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem('pipelineZoomLevel');
    return saved ? parseFloat(saved) : 1;
  });

  // Persist zoom level to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('pipelineZoomLevel', zoomLevel.toString());
  }, [zoomLevel]);

  // Group jobs by stage
  const columns = useMemo(() => {
    const grouped: Record<string, Job[]> = {};
    STAGES.forEach(stage => grouped[stage.id] = []);
    jobs.forEach(job => {
      const stage = job.pipelineStage || 'LEAD';
      if (grouped[stage]) grouped[stage].push(job);
      else grouped['LEAD'].push(job); // Fallback
    });
    return grouped;
  }, [jobs]);

  const stageMap: Partial<Record<PipelineStage, string>> = {
    LEAD: 'inquiry',
    ESTIMATE_SENT: 'quote',
    APPROVED: 'qualified',
    SCHEDULED: 'work-order',
    IN_PROGRESS: 'work-order',
    COMPLETED: 'completion',
    INVOICED: 'review',
    PAID: 'review',
  };

  const pipelineConfig = useMemo(() => {
    if (!store) return null;
    const industryId = store.settings?.industry;
    return (
      store.crmPipelineConfigs.find((config) => config.industryId === industryId) ||
      store.crmPipelineConfigs[0] ||
      null
    );
  }, [store]);

  const getStageMeta = (stageId: PipelineStage) => {
    if (!pipelineConfig) return null;
    const crmStageId = stageMap[stageId];
    if (!crmStageId) return null;
    return pipelineConfig.stages.find((stage) => stage.id === crmStageId) || null;
  };

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingJobId(jobId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: PipelineStage | 'SNOOZE' | 'RESCHEDULE' | 'BLAST') => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId) {
      if (stageId === 'SNOOZE' || stageId === 'RESCHEDULE' || stageId === 'BLAST') {
        // Placeholder for Drop Zone Actions
        alert(`Action triggered: ${stageId} for job ${jobId}`);
      } else {
        onUpdateStage(jobId, stageId as PipelineStage);
      }
    }
    setDraggingJobId(null);
  };

  // Zoom Logic
  const BASE_WIDTH = 300;
  const columnWidth = Math.round(BASE_WIDTH * zoomLevel);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  const stepZoom = (delta: number) => {
    setZoomLevel(prev => {
      const next = prev + delta;
      return Math.min(Math.max(next, 0.5), 1.5);
    });
  };

  const getWeightedValue = (stageId: string, total: number) => {
    const weights: Record<string, number> = {
      'LEAD': 0.1, 'ESTIMATE_SENT': 0.4, 'APPROVED': 0.9, 'SCHEDULED': 1.0,
      'IN_PROGRESS': 1.0, 'COMPLETED': 1.0, 'INVOICED': 1.0, 'PAID': 1.0
    };
    return total * (weights[stageId] || 0);
  };

  const getRottingStyle = (job: Job) => {
    if (!job.lastStageChange) return '';
    const days = differenceInDays(new Date(), parseISO(job.lastStageChange));
    if (days > 7) return 'opacity-80 border-slate-300 border-dashed'; // Rotting
    return '';
  };

  const getSmartAction = (stageId: PipelineStage) => {
    switch (stageId) {
      case 'LEAD': return { icon: <Phone className="w-3 h-3" />, label: 'Call' };
      case 'ESTIMATE_SENT': return { icon: <Send className="w-3 h-3" />, label: 'Resend' };
      case 'APPROVED': return { icon: <Calendar className="w-3 h-3" />, label: 'Schedule' };
      case 'SCHEDULED': return { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Confirm' };
      case 'IN_PROGRESS': return { icon: <Clock className="w-3 h-3" />, label: 'Log Time' };
      case 'COMPLETED': return { icon: <DollarSign className="w-3 h-3" />, label: 'Invoice' };
      case 'INVOICED': return { icon: <Send className="w-3 h-3" />, label: 'Remind' };
      default: return { icon: <MoreHorizontal className="w-3 h-3" />, label: 'More' };
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Pipeline Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 px-1 custom-scrollbar">
        <div className="flex h-full gap-4 pb-12" style={{ width: 'max-content' }}>
          {STAGES.map(stage => {
            const stageJobs = columns[stage.id] || [];
            const totalValue = stageJobs.reduce((sum, j) => sum + j.items.reduce((s, i) => s + i.total, 0), 0);
            const weightedValue = getWeightedValue(stage.id, totalValue);
            const action = getSmartAction(stage.id);
            const stageMeta = getStageMeta(stage.id);
            const slaHours = stageMeta?.slaHours;
            const overdueCount = slaHours
              ? stageJobs.filter((job) => {
                  const anchor = job.lastStageChange || job.start;
                  if (!anchor) return false;
                  return differenceInHours(new Date(), parseISO(anchor)) > slaHours;
                }).length
              : 0;
            const triggerLabels = stageMeta?.automationTriggers?.map((trigger) =>
              trigger.action.replace(/_/g, ' ').toLowerCase()
            );

            return (
              <div
                key={stage.id}
                className={`flex-shrink-0 rounded-xl flex flex-col border ${stage.containerClass} transition-all duration-300 ease-in-out`}
                style={{ width: `${columnWidth}px` }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Column Header */}
                <div
                  onClick={() => setCommandCenterStage(stage.id)}
                  className={`p-3 rounded-t-xl border-b border-white/20 flex flex-col gap-1 ${stage.headerClass} cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all`}
                  title="Click to open Command Center"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {stage.icon}
                      <span className="text-xs font-bold uppercase tracking-wider truncate">{stage.label}</span>
                      <span className="bg-white/50 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">{stageJobs.length}</span>
                    </div>
                    {totalValue > 0 && zoomLevel > 0.6 && (
                      <span className="text-[10px] font-bold opacity-80 shrink-0">${totalValue.toLocaleString()}</span>
                    )}
                  </div>
                  {slaHours && (
                    <div className="flex items-center justify-between text-[10px] font-semibold opacity-80">
                      <span>SLA {slaHours}h</span>
                      {overdueCount > 0 && (
                        <span className="text-rose-700">Overdue {overdueCount}</span>
                      )}
                    </div>
                  )}
                  {/* Weighted Forecast */}
                  {totalValue > 0 && zoomLevel > 0.8 && (
                    <div className="text-[9px] opacity-60 font-mono text-right">
                      Forecast: ${Math.round(weightedValue).toLocaleString()}
                    </div>
                  )}
                  {triggerLabels && triggerLabels.length > 0 && zoomLevel > 0.7 && (
                    <div className="text-[9px] opacity-70">
                      Triggers: {triggerLabels.join(', ')}
                    </div>
                  )}
                </div>

                {/* Cards Container */}
                <div className="p-2 flex-1 overflow-y-auto custom-scrollbar space-y-2 min-h-[100px]">
                  {stageJobs.map(job => {
                    const client = clients.find(c => c.id === job.clientId);
                    const tech = users.find(u => u.id === job.assignedTechIds[0]);
                    const value = job.items.reduce((sum, i) => sum + i.total, 0);

                    // Rotting Logic (Fallback to random if no data for demo?)
                    // For now strict logic: if no date, no rot.
                    const rottingClass = getRottingStyle(job);

                    // Geo Clustering
                    let isCluster = false;
                    if (hoveredJobId && hoveredJobId !== job.id && job.location && draggingJobId === null) {
                      const hoveredJob = jobs.find(j => j.id === hoveredJobId);
                      if (hoveredJob?.location) {
                        const dist = getDistanceFromLatLonInKm(
                          job.location.lat, job.location.lng,
                          hoveredJob.location.lat, hoveredJob.location.lng
                        );
                        if (dist < 8) isCluster = true; // Within 8km
                      }
                    }

                    // Client Wealth Jewel (Real Calculation)
                    const clientInvoices = invoices?.filter(i => i.clientId === job.clientId && i.status === 'PAID') || [];
                    const clientTotalSpend = clientInvoices.reduce((sum, i) => sum + i.total, 0);
                    const isVIP = clientTotalSpend > 5000;
                    const isNew = clientTotalSpend === 0;

                    return (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job.id)}
                        onMouseEnter={() => setHoveredJobId(job.id)}
                        onMouseLeave={() => setHoveredJobId(null)}
                        className={`
                                    bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-grab 
                                    hover:shadow-md transition-all group border-l-4 ${stage.accentClass}
                                    ${draggingJobId === job.id ? 'opacity-50' : 'opacity-100'}
                                    ${rottingClass}
                                    ${isCluster ? 'ring-2 ring-indigo-400 ring-offset-1 scale-105 z-10' : ''}
                                `}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold text-slate-900 leading-tight ${zoomLevel < 0.7 ? 'text-xs' : 'text-sm'}`}>{job.title}</h4>

                          <div className="flex items-center gap-1">
                            {/* Sentiment Badge */}
                            {job.sentiment === 'POSITIVE' && <Smile className="w-3 h-3 text-emerald-500" />}
                            {job.sentiment === 'NEGATIVE' && <Frown className="w-3 h-3 text-red-500" />}

                            {/* Smart Action Button */}
                            <button
                              className="text-slate-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 bg-slate-50 hover:bg-emerald-50 px-1.5 py-0.5 rounded border border-slate-200"
                              title={action.label}
                            >
                              {action.icon}
                              {zoomLevel > 1.0 && <span className="text-[9px] font-bold uppercase">{action.label}</span>}
                            </button>
                          </div>
                        </div>

                        {zoomLevel > 0.6 && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                            <UserIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{client?.firstName} {client?.lastName}</span>
                            {isVIP && <Gem className="w-3 h-3 text-amber-400 fill-amber-400 ml-1" title={`VIP Client ($${clientTotalSpend.toLocaleString()})`} />}
                            {isNew && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded ml-1">NEW</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-2 overflow-hidden">
                            {/* Weather Risk Indicator (Mock) */}
                            {job.status === 'SCHEDULED' && Math.random() > 0.8 && (
                              <CloudRain className="w-3 h-3 text-blue-400" title="Rain Forecast" />
                            )}

                            {tech ? (
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0" title={tech.name}>
                                {tech.avatarUrl ? (
                                  <img src={tech.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-500">{tech.name[0]}</span>
                                )}
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center shrink-0">
                                <span className="text-[8px] text-slate-400">?</span>
                              </div>
                            )}
                            {zoomLevel > 0.7 && (
                              <div className="text-[10px] font-medium text-slate-400 truncate">
                                {job.start ? format(new Date(job.start), 'MMM d') : 'No Date'}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                            ${value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Drop Zones */}
      {draggingJobId && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4 z-40 animate-in slide-in-from-bottom-4 fade-in">
          <div
            className="bg-slate-800 text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-2 cursor-pointer hover:bg-slate-700 hover:scale-105 transition-all border border-slate-600"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'SNOOZE')}
          >
            <Clock className="w-4 h-4" /> <span className="text-sm font-bold">Snooze 2d</span>
          </div>
          <div
            className="bg-purple-600 text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-2 cursor-pointer hover:bg-purple-500 hover:scale-105 transition-all border border-purple-400"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'BLAST')}
          >
            <Send className="w-4 h-4" /> <span className="text-sm font-bold">Follow Up</span>
          </div>
          <div
            className="bg-amber-500 text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-2 cursor-pointer hover:bg-amber-400 hover:scale-105 transition-all border border-amber-300"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'RESCHEDULE')}
          >
            <CalendarPlus className="w-4 h-4" /> <span className="text-sm font-bold">Reschedule</span>
          </div>
        </div>
      )}

      {/* Floating Zoom Control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-xl border border-slate-200/60 rounded-full px-4 py-2 flex items-center gap-4 z-30 transition-opacity duration-300 hover:opacity-100">
        <button
          onClick={() => stepZoom(-0.1)}
          disabled={zoomLevel <= 0.5}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={zoomLevel}
            onChange={handleZoomChange}
            className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-xs font-bold text-slate-600 w-9 text-right tabular-nums">{Math.round(zoomLevel * 100)}%</span>
        </div>

        <button
          onClick={() => stepZoom(0.1)}
          disabled={zoomLevel >= 1.5}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>


      {/* Command Center Modal */}
      {
        commandCenterStage && (
          <StageCommandCenter
            isOpen={true}
            onClose={() => setCommandCenterStage(null)}
            stage={commandCenterStage}
            jobs={jobs}
            clients={clients}
            users={users}
            invoices={invoices}
          />
        )
      }
    </div >
  );
};
