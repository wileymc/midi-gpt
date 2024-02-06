create table "public"."profile" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "email" character varying(255) not null,
    "credits" integer not null default 0,
    "attributes" jsonb not null default '{}'::jsonb
);


CREATE UNIQUE INDEX profile_email_key ON public.profile USING btree (email);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (user_id);

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."profile" add constraint "profile_email_key" UNIQUE using index "profile_email_key";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";


create schema if not exists "internal";

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


