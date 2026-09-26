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
  {
    id: '4',
    title: 'Everything In Its Right Place',
    artist: 'Radiohead',
    album: 'Kid A',
    duration: '4:12',
    audioSrc: '/audio/everything.mp3',
    coverSrc: '/covers/kid-a.jpg',
  },
  {
    id: '5',
    title: 'Karma Police',
    artist: 'Radiohead',
    album: 'OK Computer',
    duration: '4:21',
    audioSrc: '/audio/karma-police.mp3',
    coverSrc: '/covers/ok-computer.jpg',
  },
];
