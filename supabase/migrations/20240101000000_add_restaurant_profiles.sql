create table if not exists restaurant_profiles (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid references organizations(id) unique not null,
    phone_number text not null,
    email text not null,
    address text not null,
    city text not null,
    postal_code text not null,
    latitude double precision,
    longitude double precision,
    settings jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table restaurant_profiles enable row level security;

-- Policies
create policy "Users can view their own restaurant profile"
    on restaurant_profiles for select
    using (
        organization_id in (
            select organization_id 
            from organization_members 
            where user_id = auth.uid()
        )
    );

create policy "Organization owners can update their restaurant profile"
    on restaurant_profiles for update
    using (
        organization_id in (
            select organization_id 
            from organization_members 
            where user_id = auth.uid() 
            and role = 'owner'
        )
    );

-- Triggers
create trigger set_updated_at
    before update on restaurant_profiles
    for each row
    execute function set_updated_at(); 