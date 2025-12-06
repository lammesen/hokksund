-- Kindergardener Seed Data
-- Fictional test data for development

-- Note: This seed file assumes users are created through Supabase Auth
-- and profiles are automatically created via trigger.
-- Run this after creating test users in Supabase Auth dashboard.

-- Example user UUIDs (replace with actual UUIDs from your Supabase Auth users)
-- Staff users
-- staff1@eventyrhagen.no - UUID placeholder
-- staff2@eventyrhagen.no - UUID placeholder
-- staff3@eventyrhagen.no - UUID placeholder

-- Parent users
-- parent1@example.no - UUID placeholder (through parent10@example.no)

-- Children (15 total across 3 groups)
INSERT INTO public.children (id, first_name, last_name, date_of_birth, group_name) VALUES
  -- Trollene group (5 children)
  ('c0000001-0000-0000-0000-000000000001', 'Emma', 'Hansen', '2020-03-15', 'Trollene'),
  ('c0000001-0000-0000-0000-000000000002', 'Olav', 'Johansen', '2020-05-22', 'Trollene'),
  ('c0000001-0000-0000-0000-000000000003', 'Sofie', 'Andersen', '2020-01-08', 'Trollene'),
  ('c0000001-0000-0000-0000-000000000004', 'Henrik', 'Larsen', '2020-07-30', 'Trollene'),
  ('c0000001-0000-0000-0000-000000000005', 'Nora', 'Pedersen', '2020-11-12', 'Trollene'),

  -- Elvene group (5 children)
  ('c0000001-0000-0000-0000-000000000006', 'Magnus', 'Nilsen', '2019-02-18', 'Elvene'),
  ('c0000001-0000-0000-0000-000000000007', 'Ingrid', 'Eriksen', '2019-06-25', 'Elvene'),
  ('c0000001-0000-0000-0000-000000000008', 'Erik', 'Berg', '2019-09-03', 'Elvene'),
  ('c0000001-0000-0000-0000-000000000009', 'Astrid', 'Kristiansen', '2019-04-14', 'Elvene'),
  ('c0000001-0000-0000-0000-000000000010', 'Lars', 'Olsen', '2019-12-01', 'Elvene'),

  -- Nissene group (5 children)
  ('c0000001-0000-0000-0000-000000000011', 'Maja', 'Haugen', '2021-01-20', 'Nissene'),
  ('c0000001-0000-0000-0000-000000000012', 'Jonas', 'Solberg', '2021-04-07', 'Nissene'),
  ('c0000001-0000-0000-0000-000000000013', 'Ella', 'Moen', '2021-08-16', 'Nissene'),
  ('c0000001-0000-0000-0000-000000000014', 'Oscar', 'Bakken', '2021-02-28', 'Nissene'),
  ('c0000001-0000-0000-0000-000000000015', 'Leah', 'Holm', '2021-06-11', 'Nissene');

