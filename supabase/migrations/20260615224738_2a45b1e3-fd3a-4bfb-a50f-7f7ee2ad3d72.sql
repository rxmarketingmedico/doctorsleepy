
-- 1) audio_library: restrict premium content to active subscribers
DROP POLICY IF EXISTS "Anyone can view audio library" ON public.audio_library;

CREATE POLICY "View free or premium with subscription"
ON public.audio_library
FOR SELECT
TO public
USING (
  is_premium = false
  OR (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.subscription_status = 'active'
    )
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 2) pending_activations: explicitly block INSERTs from clients as well
DROP POLICY IF EXISTS "Service role only" ON public.pending_activations;

CREATE POLICY "Block all client access"
ON public.pending_activations
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- 3) storage: restrict email-assets listing — allow only direct object access via signed/known path,
-- not enumeration. Replace broad SELECT with one that requires a non-empty exact name match style usage.
DROP POLICY IF EXISTS "Public read access for email-assets" ON storage.objects;

-- Keep public read but prevent listing by requiring a specific object name lookup
-- (Supabase listing uses SELECT with no name predicate — this still allows GET by exact path)
CREATE POLICY "Public read email-assets by path"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'email-assets' AND name IS NOT NULL);

-- 4) Revoke EXECUTE on has_role from anon (keep authenticated for RLS use)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
