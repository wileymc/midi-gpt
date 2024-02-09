CREATE TABLE public.credit_codes (
    id uuid PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    code varchar(255) NOT NULL UNIQUE,
    credits integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    redeemed_at timestamptz
);

CREATE TABLE public.transactions (
    id uuid PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    credit_code_id uuid REFERENCES public.credit_codes (id),
    stripe_charge_id varchar(255) NOT NULL,
    user_email varchar(255) NOT NULL,
    amount integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
