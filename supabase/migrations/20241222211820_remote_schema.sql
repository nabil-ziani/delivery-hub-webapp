create type "public"."MemberRole" as enum ('owner', 'courier');

drop policy "Enable insert for organization admins" on "public"."invite_tokens";

drop policy "Enable read access for organization members" on "public"."invite_tokens";

drop policy "Enable update for organization admins" on "public"."invite_tokens";

drop policy "Enable insert for admin role" on "public"."organizations";

drop policy "Enable insert for service role" on "public"."organizations";

drop policy "Enable read access for organization members" on "public"."organizations";

drop policy "Enable update for organization admins" on "public"."organizations";

drop policy "Organization members can view their organization" on "public"."organizations";

drop policy "Users can only view their own reset codes" on "public"."password_resets";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

revoke delete on table "public"."external_orders" from "anon";

revoke insert on table "public"."external_orders" from "anon";

revoke references on table "public"."external_orders" from "anon";

revoke select on table "public"."external_orders" from "anon";

revoke trigger on table "public"."external_orders" from "anon";

revoke truncate on table "public"."external_orders" from "anon";

revoke update on table "public"."external_orders" from "anon";

revoke delete on table "public"."external_orders" from "authenticated";

revoke insert on table "public"."external_orders" from "authenticated";

revoke references on table "public"."external_orders" from "authenticated";

revoke select on table "public"."external_orders" from "authenticated";

revoke trigger on table "public"."external_orders" from "authenticated";

revoke truncate on table "public"."external_orders" from "authenticated";

revoke update on table "public"."external_orders" from "authenticated";

revoke delete on table "public"."external_orders" from "service_role";

revoke insert on table "public"."external_orders" from "service_role";

revoke references on table "public"."external_orders" from "service_role";

revoke select on table "public"."external_orders" from "service_role";

revoke trigger on table "public"."external_orders" from "service_role";

revoke truncate on table "public"."external_orders" from "service_role";

revoke update on table "public"."external_orders" from "service_role";

revoke delete on table "public"."invite_tokens" from "anon";

revoke insert on table "public"."invite_tokens" from "anon";

revoke references on table "public"."invite_tokens" from "anon";

revoke select on table "public"."invite_tokens" from "anon";

revoke trigger on table "public"."invite_tokens" from "anon";

revoke truncate on table "public"."invite_tokens" from "anon";

revoke update on table "public"."invite_tokens" from "anon";

revoke delete on table "public"."invite_tokens" from "authenticated";

revoke insert on table "public"."invite_tokens" from "authenticated";

revoke references on table "public"."invite_tokens" from "authenticated";

revoke select on table "public"."invite_tokens" from "authenticated";

revoke trigger on table "public"."invite_tokens" from "authenticated";

revoke truncate on table "public"."invite_tokens" from "authenticated";

revoke update on table "public"."invite_tokens" from "authenticated";

revoke delete on table "public"."invite_tokens" from "service_role";

revoke insert on table "public"."invite_tokens" from "service_role";

revoke references on table "public"."invite_tokens" from "service_role";

revoke select on table "public"."invite_tokens" from "service_role";

revoke trigger on table "public"."invite_tokens" from "service_role";

revoke truncate on table "public"."invite_tokens" from "service_role";

revoke update on table "public"."invite_tokens" from "service_role";

revoke delete on table "public"."organization_members" from "anon";

revoke insert on table "public"."organization_members" from "anon";

revoke references on table "public"."organization_members" from "anon";

revoke select on table "public"."organization_members" from "anon";

revoke trigger on table "public"."organization_members" from "anon";

revoke truncate on table "public"."organization_members" from "anon";

revoke update on table "public"."organization_members" from "anon";

revoke delete on table "public"."organization_members" from "authenticated";

revoke insert on table "public"."organization_members" from "authenticated";

revoke references on table "public"."organization_members" from "authenticated";

revoke select on table "public"."organization_members" from "authenticated";

revoke trigger on table "public"."organization_members" from "authenticated";

revoke truncate on table "public"."organization_members" from "authenticated";

revoke update on table "public"."organization_members" from "authenticated";

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

