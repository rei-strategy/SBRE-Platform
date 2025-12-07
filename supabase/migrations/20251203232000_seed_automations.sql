-- Seed Prebuilt Automations for all companies

-- 1. New Client Welcome Flow
INSERT INTO marketing_automations (company_id, name, trigger_type, trigger_config, steps, is_active)
SELECT 
    company_id,
    'New Client Welcome Series',
    'NEW_CLIENT',
    '{"conditions": {"id": "root", "logic": "AND", "conditions": []}}'::jsonb,
    '[
        {"id": "s1", "type": "SEND_EMAIL", "config": {"subject": "Welcome!", "content": "Hi {{client.first_name}}, welcome to our family!"}},
        {"id": "s2", "type": "DELAY", "config": {"days": 2}},
        {"id": "s3", "type": "SEND_EMAIL", "config": {"subject": "What to expect", "content": "Here is how we work..."}},
        {"id": "s4", "type": "DELAY", "config": {"days": 3}},
        {"id": "s5", "type": "SEND_EMAIL", "config": {"subject": "Helpful tips", "content": "Did you know..."}}
    ]'::jsonb,
    false
FROM settings;

-- 2. New Job Booking Flow
INSERT INTO marketing_automations (company_id, name, trigger_type, trigger_config, steps, is_active)
SELECT 
    company_id,
    'Job Booking Confirmation',
    'NEW_JOB',
    '{"conditions": {"id": "root", "logic": "AND", "conditions": []}}'::jsonb,
    '[
        {"id": "j1", "type": "SEND_EMAIL", "config": {"to": "client", "subject": "Booking Confirmed", "content": "Your job is booked for {{job.date}}. We look forward to seeing you!"}}
    ]'::jsonb,
    false
FROM settings;

-- 3. Post-Job Review Request
INSERT INTO marketing_automations (company_id, name, trigger_type, trigger_config, steps, is_active)
SELECT 
    company_id,
    'Post-Job Review Request',
    'JOB_COMPLETED',
    '{"conditions": {"id": "root", "logic": "AND", "conditions": []}}'::jsonb,
    '[
        {"id": "p1", "type": "DELAY", "config": {"hours": 1}},
        {"id": "p2", "type": "SEND_EMAIL", "config": {"to": "client", "subject": "How did we do?", "content": "Hi {{client.first_name}}, how did {{technician.name}} do on your recent job?"}}
    ]'::jsonb,
    false
FROM settings;

-- 4. Quote Follow-Up
INSERT INTO marketing_automations (company_id, name, trigger_type, trigger_config, steps, is_active)
SELECT 
    company_id,
    'Quote Follow-Up',
    'NEW_QUOTE',
    '{"conditions": {"id": "root", "logic": "AND", "conditions": []}}'::jsonb,
    '[
        {"id": "q1", "type": "SEND_EMAIL", "config": {"to": "client", "subject": "Quote #{{quote.number}}", "content": "Here is your quote for ${{quote.total}}. Let us know if you have questions."}},
        {"id": "q2", "type": "DELAY", "config": {"days": 2}},
        {"id": "q3", "type": "SEND_EMAIL", "config": {"to": "client", "subject": "Thinking about it?", "content": "Just checking in on the quote we sent."}}
    ]'::jsonb,
    false
FROM settings;

-- 5. Birthday Flow
INSERT INTO marketing_automations (company_id, name, trigger_type, trigger_config, steps, is_active)
SELECT 
    company_id,
    'Birthday Celebration',
    'CLIENT_BIRTHDAY',
    '{"conditions": {"id": "root", "logic": "AND", "conditions": []}}'::jsonb,
    '[
        {"id": "b1", "type": "SEND_EMAIL", "config": {"to": "client", "subject": "Happy Birthday!", "content": "Happy Birthday {{client.first_name}}! We hope you have a great day."}}
    ]'::jsonb,
    false
FROM settings;

-- 6. Re-Engagement
INSERT INTO marketing_automations (company_id, name, trigger_type, trigger_config, steps, is_active)
SELECT 
    company_id,
    'Client Re-Engagement',
    'DORMANT_CLIENT',
    '{"conditions": {"id": "root", "logic": "AND", "conditions": []}}'::jsonb,
    '[
        {"id": "r1", "type": "SEND_EMAIL", "config": {"to": "client", "subject": "We miss you", "content": "It has been a while since we saw you. Here is a special offer..."}}
    ]'::jsonb,
    false
FROM settings;
