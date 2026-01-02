import React from 'react';
import { useState } from 'react';
import { BadgeCheck, Eye, Network, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { AuthModal } from '../components/AuthModal';

const steps = [
  {
    title: 'Verified',
    icon: BadgeCheck,
    description: 'Licenses, insurance, identity, and compliance checks stay current so your bench is always vetted.',
    bullets: ['Auto-reminders on expirations', 'Badge tiers for trust signals', 'One source of truth for documents']
  },
  {
    title: 'Visible',
    icon: Eye,
    description: 'Profiles, coverage, and specialties stay in front of operators with search-ready listings.',
    bullets: ['Coverage overlays', 'SEO-friendly profiles', 'Demand alerts per market']
  },
  {
    title: 'Connected',
    icon: Network,
    description: 'Requests, SLAs, and messaging keep work flowing without email chains or missed calls.',
    bullets: ['Lead inbox + SMS threads', 'Automated routing', 'Performance analytics']
  },
];

const milestones = [
  { label: 'Verification Completion', value: '89%' },
  { label: 'Average Time to Live', value: '72 hrs' },
  { label: 'Connected Deals / Month', value: '4.6' },
];

export const HowItWorksPage: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <PublicNavbar onOpenAuth={openAuth} />

      <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-[0.3em] mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          How it works
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Verified → Visible → Connected.
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          SBRE Connect keeps vendors vetted, on the map, and in motion—so operators move faster with trusted partners and zero guesswork.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <Button size="lg" className="h-12 px-6" onClick={() => openAuth('signup')}>
            Explore vendor path <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Link to="/pricing">
            <Button variant="ghost" size="lg" className="h-12 px-6">
              View pricing
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {milestones.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">{item.label}</p>
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{step.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </div>
  );
};
