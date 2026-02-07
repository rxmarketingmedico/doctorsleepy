-- Drop existing RESTRICTIVE policies on profiles
DROP POLICY "Users can view their own profile" ON public.profiles;
DROP POLICY "Users can update their own profile" ON public.profiles;
DROP POLICY "Users can create their own profile" ON public.profiles;
DROP POLICY "Admins can view all profiles" ON public.profiles;
DROP POLICY "Admins can update all profiles" ON public.profiles;
DROP POLICY "Admins can delete all profiles" ON public.profiles;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete all profiles" ON public.profiles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));