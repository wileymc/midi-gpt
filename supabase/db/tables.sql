CREATE TABLE public.profile
(
    user_id uuid NOT NULL REFERENCES auth.users
    ON DELETE CASCADE ON UPDATE CASCADE
    PRIMARY KEY,

    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email varchar(255) NOT NULL UNIQUE,
    credits integer NOT NULL DEFAULT 0,
    attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);
