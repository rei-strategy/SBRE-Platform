import { Job, Invoice, TimeEntry, User } from '../types';
import { differenceInMinutes } from 'date-fns';

export interface JobProfitability {
    revenue: number;
    laborCost: number;
    profit: number;
    margin: number;
    status: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const calculateJobProfit = (
    job: Job,
    invoices: Invoice[],
    timeEntries: TimeEntry[],
    users: User[]
): JobProfitability => {
    // 1. Revenue (from Invoice)
    const invoice = invoices.find(i => i.jobId === job.id);
    const revenue = invoice ? invoice.total : 0;

    // 2. Labor Cost
    const jobEntries = timeEntries.filter(t => t.jobId === job.id);
    let laborCost = 0;

    jobEntries.forEach(entry => {
        if (entry.endTime) {
            const minutes = differenceInMinutes(new Date(entry.endTime), new Date(entry.startTime));
            const hours = minutes / 60;
            const tech = users.find(u => u.id === entry.userId);
            const rate = tech?.payRate || 0;
            laborCost += hours * rate;
        }
    });

    // 3. Profit
    const profit = revenue - laborCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // 4. Status Classification
    let status: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (profit > 200) status = 'HIGH';
    else if (profit >= 50) status = 'MEDIUM';

    return {
        revenue,
        laborCost,
        profit,
        margin,
        status
    };
};
