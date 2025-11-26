/*
  # Create Core Tables for ContractOS

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `role` (enum: startup, lawyer, enterprise_admin)
      - `organization_id` (uuid, nullable, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `plan` (enum: starter, growth, enterprise)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contracts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text, contract body)
      - `status` (enum: draft, in_review, reviewed, signed, archived)
      - `owner_id` (uuid, foreign key to profiles)
      - `organization_id` (uuid, nullable, foreign key)
      - `lawyer_id` (uuid, nullable, foreign key to profiles)
      - `counterparty` (text, nullable)
      - `tags` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contract_versions`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, foreign key)
      - `content` (text)
      - `version_number` (integer)
      - `changed_by` (uuid, foreign key to profiles)
      - `change_description` (text, nullable)
      - `created_at` (timestamptz)
    
    - `contract_comments`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `position` (integer, nullable, for inline comments)
      - `resolved` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `lawyer_reviews`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, foreign key)
      - `lawyer_id` (uuid, foreign key to profiles)
      - `status` (enum: pending, in_progress, completed)
      - `fee_amount` (numeric)
      - `paid` (boolean, default false)
      - `started_at` (timestamptz, nullable)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
    
    - `audit_logs`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to profiles)
      - `action` (text)
      - `entity_type` (text)
      - `entity_id` (uuid)
      - `details` (jsonb, nullable)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access:
      - Startup users can read/write their own contracts
      - Lawyers can read contracts assigned to them
      - Enterprise admins can manage their organization's data
      - Users can read their own profile
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan text NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'startup' CHECK (role IN ('startup', 'lawyer', 'enterprise_admin')),
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'reviewed', 'signed', 'archived')),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  lawyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  counterparty text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contract_versions table
CREATE TABLE IF NOT EXISTS contract_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  content text NOT NULL,
  version_number integer NOT NULL,
  changed_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  change_description text,
  created_at timestamptz DEFAULT now()
);

-- Create contract_comments table
CREATE TABLE IF NOT EXISTS contract_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  position integer,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lawyer_reviews table
CREATE TABLE IF NOT EXISTS lawyer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  fee_amount numeric NOT NULL DEFAULT 0,
  paid boolean DEFAULT false,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Enterprise admins can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'enterprise_admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'enterprise_admin'
    )
  );

-- Contracts policies
CREATE POLICY "Users can view own contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    lawyer_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create contracts"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their contracts"
  ON contracts FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete their contracts"
  ON contracts FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Contract versions policies
CREATE POLICY "Users can view versions of accessible contracts"
  ON contract_versions FOR SELECT
  TO authenticated
  USING (
    contract_id IN (
      SELECT id FROM contracts WHERE 
        owner_id = auth.uid() OR
        lawyer_id = auth.uid() OR
        organization_id IN (
          SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    )
  );

CREATE POLICY "Users can create versions for accessible contracts"
  ON contract_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    contract_id IN (
      SELECT id FROM contracts WHERE 
        owner_id = auth.uid() OR
        lawyer_id = auth.uid()
    )
  );

-- Contract comments policies
CREATE POLICY "Users can view comments on accessible contracts"
  ON contract_comments FOR SELECT
  TO authenticated
  USING (
    contract_id IN (
      SELECT id FROM contracts WHERE 
        owner_id = auth.uid() OR
        lawyer_id = auth.uid() OR
        organization_id IN (
          SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    )
  );

CREATE POLICY "Users can create comments on accessible contracts"
  ON contract_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    contract_id IN (
      SELECT id FROM contracts WHERE 
        owner_id = auth.uid() OR
        lawyer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own comments"
  ON contract_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Lawyer reviews policies
CREATE POLICY "Lawyers can view their reviews"
  ON lawyer_reviews FOR SELECT
  TO authenticated
  USING (
    lawyer_id = auth.uid() OR
    contract_id IN (SELECT id FROM contracts WHERE owner_id = auth.uid())
  );

CREATE POLICY "Contract owners can create lawyer reviews"
  ON lawyer_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    contract_id IN (SELECT id FROM contracts WHERE owner_id = auth.uid())
  );

CREATE POLICY "Lawyers can update their reviews"
  ON lawyer_reviews FOR UPDATE
  TO authenticated
  USING (lawyer_id = auth.uid())
  WITH CHECK (lawyer_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Organization members can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_contracts_owner ON contracts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_lawyer ON contracts(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_organization ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contract_versions_contract ON contract_versions(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_comments_contract ON contract_comments(contract_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_lawyer ON lawyer_reviews(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_contract ON lawyer_reviews(contract_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
