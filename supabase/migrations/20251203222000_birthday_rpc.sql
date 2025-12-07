CREATE OR REPLACE FUNCTION get_clients_with_birthday(p_company_id UUID, p_month INT, p_day INT)
RETURNS SETOF clients AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM clients
  WHERE company_id = p_company_id
    AND EXTRACT(MONTH FROM date_of_birth) = p_month
    AND EXTRACT(DAY FROM date_of_birth) = p_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
