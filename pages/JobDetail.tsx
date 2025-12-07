import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job, JobStatus, Client } from '../types';
import { Button } from '../components/Button';
import { CheckCircle, Camera, Clock, Calendar, ArrowLeft, AlertCircle, Car, DollarSign, Repeat } from 'lucide-react';
import { StoreContext } from '../store';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

interface JobDetailProps {
  jobs: Job[];
  clients: Client[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({ jobs, clients, onUpdateStatus }) => {
  const store = useContext(StoreContext);
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);
  const client = clients.find((c) => c.id === job?.clientId);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'photos'>('overview');

  if (!job || !client) return <div>Job not found</div>;

  const property = client.properties.find(p => p.id === job.propertyId);

  const handleStartJob = () => {
    // Auto-assign if unassigned (e.g. Admin taking over)
    if (!job.technicianId && store?.currentUser) {
      store.updateJob({ ...job, technicianId: store.currentUser.id });
    }

    // 1. Update Status
    onUpdateStatus(job.id, JobStatus.IN_PROGRESS);
    // 2. Auto Clock In (Feature Request)
    store?.clockIn(job.id);
  };

  const handleCompleteJob = () => {
    // 1. Update Status
    onUpdateStatus(job.id, JobStatus.COMPLETED);
    // 2. Auto Clock Out (Feature Request)
    store?.clockOut();
  };

  const handleShareTracking = async () => {
    if (!store?.createTrackingLink) return;
    const url = await store.createTrackingLink(job.id);
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Tracking link copied to clipboard!');
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    const colors = {
      SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
      IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
      COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      DRAFT: 'bg-slate-50 text-slate-700 border-slate-200 border-dashed',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[status]} uppercase tracking-wide`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Link to="/jobs" className="mb-6 inline-flex items-center text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Jobs
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
              {getStatusBadge(job.status)}
              {job.priority === 'HIGH' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-200 uppercase tracking-wide flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> High Priority
                </span>
              )}
              {job.recurrence && (
                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-purple-50 text-purple-700 border-purple-200 uppercase tracking-wide flex items-center gap-1">
                  <Repeat className="w-3 h-3" /> {job.recurrence.frequency}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(job.start).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(job.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {job.status === JobStatus.SCHEDULED && (
              <Button onClick={handleStartJob}>
                Start Job
              </Button>
            )}
            {job.status === JobStatus.IN_PROGRESS && (
              <Button onClick={handleCompleteJob} className="bg-emerald-600 hover:bg-emerald-700">
                Complete Job
              </Button>
            )}
            <Button variant="outline" onClick={handleShareTracking} className="flex items-center gap-2">
              <Car className="w-4 h-4" /> Share Tracking
            </Button>
            <Button variant="outline" onClick={() => {
              // Auto-assign if unassigned
              if (!job.technicianId && store?.currentUser) {
                store.updateJob({ ...job, technicianId: store.currentUser.id });
              }
              store?.triggerAutomation('ON_MY_WAY', job.id);
              alert("Notification sent!");
            }}>
              On My Way
            </Button>
          </div>
        </div>

        {/* Client Quick View */}
        <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Client</p>
            <Link to={`/clients/${client.id}`} className="font-bold text-slate-900 hover:text-emerald-600 hover:underline transition-colors">
              {client.firstName} {client.lastName}
            </Link>
            <p className="text-sm text-slate-500">{client.phone}</p>
          </div>
          <div className="w-px h-10 bg-slate-200 mx-6"></div>
          <div className="flex-[2]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-700 font-medium">
                {property?.address.street}, {property?.address.city}, {property?.address.state} {property?.address.zip}
              </p>
              <a href="#" className="text-emerald-600 text-sm font-bold hover:underline">Map</a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 mb-8 px-4">
        {['overview', 'checklist', 'photos'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 font-medium text-sm capitalize border-b-2 transition-all ${activeTab === tab
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 min-h-[400px]">

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {job.vehicleDetails && (
              <section className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Vehicle Information
                </h3>
                <div className="flex gap-8">
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Year</span>
                    <p className="font-bold text-slate-900">{job.vehicleDetails.year}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Make</span>
                    <p className="font-bold text-slate-900">{job.vehicleDetails.make}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Model</span>
                    <p className="font-bold text-slate-900">{job.vehicleDetails.model}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Color</span>
                    <p className="font-bold text-slate-900">{job.vehicleDetails.color}</p>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {job.description}
              </p>
              {property?.accessInstructions && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm flex gap-3 items-start">
                  <div className="mt-0.5 font-bold">Note:</div>
                  <div>{property.accessInstructions}</div>
                </div>
              )}
            </section>

            {/* PROFITABILITY SECTION (New) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profitability & Costs</h3>
                {job.costs && (
                  <span className={`px-2 py-1 rounded text-xs font-bold ${((job.items.reduce((s, i) => s + i.total, 0) - job.costs.supplies - job.costs.labor) / job.items.reduce((s, i) => s + i.total, 0)) > 0.3
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {Math.round(((job.items.reduce((s, i) => s + i.total, 0) - job.costs.supplies - job.costs.labor) / job.items.reduce((s, i) => s + i.total, 0)) * 100)}% Margin
                  </span>
                )}
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Revenue</label>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      ${job.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supplies Cost</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
                        <input
                          type="number"
                          className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="0.00"
                          defaultValue={job.costs?.supplies}
                          onBlur={(e) => {
                            const newCosts = { labor: job.costs?.labor || 0, ...job.costs, supplies: Number(e.target.value) };
                            store?.updateJob({ ...job, costs: newCosts });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Labor Cost</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
                        <input
                          type="number"
                          className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="0.00"
                          defaultValue={job.costs?.labor}
                          onBlur={(e) => {
                            const newCosts = { supplies: job.costs?.supplies || 0, ...job.costs, labor: Number(e.target.value) };
                            store?.updateJob({ ...job, costs: newCosts });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Net Profit</label>
                    <div className={`text-xl font-bold ${(job.items.reduce((s, i) => s + i.total, 0) - (job.costs?.supplies || 0) - (job.costs?.labor || 0)) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      ${(job.items.reduce((s, i) => s + i.total, 0) - (job.costs?.supplies || 0) - (job.costs?.labor || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Line Items</h3>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4 text-right">Qty</th>
                      <th className="p-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {job.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-4 font-medium text-slate-900">{item.description}</td>
                        <td className="p-4 text-right text-slate-600">{item.quantity}</td>
                        <td className="p-4 text-right font-bold text-slate-900">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-3">
            {job.checklists.map((item) => (
              <label key={item.id} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${item.isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-emerald-300'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                  {item.isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <input
                  type="checkbox"
                  defaultChecked={item.isCompleted}
                  className="hidden"
                />
                <span className={`font-medium ${item.isCompleted ? 'text-emerald-900' : 'text-slate-700'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            {/* SLIDER SECTION (New) */}
            <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Before & After Comparison</h4>
              {job.photos.filter(p => p.type === 'BEFORE').length > 0 && job.photos.filter(p => p.type === 'AFTER').length > 0 ? (
                <BeforeAfterSlider
                  beforeImage={job.photos.find(p => p.type === 'BEFORE')?.url || ''}
                  afterImage={job.photos.find(p => p.type === 'AFTER')?.url || ''}
                />
              ) : (
                <div className="text-sm text-slate-500 italic flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Tag at least one photo as "Before" and one as "After" to enable the slider.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {job.photos.map(photo => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden border border-slate-100 relative group shadow-sm">
                  <img src={photo.url} alt="Job" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium mb-2">{new Date(photo.uploadedAt).toLocaleDateString()}</p>
                    <div className="flex gap-1">
                      <button
                        className={`text-[10px] px-2 py-1 rounded font-bold ${photo.type === 'BEFORE' ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        onClick={() => {
                          // In a real app, this would call an update API
                          const updatedPhotos = job.photos.map(p => p.id === photo.id ? { ...p, type: 'BEFORE' as const } : p);
                          store?.updateJob({ ...job, photos: updatedPhotos });
                        }}
                      >
                        BEFORE
                      </button>
                      <button
                        className={`text-[10px] px-2 py-1 rounded font-bold ${photo.type === 'AFTER' ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        onClick={() => {
                          const updatedPhotos = job.photos.map(p => p.id === photo.id ? { ...p, type: 'AFTER' as const } : p);
                          store?.updateJob({ ...job, photos: updatedPhotos });
                        }}
                      >
                        AFTER
                      </button>
                    </div>
                  </div>
                  {photo.type && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${photo.type === 'BEFORE' ? 'bg-blue-500' : photo.type === 'AFTER' ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                      {photo.type}
                    </div>
                  )}
                </div>
              ))}
              <button className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all gap-2">
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">Add Photo</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
