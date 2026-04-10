UPDATE audio_library SET 
  audio_url = 'https://www.mfiles.co.uk/mp3-downloads/twinkle-twinkle-little-star.mp3',
  duration_seconds = 34,
  description = 'Classic nursery rhyme and lullaby, gentle melody perfect for bedtime'
WHERE title = 'Twinkle Twinkle Little Star';

UPDATE audio_library SET 
  audio_url = 'https://archive.org/download/mozartlullabyrelaxingbabysleep/Mozart%20Lullaby%20Relaxing%20Baby%20Sleep.mp3',
  title = 'Mozart Lullaby',
  author = 'Mozart',
  duration_seconds = 2640,
  description = 'Relaxing Mozart lullaby for peaceful baby sleep'
WHERE title = 'Brahms Lullaby';

UPDATE audio_library SET 
  audio_url = 'https://archive.org/download/relaxingbabylullabysleepmusic/Relaxing%20Baby%20Lullaby%20Sleep%20Music.mp3',
  title = 'Relaxing Baby Lullaby',
  author = 'Sleep Music',
  duration_seconds = 5400,
  description = 'Soothing lullaby music to help your baby fall asleep'
WHERE title = 'Rock-a-Bye Baby';

UPDATE audio_library SET 
  audio_url = 'https://archive.org/download/1hourrelaxingbabylullaby/1%20Hour%20Relaxing%20Baby%20Lullaby.mp3',
  title = '1 Hour Relaxing Lullaby',
  author = 'Sleep Music',
  duration_seconds = 3600,
  description = 'One hour of calming lullaby music for extended sleep sessions'
WHERE title = 'Hush Little Baby';