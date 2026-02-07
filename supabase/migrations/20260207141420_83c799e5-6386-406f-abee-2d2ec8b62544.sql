
-- Create a safe view excluding sensitive subscription/payment fields
CREATE VIEW public.profiles_safe
WITH (security_invoker=on) AS
  SELECT 
    id, user_id, parent_name, baby_name, baby_birth_date,
    sleep_location, uses_pacifier, night_feedings, onboarding_completed,
    subscription_status, subscription_plan, subscription_expires_at,
    is_first_child, has_support_network, parent_experience, main_concerns,
    created_at, updated_at
  FROM public.profiles;
  -- Excludes: subscription_id, hotmart_transaction_id
