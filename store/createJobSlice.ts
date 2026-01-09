import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { Job, JobStatus, UserRole, TimeEntry, TimeEntryType, TimeEntryStatus, JobTemplate, PipelineStage } from '../types';
import { differenceInMinutes, differenceInHours, parseISO } from 'date-fns';

export const createJobSlice: StoreSlice<any> = (set, get) => ({
    jobs: [],
    timeEntries: [],

    addJob: async (job: Job) => {
        const { currentUser } = get();
        if (!currentUser.companyId) return;

        const jobPayload = {
            id: job.id,
            company_id: currentUser.companyId,
            client_id: job.clientId,
            property_id: job.propertyId,
            title: job.title,
            description: job.description,
            start_time: job.start,
            end_time: job.end,
            status: job.status,
            priority: job.priority,
            vehicle_details: job.vehicleDetails,
            assigned_tech_ids: job.assignedTechIds,
            pipeline_stage: job.pipelineStage
        };

        const { error } = await supabase.from('jobs').insert(jobPayload);
        if (error) { console.error("Add Job Failed", error); return; }

        if (job.items && job.items.length > 0) {
            const itemsPayload = job.items.map(i => ({
                company_id: currentUser.companyId,
                job_id: job.id,
                description: i.description,
                quantity: i.quantity,
                unit_price: i.unitPrice,
                total: i.total
            }));
            await supabase.from('line_items').insert(itemsPayload);
        }

        if (job.checklists && job.checklists.length > 0) {
            const checkPayload = job.checklists.map(c => ({
                company_id: currentUser.companyId,
                job_id: job.id,
                label: c.label,
                is_completed: c.isCompleted
            }));
            await supabase.from('checklists').insert(checkPayload);
        }

        set((state) => ({ jobs: [...state.jobs, job] }));
    },

    updateJob: async (job: Job) => {
        const payload = {
            title: job.title,
            description: job.description,
            start_time: job.start,
            end_time: job.end,
            status: job.status,
            priority: job.priority,
            vehicle_details: job.vehicleDetails,
            assigned_tech_ids: job.assignedTechIds
        };
        await supabase.from('jobs').update(payload).eq('id', job.id);
        set((state) => ({ jobs: state.jobs.map(j => j.id === job.id ? job : j) }));
    },

    deleteJob: async (id: string) => {
        console.log("Store: deleteJob called with id:", id);
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) {
            console.error("Store: Delete Job Failed", error);
            return { error };
        }
        console.log("Store: Delete Job Success, updating state");
        set((state) => ({ jobs: state.jobs.filter(j => j.id !== id) }));
        return { error: null };
    },

    updateJobStatus: async (jobId: string, status: JobStatus) => {
        let newPipelineStage: any = undefined;
        let job = get().jobs.find(j => j.id === jobId);

        if (status === JobStatus.SCHEDULED) newPipelineStage = 'SCHEDULED';
        else if (status === JobStatus.IN_PROGRESS) newPipelineStage = 'IN_PROGRESS';
        else if (status === JobStatus.COMPLETED) newPipelineStage = 'COMPLETED';
        else if (status === JobStatus.CANCELLED) newPipelineStage = 'CANCELLED';
        else if (status === JobStatus.DRAFT) newPipelineStage = 'LEAD';

        set((state) => ({
            jobs: state.jobs.map(j => j.id === jobId ? { ...j, status, pipelineStage: newPipelineStage || j.pipelineStage } : j)
        }));

        const payload: any = { status };
        if (newPipelineStage) {
            payload.pipeline_stage = newPipelineStage;
            payload.last_stage_change = new Date().toISOString();
        }

        const { error } = await supabase.from('jobs').update(payload).eq('id', jobId);
        if (error) {
            console.error("Update Job Status Failed", error);
        }

        get().triggerAutomation('JOB_STATUS_CHANGED', jobId, { status });

        // AUTO CLOCK-IN/OUT
        const { currentUser, timeEntries, addTimeEntry, updateTimeEntry, getCurrentLocation } = get();
        // Need to refetch job as it might be updated in closure
        job = get().jobs.find(j => j.id === jobId);

        if (job && currentUser.role === UserRole.TECHNICIAN && job.assignedTechIds.includes(currentUser.id)) {
            if (status === JobStatus.IN_PROGRESS) {
                const activeEntry = timeEntries.find(e => e.userId === currentUser.id && !e.endTime);
                if (!activeEntry) {
                    console.log("Auto-Clocking In for Job", jobId);
                    getCurrentLocation().then(location => {
                        addTimeEntry({
                            id: crypto.randomUUID(),
                            userId: currentUser.id,
                            type: TimeEntryType.JOB,
                            startTime: new Date().toISOString(),
                            status: TimeEntryStatus.PENDING,
                            jobId: jobId,
                            gpsLocation: location
                        });
                    });
                }
            } else if (status === JobStatus.COMPLETED) {
                const jobEntry = timeEntries.find(e => e.userId === currentUser.id && e.jobId === jobId && !e.endTime);
                if (jobEntry) {
                    console.log("Auto-Clocking Out for Job", jobId);
                    updateTimeEntry({
                        ...jobEntry,
                        endTime: new Date().toISOString(),
                        durationMinutes: differenceInMinutes(new Date(), new Date(jobEntry.startTime))
                    });
                }
            }
        }

        if (status === JobStatus.COMPLETED && job) {
            get().triggerAutomation('JOB_COMPLETED', jobId, { job });
        }
    },

    updateJobStage: async (id: string, stage: any) => {
        let newStatus: JobStatus | undefined;
        if (stage === 'SCHEDULED') newStatus = JobStatus.SCHEDULED;
        else if (stage === 'IN_PROGRESS') newStatus = JobStatus.IN_PROGRESS;
        else if (stage === 'COMPLETED') newStatus = JobStatus.COMPLETED;
        else if (stage === 'CANCELLED') newStatus = JobStatus.CANCELLED;
        else if (stage === 'LEAD') newStatus = JobStatus.DRAFT;

        const payload: any = { pipeline_stage: stage, last_stage_change: new Date().toISOString() };
        if (newStatus) payload.status = newStatus;

        await supabase.from('jobs').update(payload).eq('id', id);

        set((state) => ({
            jobs: state.jobs.map(j => j.id === id ? { ...j, pipelineStage: stage, status: newStatus || j.status, lastStageChange: payload.last_stage_change } : j)
        }));

        if (newStatus) {
            get().triggerAutomation('JOB_STATUS_CHANGED', id, { status: newStatus });
            if (newStatus === JobStatus.COMPLETED) {
                const job = get().jobs.find(j => j.id === id);
                if (job) get().triggerAutomation('JOB_COMPLETED', id, { job });
            }
        }
    },

    checkSlaBreaches: () => {
        const {
            jobs,
            crmPipelineConfigs,
            settings,
            currentUser,
            notifications,
            addNotification,
            removeNotification
        } = get();

        if (!currentUser?.id) return;

        const stageMap: Partial<Record<PipelineStage, string>> = {
            LEAD: 'inquiry',
            ESTIMATE_SENT: 'quote',
            APPROVED: 'qualified',
            SCHEDULED: 'work-order',
            IN_PROGRESS: 'work-order',
            COMPLETED: 'completion',
            INVOICED: 'review',
            PAID: 'review',
        };

        const pipelineConfig =
            crmPipelineConfigs.find((config) => config.industryId === settings?.industry) ||
            crmPipelineConfigs[0];

        if (!pipelineConfig) return;

        const breachIds = new Set<string>();

        jobs.forEach((job) => {
            const stageId = job.pipelineStage || 'LEAD';
            const crmStageId = stageMap[stageId];
            if (!crmStageId) return;
            const stageMeta = pipelineConfig.stages.find((stage) => stage.id === crmStageId);
            if (!stageMeta?.slaHours) return;
            const anchor = job.lastStageChange || job.start;
            if (!anchor) return;
            const hoursOpen = differenceInHours(new Date(), parseISO(anchor));
            if (hoursOpen <= stageMeta.slaHours) return;

            const overdueBy = hoursOpen - stageMeta.slaHours;
            const notificationId = `sla-${job.id}-${crmStageId}`;
            breachIds.add(notificationId);

            addNotification({
                id: notificationId,
                userId: currentUser.id,
                title: `SLA breached: ${job.title}`,
                message: `${stageMeta.name} exceeded by ${overdueBy}h`,
                timestamp: new Date().toISOString(),
                read: false,
                link: '/jobs',
                type: 'WARNING'
            });
        });

        notifications
            .filter((n) => n.id.startsWith('sla-') && !breachIds.has(n.id))
            .forEach((n) => removeNotification(n.id));
    },

    assignJob: (jobId: string, techId: string, job: Job) => {
        const newTechs = [...job.assignedTechIds, techId];
        supabase.from('jobs').update({ assigned_tech_ids: newTechs }).eq('id', jobId).then(() => {
            set((state) => ({ jobs: state.jobs.map(j => j.id === jobId ? { ...j, assignedTechIds: newTechs } : j) }));
        });
    },

    cancelJob: (id: string, reason: string) => {
        get().updateJobStatus(id, JobStatus.CANCELLED);
    },

    moveJob: (jobId: string, start: string, end: string, assignedTechIds?: string[]) => {
        set((state) => ({
            jobs: state.jobs.map(j => j.id === jobId ? {
                ...j,
                start,
                end,
                assignedTechIds: assignedTechIds || j.assignedTechIds
            } : j)
        }));

        const payload: any = { start_time: start, end_time: end };
        if (assignedTechIds) payload.assigned_tech_ids = assignedTechIds;

        supabase.from('jobs').update(payload).eq('id', jobId).then(({ error }) => {
            if (error) console.error("Move Job Failed", error);
        });
    },

    unscheduleJob: (jobId: string) => {
        supabase.from('jobs').update({ status: JobStatus.DRAFT, assigned_tech_ids: [] }).eq('id', jobId).then(() => {
            set((state) => ({ jobs: state.jobs.map(j => j.id === jobId ? { ...j, assignedTechIds: [], status: JobStatus.DRAFT } : j) }));
        });
    },

    addJobTemplate: async (template: JobTemplate) => {
        const { currentUser } = get();
        if (!currentUser.companyId) return;
        const payload = {
            id: template.id,
            company_id: currentUser.companyId,
            name: template.name,
            description: template.description,
            default_price: template.defaultPrice,
            category: template.category
        };
        await supabase.from('job_templates').insert(payload);
    },

    addTimeEntry: async (entry: TimeEntry) => {
        const { currentUser } = get();
        console.log("Store: addTimeEntry called", entry);
        const payload = {
            id: entry.id,
            company_id: currentUser.companyId,
            user_id: entry.userId,
            type: entry.type,
            start_time: entry.startTime,
            status: entry.status,
            job_id: entry.jobId,
            gps_location: typeof entry.gpsLocation === 'object' ? JSON.stringify(entry.gpsLocation) : entry.gpsLocation
        };
        const { error } = await supabase.from('time_entries').insert(payload);
        if (error) {
            console.error("Store: addTimeEntry failed", error);
            alert(`Failed to clock in: ${error.message}`);
            return;
        }
        console.log("Store: addTimeEntry success");
        set((state) => ({ timeEntries: [...state.timeEntries, entry] }));
    },

    updateTimeEntry: async (entry: TimeEntry) => {
        console.log("Store: updateTimeEntry called", entry);
        const payload = {
            end_time: entry.endTime,
            duration_minutes: entry.durationMinutes,
            status: entry.status
        };
        const { error } = await supabase.from('time_entries').update(payload).eq('id', entry.id);
        if (error) {
            console.error("Store: updateTimeEntry failed", error);
            alert(`Failed to update time entry: ${error.message}`);
            return;
        }
        console.log("Store: updateTimeEntry success");
        set((state) => ({ timeEntries: state.timeEntries.map(e => e.id === entry.id ? entry : e) }));
    },

    approveTimeEntry: async (id: string) => {
        await supabase.from('time_entries').update({ status: TimeEntryStatus.APPROVED }).eq('id', id);
        set((state) => ({ timeEntries: state.timeEntries.map(e => e.id === id ? { ...e, status: TimeEntryStatus.APPROVED } : e) }));
    },

    clockIn: () => { }, // Placeholder as per original
    clockOut: () => { }, // Placeholder as per original

    createTrackingLink: async (jobId: string): Promise<string | null> => {
        try {
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);

            const { error } = await supabase
                .from('job_tracking_links')
                .insert({
                    job_id: jobId,
                    token: token,
                    expires_at: expiresAt.toISOString()
                });

            if (error) throw error;

            const url = `${window.location.origin}/track/${token}`;
            return url;
        } catch (error) {
            console.error('Error creating tracking link:', error);
            return null;
        }
    }
});
