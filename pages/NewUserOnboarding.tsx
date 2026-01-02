import React, { useState } from 'react';
import { CheckCircle2, MapPin, Users, Search, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { PublicNavbar } from '../components/PublicNavbar';

interface NewUserOnboardingProps {
  onComplete: () => void;
}

export const NewUserOnboarding: React.FC<NewUserOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const interestOptions = ['Contractors', 'Lenders', 'Inspectors', 'Property Managers', 'Rehab Crews', 'Vendors Near Me'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNavbar onOpenAuth={() => {}} />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Welcome</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2">
            Let’s tailor your vendor search.
          </h1>
          <p className="text-lg text-slate-600 mt-3">
            Tell us what you need and where you operate. We’ll surface the best matches right away.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> What are you looking for?</h2>
              <p className="text-slate-600">Pick the partner types you want in your orbit.</p>
              <div className="flex flex-wrap gap-3">
                {interestOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                      interests.includes(item)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> Where are you operating?</h2>
              <p className="text-slate-600">We’ll focus results near your primary market.</p>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Search className="w-5 h-5 text-blue-600" /> Ready to search vendors?</h2>
              <p className="text-slate-600">We’ll drop you into the vendor map and curated categories.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Filter by badges and response times</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Save favorites and track outreach</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> See coverage heatmaps and availability</li>
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-slate-500">
              Step {step} of 3
            </div>
            <Button className="h-11 px-6" onClick={handleNext}>
              {step < 3 ? 'Next' : 'Start searching'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
