-- 1. Drop existing tables (Clean Slate)
DROP TABLE IF EXISTS automation_runs CASCADE;
DROP TABLE IF EXISTS marketing_automations CASCADE;

-- 2. Re-create Marketing Automations Table
CREATE TABLE marketing_automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL, -- No foreign key to settings to avoid issues if settings is empty
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL, -- 'NEW_CLIENT', 'JOB_COMPLETED', etc.
    trigger_config JSONB DEFAULT '{}'::jsonb,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of steps (EMAIL, DELAY)
    is_active BOOLEAN DEFAULT FALSE,
    stats JSONB DEFAULT '{"runs": 0, "completed": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Re-create Automation Runs Table
CREATE TABLE automation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    automation_id UUID REFERENCES marketing_automations(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL, -- ID of the client, job, etc. that triggered it
    status TEXT NOT NULL, -- 'RUNNING', 'WAITING', 'COMPLETED', 'FAILED'
    current_step_index INTEGER DEFAULT 0,
    next_run_at TIMESTAMP WITH TIME ZONE, -- For scheduled steps
    logs JSONB DEFAULT '[]'::jsonb, -- Execution history
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE marketing_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Allow all authenticated users for now to prevent visibility issues)
CREATE POLICY "Enable all access for authenticated users" ON marketing_automations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON automation_runs FOR ALL USING (auth.role() = 'authenticated');

-- 6. Seed Data for ALL Companies
DO $$
DECLARE
    company_rec RECORD;
BEGIN
    -- Loop through all unique company_ids found in profiles
    FOR company_rec IN 
        SELECT DISTINCT company_id FROM profiles WHERE company_id IS NOT NULL
    LOOP
        -- Insert Default Workflows for this company
        INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
        VALUES 
        (
            company_rec.company_id,
            'New Client Welcome Series',
            'Welcome new clients and introduce your services.',
            'NEW_CLIENT',
            TRUE,
            '[
                {"id": "step_1", "type": "EMAIL", "config": {"subject": "Welcome to our family!", "content": "<p>Hi {{client.first_name}},</p><p>Thanks for joining us! We are thrilled to have you.</p>"}},
                {"id": "step_2", "type": "DELAY", "config": {"days": 2}},
                {"id": "step_3", "type": "EMAIL", "config": {"subject": "How can we help?", "content": "<p>Hi {{client.first_name}},</p><p>Just checking in to see if you need anything.</p>"}}
            ]'::jsonb
        ),
        (
            company_rec.company_id,
            'Post-Service Follow-Up',
            'Ask for a review after a job is completed.',
            'JOB_COMPLETED',
            TRUE,
            '[
                {"id": "step_1", "type": "DELAY", "config": {"days": 1}},
                {"id": "step_2", "type": "EMAIL", "config": {"subject": "How did we do?", "content": "<p>Hi {{client.first_name}},</p><p>We finished the job at {{job.address}}. How was your experience?</p>"}}
            ]'::jsonb
        ),
        (
            company_rec.company_id,
            'Technician On My Way',
            'Notify client when technician is en route.',
            'ON_MY_WAY',
            TRUE,
            '[
                {"id": "step_1", "type": "EMAIL", "config": {"subject": "Technician is on the way!", "content": "<p>Hi {{client.first_name}},</p><p>Our technician is on the way to your property.</p>"}}
            ]'::jsonb
        ),
        (
            company_rec.company_id,
            'Dormant Client Re-engagement',
            'Win back clients who haven''t booked in 6 months.',
            'DORMANT',
            TRUE,
            '[
                {"id": "step_1", "type": "EMAIL", "config": {"subject": "We miss you!", "content": "<p>Hi {{client.first_name}},</p><p>It''s been a while. Here is a 10% discount code for your next service.</p>"}}
            ]'::jsonb
        ),
        (
            company_rec.company_id,
            'Birthday Flow',
            'Send a birthday greeting.',
            'BIRTHDAY',
            TRUE,
            '[
                {"id": "step_1", "type": "EMAIL", "config": {"subject": "Happy Birthday!", "content": "<p>Hi {{client.first_name}},</p><p>Happy Birthday from the team!</p>"}}
            ]'::jsonb
        ),
        (
            company_rec.company_id,
            'Quote Follow-Up',
            'Follow up on sent quotes after 3 days.',
            'QUOTE_SENT',
            TRUE,
            '[
                {"id": "step_1", "type": "DELAY", "config": {"days": 3}},
                {"id": "step_2", "type": "EMAIL", "config": {"subject": "Any questions about your quote?", "content": "<p>Hi {{client.first_name}},</p><p>Just checking if you had any questions about the quote we sent.</p>"}}
            ]'::jsonb
        );
    END LOOP;
END $$;
