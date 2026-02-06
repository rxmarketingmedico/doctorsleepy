-- Create audio library table for stories and lullabies
CREATE TABLE public.audio_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('lullaby', 'story')),
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  author TEXT,
  is_premium BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_library ENABLE ROW LEVEL SECURITY;

-- Everyone can view audio library (public content)
CREATE POLICY "Anyone can view audio library" 
ON public.audio_library 
FOR SELECT 
USING (true);

-- Create table to track user's recently played
CREATE TABLE public.audio_plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  audio_id UUID NOT NULL REFERENCES public.audio_library(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_plays ENABLE ROW LEVEL SECURITY;

-- Users can view their own play history
CREATE POLICY "Users can view their own plays" 
ON public.audio_plays 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can record their plays
CREATE POLICY "Users can record their plays" 
ON public.audio_plays 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_audio_library_category ON public.audio_library(category);
CREATE INDEX idx_audio_plays_user ON public.audio_plays(user_id);
CREATE INDEX idx_audio_plays_audio ON public.audio_plays(audio_id);

-- Insert sample data with free audio URLs
INSERT INTO public.audio_library (title, description, category, audio_url, duration_seconds, author) VALUES
-- Músicas de ninar
('Brahms Lullaby', 'A clássica canção de ninar de Johannes Brahms, perfeita para acalmar seu bebê', 'lullaby', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 180, 'Johannes Brahms'),
('Twinkle Twinkle Little Star', 'Brilha brilha estrelinha, melodia suave e reconfortante', 'lullaby', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 120, 'Tradicional'),
('Rock-a-bye Baby', 'Canção de ninar tradicional com melodia gentil', 'lullaby', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 150, 'Tradicional'),
('Hush Little Baby', 'Melodia tranquila para embalar seu pequeno', 'lullaby', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 135, 'Tradicional'),
('Nana Nenê', 'Clássica canção de ninar brasileira', 'lullaby', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 160, 'Tradicional Brasileira'),

-- Histórias infantis
('Os Três Porquinhos', 'A história clássica dos três porquinhos e o lobo mau', 'story', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 420, 'Conto Popular'),
('Chapeuzinho Vermelho', 'A aventura de Chapeuzinho pela floresta', 'story', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 480, 'Irmãos Grimm'),
('A Lebre e a Tartaruga', 'Fábula sobre persistência e humildade', 'story', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 300, 'Esopo'),
('João e o Pé de Feijão', 'A mágica aventura de João nas nuvens', 'story', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 540, 'Conto Popular'),
('A Cigarra e a Formiga', 'Fábula sobre trabalho e planejamento', 'story', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 240, 'Esopo');