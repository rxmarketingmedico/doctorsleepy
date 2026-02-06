-- Add parent profile columns
ALTER TABLE public.profiles
ADD COLUMN is_first_child BOOLEAN DEFAULT true,
ADD COLUMN parent_experience TEXT CHECK (parent_experience IN ('none', 'some', 'experienced')),
ADD COLUMN has_support_network BOOLEAN DEFAULT false,
ADD COLUMN main_concerns TEXT[] DEFAULT '{}';