-- Emergency Contacts (2-3 per child)
INSERT INTO public.contacts (child_id, contact_name, relationship, phone, email, is_primary) VALUES
  -- Emma Hansen contacts
  ('c0000001-0000-0000-0000-000000000001', 'Kari Hansen', 'Mor', '+47 912 34 567', 'kari.hansen@example.no', true),
  ('c0000001-0000-0000-0000-000000000001', 'Per Hansen', 'Far', '+47 923 45 678', 'per.hansen@example.no', false),
  ('c0000001-0000-0000-0000-000000000001', 'Anne Hansen', 'Bestemor', '+47 934 56 789', null, false),

  -- Olav Johansen contacts
  ('c0000001-0000-0000-0000-000000000002', 'Lise Johansen', 'Mor', '+47 945 67 890', 'lise.johansen@example.no', true),
  ('c0000001-0000-0000-0000-000000000002', 'Thomas Johansen', 'Far', '+47 956 78 901', 'thomas.johansen@example.no', false),

  -- Sofie Andersen contacts
  ('c0000001-0000-0000-0000-000000000003', 'Maria Andersen', 'Mor', '+47 967 89 012', 'maria.andersen@example.no', true),
  ('c0000001-0000-0000-0000-000000000003', 'Jon Andersen', 'Far', '+47 978 90 123', 'jon.andersen@example.no', false),
  ('c0000001-0000-0000-0000-000000000003', 'Eva Andersen', 'Tante', '+47 989 01 234', null, false),

  -- Henrik Larsen contacts
  ('c0000001-0000-0000-0000-000000000004', 'Silje Larsen', 'Mor', '+47 990 12 345', 'silje.larsen@example.no', true),
  ('c0000001-0000-0000-0000-000000000004', 'Anders Larsen', 'Far', '+47 901 23 456', 'anders.larsen@example.no', false),

  -- Nora Pedersen contacts
  ('c0000001-0000-0000-0000-000000000005', 'Hilde Pedersen', 'Mor', '+47 912 34 568', 'hilde.pedersen@example.no', true),
  ('c0000001-0000-0000-0000-000000000005', 'Morten Pedersen', 'Far', '+47 923 45 679', 'morten.pedersen@example.no', false),

  -- Magnus Nilsen contacts
  ('c0000001-0000-0000-0000-000000000006', 'Kristin Nilsen', 'Mor', '+47 934 56 780', 'kristin.nilsen@example.no', true),
  ('c0000001-0000-0000-0000-000000000006', 'Geir Nilsen', 'Far', '+47 945 67 891', 'geir.nilsen@example.no', false),
  ('c0000001-0000-0000-0000-000000000006', 'Bjorn Nilsen', 'Onkel', '+47 956 78 902', null, false),

  -- Ingrid Eriksen contacts
  ('c0000001-0000-0000-0000-000000000007', 'Tone Eriksen', 'Mor', '+47 967 89 013', 'tone.eriksen@example.no', true),
  ('c0000001-0000-0000-0000-000000000007', 'Rune Eriksen', 'Far', '+47 978 90 124', 'rune.eriksen@example.no', false),

  -- Erik Berg contacts
  ('c0000001-0000-0000-0000-000000000008', 'Linda Berg', 'Mor', '+47 989 01 235', 'linda.berg@example.no', true),
  ('c0000001-0000-0000-0000-000000000008', 'Hans Berg', 'Far', '+47 990 12 346', 'hans.berg@example.no', false),

  -- Astrid Kristiansen contacts
  ('c0000001-0000-0000-0000-000000000009', 'Vibeke Kristiansen', 'Mor', '+47 901 23 457', 'vibeke.kristiansen@example.no', true),
  ('c0000001-0000-0000-0000-000000000009', 'Stein Kristiansen', 'Far', '+47 912 34 569', 'stein.kristiansen@example.no', false),
  ('c0000001-0000-0000-0000-000000000009', 'Ruth Kristiansen', 'Bestemor', '+47 923 45 680', null, false),

  -- Lars Olsen contacts
  ('c0000001-0000-0000-0000-000000000010', 'Nina Olsen', 'Mor', '+47 934 56 781', 'nina.olsen@example.no', true),
  ('c0000001-0000-0000-0000-000000000010', 'Petter Olsen', 'Far', '+47 945 67 892', 'petter.olsen@example.no', false),

  -- Maja Haugen contacts
  ('c0000001-0000-0000-0000-000000000011', 'Camilla Haugen', 'Mor', '+47 956 78 903', 'camilla.haugen@example.no', true),
  ('c0000001-0000-0000-0000-000000000011', 'Fredrik Haugen', 'Far', '+47 967 89 014', 'fredrik.haugen@example.no', false),

  -- Jonas Solberg contacts
  ('c0000001-0000-0000-0000-000000000012', 'Anette Solberg', 'Mor', '+47 978 90 125', 'anette.solberg@example.no', true),
  ('c0000001-0000-0000-0000-000000000012', 'Trond Solberg', 'Far', '+47 989 01 236', 'trond.solberg@example.no', false),
  ('c0000001-0000-0000-0000-000000000012', 'Grete Solberg', 'Bestemor', '+47 990 12 347', null, false),

  -- Ella Moen contacts
  ('c0000001-0000-0000-0000-000000000013', 'Heidi Moen', 'Mor', '+47 901 23 458', 'heidi.moen@example.no', true),
  ('c0000001-0000-0000-0000-000000000013', 'Svein Moen', 'Far', '+47 912 34 570', 'svein.moen@example.no', false),

  -- Oscar Bakken contacts
  ('c0000001-0000-0000-0000-000000000014', 'Mona Bakken', 'Mor', '+47 923 45 681', 'mona.bakken@example.no', true),
  ('c0000001-0000-0000-0000-000000000014', 'Karl Bakken', 'Far', '+47 934 56 782', 'karl.bakken@example.no', false),

  -- Leah Holm contacts
  ('c0000001-0000-0000-0000-000000000015', 'Berit Holm', 'Mor', '+47 945 67 893', 'berit.holm@example.no', true),
  ('c0000001-0000-0000-0000-000000000015', 'Ole Holm', 'Far', '+47 956 78 904', 'ole.holm@example.no', false),
  ('c0000001-0000-0000-0000-000000000015', 'Liv Holm', 'Tante', '+47 967 89 015', null, false);

-- Sample attendance records for today
-- Mix of: checked in (present), picked up, and not arrived
-- Note: Adjust timestamps based on your timezone

