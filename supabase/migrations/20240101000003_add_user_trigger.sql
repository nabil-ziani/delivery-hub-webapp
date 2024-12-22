-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create the function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  organization_id uuid;
begin
  -- Get the organization_id from invite_tokens based on the email
  select organization_id into organization_id
  from invite_tokens
  where email = new.email
  and used_at is null
  order by created_at desc
  limit 1;

  -- If organization found, create organization member
  if organization_id is not null then
    insert into organization_members (
      user_id,
      organization_id,
      role,
      created_at,
      updated_at
    )
    values (
      new.id,
      organization_id,
      'owner',
      now(),
      now()
    );

    -- Mark invite token as used
    update invite_tokens
    set used_at = now(),
        used_by = new.id
    where organization_id = organization_id
    and email = new.email
    and used_at is null;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 