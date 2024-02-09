create table "public"."credit_codes" (
    "id" uuid not null default gen_random_uuid(),
    "code" character varying(255) not null,
    "credits" integer not null default 0,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "redeemed_at" timestamp with time zone
);


create table "public"."transactions" (
    "id" uuid not null default gen_random_uuid(),
    "credit_code_id" uuid,
    "stripe_charge_id" character varying(255) not null,
    "user_email" character varying(255) not null,
    "amount" integer not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX credit_codes_code_key ON public.credit_codes USING btree (code);

CREATE UNIQUE INDEX credit_codes_pkey ON public.credit_codes USING btree (id);

CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id);

alter table "public"."credit_codes" add constraint "credit_codes_pkey" PRIMARY KEY using index "credit_codes_pkey";

alter table "public"."transactions" add constraint "transactions_pkey" PRIMARY KEY using index "transactions_pkey";

alter table "public"."credit_codes" add constraint "credit_codes_code_key" UNIQUE using index "credit_codes_code_key";

alter table "public"."transactions" add constraint "transactions_credit_code_id_fkey" FOREIGN KEY (credit_code_id) REFERENCES credit_codes(id) not valid;

alter table "public"."transactions" validate constraint "transactions_credit_code_id_fkey";

grant delete on table "public"."credit_codes" to "anon";

grant insert on table "public"."credit_codes" to "anon";

grant references on table "public"."credit_codes" to "anon";

grant select on table "public"."credit_codes" to "anon";

grant trigger on table "public"."credit_codes" to "anon";

grant truncate on table "public"."credit_codes" to "anon";

grant update on table "public"."credit_codes" to "anon";

grant delete on table "public"."credit_codes" to "authenticated";

grant insert on table "public"."credit_codes" to "authenticated";

grant references on table "public"."credit_codes" to "authenticated";

grant select on table "public"."credit_codes" to "authenticated";

grant trigger on table "public"."credit_codes" to "authenticated";

grant truncate on table "public"."credit_codes" to "authenticated";

grant update on table "public"."credit_codes" to "authenticated";

grant delete on table "public"."credit_codes" to "service_role";

grant insert on table "public"."credit_codes" to "service_role";

grant references on table "public"."credit_codes" to "service_role";

grant select on table "public"."credit_codes" to "service_role";

grant trigger on table "public"."credit_codes" to "service_role";

grant truncate on table "public"."credit_codes" to "service_role";

grant update on table "public"."credit_codes" to "service_role";

grant delete on table "public"."transactions" to "anon";

grant insert on table "public"."transactions" to "anon";

grant references on table "public"."transactions" to "anon";

grant select on table "public"."transactions" to "anon";

grant trigger on table "public"."transactions" to "anon";

grant truncate on table "public"."transactions" to "anon";

grant update on table "public"."transactions" to "anon";

grant delete on table "public"."transactions" to "authenticated";

grant insert on table "public"."transactions" to "authenticated";

grant references on table "public"."transactions" to "authenticated";

grant select on table "public"."transactions" to "authenticated";

grant trigger on table "public"."transactions" to "authenticated";

grant truncate on table "public"."transactions" to "authenticated";

grant update on table "public"."transactions" to "authenticated";

grant delete on table "public"."transactions" to "service_role";

grant insert on table "public"."transactions" to "service_role";

grant references on table "public"."transactions" to "service_role";

grant select on table "public"."transactions" to "service_role";

grant trigger on table "public"."transactions" to "service_role";

grant truncate on table "public"."transactions" to "service_role";

grant update on table "public"."transactions" to "service_role";


create schema if not exists "internal";


