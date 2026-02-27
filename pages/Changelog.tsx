import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Filter, Search } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { AuthModal } from '../components/AuthModal';
import { StoreContext } from '../store';

type ChangeLink = {
  label: string;
  href: string;
};

type ChangeEntry = {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  tags: string[];
  links: ChangeLink[];
};

const CHANGELOG_ENTRIES: ChangeEntry[] = [
  {
    id: 'crm-data-model',
    title: 'Industry-agnostic CRM data model & object relationships',
    summary:
      'Defined the core CRM building blocks (company, people, locations, assets, jobs, quotes, invoices, tasks, cases) so any industry can track work the same way.',
    date: 'Feb 2025',
    category: 'CRM',
    tags: ['CRM', 'Data model'],
    links: [
      { label: 'Settings · Data Management', href: '/settings' },
    ],
  },
  {
    id: 'crm-pipeline',
    title: 'Pipeline/stage management within CRM',
    summary:
      'Added flexible stages for how work moves from first inquiry to completed review, plus automatic actions and time targets at each step.',
    date: 'Feb 2025',
    category: 'CRM',
    tags: ['CRM', 'Pipeline', 'SLA'],
    links: [
      { label: 'Jobs · CRM Pipeline View', href: '/jobs' },
    ],
  },
  {
    id: 'crm-activity-timeline',
    title: 'Unified communications + activity timeline',
    summary:
      'Created a single timeline that shows emails, texts, calls, notes, files, and status changes so teams can follow the full story in one place.',
    date: 'Feb 2025',
    category: 'CRM',
    tags: ['CRM', 'Comms'],
    links: [
      { label: 'Jobs · CRM Activity Timeline', href: '/jobs' },
      { label: 'Communication Hub', href: '/communication' },
    ],
  },
  {
    id: 'service-taxonomy',
    title: 'Multi-industry service taxonomy & category governance',
    summary:
      'Built a shared category library with clear labels, common synonyms, required skills, and an approval flow to keep service listings consistent.',
    date: 'Jan 2025',
    category: 'Governance',
    tags: ['Categories', 'Governance'],
    links: [
      { label: 'Settings · Service Menu', href: '/settings' },
    ],
  },
  {
    id: 'scheduling-fulfillment',
    title: 'Scheduling, job management, and fulfillment',
    summary:
      'Made scheduling and coverage clearer, with booking controls and a job workflow that shows who is assigned, what is due, and what is complete.',
    date: 'Jan 2025',
    category: 'Operations',
    tags: ['Scheduling', 'Jobs'],
    links: [
      { label: 'Schedule', href: '/schedule' },
      { label: 'Jobs', href: '/jobs' },
    ],
  },
  {
    id: 'payments-invoicing',
    title: 'Payments, invoicing, and tax compliance',
    summary:
      'Added job-level invoices, payment collection, tax handling, and receipts so teams can bill correctly without extra systems.',
    date: 'Jan 2025',
    category: 'Finance',
    tags: ['Payments', 'Invoicing'],
    links: [
      { label: 'Invoices', href: '/invoices' },
      { label: 'Quotes', href: '/quotes' },
    ],
  },
  {
    id: 'crm-case-management',
    title: 'Dispute resolution with case management',
    summary:
      'Introduced a case file for disputes that logs severity, steps to resolve, and a full history linked back to the job.',
    date: 'Jan 2025',
    category: 'Trust & Safety',
    tags: ['Disputes', 'Cases'],
    links: [
      { label: 'Jobs · Cases & Disputes', href: '/jobs' },
    ],
  },
  {
    id: 'rbac-segmentation',
    title: 'Role-based CRM permissions + data segmentation',
    summary:
      'Set clear access rules by role and region so the right people see the right data, which is critical for large teams.',
    date: 'Jan 2025',
    category: 'Security',
    tags: ['Permissions', 'Segmentation'],
    links: [
      { label: 'Settings · Team & Access', href: '/settings' },
      { label: 'Reports · Segmented KPIs', href: '/reports' },
    ],
  },
  {
    id: 'integrations-import-export',
    title: 'Data import/export + integrations',
    summary:
      'Enabled bulk import/export and integration hooks so data can move in and out of SBRE without manual re-entry.',
    date: 'Jan 2025',
    category: 'Integrations',
    tags: ['Integrations', 'Data'],
    links: [
      { label: 'Settings · Data Management', href: '/settings' },
      { label: 'Settings · Integrations', href: '/settings' },
    ],
  },
  {
    id: 'crm-reporting',
    title: 'Reporting beyond marketplace metrics',
    summary:
      'Expanded reports to show pipeline progress, win rates, time-to-close, and performance by industry segment.',
    date: 'Jan 2025',
    category: 'Analytics',
    tags: ['Reporting', 'CRM'],
    links: [
      { label: 'Reports', href: '/reports' },
    ],
  },
  {
    id: 'sla-guarantee',
    title: 'Guaranteed response time + SLA enforcement',
    summary:
      'Made response-time promises visible on vendor profiles and tied them to trust signals and ranking.',
    date: 'Jan 2025',
    category: 'Marketplace',
    tags: ['SLA', 'Marketplace'],
    links: [
      { label: 'Vendor Marketplace', href: '/platform' },
    ],
  },
  {
    id: 'review-moderation',
    title: 'Reviews system depth (photo reviews + moderation)',
    summary:
      'Added photo reviews and a moderation queue so feedback stays trustworthy and safe.',
    date: 'Jan 2025',
    category: 'Trust & Safety',
    tags: ['Reviews', 'Moderation'],
    links: [
      { label: 'Vendor Benefits', href: '/vendor-benefits' },
    ],
  },
  {
    id: 'crm-templates-automation',
    title: 'CRM messaging templates tied to automation',
    summary:
      'Connected message templates to common moments like new leads, missed responses, and review requests so outreach is consistent.',
    date: 'Jan 2025',
    category: 'Automation',
    tags: ['Templates', 'Automation'],
    links: [
      { label: 'Settings · Workflow', href: '/settings' },
    ],
  },
  {
    id: 'dispute-workflow-visibility',
    title: 'Dispute workflow detail in jobs',
    summary:
      'Made dispute intake and case updates visible directly inside each job record for easy tracking.',
    date: 'Jan 2025',
    category: 'Trust & Safety',
    tags: ['Disputes', 'Jobs'],
    links: [
      { label: 'Job Detail', href: '/jobs' },
    ],
  },
  {
    id: 'vendor-availability',
    title: 'Vendor availability scheduling in portal',
    summary:
      'Added availability schedules and calendar controls so vendors only receive leads when they are open.',
    date: 'Jan 2025',
    category: 'Operations',
    tags: ['Scheduling', 'Vendors'],
    links: [
      { label: 'Schedule', href: '/schedule' },
      { label: 'Jobs · Booking Panel', href: '/jobs' },
    ],
  },
  {
    id: 'vendor-claim',
    title: 'Vendor profile claim flow',
    summary:
      'Created a simple claim process so vendors can verify ownership and manage their public profile.',
    date: 'Dec 2024',
    category: 'Marketplace',
    tags: ['Vendors', 'Profiles'],
    links: [
      { label: 'Vendor Benefits', href: '/vendor-benefits' },
    ],
  },
  {
    id: 'lead-rollover',
    title: 'Lead rollover logic visible in operator/admin tooling',
    summary:
      'Showed when a lead is passed to the next vendor after a missed response, with clear escalation history.',
    date: 'Dec 2024',
    category: 'Operations',
    tags: ['SLA', 'Admin'],
    links: [
      { label: 'Settings · Workflow', href: '/settings' },
    ],
  },
  {
    id: 'admin-approvals',
    title: 'Admin approval/rejection + suspension logic',
    summary:
      'Added approval and suspension controls so admins can allow, deny, or pause vendors with a clear record of why.',
    date: 'Dec 2024',
    category: 'Governance',
    tags: ['Admin', 'Compliance'],
    links: [
      { label: 'Settings · Workflow', href: '/settings' },
    ],
  },
  {
    id: 'industry-agnostic-positioning',
    title: 'Industry-agnostic positioning',
    summary:
      'Updated messaging to speak to all industries, not just real estate, so it reads correctly for any operator.',
    date: 'Dec 2024',
    category: 'Positioning',
    tags: ['Brand', 'Industry'],
    links: [
      { label: 'Landing Page', href: '/' },
    ],
  },
  {
    id: 'automation-reliability',
    title: 'Automation reliability + offline-safe creation',
    summary:
      'Made automation setup more reliable so new rules still save even when the live database is offline.',
    date: 'Dec 2024',
    category: 'Automation',
    tags: ['Automation', 'Reliability'],
    links: [
      { label: 'Marketing Automations', href: '/marketing/automations' },
    ],
  },
];

