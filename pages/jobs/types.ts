import { Job, Client } from '../../types';

export type JobFilterType = 'ALL' | 'ACTIVE' | 'DRAFTS' | 'COMPLETED' | 'HIGH_PRIORITY';
export type ViewType = 'TABLE' | 'PIPELINE' | 'CRM_PIPELINE' | 'GANTT' | 'MAP';
export type SortKey = 'JOB' | 'CLIENT' | 'DATE' | 'VEHICLE' | 'STATUS' | 'TECH' | 'VALUE';

export interface JobsViewProps {
    jobs: Job[];
    clients: Client[];
}
