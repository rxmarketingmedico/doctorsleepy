-- Add last access tracking and buyer phone to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_access_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS buyer_phone TEXT DEFAULT NULL;

-- Update the profiles_safe view to include new fields
DROP VIEW IF EXISTS public.profiles_safe;
CREATE VIEW public.profiles_safe
WITH (security_invoker=on) AS
  SELECT 
    id,
    user_id,
    parent_name,
    baby_name,
    baby_birth_date,
    sleep_location,
    uses_pacifier,
    night_feedings,
    onboarding_completed,
    subscription_status,
    subscription_plan,
    subscription_expires_at,
    parent_experience,
    is_first_child,
    has_support_network,
    main_concerns,
    buyer_phone,
    last_access_at,
    created_at,
    updated_at
  FROM public.profiles;