-- Drop the existing constraint
alter table "invite_tokens" drop constraint "invite_tokens_role_check";

-- Add the updated constraint
alter table "invite_tokens" add constraint "invite_tokens_role_check"
    check (role in ('super_admin', 'owner', 'courier'));