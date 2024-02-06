CREATE OR REPLACE FUNCTION internal.create_profile_from_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS
$$
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
$$;

CREATE OR REPLACE TRIGGER CREATE_PROFILE_ON_INSERTED_USER
AFTER INSERT ON AUTH.USERS
FOR EACH ROW
EXECUTE FUNCTION internal.create_profile_from_user();
