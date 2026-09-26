/**
 * 🎵 MUSIC PLAYLIST CONFIGURATION 🎵
 * 
 * AUDIO FILE PLACEMENT:
 * Place your MP3 files in: public/audio/
 * 
 * Required filenames (must match exactly):
 * - creep.mp3
 * - just.mp3
 * - no-surprises.mp3
 * 
 * The MusicPlayer component will automatically detect these files
 * and play them. If files are missing, a warning message will be shown.
 * 
 * COVER ART (Optional):
 * Place cover images in: public/covers/
 * - pablo-honey.jpg (300x300px recommended)
 * - the-bends.jpg
 * - ok-computer.jpg
 * 
 * If cover images are missing, a pixel-art cassette fallback will be shown.
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioSrc: string;
  coverSrc: string;
}

export const playlist: Track[] = [
  {
    id: '1',
    title: 'Creep',
    artist: 'Radiohead',
    album: 'Pablo Honey',
    duration: '3:56',
    audioSrc: '/audio/creep.mp3',
    coverSrc: '/covers/pablo-honey.jpg',
  },
  {
    id: '2',
    title: 'Just',
    artist: 'Radiohead',
    album: 'The Bends',
    duration: '3:54',
    audioSrc: '/audio/just.mp3',
    coverSrc: '/covers/the-bends.jpg',
  },
  {
    id: '3',
    title: 'No Surprises',
    artist: 'Radiohead',
    album: 'OK Computer',
    duration: '3:49',
    audioSrc: '/audio/no-surprises.mp3',
    coverSrc: '/covers/ok-computer.jpg',
  },
];
