import React from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '@nanostores/react';
import { $currentTrack, $isPlaying, $trackTitle, $playlist } from '../store';

export default function Player() {
  const url = useStore($currentTrack);
  const isPlaying = useStore($isPlaying);
  const title = useStore($trackTitle);
  const playlist = useStore($playlist);

  const playNext = () => {
    const currentIndex = playlist.findIndex(track => track.url === url);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    $currentTrack.set(nextTrack.url);
    $trackTitle.set(nextTrack.title);
    $isPlaying.set(true);
  };

  if (!url) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#121212] text-white border-t border-[#282828] z-[999] shadow-2xl" style={{ height: '90px' }}>
      <div className="flex items-center justify-between h-full px-6 max-w-[1400px] mx-auto gap-4">
        
        {/* Hidden Audio Engine */}
        <div className="hidden">
          <ReactPlayer 
            url={url} 
            playing={isPlaying} 
            width="0" 
            height="0" 
            onEnded={playNext}
          />
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/3 truncate">
          <div className="w-12 h-12 bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-xl">⛪</span>
          </div>
          <div className="truncate">
            <p className="text-sm font-bold truncate">{title}</p>
            <p className="text-xs text-gray-400">Sibagat FBC</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 w-1/3">
          <div className="flex items-center gap-5">
            <button onClick={playNext} className="text-gray-400 hover:text-white transition">
               <span className="text-xl">⏭</span>
            </button>
            
            <button 
              onClick={() => $isPlaying.set(!isPlaying)}
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="w-1/3 text-right hidden md:block">
          <span className="text-[10px] text-purple-400 font-mono tracking-tighter uppercase">
            Now Streaming
          </span>
        </div>
      </div>
    </div>
  );
}
