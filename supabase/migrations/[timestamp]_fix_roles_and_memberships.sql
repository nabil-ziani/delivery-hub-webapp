-- Disable RLS temporarily for the migration
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE invite_tokens DISABLE ROW LEVEL SECURITY;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the handle_new_user function with proper role mapping
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
declare
  user_role text;
  user_org_id uuid;
  org_role text;
begin
  -- Get the role and organization_id from the user's metadata
  user_role := new.raw_user_meta_data->>'role';
  user_org_id := (new.raw_user_meta_data->>'organization_id')::uuid;

  -- If no role in metadata, try to get from invite_tokens
  IF user_role IS NULL THEN
    SELECT role, organization_id INTO user_role, user_org_id
    FROM invite_tokens
    WHERE email = new.email
      AND used_at is null
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  -- If still no role found, default to 'owner'
  IF user_role IS NULL THEN
    user_role := 'owner';
  END IF;

  -- Create profile with auth-level role
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, user_role);

  -- Map auth role to organization role
  IF user_org_id IS NOT NULL THEN
    org_role := CASE 
      WHEN user_role = 'owner' THEN 'admin'
      WHEN user_role = 'courier' THEN 'courier'
      ELSE NULL
    END;

    -- Only create organization membership if we have a valid org_role
    IF org_role IS NOT NULL THEN
      INSERT INTO public.organization_members (
        user_id,
        organization_id,
        role
      ) VALUES (
        new.id,
        user_org_id,
        org_role
      );
    END IF;
  END IF;
  
  return new;
end;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for organization_members
CREATE POLICY "Organization members can view their organization"
  ON organization_members FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM organization_members 
      WHERE organization_id = organization_members.organization_id
    )
  );

CREATE POLICY "Organization admins can manage members"
  ON organization_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM organization_members 
      WHERE user_id = auth.uid() 
        AND organization_id = organization_members.organization_id 
        AND role = 'admin'
    )
  );

-- Create policies for invite_tokens
CREATE POLICY "Super admins can manage all invites"
  ON invite_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE id = auth.uid() 
        AND role = 'super_admin'
    )
  );

CREATE POLICY "Organization admins can manage their invites"
  ON invite_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM organization_members 
      WHERE user_id = auth.uid() 
        AND organization_id = invite_tokens.organization_id 
        AND role = 'admin'
    )
  ); 