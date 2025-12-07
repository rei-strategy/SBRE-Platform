-- Add cost column to line_items for profit calculation
alter table line_items add column if not exists cost numeric default 0;
