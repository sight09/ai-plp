/*
  # Add Payment Features

  1. New Tables
    - `payments` - Track all payment transactions
    - Update `jobs` table to include boosted status
    - Update `users` table to include subscription details

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to manage their own payments
    - Add policies for job boosting

  3. Changes
    - Add boosted column to jobs table
    - Add subscription tracking to users table
    - Create comprehensive payment tracking system
*/

-- Add boosted column to jobs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'boosted'
  ) THEN
    ALTER TABLE jobs ADD COLUMN boosted boolean DEFAULT false;
  END IF;
END $$;

-- Add subscription details to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_status text DEFAULT 'inactive';
  END IF;
END $$;

-- Update payments table structure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'type'
  ) THEN
    ALTER TABLE payments ADD COLUMN type text DEFAULT 'subscription';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'description'
  ) THEN
    ALTER TABLE payments ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'provider'
  ) THEN
    ALTER TABLE payments ADD COLUMN provider text DEFAULT 'stripe';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN job_id uuid REFERENCES jobs(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add payment policies
CREATE POLICY "Users can view own payment history"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add job boosting policies
CREATE POLICY "Users can boost own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = employer_id);