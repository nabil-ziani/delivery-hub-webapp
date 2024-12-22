-- Create a new storage bucket for restaurant logos
insert into storage.buckets (id, name, public)
values ('restaurant-logos', 'restaurant-logos', true);

-- Allow authenticated users to upload logos
create policy "Users can upload their restaurant logo"
    on storage.objects for insert
    with check (
        bucket_id = 'restaurant-logos'
        and auth.role() = 'authenticated'
        and (storage.foldername(name))[1] = auth.uid()
    );

-- Allow public access to logos
create policy "Anyone can view restaurant logos"
    on storage.objects for select
    using (bucket_id = 'restaurant-logos'); 