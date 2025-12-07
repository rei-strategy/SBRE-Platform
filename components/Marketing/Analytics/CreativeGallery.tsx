import React from 'react';
import { Play, Image, MoreHorizontal, Eye, MousePointer } from 'lucide-react';

interface Creative {
    id: string;
    thumbnail: string;
    type: 'VIDEO' | 'IMAGE';
    slogan?: string;
    metric: string; // e.g. "ROAS", "CTR"
    value: string; // e.g. "4.2x", "1.5%"
}

interface Props {
    creatives: Creative[];
}

export const CreativeGallery: React.FC<Props> = ({ creatives }) => {
    // Fallback mock creatives if none provided
    const items = creatives && creatives.length > 0 ? creatives : [
        { id: '1', thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400&q=80', type: 'IMAGE', metric: 'ROAS', value: '4.5x' },
        { id: '2', thumbnail: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&q=80', type: 'VIDEO', metric: 'Thumb-Stop', value: '35%' },
        { id: '3', thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80', type: 'IMAGE', metric: 'CTR', value: '1.2%' }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Top Performing Creatives</h3>
                <button className="text-xs text-blue-600 font-bold hover:underline">View Asset Library</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-4">
                {items.map((item, idx) => (
                    <div key={idx} className="relative aspect-[4/5] rounded-lg overflow-hidden group border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                        <img src={item.thumbnail} alt="Creative" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-slate-300 uppercase font-bold">{item.metric}</p>
                                    <p className="text-lg font-bold text-white leading-none">{item.value}</p>
                                </div>
                                <div className="p-1.5 bg-white/20 backdrop-blur rounded-lg text-white hover:bg-white/30 cursor-pointer">
                                    <Eye className="w-3 h-3" />
                                </div>
                            </div>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/50 text-white backdrop-blur-sm border border-white/10">
                            {item.type === 'VIDEO' ? <Play className="w-3 h-3 fill-white" /> : <Image className="w-3 h-3" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
