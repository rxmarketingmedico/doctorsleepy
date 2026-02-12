-- Remove the admin SELECT policy on pending_activations
-- The restrictive "Service role only" policy with USING(false) already blocks all access
-- Only service_role (which bypasses RLS) should access this table
DROP POLICY IF EXISTS "Admins can view pending activations" ON public.pending_activations;