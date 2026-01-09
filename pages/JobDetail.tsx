import React, { useRef, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job, JobStatus, Client, Invoice, InvoiceStatus, Payment, InvoiceMilestone } from '../types';
import { Button } from '../components/Button';
import { CheckCircle, Camera, Clock, Calendar, ArrowLeft, AlertCircle, DollarSign, Repeat } from 'lucide-react';
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
  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!job || !client) return <div>Job not found</div>;

  const property = client.properties.find(p => p.id === job.propertyId);
  const assignedTechs = store?.users.filter((u) => job.assignedTechIds.includes(u.id)) || [];
  const invoices = store?.invoices || [];
  const settings = store?.settings;
  const jobInvoice = invoices.find((invoice) => invoice.jobId === job.id);

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
    if (job.checklists.some((item) => !item.isCompleted)) {
      alert('Please complete all checklist items before finishing the job.');
      return;
    }
    if (job.photos.length === 0) {
      alert('Please upload completion evidence before finishing the job.');
      return;
    }
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

  const calculateSubtotal = () => job.items.reduce((sum, item) => sum + item.total, 0);
  const calculateTax = (subtotal: number) => {
    const rate = settings?.taxRate ?? 0;
    return subtotal * rate;
  };

  const buildMilestones = (total: number): InvoiceMilestone[] => {
    if (total <= 0) return [];
    return [
      { id: crypto.randomUUID(), label: 'Deposit', amount: Math.round(total * 0.3), status: 'PENDING' },
      { id: crypto.randomUUID(), label: 'Midpoint', amount: Math.round(total * 0.4), status: 'PENDING' },
      { id: crypto.randomUUID(), label: 'Final', amount: Math.max(total - Math.round(total * 0.7), 0), status: 'PENDING' },
    ];
  };

  const handleCreateInvoice = () => {
    if (!store?.createInvoice) return;
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      clientId: client.id,
      jobId: job.id,
      items: job.items.length > 0 ? job.items : [{
        id: crypto.randomUUID(),
        description: job.title,
        quantity: 1,
        unitPrice: total,
        total
      }],
      subtotal,
      tax,
      total,
      balanceDue: total,
      status: InvoiceStatus.SENT,
      dueDate: new Date().toISOString(),
      issuedDate: new Date().toISOString(),
      payments: [],
      taxRate: settings?.taxRate,
      taxLabel: settings?.taxName,
      milestones: buildMilestones(total)
    };
    store.createInvoice(invoice);
  };

  const handleCollectPayment = () => {
    if (!store?.updateInvoice || !jobInvoice) return;
    const amountInput = window.prompt('Payment amount', jobInvoice.balanceDue.toString());
    const amount = Number(amountInput);
    if (!amount || Number.isNaN(amount)) return;

    const payment: Payment = {
      id: crypto.randomUUID(),
      invoiceId: jobInvoice.id,
      amount,
      method: 'TRANSFER',
      date: new Date().toISOString()
    };

    const nextBalance = Math.max(jobInvoice.balanceDue - amount, 0);
    const nextStatus = nextBalance === 0 ? InvoiceStatus.PAID : jobInvoice.status;
    const receiptId = nextStatus === InvoiceStatus.PAID
      ? jobInvoice.receiptId || `RCT-${jobInvoice.id.slice(0, 6).toUpperCase()}`
      : jobInvoice.receiptId;

    store.updateInvoice({
      ...jobInvoice,
      balanceDue: nextBalance,
      status: nextStatus,
      payments: [...jobInvoice.payments, payment],
      receiptId
    });
  };

  const handleMilestoneUpdate = (milestoneId: string, nextStatus: 'FUNDED' | 'RELEASED') => {
    if (!store?.updateInvoice || !jobInvoice || !jobInvoice.milestones) return;
    const updatedMilestones = jobInvoice.milestones.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, status: nextStatus } : milestone
    );

    let nextInvoice = { ...jobInvoice, milestones: updatedMilestones };

    if (nextStatus === 'RELEASED') {
      const milestone = jobInvoice.milestones.find((m) => m.id === milestoneId);
      if (milestone) {
        const payment: Payment = {
          id: crypto.randomUUID(),
          invoiceId: jobInvoice.id,
          amount: milestone.amount,
          method: 'TRANSFER',
          date: new Date().toISOString()
        };
        const nextBalance = Math.max(jobInvoice.balanceDue - milestone.amount, 0);
        const nextStatus = nextBalance === 0 ? InvoiceStatus.PAID : jobInvoice.status;
        const receiptId = nextStatus === InvoiceStatus.PAID
          ? jobInvoice.receiptId || `RCT-${jobInvoice.id.slice(0, 6).toUpperCase()}`
          : jobInvoice.receiptId;
        nextInvoice = {
          ...nextInvoice,
          balanceDue: nextBalance,
          status: nextStatus,
          payments: [...jobInvoice.payments, payment],
          receiptId
        };
      }
    }

    store.updateInvoice(nextInvoice);
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
            <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Service Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 uppercase">Scope Notes</span>
                  <p className="font-semibold text-slate-900">{job.notes || '—'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase">Priority</span>
                  <p className="font-semibold text-slate-900">{job.priority}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase">Checklist Items</span>
                  <p className="font-semibold text-slate-900">{job.checklists.length}</p>
                </div>
              </div>
            </section>

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

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Work Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-slate-500">Work Order ID</div>
                  <div className="font-semibold text-slate-900">#{job.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-slate-500">Assigned</div>
                  <div className="font-semibold text-slate-900">
                    {assignedTechs.length > 0 ? assignedTechs.map((tech) => tech.name).join(', ') : 'Unassigned'}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-slate-500">Stage</div>
                  <div className="font-semibold text-slate-900">{job.pipelineStage || 'LEAD'}</div>
                </div>
              </div>
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

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payments & Invoicing</h3>
                  <p className="text-xs text-slate-500">Collect payments, apply taxes, and issue receipts.</p>
                </div>
                {!jobInvoice && (
                  <Button size="sm" onClick={handleCreateInvoice}>Create Invoice</Button>
                )}
              </div>

              {jobInvoice ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 uppercase">Invoice</div>
                      <div className="font-semibold text-slate-900">#{jobInvoice.id.slice(0, 6).toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase">Total</div>
                      <div className="font-semibold text-slate-900">${jobInvoice.total.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase">Balance</div>
                      <div className="font-semibold text-slate-900">${jobInvoice.balanceDue.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase">Tax</div>
                      <div className="font-semibold text-slate-900">
                        {jobInvoice.taxLabel || 'Tax'} ({((jobInvoice.taxRate ?? settings?.taxRate ?? 0) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>

                  {jobInvoice.receiptId && (
                    <div className="text-xs text-slate-500">
                      Receipt: <span className="font-semibold text-slate-700">{jobInvoice.receiptId}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={handleCollectPayment}>Collect Payment</Button>
                    <Button size="sm" variant="outline">Send Receipt</Button>
                  </div>

                  {jobInvoice.milestones && jobInvoice.milestones.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-bold uppercase text-slate-500 mb-3">Escrow / Milestones</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {jobInvoice.milestones.map((milestone) => (
                          <div key={milestone.id} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 text-sm">
                            <div className="font-semibold text-slate-900">{milestone.label}</div>
                            <div className="text-xs text-slate-500">${milestone.amount.toFixed(2)}</div>
                            <div className={`text-[10px] font-bold uppercase ${
                              milestone.status === 'RELEASED'
                                ? 'text-emerald-600'
                                : milestone.status === 'FUNDED'
                                ? 'text-amber-600'
                                : 'text-slate-500'
                            }`}>
                              {milestone.status}
                            </div>
                            <div className="flex gap-2">
                              {milestone.status === 'PENDING' && (
                                <Button size="sm" variant="outline" onClick={() => handleMilestoneUpdate(milestone.id, 'FUNDED')}>
                                  Fund
                                </Button>
                              )}
                              {milestone.status === 'FUNDED' && (
                                <Button size="sm" onClick={() => handleMilestoneUpdate(milestone.id, 'RELEASED')}>
                                  Release
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500">No invoice yet. Create one to start collecting payment.</div>
              )}
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
                  checked={item.isCompleted}
                  onChange={(e) => {
                    const updated = job.checklists.map((entry) =>
                      entry.id === item.id ? { ...entry, isCompleted: e.target.checked } : entry
                    );
                    store?.updateJob({ ...job, checklists: updated });
                  }}
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

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Completion Evidence</h4>
                <p className="text-xs text-slate-500">Upload photos or documents that prove completion.</p>
              </div>
              <div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    const updatedPhotos = [
                      ...job.photos,
                      { id: crypto.randomUUID(), url, uploadedAt: new Date().toISOString(), type: 'GENERAL' as const }
                    ];
                    store?.updateJob({ ...job, photos: updatedPhotos });
                    e.currentTarget.value = '';
                  }}
                />
                <Button size="sm" variant="outline" onClick={() => photoInputRef.current?.click()}>
                  Upload evidence
                </Button>
              </div>
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
              <button
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all gap-2"
                onClick={() => photoInputRef.current?.click()}
              >
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
