create table "public"."profile" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "email" character varying(255) not null,
    "credits" integer not null default 0,
    "attributes" jsonb not null default '{}'::jsonb
);


create unique index profile_email_key on public.profile using btree (email);

create unique index profile_pkey on public.profile using btree (user_id);

alter table "public"."profile" add constraint "profile_pkey" primary key using index "profile_pkey";

alter table "public"."profile" add constraint "profile_email_key" unique using index "profile_email_key";

alter table "public"."profile" add constraint "profile_user_id_fkey" foreign key (
    user_id
) references auth.users (id) on update cascade on delete cascade not valid;

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

create or replace function internal.create_profile_from_user()
returns trigger
language plpgsql
security definer
as $function$
BEGIN
  INSERT INTO public.profile (
    user_id,
    email
  )
  VALUES (
    NEW.id,
    NEW.email
  );
  RETURN NEW;
END;
$function$;
