select public.create_user('test@example.com', 'qwerty');



    INSERT INTO public.todos ("desc", owner)
select 'Beer', id from auth.users where email = 'test@example.com';

INSERT INTO public.todos ("desc", owner)
select 'Coffee', id from auth.users where email = 'test@example.com';