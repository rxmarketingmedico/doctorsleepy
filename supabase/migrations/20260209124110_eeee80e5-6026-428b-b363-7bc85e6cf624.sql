
-- 1. Recreate profiles_safe view WITHOUT security_invoker
--    Add WHERE clause to filter by auth.uid() since the view owner bypasses RLS
DROP VIEW IF EXISTS public.profiles_safe;

CREATE VIEW public.profiles_safe AS
  SELECT
    id, user_id, parent_name, baby_name, baby_birth_date,
    sleep_location, uses_pacifier, night_feedings, is_first_child,
    has_support_network, parent_experience, main_concerns,
    onboarding_completed, subscription_status, subscription_plan,
    subscription_expires_at, last_access_at, created_at, updated_at
  FROM public.profiles
  WHERE user_id = auth.uid();

-- 2. Remove direct user SELECT on the base profiles table
--    This forces regular users to go through profiles_safe
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Admin SELECT policy remains, so admin pages still work
