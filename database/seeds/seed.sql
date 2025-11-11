-- Seed data for development
-- Run this after running migrations

-- Insert test user (password is 'password123')
INSERT INTO users (email, password, created_at)
VALUES (
  'test@example.com',
  '$2b$10$0WZdHqhaogKwrzpk0gu17.6oRNbt5v6Vte5iCgH2MpgqGjg4ym75W',
  NOW()
) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert sample todos for the test user
INSERT INTO todos (user_id, title, description, completed, created_at, updated_at)
SELECT
  u.id,
  'Complete project',
  'Finish TODO API with authentication and tests',
  false,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
FROM users u WHERE u.email = 'test@example.com';

INSERT INTO todos (user_id, title, description, completed, created_at, updated_at)
SELECT
  u.id,
  'Buy groceries',
  'Milk, bread, butter, eggs',
  false,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
FROM users u WHERE u.email = 'test@example.com';

INSERT INTO todos (user_id, title, description, completed, created_at, updated_at)
SELECT
  u.id,
  'Call doctor',
  'Schedule preventive checkup',
  false,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '3 hours'
FROM users u WHERE u.email = 'test@example.com';

INSERT INTO todos (user_id, title, description, completed, created_at, updated_at)
SELECT
  u.id,
  'Read book',
  'Finish chapter 5',
  true,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day'
FROM users u WHERE u.email = 'test@example.com';

INSERT INTO todos (user_id, title, description, completed, created_at, updated_at)
SELECT
  u.id,
  'Exercise',
  NULL,
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '12 hours'
FROM users u WHERE u.email = 'test@example.com';

INSERT INTO todos (user_id, title, description, completed, created_at, updated_at)
SELECT
  u.id,
  'Write blog post',
  'Article about Node.js best practices',
  false,
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
FROM users u WHERE u.email = 'test@example.com';