revoke delete on table "public"."organizations" from "authenticated";

revoke insert on table "public"."organizations" from "authenticated";

revoke references on table "public"."organizations" from "authenticated";

revoke select on table "public"."organizations" from "authenticated";

revoke trigger on table "public"."organizations" from "authenticated";

revoke truncate on table "public"."organizations" from "authenticated";

revoke update on table "public"."organizations" from "authenticated";

revoke delete on table "public"."organizations" from "service_role";

revoke insert on table "public"."organizations" from "service_role";

revoke references on table "public"."organizations" from "service_role";

revoke select on table "public"."organizations" from "service_role";

revoke trigger on table "public"."organizations" from "service_role";

revoke truncate on table "public"."organizations" from "service_role";

revoke update on table "public"."organizations" from "service_role";

revoke delete on table "public"."password_resets" from "anon";

revoke insert on table "public"."password_resets" from "anon";

revoke references on table "public"."password_resets" from "anon";

revoke select on table "public"."password_resets" from "anon";

revoke trigger on table "public"."password_resets" from "anon";

revoke truncate on table "public"."password_resets" from "anon";

revoke update on table "public"."password_resets" from "anon";

revoke delete on table "public"."password_resets" from "authenticated";

revoke insert on table "public"."password_resets" from "authenticated";

revoke references on table "public"."password_resets" from "authenticated";

revoke select on table "public"."password_resets" from "authenticated";

revoke trigger on table "public"."password_resets" from "authenticated";

revoke truncate on table "public"."password_resets" from "authenticated";

revoke update on table "public"."password_resets" from "authenticated";

revoke delete on table "public"."password_resets" from "service_role";

revoke insert on table "public"."password_resets" from "service_role";

revoke references on table "public"."password_resets" from "service_role";

revoke select on table "public"."password_resets" from "service_role";

revoke trigger on table "public"."password_resets" from "service_role";

revoke truncate on table "public"."password_resets" from "service_role";

revoke update on table "public"."password_resets" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

alter table "public"."external_orders" drop constraint "external_orders_restaurant_id_fkey";

alter table "public"."invite_tokens" drop constraint "invite_tokens_role_check";

alter table "public"."organization_members" drop constraint "organization_members_role_check";

alter table "public"."organization_members" drop constraint "organization_members_user_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_user_id_organization_id_key";

alter table "public"."password_resets" drop constraint "password_resets_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."profiles" drop constraint "profiles_role_check";

alter table "public"."invite_tokens" drop constraint "invite_tokens_organization_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_organization_id_fkey";

alter table "public"."external_orders" drop constraint "external_orders_pkey";

alter table "public"."profiles" drop constraint "profiles_pkey";

alter table "public"."invite_tokens" drop constraint "invite_tokens_pkey";

drop index if exists "public"."external_orders_pkey";

drop index if exists "public"."external_orders_platform_idx";

drop index if exists "public"."external_orders_restaurant_id_idx";

drop index if exists "public"."organization_members_user_id_organization_id_key";

drop index if exists "public"."profiles_pkey";

drop index if exists "public"."invite_tokens_pkey";

drop table "public"."external_orders";

drop table "public"."profiles";

create table "public"."restaurant_profiles" (
    "id" text not null,
    "organization_id" text not null,
    "phone_number" text not null,
    "email" text not null,
    "address" text not null,
    "city" text not null,
    "postal_code" text not null,
    "latitude" double precision,
    "longitude" double precision,
    "settings" jsonb,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) without time zone not null
);


alter table "public"."invite_tokens" drop column "token";

alter table "public"."invite_tokens" drop column "used_at";

alter table "public"."invite_tokens" add column "id" text not null;

alter table "public"."invite_tokens" add column "updated_at" timestamp(3) without time zone not null;

alter table "public"."invite_tokens" alter column "created_at" set default CURRENT_TIMESTAMP;

alter table "public"."invite_tokens" alter column "created_at" set data type timestamp(3) without time zone using "created_at"::timestamp(3) without time zone;

alter table "public"."invite_tokens" alter column "email" set not null;

alter table "public"."invite_tokens" alter column "expires_at" set data type timestamp(3) without time zone using "expires_at"::timestamp(3) without time zone;

