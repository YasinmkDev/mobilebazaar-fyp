-- MobileBazaar data fix (Sprint 5 audit): iPhones were seeded with
-- "os": "Android 15" by the catalogue generator. Run once in
-- Supabase -> SQL Editor to correct the live database.
UPDATE public.phones
SET specs = jsonb_set(specs, '{os}', '"iOS 26"'::jsonb)
WHERE brand = 'Apple';
