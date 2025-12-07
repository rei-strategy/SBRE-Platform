-- Restore default automations if they are missing
DO $$
DECLARE
    company_rec RECORD;
BEGIN
    -- Loop through all unique company_ids found in profiles
    FOR company_rec IN 
        SELECT DISTINCT company_id FROM profiles WHERE company_id IS NOT NULL
    LOOP
        -- 1. New Client Welcome Series
        IF NOT EXISTS (SELECT 1 FROM marketing_automations WHERE company_id = company_rec.company_id AND name = 'New Client Welcome Series') THEN
            INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
            VALUES (
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
            );
        END IF;

        -- 2. Post-Service Follow-Up
        IF NOT EXISTS (SELECT 1 FROM marketing_automations WHERE company_id = company_rec.company_id AND name = 'Post-Service Follow-Up') THEN
            INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
            VALUES (
                company_rec.company_id,
                'Post-Service Follow-Up',
                'Ask for a review after a job is completed.',
                'JOB_COMPLETED',
                TRUE,
                '[
                    {"id": "step_1", "type": "DELAY", "config": {"days": 1}},
                    {"id": "step_2", "type": "EMAIL", "config": {"subject": "How did we do?", "content": "<p>Hi {{client.first_name}},</p><p>We finished the job at {{job.address}}. How was your experience?</p>"}}
                ]'::jsonb
            );
        END IF;

        -- 3. Technician On My Way
        IF NOT EXISTS (SELECT 1 FROM marketing_automations WHERE company_id = company_rec.company_id AND name = 'Technician On My Way') THEN
            INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
            VALUES (
                company_rec.company_id,
                'Technician On My Way',
                'Notify client when technician is en route.',
                'ON_MY_WAY',
                TRUE,
                '[
                    {"id": "step_1", "type": "EMAIL", "config": {"subject": "Technician is on the way!", "content": "<p>Hi {{client.first_name}},</p><p>Our technician is on the way to your property.</p>"}}
                ]'::jsonb
            );
        END IF;

        -- 4. Dormant Client Re-engagement
        IF NOT EXISTS (SELECT 1 FROM marketing_automations WHERE company_id = company_rec.company_id AND name = 'Dormant Client Re-engagement') THEN
            INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
            VALUES (
                company_rec.company_id,
                'Dormant Client Re-engagement',
                'Win back clients who haven''t booked in 6 months.',
                'DORMANT',
                TRUE,
                '[
                    {"id": "step_1", "type": "EMAIL", "config": {"subject": "We miss you!", "content": "<p>Hi {{client.first_name}},</p><p>It''s been a while. Here is a 10% discount code for your next service.</p>"}}
                ]'::jsonb
            );
        END IF;

        -- 5. Birthday Flow
        IF NOT EXISTS (SELECT 1 FROM marketing_automations WHERE company_id = company_rec.company_id AND name = 'Birthday Flow') THEN
            INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
            VALUES (
                company_rec.company_id,
                'Birthday Flow',
                'Send a birthday greeting.',
                'BIRTHDAY',
                TRUE,
                '[
                    {"id": "step_1", "type": "EMAIL", "config": {"subject": "Happy Birthday!", "content": "<p>Hi {{client.first_name}},</p><p>Happy Birthday from the team!</p>"}}
                ]'::jsonb
            );
        END IF;

        -- 6. Quote Follow-Up
        IF NOT EXISTS (SELECT 1 FROM marketing_automations WHERE company_id = company_rec.company_id AND name = 'Quote Follow-Up') THEN
            INSERT INTO marketing_automations (company_id, name, description, trigger_type, is_active, steps)
            VALUES (
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
        END IF;

    END LOOP;
END $$;
