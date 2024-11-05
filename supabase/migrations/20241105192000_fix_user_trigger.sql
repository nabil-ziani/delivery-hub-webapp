-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
declare
  user_role text;
  user_org_id uuid;
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

  -- Create organization membership if we have an org_id
  IF user_org_id IS NOT NULL THEN
    INSERT INTO public.organization_members (
      user_id,
      organization_id,
      role
    ) VALUES (
      new.id,
      user_org_id,
      CASE 
        WHEN user_role = 'owner' THEN 'admin'
        WHEN user_role = 'courier' THEN 'courier'
        ELSE 'courier'
      END
    );
  END IF;
  
  return new;
end;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON FUNCTION public.handle_new_user() TO postgres;
GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role; 