import React, { useState, useRef, useEffect } from 'react';
import { playlist, Track } from '../data/playlist';
import { useRetroNoise } from '../hooks/useRetroNoise';

interface MusicPlayerProps {
  windowId?: string;
}

// Pixel-art cassette tape SVG fallback
const CassetteFallback: React.FC = () => (
  <svg width="128" height="128" viewBox="0 0 128 128" style={{ imageRendering: 'pixelated' }}>
    {/* Cassette body */}
    <rect x="16" y="32" width="96" height="64" fill="#8B4513" />
    <rect x="16" y="32" width="96" height="4" fill="#A0522D" />
    <rect x="16" y="92" width="96" height="4" fill="#654321" />
    
    {/* Label area */}
    <rect x="24" y="40" width="80" height="32" fill="#F5DEB3" />
    <rect x="24" y="40" width="80" height="2" fill="#DEB887" />
    
    {/* Tape reels */}
    <circle cx="44" cy="56" r="12" fill="#2F2F2F" />
    <circle cx="44" cy="56" r="8" fill="#1F1F1F" />
    <circle cx="44" cy="56" r="4" fill="#0F0F0F" />
    
    <circle cx="84" cy="56" r="12" fill="#2F2F2F" />
    <circle cx="84" cy="56" r="8" fill="#1F1F1F" />
    <circle cx="84" cy="56" r="4" fill="#0F0F0F" />
    
    {/* Tape window */}
    <rect x="32" y="76" width="64" height="12" fill="#1F1F1F" />
    <rect x="36" y="78" width="56" height="8" fill="#3F3F3F" />
    
    {/* Screws */}
    <circle cx="24" cy="40" r="2" fill="#654321" />
    <circle cx="104" cy="40" r="2" fill="#654321" />
    <circle cx="24" cy="88" r="2" fill="#654321" />
    <circle cx="104" cy="88" r="2" fill="#654321" />
  </svg>
);

export default function MusicPlayer({ windowId }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [musicVolume, setMusicVolume] = useState(80);
  const [noiseVolume, setNoiseVolume] = useState(12);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coverError, setCoverError] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState([20, 20, 20, 20, 20]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { start: startNoise, stop: stopNoise, setVolume: setNoiseVolumeLevel } = useRetroNoise();

  const currentTrack = playlist[currentTrackIndex];

  // Обновление громкости музыки
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  // Обновление громкости шума
  useEffect(() => {
    setNoiseVolumeLevel(noiseVolume);
  }, [noiseVolume, setNoiseVolumeLevel]);

  // Обновление времени
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Визуализатор - анимация при воспроизведении
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerBars([20, 20, 20, 20, 20]);
      return;
    }

    const interval = setInterval(() => {
      setVisualizerBars([
        20 + Math.random() * 60,
        20 + Math.random() * 60,
        20 + Math.random() * 60,
        20 + Math.random() * 60,
        20 + Math.random() * 60,
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Обработка окончания трека
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [isLooping, currentTrackIndex]);

  // Play/Pause
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      stopNoise();
    } else {
      audio.play();
      startNoise();
    }
    setIsPlaying(!isPlaying);
  };

  // Next track
  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setCoverError(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  // Previous track
  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    setCoverError(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  // Format time
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-800 p-2">
      {/* Main Player */}
      <div className="flex gap-3 mb-3">
        {/* Album Cover - always show cassette fallback (no external images) */}
        <div className="w-32 h-32 bg-black border-2 border-gray-600 flex items-center justify-center overflow-hidden">
          <CassetteFallback />
        </div>

        {/* LCD Display */}
        <div className="flex-1 flex flex-col">
          <div 
            className="flex-1 bg-green-900 border-2 border-gray-600 p-2 flex flex-col justify-center"
            style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            <div className="text-green-400 text-xs font-mono truncate">
              {currentTrack.title}
            </div>
            <div className="text-green-500 text-xs font-mono truncate">
              {currentTrack.artist}
            </div>
            <div className="text-green-600 text-[10px] font-mono mt-1">
              {currentTrack.album}
            </div>
            <div className="text-green-400 text-xs font-mono mt-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Visualizer */}
          <div className="h-8 bg-black border-2 border-gray-600 mt-1 flex items-end justify-around px-1">
            {visualizerBars.map((height, i) => (
              <div
                key={i}
                className="w-2 bg-green-400 transition-all duration-100"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00ff00 0%, #00ff00 ${(currentTime / duration) * 100}%, #444 ${(currentTime / duration) * 100}%, #444 100%)`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          onClick={handlePrev}
          className="w-10 h-8 bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 active:bg-gray-800 flex items-center justify-center"
          style={{ boxShadow: 'inset 1px 1px 0 #888, inset -1px -1px 0 #333' }}
          aria-label="Previous track"
        >
          <span className="text-green-400 text-sm">|◀</span>
        </button>
        <button
          onClick={handlePlayPause}
          className="w-12 h-8 bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 active:bg-gray-800 flex items-center justify-center"
          style={{ boxShadow: 'inset 1px 1px 0 #888, inset -1px -1px 0 #333' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="text-green-400 text-sm">{isPlaying ? '❚❚' : '▶'}</span>
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-8 bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 active:bg-gray-800 flex items-center justify-center"
          style={{ boxShadow: 'inset 1px 1px 0 #888, inset -1px -1px 0 #333' }}
          aria-label="Next track"
        >
          <span className="text-green-400 text-sm">▶|</span>
        </button>
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`w-10 h-8 border-2 flex items-center justify-center ${
            isLooping ? 'bg-green-700 border-green-600' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
          }`}
          style={{ boxShadow: 'inset 1px 1px 0 #888, inset -1px -1px 0 #333' }}
          aria-label="Toggle loop"
        >
          <span className="text-green-400 text-xs">RPT</span>
        </button>
      </div>

      {/* Volume Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xs font-mono w-16">Music:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00ff00 0%, #00ff00 ${musicVolume}%, #444 ${musicVolume}%, #444 100%)`,
            }}
          />
          <span className="text-green-400 text-xs font-mono w-8">{musicVolume}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xs font-mono w-16">Noise:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={noiseVolume}
            onChange={(e) => setNoiseVolume(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ffaa00 0%, #ffaa00 ${noiseVolume}%, #444 ${noiseVolume}%, #444 100%)`,
            }}
          />
          <span className="text-green-400 text-xs font-mono w-8">{noiseVolume}%</span>
        </div>
      </div>

      {/* Playlist */}
      <div className="flex-1 mt-3 overflow-y-auto bg-black border-2 border-gray-600">
        <div className="text-green-400 text-xs font-mono p-1 border-b border-gray-700">
          Playlist ({playlist.length} tracks)
        </div>
        {playlist.map((track, index) => (
          <div
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setCoverError(false);
              if (isPlaying && audioRef.current) {
                audioRef.current.play();
              }
            }}
            className={`px-2 py-1 cursor-pointer text-xs font-mono flex items-center gap-2 ${
              index === currentTrackIndex
                ? 'bg-green-900 text-green-300'
                : 'text-green-500 hover:bg-gray-900'
            }`}
          >
            <span className="w-4">{index + 1}.</span>
            <span className="flex-1 truncate">{track.title}</span>
            <span className="text-green-600">{track.duration}</span>
          </div>
        ))}
      </div>

      {/* Audio element disabled - using procedural noise only */}
      {/* <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        loop={isLooping}
        onEnded={() => {}}
      /> */}
    </div>
  );
}
