/*
  # AI Job + Resume Platform - Initial Schema

  1. New Tables
    - `users` (extends Supabase auth.users)
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `premium` (boolean, default false)
      - `created_at` (timestamp)
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `original_text` (text)
      - `skills` (jsonb array)
      - `experience` (jsonb array)
      - `created_at` (timestamp)
    - `resumes_rewritten`
      - `id` (uuid, primary key)
      - `resume_id` (uuid, foreign key)
      - `improved_text` (text)
      - `created_at` (timestamp)
    - `jobs`
      - `id` (uuid, primary key)
      - `employer_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `requirements` (jsonb array)
      - `salary_range` (text)
      - `location` (text)
      - `created_at` (timestamp)
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `amount` (integer)
      - `status` (text)
      - `stripe_payment_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Premium feature access control
*/

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  original_text text NOT NULL,
  skills jsonb DEFAULT '[]',
  experience jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Rewritten resumes table (premium feature)
CREATE TABLE IF NOT EXISTS resumes_rewritten (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  improved_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  requirements jsonb DEFAULT '[]',
  salary_range text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  status text DEFAULT 'pending',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes_rewritten ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Resumes policies
CREATE POLICY "Users can read own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Rewritten resumes policies
CREATE POLICY "Users can read own rewritten resumes"
  ON resumes_rewritten
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM resumes 
    WHERE resumes.id = resumes_rewritten.resume_id 
    AND resumes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own rewritten resumes"
  ON resumes_rewritten
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM resumes 
    WHERE resumes.id = resumes_rewritten.resume_id 
    AND resumes.user_id = auth.uid()
  ));

-- Jobs policies (public read, authenticated insert/update own)
CREATE POLICY "Anyone can read jobs"
  ON jobs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Users can update own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = employer_id);

-- Payments policies
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);