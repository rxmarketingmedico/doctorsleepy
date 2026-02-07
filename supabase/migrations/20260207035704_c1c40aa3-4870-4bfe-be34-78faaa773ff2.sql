-- Allow admins to read pending_activations
CREATE POLICY "Admins can view pending activations"
ON public.pending_activations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));