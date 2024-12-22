-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create the function
create or replace function public.handle_new_user()
returns trigger as $$
declare
    org_id uuid;
    existing_member record;
begin
    -- Check if user is already a member of an organization (invited user)
    select * into existing_member 
    from organization_members 
    where user_id = new.id 
    limit 1;

    -- Only create new organization if user is not already a member
    if existing_member is null then
        -- Create organization
        insert into public.organizations (id, name, created_at, updated_at)
        values (gen_random_uuid(), 'Restaurant ' || new.email, now(), now())
        returning id into org_id;

        -- Create organization member
        insert into public.organization_members (
            organization_id,
            user_id,
            role,
            created_at,
            updated_at
        )
        values (
            org_id,
            new.id,
            'owner',
            now(),
            now()
        );

        -- Create restaurant profile placeholder
        insert into public.restaurant_profiles (
            organization_id,
            phone_number,
            email,
            address,
            city,
            postal_code,
            created_at,
            updated_at
        )
        values (
            org_id,
            '',  -- Will be filled in during onboarding
            new.email,
            '',  -- Will be filled in during onboarding
            '',  -- Will be filled in during onboarding
            '',  -- Will be filled in during onboarding
            now(),
            now()
        );
    end if;

    -- Always create profile
    insert into public.profiles (id, email, role, created_at, updated_at)
    values (new.id, new.email, 'owner', now(), now());

    return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 