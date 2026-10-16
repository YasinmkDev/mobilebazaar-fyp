-- Seed: the 24 catalogue phones + 48 variants, generated 1:1 from lib/products.ts
-- (replicates toPhone: ids ph-1..ph-24, same SKUs, prices, RAM/storage rules).
-- Run AFTER 001_initial_schema.sql. Idempotent via ON CONFLICT DO NOTHING.

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-1', 'infinix-smart-20', 'Infinix', 'Smart 20', 'Big screen, all-day battery, honest price', 4.9, 37,
  '{Black,Blue,Silver}', 152, '{budget}', true, 'Infinix Official Warranty',
  '{"display": "6.7\" HD+", "refreshHz": 90, "chipset": "Helio G81", "mainCameraMp": 13, "selfieCameraMp": 8, "batteryMah": 5000, "chargingW": 10, "fiveG": false, "nfc": false, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('infinix-smart-20-128', 'ph-1', 128, 8, 39499, 42999, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('infinix-smart-20-256', 'ph-1', 256, 12, 44199, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-2', 'tecno-spark-go-2', 'Tecno', 'Spark Go 2', 'The starter smartphone that just works', 4.5, 112,
  '{Black,Blue,Silver}', 210, '{budget}', true, 'Tecno Official Warranty',
  '{"display": "6.67\" HD+", "refreshHz": 120, "chipset": "Unisoc T7250", "mainCameraMp": 13, "selfieCameraMp": 8, "batteryMah": 5000, "chargingW": 15, "fiveG": false, "nfc": false, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-spark-go-2-64', 'ph-2', 64, 4, 21499, NULL, 15)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-spark-go-2-128', 'ph-2', 128, 4, 24699, NULL, 9)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-3', 'xiaomi-redmi-a3', 'Xiaomi', 'Redmi A3', 'Clean design, dependable everyday phone', 4.4, 98,
  '{Black,Blue,Silver}', 190, '{budget}', true, 'Xiaomi Official Warranty',
  '{"display": "6.71\" HD+", "refreshHz": 90, "chipset": "Helio G36", "mainCameraMp": 8, "selfieCameraMp": 5, "batteryMah": 5000, "chargingW": 10, "fiveG": false, "nfc": false, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-redmi-a3-64', 'ph-3', 64, 4, 17450, NULL, 15)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-redmi-a3-128', 'ph-3', 128, 4, 20099, NULL, 9)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-4', 'realme-note-60x', 'Realme', 'Note 60x', 'Tough build for rough everyday use', 4.5, 76,
  '{Black,Blue,Silver}', 230, '{budget}', true, 'Realme Official Warranty',
  '{"display": "6.74\" HD+", "refreshHz": 90, "chipset": "Unisoc T612", "mainCameraMp": 32, "selfieCameraMp": 5, "batteryMah": 5000, "chargingW": 10, "fiveG": false, "nfc": false, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('realme-note-60x-64', 'ph-4', 64, 4, 23999, NULL, 15)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('realme-note-60x-128', 'ph-4', 128, 4, 27599, NULL, 9)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-5', 'tecno-spark-40', 'Tecno', 'Spark 40', 'Slim, bright and surprisingly fast', 4.6, 64,
  '{Black,Blue,Silver}', 170, '{budget,camera}', true, 'Tecno Official Warranty',
  '{"display": "6.67\" HD+", "refreshHz": 120, "chipset": "Helio G81", "mainCameraMp": 50, "selfieCameraMp": 8, "batteryMah": 5200, "chargingW": 45, "fiveG": false, "nfc": false, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-spark-40-128', 'ph-5', 128, 8, 35999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-spark-40-256', 'ph-5', 256, 12, 40299, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-6', 'infinix-hot-60-pro', 'Infinix', 'Hot 60 Pro', 'Gaming-ready power on a budget', 4.7, 143,
  '{Black,Blue,Silver}', 265, '{gaming,budget}', true, 'Infinix Official Warranty',
  '{"display": "6.78\" AMOLED", "refreshHz": 144, "chipset": "Helio G200", "mainCameraMp": 50, "selfieCameraMp": 13, "batteryMah": 5160, "chargingW": 45, "fiveG": false, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('infinix-hot-60-pro-128', 'ph-6', 128, 8, 61999, 66999, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('infinix-hot-60-pro-256', 'ph-6', 256, 12, 69399, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-7', 'tecno-camon-40-pro', 'Tecno', 'Camon 40 Pro', 'Camera-first, portrait lovers'' pick', 4.7, 89,
  '{Black,Blue,Silver}', 320, '{camera}', true, 'Tecno Official Warranty',
  '{"display": "6.78\" AMOLED", "refreshHz": 120, "chipset": "Helio G100", "mainCameraMp": 50, "selfieCameraMp": 50, "batteryMah": 5200, "chargingW": 45, "fiveG": false, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-camon-40-pro-128', 'ph-7', 128, 8, 69999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-camon-40-pro-256', 'ph-7', 256, 12, 78399, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-8', 'samsung-galaxy-a16', 'Samsung', 'Galaxy A16', 'Samsung reliability, years of updates', 4.6, 210,
  '{Black,Blue,Silver}', 205, '{budget}', true, 'Samsung Official Warranty',
  '{"display": "6.7\" Super AMOLED", "refreshHz": 90, "chipset": "Helio G99", "mainCameraMp": 50, "selfieCameraMp": 13, "batteryMah": 5000, "chargingW": 25, "fiveG": false, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-a16-128', 'ph-8', 128, 8, 54999, 59999, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-a16-256', 'ph-8', 256, 12, 61599, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-9', 'xiaomi-redmi-note-14', 'Xiaomi', 'Redmi Note 14', 'The mid-range benchmark', 4.7, 320,
  '{Black,Blue,Silver}', 200, '{camera,gaming}', true, 'Xiaomi Official Warranty',
  '{"display": "6.67\" AMOLED", "refreshHz": 120, "chipset": "Helio G99 Ultra", "mainCameraMp": 108, "selfieCameraMp": 20, "batteryMah": 5500, "chargingW": 33, "fiveG": false, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-redmi-note-14-128', 'ph-9', 128, 8, 64999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-redmi-note-14-256', 'ph-9', 256, 12, 72799, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-10', 'vivo-v40-lite', 'Vivo', 'V40 Lite', 'Fast charging, feather-light feel', 4.5, 58,
  '{Black,Blue,Silver}', 280, '{camera}', true, 'Vivo Official Warranty',
  '{"display": "6.67\" AMOLED", "refreshHz": 120, "chipset": "Snapdragon 685", "mainCameraMp": 50, "selfieCameraMp": 32, "batteryMah": 5000, "chargingW": 80, "fiveG": false, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('vivo-v40-lite-128', 'ph-10', 128, 8, 74999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('vivo-v40-lite-256', 'ph-10', 256, 12, 83999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-11', 'oppo-reno-13-f', 'Oppo', 'Reno 13 F', 'Portrait AI in a slim body', 4.6, 47,
  '{Black,Blue,Silver}', 300, '{camera}', true, 'Oppo Official Warranty',
  '{"display": "6.67\" AMOLED", "refreshHz": 120, "chipset": "Snapdragon 6 Gen 1", "mainCameraMp": 50, "selfieCameraMp": 32, "batteryMah": 5800, "chargingW": 45, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('oppo-reno-13-f-128', 'ph-11', 128, 8, 89999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('oppo-reno-13-f-256', 'ph-11', 256, 12, 100799, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-12', 'infinix-note-60-5g', 'Infinix', 'Note 60 5G', '5G speed without the flagship bill', 4.7, 71,
  '{Black,Blue,Silver}', 240, '{gaming,5g}', true, 'Infinix Official Warranty',
  '{"display": "6.78\" AMOLED", "refreshHz": 144, "chipset": "Dimensity 7300", "mainCameraMp": 50, "selfieCameraMp": 13, "batteryMah": 5200, "chargingW": 45, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('infinix-note-60-5g-128', 'ph-12', 128, 8, 94999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('infinix-note-60-5g-256', 'ph-12', 256, 12, 106399, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-13', 'tecno-camon-50-pro', 'Tecno', 'Camon 50 Pro', 'Pro portraits, pro price-to-value', 4.7, 66,
  '{Black,Blue,Silver}', 330, '{camera}', true, 'Tecno Official Warranty',
  '{"display": "6.78\" AMOLED", "refreshHz": 144, "chipset": "Dimensity 7300", "mainCameraMp": 50, "selfieCameraMp": 50, "batteryMah": 5200, "chargingW": 45, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-camon-50-pro-128', 'ph-13', 128, 8, 94999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('tecno-camon-50-pro-256', 'ph-13', 256, 12, 106399, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-14', 'samsung-galaxy-a36', 'Samsung', 'Galaxy A36', 'The balanced Samsung for most people', 4.7, 188,
  '{Black,Blue,Silver}', 215, '{camera,5g}', true, 'Samsung Official Warranty',
  '{"display": "6.7\" Super AMOLED", "refreshHz": 120, "chipset": "Snapdragon 6 Gen 3", "mainCameraMp": 50, "selfieCameraMp": 12, "batteryMah": 5000, "chargingW": 45, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-a36-128', 'ph-14', 128, 8, 119999, 129999, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-a36-256', 'ph-14', 256, 12, 134399, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-15', 'xiaomi-poco-x7-pro', 'Xiaomi', 'Poco X7 Pro', 'Flagship-grade gaming, mid-range price', 4.8, 240,
  '{Black,Blue,Silver}', 45, '{gaming,5g}', true, 'Xiaomi Official Warranty',
  '{"display": "6.67\" AMOLED", "refreshHz": 120, "chipset": "Dimensity 8400 Ultra", "mainCameraMp": 50, "selfieCameraMp": 20, "batteryMah": 6000, "chargingW": 90, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-poco-x7-pro-128', 'ph-15', 128, 8, 124999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-poco-x7-pro-256', 'ph-15', 256, 12, 139999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-16', 'samsung-galaxy-a56', 'Samsung', 'Galaxy A56', 'Premium feel, long software support', 4.8, 176,
  '{Black,Blue,Silver}', 225, '{camera,5g}', true, 'Samsung Official Warranty',
  '{"display": "6.7\" Super AMOLED", "refreshHz": 120, "chipset": "Exynos 1580", "mainCameraMp": 50, "selfieCameraMp": 12, "batteryMah": 5000, "chargingW": 45, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-a56-128', 'ph-16', 128, 8, 139999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-a56-256', 'ph-16', 256, 12, 156799, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-17', 'honor-magic-7-lite', 'Honor', 'Magic 7 Lite', 'Drop-tested toughness, huge battery', 4.6, 39,
  '{Black,Blue,Silver}', 160, '{battery}', true, 'Honor Official Warranty',
  '{"display": "6.78\" AMOLED", "refreshHz": 120, "chipset": "Snapdragon 6 Gen 1", "mainCameraMp": 108, "selfieCameraMp": 16, "batteryMah": 6600, "chargingW": 66, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('honor-magic-7-lite-128', 'ph-17', 128, 8, 109999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('honor-magic-7-lite-256', 'ph-17', 256, 12, 123199, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-18', 'nothing-phone-3a-pro', 'Nothing', 'Phone (3a) Pro', 'Glyph lights, clean software, standout design', 4.7, 92,
  '{Black,Blue,Silver}', 0, '{camera,5g}', true, 'Nothing Official Warranty',
  '{"display": "6.77\" AMOLED", "refreshHz": 120, "chipset": "Snapdragon 7s Gen 3", "mainCameraMp": 50, "selfieCameraMp": 50, "batteryMah": 5000, "chargingW": 50, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('nothing-phone-3a-pro-128', 'ph-18', 128, 8, 164999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('nothing-phone-3a-pro-256', 'ph-18', 256, 12, 184799, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-19', 'samsung-galaxy-s26-fe', 'Samsung', 'Galaxy S26 FE', 'Flagship essentials, friendlier price', 4.8, 134,
  '{Black,Blue,Silver}', 235, '{flagship,camera}', true, 'Samsung Official Warranty',
  '{"display": "6.7\" AMOLED 2X", "refreshHz": 120, "chipset": "Exynos 2400e", "mainCameraMp": 50, "selfieCameraMp": 12, "batteryMah": 4700, "chargingW": 25, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-s26-fe-128', 'ph-19', 128, 8, 249999, 269999, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-s26-fe-256', 'ph-19', 256, 12, 279999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-20', 'xiaomi-16t-pro', 'Xiaomi', '16T Pro', 'Leica colour, flagship cameras', 4.8, 67,
  '{Black,Blue,Silver}', 20, '{flagship,camera}', true, 'Xiaomi Official Warranty',
  '{"display": "6.83\" AMOLED", "refreshHz": 144, "chipset": "Dimensity 9400+", "mainCameraMp": 50, "selfieCameraMp": 32, "batteryMah": 5500, "chargingW": 120, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-16t-pro-128', 'ph-20', 128, 8, 249999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('xiaomi-16t-pro-256', 'ph-20', 256, 12, 279999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-21', 'nothing-phone-3', 'Nothing', 'Phone (3)', 'The design statement of the year', 4.7, 54,
  '{Black,Blue,Silver}', 10, '{flagship}', true, 'Nothing Official Warranty',
  '{"display": "6.67\" AMOLED", "refreshHz": 120, "chipset": "Snapdragon 8s Gen 4", "mainCameraMp": 50, "selfieCameraMp": 50, "batteryMah": 5150, "chargingW": 65, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('nothing-phone-3-128', 'ph-21', 128, 8, 299999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('nothing-phone-3-256', 'ph-21', 256, 12, 335999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-22', 'samsung-galaxy-s26', 'Samsung', 'Galaxy S26', 'Compact flagship, Galaxy AI inside', 4.9, 201,
  '{Black,Blue,Silver}', 245, '{flagship,camera}', true, 'Samsung Official Warranty',
  '{"display": "6.3\" AMOLED 2X", "refreshHz": 120, "chipset": "Snapdragon 8 Elite Gen 5", "mainCameraMp": 50, "selfieCameraMp": 12, "batteryMah": 4300, "chargingW": 25, "fiveG": true, "nfc": true, "os": "Android 15"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-s26-128', 'ph-22', 128, 8, 284799, 319999, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('samsung-galaxy-s26-256', 'ph-22', 256, 12, 318999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-23', 'apple-iphone-17', 'Apple', 'iPhone 17', 'The iPhone most people should buy', 4.9, 310,
  '{Black,Blue,Silver}', 260, '{flagship,camera}', true, 'Apple Official Warranty',
  '{"display": "6.3\" Super Retina XDR", "refreshHz": 120, "chipset": "Apple A19", "mainCameraMp": 48, "selfieCameraMp": 18, "batteryMah": 3692, "chargingW": 20, "fiveG": true, "nfc": true, "os": "iOS 26"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('apple-iphone-17-128', 'ph-23', 128, 8, 339999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('apple-iphone-17-256', 'ph-23', 256, 12, 380799, NULL, 7)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)
VALUES ('ph-24', 'apple-iphone-17-pro-max', 'Apple', 'iPhone 17 Pro Max', 'The ultimate camera phone', 4.9, 265,
  '{Black,Blue,Silver}', 30, '{flagship,camera}', true, 'Apple Official Warranty',
  '{"display": "6.9\" Super Retina XDR", "refreshHz": 120, "chipset": "Apple A19 Pro", "mainCameraMp": 48, "selfieCameraMp": 18, "batteryMah": 5088, "chargingW": 25, "fiveG": true, "nfc": true, "os": "iOS 26"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('apple-iphone-17-pro-max-128', 'ph-24', 128, 8, 474999, NULL, 12)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)
VALUES ('apple-iphone-17-pro-max-256', 'ph-24', 256, 12, 531999, NULL, 7)
ON CONFLICT (sku) DO NOTHING;
