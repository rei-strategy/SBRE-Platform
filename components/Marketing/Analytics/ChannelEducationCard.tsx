import React from 'react';
import { ChannelEducation } from '../../../types';
import { Lightbulb, Layers, Zap } from 'lucide-react';

interface Props {
    education: ChannelEducation;
}

export const ChannelEducationCard: React.FC<Props> = ({ education }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 relative overflow-hidden shadow-lg border border-indigo-500/30">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                            {/* Icon placeholder if passed as component, or default */}
                            <Layers className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">{education.title}</h3>
                            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">Channel Guide</span>
                        </div>
                    </div>
                </div>

                <p className="text-indigo-100/90 text-sm leading-relaxed mb-6">
                    {education.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300">
                            <TargetIcon className="w-3 h-3" />
                            <span className="text-xs font-bold uppercase">Best For</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {education.bestFor.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 text-[10px] font-medium border border-indigo-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2 text-pink-300">
                            <Zap className="w-3 h-3" />
                            <span className="text-xs font-bold uppercase">Creative Specs</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1 ml-1">
                            {education.creativeRequirements.slice(0, 3).map((req, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-pink-400 mt-1.5"></div>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-indigo-950/50 rounded-lg p-3 border border-indigo-500/20">
                    <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-xs font-bold text-yellow-400 uppercase block mb-0.5">Pro Tip</span>
                        <p className="text-xs text-indigo-200 italic">"{education.proTip}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple internal icon for layout
const TargetIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);
