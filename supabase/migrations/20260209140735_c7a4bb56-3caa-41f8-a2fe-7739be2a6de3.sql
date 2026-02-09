
-- Add new profile columns for richer AI context
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS feeding_type text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS usual_bedtime text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS main_challenge text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS special_conditions text[] DEFAULT '{}'::text[];

-- Drop and recreate the safe view with new columns
DROP VIEW IF EXISTS public.profiles_safe;

CREATE VIEW public.profiles_safe AS
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
  created_at,
  updated_at,
  is_first_child,
  has_support_network,
  parent_experience,
  main_concerns,
  last_access_at,
  feeding_type,
  usual_bedtime,
  main_challenge,
  special_conditions
FROM public.profiles;
