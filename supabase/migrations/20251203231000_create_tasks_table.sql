CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID, -- User ID
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED
    related_client_id UUID,
    related_job_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON tasks FOR ALL USING (auth.role() = 'authenticated');