alter table "public"."invite_tokens" alter column "organization_id" set not null;

alter table "public"."invite_tokens" alter column "organization_id" set data type text using "organization_id"::text;

alter table "public"."invite_tokens" alter column "role" set data type "MemberRole" using "role"::"MemberRole";

alter table "public"."organization_members" alter column "created_at" set default CURRENT_TIMESTAMP;

alter table "public"."organization_members" alter column "created_at" set data type timestamp(3) without time zone using "created_at"::timestamp(3) without time zone;

alter table "public"."organization_members" alter column "id" drop default;

alter table "public"."organization_members" alter column "id" set data type text using "id"::text;

alter table "public"."organization_members" alter column "organization_id" set data type text using "organization_id"::text;

alter table "public"."organization_members" alter column "role" set data type "MemberRole" using "role"::"MemberRole";

alter table "public"."organization_members" alter column "updated_at" drop default;

alter table "public"."organization_members" alter column "updated_at" set data type timestamp(3) without time zone using "updated_at"::timestamp(3) without time zone;

alter table "public"."organization_members" alter column "user_id" set data type text using "user_id"::text;

alter table "public"."organizations" alter column "created_at" set default CURRENT_TIMESTAMP;

alter table "public"."organizations" alter column "created_at" set data type timestamp(3) without time zone using "created_at"::timestamp(3) without time zone;

alter table "public"."organizations" alter column "id" drop default;

alter table "public"."organizations" alter column "id" set data type text using "id"::text;

alter table "public"."organizations" alter column "updated_at" drop default;

alter table "public"."organizations" alter column "updated_at" set data type timestamp(3) without time zone using "updated_at"::timestamp(3) without time zone;

alter table "public"."password_resets" drop column "security_code";

alter table "public"."password_resets" drop column "used_at";

alter table "public"."password_resets" drop column "user_id";

alter table "public"."password_resets" add column "email" text not null;

alter table "public"."password_resets" add column "token" text not null;

alter table "public"."password_resets" add column "updated_at" timestamp(3) without time zone not null;

alter table "public"."password_resets" alter column "created_at" set default CURRENT_TIMESTAMP;

alter table "public"."password_resets" alter column "created_at" set data type timestamp(3) without time zone using "created_at"::timestamp(3) without time zone;

alter table "public"."password_resets" alter column "expires_at" set data type timestamp(3) without time zone using "expires_at"::timestamp(3) without time zone;

alter table "public"."password_resets" alter column "id" drop default;

alter table "public"."password_resets" alter column "id" set data type text using "id"::text;

CREATE UNIQUE INDEX organization_members_organization_id_user_id_key ON public.organization_members USING btree (organization_id, user_id);

CREATE UNIQUE INDEX password_resets_token_key ON public.password_resets USING btree (token);

CREATE UNIQUE INDEX restaurant_profiles_organization_id_key ON public.restaurant_profiles USING btree (organization_id);

CREATE UNIQUE INDEX restaurant_profiles_pkey ON public.restaurant_profiles USING btree (id);

CREATE UNIQUE INDEX invite_tokens_pkey ON public.invite_tokens USING btree (id);

alter table "public"."restaurant_profiles" add constraint "restaurant_profiles_pkey" PRIMARY KEY using index "restaurant_profiles_pkey";

alter table "public"."invite_tokens" add constraint "invite_tokens_pkey" PRIMARY KEY using index "invite_tokens_pkey";

alter table "public"."restaurant_profiles" add constraint "restaurant_profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."restaurant_profiles" validate constraint "restaurant_profiles_organization_id_fkey";

alter table "public"."invite_tokens" add constraint "invite_tokens_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."invite_tokens" validate constraint "invite_tokens_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    org_id uuid;
begin
    -- Create organization
    insert into public.organizations (id, name, created_at, updated_at)
    values (gen_random_uuid(), 'Restaurant ' || new.email, now(), now())
    returning id into org_id;

    -- Create profile
    insert into public.profiles (id, email, role, created_at, updated_at)
    values (new.id, new.email, 'owner', now(), now());

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

    return new;
end;
$function$
;


