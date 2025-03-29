drop policy "Users can add themselves as members" on "public"."organization_members";

drop policy "Users can join organizations" on "public"."organization_members";

drop policy "Enable read access for authenticated users" on "public"."organizations";

drop policy "Only authenticated users can create organizations" on "public"."organizations";

drop policy "Users can create organizations" on "public"."organizations";

drop policy "Members can create restaurant profile" on "public"."restaurant_profiles";

drop policy "Owners can update their restaurant profile" on "public"."restaurant_profiles";

drop policy "Users can create restaurant profile for their organization" on "public"."restaurant_profiles";

drop policy "Users can view their own memberships" on "public"."organization_members";

drop policy "Users can view restaurant profiles of their organizations" on "public"."restaurant_profiles";

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

alter table "public"."invite_tokens" drop constraint "invite_tokens_organization_id_fkey";

alter table "public"."password_resets" drop constraint "password_resets_token_key";

alter table "public"."invite_tokens" drop constraint "invite_tokens_pkey";

alter table "public"."password_resets" drop constraint "password_resets_pkey";

drop index if exists "public"."invite_tokens_pkey";

drop index if exists "public"."password_resets_pkey";

drop index if exists "public"."password_resets_token_key";

drop table "public"."invite_tokens";

drop table "public"."password_resets";

grant delete on table "public"."organization_members" to "anon";

grant insert on table "public"."organization_members" to "anon";

grant references on table "public"."organization_members" to "anon";

grant select on table "public"."organization_members" to "anon";

grant trigger on table "public"."organization_members" to "anon";

grant truncate on table "public"."organization_members" to "anon";

grant update on table "public"."organization_members" to "anon";

grant delete on table "public"."organization_members" to "service_role";

grant insert on table "public"."organization_members" to "service_role";

grant references on table "public"."organization_members" to "service_role";

grant select on table "public"."organization_members" to "service_role";

grant trigger on table "public"."organization_members" to "service_role";

grant truncate on table "public"."organization_members" to "service_role";

grant update on table "public"."organization_members" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."restaurant_profiles" to "anon";

grant insert on table "public"."restaurant_profiles" to "anon";

grant references on table "public"."restaurant_profiles" to "anon";

grant select on table "public"."restaurant_profiles" to "anon";

grant trigger on table "public"."restaurant_profiles" to "anon";

grant truncate on table "public"."restaurant_profiles" to "anon";

grant update on table "public"."restaurant_profiles" to "anon";

grant delete on table "public"."restaurant_profiles" to "service_role";

grant insert on table "public"."restaurant_profiles" to "service_role";

grant references on table "public"."restaurant_profiles" to "service_role";

grant select on table "public"."restaurant_profiles" to "service_role";

grant trigger on table "public"."restaurant_profiles" to "service_role";

grant truncate on table "public"."restaurant_profiles" to "service_role";

grant update on table "public"."restaurant_profiles" to "service_role";

create policy "Users can view their own memberships"
on "public"."organization_members"
as permissive
for all
to authenticated
using ((user_id = auth.uid()));


create policy "Users can view restaurant profiles of their organizations"
on "public"."restaurant_profiles"
as permissive
for all
to authenticated
using ((organization_id IN ( SELECT organization_members.organization_id
   FROM organization_members
  WHERE (organization_members.user_id = auth.uid()))));



