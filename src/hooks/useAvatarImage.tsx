import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening';

interface CachedImage {
  url: string;
  timestamp: number;
}

// Cache images for 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

// In-memory cache to avoid regenerating images
const imageCache: Record<AvatarState, CachedImage | null> = {
  idle: null,
  thinking: null,
  speaking: null,
  listening: null,
};

export function useAvatarImage(state: AvatarState) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvatarImage = useCallback(async (avatarState: AvatarState) => {
    // Check cache first
    const cached = imageCache[avatarState];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('generate-avatar', {
        body: { state: avatarState },
      });

      if (funcError) throw funcError;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      const url = data?.imageUrl;
      if (url) {
        // Cache the result
        imageCache[avatarState] = {
          url,
          timestamp: Date.now(),
        };
        return url;
      }

      return null;
    } catch (err) {
      console.error('Error generating avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate avatar');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      const url = await fetchAvatarImage(state);
      if (mounted && url) {
        setImageUrl(url);
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [state, fetchAvatarImage]);

  // Pre-fetch other states in the background
  useEffect(() => {
    const states: AvatarState[] = ['idle', 'thinking', 'speaking', 'listening'];
    const otherStates = states.filter(s => s !== state);

    // Stagger pre-fetches to avoid rate limiting
    otherStates.forEach((s, index) => {
      if (!imageCache[s]) {
        setTimeout(() => {
          fetchAvatarImage(s);
        }, (index + 1) * 5000); // 5 seconds apart
      }
    });
  }, [fetchAvatarImage, state]);

  return { imageUrl, isLoading, error };
}
