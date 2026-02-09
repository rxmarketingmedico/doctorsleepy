
-- Fix security definer view by adding security_invoker=on
DROP VIEW IF EXISTS public.profiles_safe;

CREATE VIEW public.profiles_safe
WITH (security_invoker=on) AS
  SELECT
    id, user_id, parent_name, baby_name, baby_birth_date,
    sleep_location, uses_pacifier, night_feedings, is_first_child,
    has_support_network, parent_experience, main_concerns,
    onboarding_completed, subscription_status, subscription_plan,
    subscription_expires_at, last_access_at, created_at, updated_at
  FROM public.profiles;

-- Restore user SELECT policy so the view works with security_invoker
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
