import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '@nanostores/react';
import { $currentTrack, $isPlaying, $trackTitle, $playlist } from '../store';

export default function Player() {
  const [isMounted, setIsMounted] = useState(false);
  const url = useStore($currentTrack);
  const isPlaying = useStore($isPlaying);
  const title = useStore($trackTitle);
  const playlist = useStore($playlist);

  // This ensures the component only runs on the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playNext = () => {
    const currentIndex = playlist.findIndex(track => track.url === url);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    $currentTrack.set(nextTrack.url);
    $trackTitle.set(nextTrack.title);
    $isPlaying.set(true);
  };

  if (!isMounted || !url) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#121212] text-white border-t border-[#282828] z-[999]" style={{ height: '90px' }}>
      <div className="flex items-center justify-between h-full px-6 max-w-[1400px] mx-auto">
        <div className="hidden">
          <ReactPlayer 
            url={url} 
            playing={isPlaying} 
            width="0" 
            height="0" 
            onEnded={playNext}
          />
        </div>
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-10 h-10 bg-purple-700 rounded flex-shrink-0 flex items-center justify-center">🎵</div>
          <div className="truncate text-sm font-bold">{title}</div>
        </div>
        <div className="flex items-center justify-center w-1/3 gap-4">
           <button onClick={() => $isPlaying.set(!isPlaying)} className="w-10 h-10 bg-white text-black rounded-full">
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>
        <div className="w-1/3 text-right text-[10px] text-gray-500 uppercase">Live Stream</div>
      </div>
    </div>
  );
}
