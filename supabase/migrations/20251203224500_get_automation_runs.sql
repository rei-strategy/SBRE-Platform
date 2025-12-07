CREATE OR REPLACE FUNCTION get_automation_runs(p_automation_id UUID)
RETURNS TABLE (
    id UUID,
    status TEXT,
    current_step_index INT,
    client_name TEXT,
    client_email TEXT,
    last_updated TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ar.id,
        ar.status,
        ar.current_step_index,
        (c.first_name || ' ' || c.last_name) as client_name,
        c.email as client_email,
        ar.updated_at as last_updated
    FROM automation_runs ar
    JOIN clients c ON ar.entity_id = c.id
    WHERE ar.automation_id = p_automation_id
    ORDER BY ar.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
