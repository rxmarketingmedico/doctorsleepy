
-- Table to store Hotmart purchases when user hasn't signed up yet
CREATE TABLE public.pending_activations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  subscription_status TEXT NOT NULL DEFAULT 'active',
  subscription_plan TEXT,
  subscription_expires_at TIMESTAMPTZ,
  hotmart_transaction_id TEXT,
  event TEXT NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false
);

-- Index for quick email lookup
CREATE INDEX idx_pending_activations_email ON public.pending_activations (email) WHERE NOT processed;

-- Enable RLS
ALTER TABLE public.pending_activations ENABLE ROW LEVEL SECURITY;

-- Only service role (edge functions) can manage this table
CREATE POLICY "Service role only" ON public.pending_activations
  FOR ALL USING (false);

-- Function to auto-activate subscription when a new user signs up
CREATE OR REPLACE FUNCTION public.activate_pending_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pending RECORD;
  user_email TEXT;
BEGIN
  -- Get the email of the newly created user
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
  
  IF user_email IS NULL THEN
    RETURN NEW;
  END IF;

  -- Find the most recent unprocessed pending activation for this email
  SELECT * INTO pending
  FROM public.pending_activations
  WHERE LOWER(email) = LOWER(user_email)
    AND NOT processed
    AND subscription_status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  IF pending IS NOT NULL THEN
    -- Update the new profile with subscription data
    NEW.subscription_status := pending.subscription_status;
    NEW.subscription_plan := pending.subscription_plan;
    NEW.subscription_expires_at := pending.subscription_expires_at;
    NEW.hotmart_transaction_id := pending.hotmart_transaction_id;
    NEW.subscription_id := pending.hotmart_transaction_id;

    -- Mark as processed
    UPDATE public.pending_activations
    SET processed = true
    WHERE id = pending.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on profile insert (runs after handle_new_user creates the profile)
CREATE TRIGGER activate_subscription_on_signup
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_pending_subscription();
