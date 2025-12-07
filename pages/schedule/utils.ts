import { Job } from '../../types';

export const getTechColorStyles = (color: string = 'slate') => {
    const map: Record<string, { bg: string, header: string, border: string, text: string }> = {
        blue: { bg: 'bg-blue-50', header: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700' },
        amber: { bg: 'bg-amber-50', header: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700' },
        emerald: { bg: 'bg-emerald-50', header: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' },
        rose: { bg: 'bg-rose-50', header: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-700' },
        purple: { bg: 'bg-purple-50', header: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-700' },
        slate: { bg: 'bg-slate-50', header: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-700' },
    };
    return map[color] || map.slate;
};

export const getOverlappingIntervals = (jobs: Job[]) => {
    if (jobs.length < 2) return [];

    const sortedJobs = [...jobs].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const overlaps: { start: Date, end: Date }[] = [];

    for (let i = 0; i < sortedJobs.length; i++) {
        for (let j = i + 1; j < sortedJobs.length; j++) {
            const jobA = sortedJobs[i];
            const jobB = sortedJobs[j];
            const startA = new Date(jobA.start);
            const endA = new Date(jobA.end);
            const startB = new Date(jobB.start);
            const endB = new Date(jobB.end);

            if (startA < endB && startB < endA) {
                // Overlap exists
                const overlapStart = startA > startB ? startA : startB;
                const overlapEnd = endA < endB ? endA : endB;
                overlaps.push({ start: overlapStart, end: overlapEnd });
            } else {
                // Since sorted by start time, if startB >= endA, no subsequent jobs will overlap jobA
                break;
            }
        }
    }
    return overlaps;
};
