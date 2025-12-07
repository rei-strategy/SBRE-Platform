-- Fix dependencies on jobs table to allow deletion
-- 1. Time Entries should be deleted if the job is deleted
-- 2. Invoices should remain but have job_id set to NULL if the job is deleted

-- Time Entries
ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_job_id_fkey;
ALTER TABLE time_entries ADD CONSTRAINT time_entries_job_id_fkey
    FOREIGN KEY (job_id)
    REFERENCES jobs(id)
    ON DELETE CASCADE;

-- Invoices
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_job_id_fkey;
ALTER TABLE invoices ADD CONSTRAINT invoices_job_id_fkey
    FOREIGN KEY (job_id)
    REFERENCES jobs(id)
    ON DELETE SET NULL;
