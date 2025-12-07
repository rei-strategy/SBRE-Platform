-- Add ON DELETE CASCADE to quotes and invoices tables for client_id
-- This allows deleting a client even if they have associated quotes or invoices

-- Quotes
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_client_id_fkey;
ALTER TABLE quotes ADD CONSTRAINT quotes_client_id_fkey
    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE;

-- Invoices
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_client_id_fkey;
ALTER TABLE invoices ADD CONSTRAINT invoices_client_id_fkey
    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE;