const CATEGORY_FILTERS = ['All', ...Array.from(new Set(CHANGELOG_ENTRIES.map((item) => item.category)))];

const PENDING_CHANGELOG_LINK_KEY = 'pendingChangelogLink';

export const ChangelogPage: React.FC = () => {
  const store = useContext(StoreContext);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortMode, setSortMode] = useState<'LATEST' | 'CATEGORY'>('LATEST');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const base = CHANGELOG_ENTRIES.filter((entry) => {
      const matchesCategory = activeCategory === 'All' || entry.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      return (
        entry.title.toLowerCase().includes(normalizedQuery) ||
        entry.summary.toLowerCase().includes(normalizedQuery) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
    const dateOrder = (value: string) => {
      const [month, year] = value.split(' ');
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
      if (monthIndex < 0) return 0;
      return Number(year) * 12 + monthIndex;
    };
    if (sortMode === 'CATEGORY') {
      return [...base].sort((a, b) => a.category.localeCompare(b.category) || dateOrder(b.date) - dateOrder(a.date));
    }
    return [...base].sort((a, b) => dateOrder(b.date) - dateOrder(a.date));
  }, [query, activeCategory, sortMode]);

  const totalCategories = CATEGORY_FILTERS.length - 1;
  const latestDate = filtered[0]?.date || CHANGELOG_ENTRIES[0]?.date;
  const isAuthenticated = Boolean(store?.isAuthenticated);
  const handleChangeLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    if (isAuthenticated) {
      const targetUrl = `${window.location.origin}/#${path}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      localStorage.setItem(PENDING_CHANGELOG_LINK_KEY, path);
    } catch {
      // Ignore storage errors and still prompt login.
    }
    openAuth('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <PublicNavbar onOpenAuth={openAuth} />

      <section className="max-w-6xl mx-auto px-6 pt-28 pb-10">
        <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
                <Filter className="h-3.5 w-3.5" />
                Product changelog
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">What’s new in SBRE</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Clean, searchable updates across CRM, operations, trust & safety, and analytics.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search updates, tags, or features"
                className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Sort</span>
              <button
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  sortMode === 'LATEST' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-emerald-700'
                }`}
                onClick={() => setSortMode('LATEST')}
              >
                Latest
              </button>
              <button
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  sortMode === 'CATEGORY' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-emerald-700'
                }`}
                onClick={() => setSortMode('CATEGORY')}
              >
                Category
              </button>
              <div className="ml-auto text-xs text-slate-400">{filtered.length} matches</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Filters</p>
              <div className="mt-3 flex flex-col gap-2">
                {CATEGORY_FILTERS.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
                      activeCategory === category
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setQuery('');
                  setSortMode('LATEST');
                }}
                className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 hover:border-emerald-300 hover:text-emerald-700"
              >
                Reset filters
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Looking for something?</p>
              <p className="mt-2 text-xs text-slate-500">
                Use search to jump to a feature, or filter by team ownership.
              </p>
            </div>
          </aside>

          <div className="space-y-4">
            {filtered.map((entry, index) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{entry.category}</span>
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-slate-900">{entry.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{entry.summary}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                      {entry.date}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {entry.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={(event) => handleChangeLinkClick(event, link.href)}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm hover:border-emerald-300 hover:bg-emerald-100"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </div>
  );
};
