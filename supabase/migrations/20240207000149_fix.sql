set check_function_bodies = off;

CREATE OR REPLACE FUNCTION internal.create_profile_from_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profile (
    user_id,
    email,
    confirmed_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.confirmed_at
  );
  RETURN NEW;
END;
$function$
;


