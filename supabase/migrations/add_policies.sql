-- Add these policies to your existing ones

-- Invite tokens policies
create policy "Anyone can read invite tokens"
  on invite_tokens for select
  using (true);

create policy "Only admins can create invite tokens for their organization"
  on invite_tokens for insert
  using (
    exists (
      select 1 from organization_members
      where user_id = auth.uid()
      and role = 'admin'
      and organization_id = organization_id
    )
  );

-- Organization members policies
create policy "Members can view other members in their organization"
  on organization_members for select
  using (
    exists (
      select 1 from organization_members
      where user_id = auth.uid()
      and organization_id = organization_members.organization_id
    )
  );

create policy "Admins can add members to their organization"
  on organization_members for insert
  using (
    exists (
      select 1 from organization_members
      where user_id = auth.uid()
      and role = 'admin'
      and organization_id = organization_members.organization_id
    )
  );

-- Initial organization creation policy (for when admin signs up)
create policy "Allow organization creation through invite"
  on organizations for insert
  using (true); 