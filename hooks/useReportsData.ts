import { useMemo } from 'react';
import {
    format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval,
    isValid, isSameMonth, subMonths, startOfYear, endOfYear, subYears
} from 'date-fns';
import { Job, Invoice, User, JobStatus, InvoiceStatus } from '../types';

interface DateRange {
    start: string;
    end: string;
}

export const useReportsData = (jobs: Job[], invoices: Invoice[], users: User[], dateRange: DateRange) => {

    // --- 1. FILTER DATA ---
    const filteredJobs = useMemo(() => {
        const start = parseISO(dateRange.start);
        const end = parseISO(dateRange.end);
        end.setHours(23, 59, 59, 999);

        if (!isValid(start) || !isValid(end)) return [];

        return jobs.filter(j => {
            const date = parseISO(j.end);
            return date >= start && date <= end;
        });
    }, [jobs, dateRange]);

    const filteredInvoices = useMemo(() => {
        const start = parseISO(dateRange.start);
        const end = parseISO(dateRange.end);
        end.setHours(23, 59, 59, 999);

        if (!isValid(start) || !isValid(end)) return [];

        return invoices.filter(i => {
            const date = parseISO(i.issuedDate);
            return date >= start && date <= end;
        });
    }, [invoices, dateRange]);

    // --- 2. PREVIOUS PERIOD DATA (For Comparisons) ---
    const previousPeriodData = useMemo(() => {
        const start = parseISO(dateRange.start);
        const end = parseISO(dateRange.end);

        // Calculate duration to shift back
        const duration = end.getTime() - start.getTime();
        const prevStart = new Date(start.getTime() - duration);
        const prevEnd = new Date(end.getTime() - duration);

        const prevInvoices = invoices.filter(i => {
            const date = parseISO(i.issuedDate);
            return date >= prevStart && date <= prevEnd;
        });

        const prevJobs = jobs.filter(j => {
            const date = parseISO(j.end);
            return date >= prevStart && date <= prevEnd;
        });

        return { invoices: prevInvoices, jobs: prevJobs };
    }, [invoices, jobs, dateRange]);

    // --- 3. KPI CALCULATIONS ---
    const kpis = useMemo(() => {
        // Current
        const totalRevenue = filteredInvoices
            .filter(i => i.status === InvoiceStatus.PAID)
            .reduce((sum, i) => sum + i.total, 0);

        const outstanding = filteredInvoices
            .filter(i => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE)
            .reduce((sum, i) => sum + i.balanceDue, 0);

        const completedJobsCount = filteredJobs.filter(j => j.status === JobStatus.COMPLETED).length;
        const paidInvoicesCount = filteredInvoices.filter(i => i.status === InvoiceStatus.PAID).length;
        const avgTicket = paidInvoicesCount > 0 ? totalRevenue / paidInvoicesCount : 0;

        // Profit (Gross)
        // Assuming Job Items have cost. If not, this will be 0.
        const totalCost = filteredJobs
            .filter(j => j.status === JobStatus.COMPLETED)
            .reduce((sum, job) => {
                return sum + job.items.reduce((iSum, item) => iSum + ((item.cost || 0) * item.quantity), 0);
            }, 0);

        const grossProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

        // Previous (for comparison)
        const prevRevenue = previousPeriodData.invoices
            .filter(i => i.status === InvoiceStatus.PAID)
            .reduce((sum, i) => sum + i.total, 0);

        const prevJobsCount = previousPeriodData.jobs.filter(j => j.status === JobStatus.COMPLETED).length;

        // Growth
        const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const jobsGrowth = prevJobsCount > 0 ? ((completedJobsCount - prevJobsCount) / prevJobsCount) * 100 : 0;

        return {
            totalRevenue,
            outstanding,
            completedJobsCount,
            avgTicket,
            grossProfit,
            profitMargin,
            revenueGrowth,
            jobsGrowth
        };
    }, [filteredInvoices, filteredJobs, previousPeriodData]);

    // --- 4. CHARTS DATA ---

    // Revenue Trend
    const revenueTrendData = useMemo(() => {
        const start = parseISO(dateRange.start);
        const end = parseISO(dateRange.end);

        if (!isValid(start) || !isValid(end) || start > end) return [];

        const months = eachMonthOfInterval({ start: startOfMonth(start), end: endOfMonth(end) });

        return months.map(date => {
            const monthName = format(date, 'MMM yy');
            const monthInvoices = filteredInvoices.filter(inv =>
                (inv.status === InvoiceStatus.PAID || inv.status === InvoiceStatus.SENT) &&
                isSameMonth(parseISO(inv.issuedDate), date)
            );

            const revenue = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);

            // Calculate Cost for this month's jobs to show Profit Trend
            const monthJobs = filteredJobs.filter(j =>
                j.status === JobStatus.COMPLETED &&
                isSameMonth(parseISO(j.end), date)
            );
            const cost = monthJobs.reduce((sum, job) => {
                return sum + job.items.reduce((iSum, item) => iSum + ((item.cost || 0) * item.quantity), 0);
            }, 0);

            return {
                name: monthName,
                revenue,
                profit: revenue - cost
            };
        });
    }, [filteredInvoices, filteredJobs, dateRange]);

    // Tech Performance
    const techPerformanceData = useMemo(() => {
        const technicians = users.filter(u => u.role === 'TECHNICIAN');

        return technicians.map(tech => {
            const techJobs = filteredJobs.filter(j =>
                j.assignedTechIds.includes(tech.id) &&
                j.status === JobStatus.COMPLETED
            );

            const revenue = techJobs.reduce((sum, job) => {
                const jobTotal = job.items.reduce((iSum, item) => iSum + item.total, 0);
                return sum + jobTotal;
            }, 0);

            return {
                name: tech.name.split(' ')[0],
                fullName: tech.name,
                revenue: revenue,
                jobs: techJobs.length,
                color: tech.color || 'slate',
                avatar: tech.avatarUrl
            };
        }).sort((a, b) => b.revenue - a.revenue).filter(t => t.revenue > 0);
    }, [users, filteredJobs]);

    // Service Mix
    const serviceMixData = useMemo(() => {
        const categories: Record<string, number> = {};

        filteredJobs.forEach(job => {
            let category = 'Other';
            const title = job.title.toLowerCase();

            if (title.includes('ceramic') || title.includes('coating')) category = 'Ceramic Coating';
            else if (title.includes('interior') || title.includes('odor')) category = 'Interior Detail';
            else if (title.includes('wash') || title.includes('exterior')) category = 'Exterior Wash';
            else if (title.includes('paint') || title.includes('correction')) category = 'Paint Correction';
            else if (title.includes('fleet')) category = 'Fleet Services';

            if (!categories[category]) categories[category] = 0;
            categories[category]++;
        });

        const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#8b5cf6'];

        return Object.keys(categories).map((cat, index) => ({
            name: cat,
            value: categories[cat],
            color: COLORS[index % COLORS.length]
        })).sort((a, b) => b.value - a.value);
    }, [filteredJobs]);

    // --- 5. INVOICE STATUS BREAKDOWN ---
    const invoiceStats = useMemo(() => {
        const stats = {
            PAID: filteredInvoices.filter(i => i.status === InvoiceStatus.PAID).length,
            OVERDUE: filteredInvoices.filter(i => i.status === InvoiceStatus.OVERDUE).length,
            SENT: filteredInvoices.filter(i => i.status === InvoiceStatus.SENT).length,
            DRAFT: filteredInvoices.filter(i => i.status === InvoiceStatus.DRAFT).length,
        };
        const total = filteredInvoices.length;
        return { counts: stats, total };
    }, [filteredInvoices]);

    return {
        filteredJobs,
        filteredInvoices,
        kpis,
        revenueTrendData,
        techPerformanceData,
        serviceMixData,
        invoiceStats
    };
};
