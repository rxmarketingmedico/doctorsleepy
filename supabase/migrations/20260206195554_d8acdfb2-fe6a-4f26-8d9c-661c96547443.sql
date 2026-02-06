
-- Add subscription plan field to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS hotmart_transaction_id text DEFAULT NULL;
