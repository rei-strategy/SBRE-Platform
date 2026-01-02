import React, { useState } from 'react';
import { ArrowUpRight, BadgeCheck, Coins, Crown, Shield } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { AuthModal } from '../components/AuthModal';

const benefits = [
  {
    icon: Shield,
    title: 'Trust, automated',
    description: 'Licenses, insurance, and identity checks stay current with reminders and badge tiers that operators can filter by.'
  },
  {
    icon: Coins,
    title: 'Monetize momentum',
    description: 'Boost placements, add coverage, and get demand alerts so your crew stays booked with the right work.'
  },
  {
    icon: Crown,
    title: 'Elite signals',
    description: 'Response times, NPS, and SLAs feed into badges that give you priority in routes and invites.'
  },
];

const badges = [
  {
    tier: 'Verified',
    points: ['License + insurance validated', 'Identity + compliance checks', 'Profile completion score > 70%']
  },
  {
    tier: 'Pro',
    points: ['Fast response times', 'Recent, high-quality reviews', 'Automations enabled']
  },
  {
    tier: 'Elite',
    points: ['Top conversion + retention', 'High-demand coverage', 'Invites to pilots']
  },
];

export const VendorBenefitsPage: React.FC = () => {
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
          For vendors
        </div>
        <div className="grid gap-12 md:grid-cols-[1.1fr,0.9fr] items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Join the verified network built for vendor revenue—not just directories.
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              SBRE Connect gives you trust badges, automated routing, and monetization tools so operators know exactly who to call and why.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Button size="lg" className="h-12 px-6" onClick={() => openAuth('signup')}>
                Claim your badge <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
              <Link to="/how-it-works">
                <Button variant="ghost" size="lg" className="h-12 px-6">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Monetization snapshot</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">+$38k</p>
            <p className="text-slate-600 mt-2">Average incremental revenue captured by SBRE Pro vendors in the first 6 months.</p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Add-on mix</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex justify-between"><span>Featured placement boosts</span><span className="font-semibold text-slate-900">42%</span></li>
                <li className="flex justify-between"><span>Category boost packs</span><span className="font-semibold text-slate-900">33%</span></li>
                <li className="flex justify-between"><span>Expanded coverage</span><span className="font-semibold text-slate-900">25%</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Badge tiers</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-6">Verification levels that matter to operators.</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {badges.map((badge) => (
              <div key={badge.tier} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 h-full">
                <div className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold">
                  <BadgeCheck className="w-4 h-4 mr-2" />
                  {badge.tier}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {badge.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </div>
  );
};