-- Children who are checked in (present) - 5 children
INSERT INTO public.attendance (child_id, check_in_time) VALUES
  ('c0000001-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '7 hours 30 minutes'),
  ('c0000001-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '7 hours 45 minutes'),
  ('c0000001-0000-0000-0000-000000000006', CURRENT_DATE + INTERVAL '8 hours'),
  ('c0000001-0000-0000-0000-000000000008', CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
  ('c0000001-0000-0000-0000-000000000011', CURRENT_DATE + INTERVAL '7 hours 50 minutes');

-- Children who have been picked up - 4 children
INSERT INTO public.attendance (child_id, check_in_time, check_out_time) VALUES
  ('c0000001-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '7 hours 30 minutes', CURRENT_DATE + INTERVAL '14 hours'),
  ('c0000001-0000-0000-0000-000000000007', CURRENT_DATE + INTERVAL '8 hours', CURRENT_DATE + INTERVAL '15 hours 30 minutes'),
  ('c0000001-0000-0000-0000-000000000012', CURRENT_DATE + INTERVAL '7 hours 45 minutes', CURRENT_DATE + INTERVAL '14 hours 30 minutes'),
  ('c0000001-0000-0000-0000-000000000014', CURRENT_DATE + INTERVAL '8 hours 30 minutes', CURRENT_DATE + INTERVAL '15 hours');

-- Children not arrived today: 4, 5, 9, 10, 13, 15 (6 children - no attendance records)

-- Historical attendance (last 7 days) for some children
INSERT INTO public.attendance (child_id, check_in_time, check_out_time) VALUES
  -- Yesterday
  ('c0000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '8 hours', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '15 hours'),
  ('c0000001-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '7 hours 30 minutes', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '14 hours 30 minutes'),
  ('c0000001-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '8 hours 15 minutes', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '15 hours 30 minutes'),

  -- 2 days ago
  ('c0000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '7 hours 45 minutes', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '14 hours'),
  ('c0000001-0000-0000-0000-000000000006', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '8 hours', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '16 hours'),

  -- 3 days ago
  ('c0000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days' + INTERVAL '8 hours', CURRENT_DATE - INTERVAL '3 days' + INTERVAL '15 hours'),
  ('c0000001-0000-0000-0000-000000000007', CURRENT_DATE - INTERVAL '3 days' + INTERVAL '7 hours 30 minutes', CURRENT_DATE - INTERVAL '3 days' + INTERVAL '14 hours 30 minutes'),
  ('c0000001-0000-0000-0000-000000000011', CURRENT_DATE - INTERVAL '3 days' + INTERVAL '8 hours 15 minutes', CURRENT_DATE - INTERVAL '3 days' + INTERVAL '15 hours 15 minutes');

-- ============================================
-- INSTRUCTIONS FOR SETTING UP TEST USERS
-- ============================================
--
-- 1. Create the following users in Supabase Auth Dashboard:
--
--    STAFF USERS (role: staff):
--    - staff1@eventyrhagen.no (password: test1234)
--    - staff2@eventyrhagen.no (password: test1234)
--    - staff3@eventyrhagen.no (password: test1234)
--
--    ADMIN USER (role: admin):
--    - admin@eventyrhagen.no (password: test1234)
--
--    PARENT USERS (role: parent):
--    - kari.hansen@example.no (password: test1234) - parent of Emma
--    - lise.johansen@example.no (password: test1234) - parent of Olav
--    - maria.andersen@example.no (password: test1234) - parent of Sofie
--    - silje.larsen@example.no (password: test1234) - parent of Henrik
--    - hilde.pedersen@example.no (password: test1234) - parent of Nora
--    - kristin.nilsen@example.no (password: test1234) - parent of Magnus
--    - tone.eriksen@example.no (password: test1234) - parent of Ingrid
--    - linda.berg@example.no (password: test1234) - parent of Erik
--    - vibeke.kristiansen@example.no (password: test1234) - parent of Astrid
--    - nina.olsen@example.no (password: test1234) - parent of Lars
--
-- 2. After creating users, update their profiles:
--
--    UPDATE public.profiles SET role = 'staff', full_name = 'Staff User 1'
--    WHERE email = 'staff1@eventyrhagen.no';
--
--    UPDATE public.profiles SET role = 'staff', full_name = 'Staff User 2'
--    WHERE email = 'staff2@eventyrhagen.no';
--
--    UPDATE public.profiles SET role = 'staff', full_name = 'Staff User 3'
--    WHERE email = 'staff3@eventyrhagen.no';
--
--    UPDATE public.profiles SET role = 'admin', full_name = 'Admin User'
--    WHERE email = 'admin@eventyrhagen.no';
--
-- 3. Link parents to children (run after users are created):
--
--    INSERT INTO public.parent_child (parent_id, child_id)
--    SELECT p.id, 'c0000001-0000-0000-0000-000000000001'
--    FROM public.profiles p WHERE p.email = 'kari.hansen@example.no';
--
--    INSERT INTO public.parent_child (parent_id, child_id)
--    SELECT p.id, 'c0000001-0000-0000-0000-000000000002'
--    FROM public.profiles p WHERE p.email = 'lise.johansen@example.no';
--
--    -- Continue for other parents...
--
-- ============================================
