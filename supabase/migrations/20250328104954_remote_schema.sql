create extension if not exists "postgis" with schema "extensions";

create extension if not exists "postgis_raster" with schema "extensions";


drop policy "Users can view their own memberships" on "public"."organization_members";

drop policy "Users can view restaurant profiles of their organizations" on "public"."restaurant_profiles";

revoke delete on table "public"."organization_members" from "anon";

revoke insert on table "public"."organization_members" from "anon";

revoke references on table "public"."organization_members" from "anon";

revoke select on table "public"."organization_members" from "anon";

revoke trigger on table "public"."organization_members" from "anon";

revoke truncate on table "public"."organization_members" from "anon";

revoke update on table "public"."organization_members" from "anon";

revoke delete on table "public"."organization_members" from "service_role";

revoke insert on table "public"."organization_members" from "service_role";

revoke references on table "public"."organization_members" from "service_role";

revoke select on table "public"."organization_members" from "service_role";

revoke trigger on table "public"."organization_members" from "service_role";

revoke truncate on table "public"."organization_members" from "service_role";

revoke update on table "public"."organization_members" from "service_role";

revoke delete on table "public"."organizations" from "anon";

revoke insert on table "public"."organizations" from "anon";

revoke references on table "public"."organizations" from "anon";

revoke select on table "public"."organizations" from "anon";

revoke trigger on table "public"."organizations" from "anon";

revoke truncate on table "public"."organizations" from "anon";

revoke update on table "public"."organizations" from "anon";

revoke delete on table "public"."organizations" from "service_role";

revoke insert on table "public"."organizations" from "service_role";

revoke references on table "public"."organizations" from "service_role";

revoke select on table "public"."organizations" from "service_role";

revoke trigger on table "public"."organizations" from "service_role";

revoke truncate on table "public"."organizations" from "service_role";

revoke update on table "public"."organizations" from "service_role";

revoke delete on table "public"."restaurant_profiles" from "anon";

revoke insert on table "public"."restaurant_profiles" from "anon";

revoke references on table "public"."restaurant_profiles" from "anon";

revoke select on table "public"."restaurant_profiles" from "anon";

revoke trigger on table "public"."restaurant_profiles" from "anon";

revoke truncate on table "public"."restaurant_profiles" from "anon";

revoke update on table "public"."restaurant_profiles" from "anon";

revoke delete on table "public"."restaurant_profiles" from "service_role";

revoke insert on table "public"."restaurant_profiles" from "service_role";

revoke references on table "public"."restaurant_profiles" from "service_role";

revoke select on table "public"."restaurant_profiles" from "service_role";

revoke trigger on table "public"."restaurant_profiles" from "service_role";

revoke truncate on table "public"."restaurant_profiles" from "service_role";

revoke update on table "public"."restaurant_profiles" from "service_role";

create table "public"."invite_tokens" (
    "id" uuid not null default uuid_generate_v4(),
    "organization_id" uuid not null,
    "email" text not null,
    "role" "MemberRole" not null,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."invite_tokens" enable row level security;

create table "public"."password_resets" (
    "id" uuid not null default uuid_generate_v4(),
    "email" text not null,
    "token" text not null,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."password_resets" enable row level security;

CREATE UNIQUE INDEX invite_tokens_pkey ON public.invite_tokens USING btree (id);

CREATE UNIQUE INDEX password_resets_pkey ON public.password_resets USING btree (id);

CREATE UNIQUE INDEX password_resets_token_key ON public.password_resets USING btree (token);

alter table "public"."invite_tokens" add constraint "invite_tokens_pkey" PRIMARY KEY using index "invite_tokens_pkey";

alter table "public"."password_resets" add constraint "password_resets_pkey" PRIMARY KEY using index "password_resets_pkey";

alter table "public"."invite_tokens" add constraint "invite_tokens_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."invite_tokens" validate constraint "invite_tokens_organization_id_fkey";

alter table "public"."password_resets" add constraint "password_resets_token_key" UNIQUE using index "password_resets_token_key";

grant select on table "public"."invite_tokens" to "authenticated";

grant select on table "public"."password_resets" to "authenticated";

create policy "Users can add themselves as members"
on "public"."organization_members"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can join organizations"
on "public"."organization_members"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Enable read access for authenticated users"
on "public"."organizations"
as permissive
for select
to authenticated
using (true);


create policy "Only authenticated users can create organizations"
on "public"."organizations"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Users can create organizations"
on "public"."organizations"
as permissive
for insert
to authenticated
with check (true);


create policy "Members can create restaurant profile"
on "public"."restaurant_profiles"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.organization_id = organization_members.organization_id) AND (organization_members.user_id = auth.uid()) AND (organization_members.role = 'owner'::"MemberRole")))));


create policy "Owners can update their restaurant profile"
on "public"."restaurant_profiles"
as permissive
for update
to public
using ((organization_id IN ( SELECT organization_members.organization_id
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = 'owner'::"MemberRole")))));


create policy "Users can create restaurant profile for their organization"
on "public"."restaurant_profiles"
as permissive
for insert
to public
with check ((organization_id IN ( SELECT organization_members.organization_id
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.role = 'owner'::"MemberRole")))));


create policy "Users can view their own memberships"
on "public"."organization_members"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Users can view restaurant profiles of their organizations"
on "public"."restaurant_profiles"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.organization_id = restaurant_profiles.organization_id) AND (organization_members.user_id = auth.uid())))));



