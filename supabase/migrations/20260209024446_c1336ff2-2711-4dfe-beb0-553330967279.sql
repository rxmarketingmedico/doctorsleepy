CREATE POLICY "Admins can view pending activations"
ON public.pending_activations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));