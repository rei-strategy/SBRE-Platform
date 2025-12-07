-- 1. Create Automation Queue Table
CREATE TABLE IF NOT EXISTS automation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    error TEXT
);

-- 2. Enable RLS
ALTER TABLE automation_queue ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy (Allow authenticated users to insert/read)
CREATE POLICY "Enable all access for authenticated users" ON automation_queue FOR ALL USING (auth.role() = 'authenticated');

-- 4. Generic Trigger Function to Queue Events
CREATE OR REPLACE FUNCTION queue_automation_event()
RETURNS TRIGGER AS $$
DECLARE
    event_type_arg TEXT;
    payload_data JSONB;
    entity_id_val UUID;
    company_id_val UUID;
BEGIN
    -- Get event type from arguments
    event_type_arg := TG_ARGV[0];
    
    -- Determine payload and IDs based on operation
    IF (TG_OP = 'DELETE') THEN
        payload_data := row_to_json(OLD)::jsonb;
        entity_id_val := OLD.id;
        company_id_val := OLD.company_id;
    ELSE
        payload_data := row_to_json(NEW)::jsonb;
        entity_id_val := NEW.id;
        company_id_val := NEW.company_id;
    END IF;

    -- Special Logic for Updates (Check if status changed)
    IF (TG_OP = 'UPDATE') THEN
        -- For Job Status Change
        IF (event_type_arg = 'JOB_STATUS_CHANGED') THEN
            IF (OLD.status = NEW.status) THEN
                RETURN NEW; -- Status didn't change, ignore
            END IF;
        END IF;

        -- For Quote Approval
        IF (event_type_arg = 'QUOTE_APPROVED') THEN
            IF (NEW.status != 'APPROVED' OR OLD.status = 'APPROVED') THEN
                RETURN NEW; -- Not an approval event
            END IF;
        END IF;

        -- For Invoice Paid
        IF (event_type_arg = 'INVOICE_PAID') THEN
            IF (NEW.status != 'PAID' OR OLD.status = 'PAID') THEN
                RETURN NEW; -- Not a payment event
            END IF;
        END IF;
    END IF;

    -- Insert into Queue
    INSERT INTO automation_queue (company_id, event_type, entity_id, payload)
    VALUES (company_id_val, event_type_arg, entity_id_val, payload_data);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Triggers

-- Clients
DROP TRIGGER IF EXISTS on_client_created ON clients;
CREATE TRIGGER on_client_created
AFTER INSERT ON clients
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('NEW_CLIENT');

-- Jobs
DROP TRIGGER IF EXISTS on_job_created ON jobs;
CREATE TRIGGER on_job_created
AFTER INSERT ON jobs
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('NEW_JOB');

DROP TRIGGER IF EXISTS on_job_status_changed ON jobs;
CREATE TRIGGER on_job_status_changed
AFTER UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('JOB_STATUS_CHANGED');

-- Quotes
DROP TRIGGER IF EXISTS on_quote_created ON quotes;
CREATE TRIGGER on_quote_created
AFTER INSERT ON quotes
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('NEW_QUOTE');

DROP TRIGGER IF EXISTS on_quote_approved ON quotes;
CREATE TRIGGER on_quote_approved
AFTER UPDATE ON quotes
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('QUOTE_APPROVED');

-- Invoices
DROP TRIGGER IF EXISTS on_invoice_created ON invoices;
CREATE TRIGGER on_invoice_created
AFTER INSERT ON invoices
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('NEW_INVOICE');

DROP TRIGGER IF EXISTS on_invoice_paid ON invoices;
CREATE TRIGGER on_invoice_paid
AFTER UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION queue_automation_event('INVOICE_PAID');
