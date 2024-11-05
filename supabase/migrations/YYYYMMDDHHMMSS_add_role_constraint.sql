alter table "invite_tokens" add constraint "invite_tokens_role_check"
    check (role in ('super_admin', 'owner', 'courier')); 