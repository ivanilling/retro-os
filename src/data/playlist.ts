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
    audioSrc: '',
    coverSrc: '',
  },
  {
    id: '2',
    title: 'Just',
    artist: 'Radiohead',
    album: 'The Bends',
    duration: '3:54',
    audioSrc: '',
    coverSrc: '',
  },
  {
    id: '3',
    title: 'No Surprises',
    artist: 'Radiohead',
    album: 'OK Computer',
    duration: '3:49',
    audioSrc: '',
    coverSrc: '',
  },
];
