/*
  # Create Email Notifications Table

  1. New Tables
    - `emailToNotify`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `emailToNotify` table
    - Add policy for inserting new emails
    - Add policy for admins to view all emails
*/

CREATE TABLE IF NOT EXISTS emailToNotify (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emailToNotify ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email
CREATE POLICY "Anyone can insert their email"
  ON emailToNotify
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users with admin role can view emails
CREATE POLICY "Admins can view all emails"
  ON emailToNotify
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');