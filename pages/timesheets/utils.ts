import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInMinutes } from 'date-fns';
import { Job, TimeEntry, User, JobStatus } from '../../types';

export const calculateWeeklyPayroll = (userId: string, users: User[], jobs: Job[], timeEntries: TimeEntry[], currentWeekStart: Date) => {
    const user = users.find(u => u.id === userId);
    if (!user) return { regular: 0, overtime: 0, gross: 0, label: 'N/A' };

    const start = currentWeekStart;
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start, end });

    if (user.payrollType === 'COMMISSION') {
        const completedJobs = jobs.filter(j => {
            const jobDate = new Date(j.end);
            return j.assignedTechIds.includes(userId) && j.status === JobStatus.COMPLETED && jobDate >= start && jobDate <= end;
        });
        const totalRevenue = completedJobs.reduce((sum, j) => sum + j.items.reduce((s, i) => s + i.total, 0), 0);
        const gross = totalRevenue * (user.payRate / 100);
        return { regular: completedJobs.length, overtime: 0, gross, label: 'Jobs' };
    }
    else if (user.payrollType === 'DAILY_RATE') {
        const daysWorked = weekDays.filter(day => {
            const dayEntries = timeEntries.filter(e => e.userId === userId && isSameDay(new Date(e.startTime), day));
            return dayEntries.length > 0;
        }).length;
        return { regular: daysWorked, overtime: 0, gross: daysWorked * user.payRate, label: 'Days' };
    }
    else {
        const userEntries = timeEntries.filter(e => {
            const d = new Date(e.startTime);
            return e.userId === userId && d >= start && d <= end;
        });
        const totalMinutes = userEntries.reduce((acc, e) => acc + (e.durationMinutes || 0), 0);
        const regularHours = Math.min(totalMinutes / 60, 40);
        const overtimeHours = Math.max((totalMinutes / 60) - 40, 0);
        const gross = (regularHours * user.payRate) + (overtimeHours * user.payRate * 1.5);
        return { regular: regularHours, overtime: overtimeHours, gross, label: 'Hours' };
    }
};

export const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};
