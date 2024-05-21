CREATE OR REPLACE FUNCTION public.create_user(
    email text,
    password text
) RETURNS uuid AS $$
declare
    user_id uuid;
    encrypted_pw text;
BEGIN
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password, gen_salt('bf'));

    INSERT INTO auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES
        ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');

    INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES
        (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');

    RETURN user_id;
END;
$$ LANGUAGE plpgsql;


create table
    todos (
                     id uuid not null default gen_random_uuid (),
                     created_at timestamp with time zone not null default now(),
                     "desc" character varying not null,
                     owner uuid not null default auth.uid (),
                     constraint todos_pkey primary key (id),
                     constraint todos_owner_fkey foreign key (owner) references auth.users (id) on update cascade on delete cascade
);

alter table todos enable row level security;

create policy "Individuals can view their own todos."
on todos for select
                        using ( (select auth.uid()) = owner );