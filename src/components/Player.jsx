import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '@nanostores/react';
import { $currentTrack, $isPlaying, $trackTitle, $playlist, $isCollapsed } from '../store';

export default function Player() {
  const [isMounted, setIsMounted] = useState(false);
  const url = useStore($currentTrack);
  const isPlaying = useStore($isPlaying);
  const title = useStore($trackTitle);
  const playlist = useStore($playlist);
  const isCollapsed = useStore($isCollapsed);

  useEffect(() => { setIsMounted(true); }, []);

  const playNext = () => {
    const currentIndex = playlist.findIndex(track => track.url === url);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    $currentTrack.set(nextTrack.url);
    $trackTitle.set(nextTrack.title);
    $isPlaying.set(true);
  };

  if (!isMounted || !url) return null;

  // --- MINI PLAYER VIEW (When Collapsed) ---
  if (isCollapsed) {
    return (
      <div className="fixed bottom-6 right-6 z-[1000] animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => $isCollapsed.set(false)}
          className="relative group w-16 h-16 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 hover:scale-110 transition-all"
        >
          <span className="text-2xl">{isPlaying ? "🎵" : "▶"}</span>
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></span>
          )}
          <div className="absolute -top-12 right-0 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Expand Player
          </div>
        </button>
      </div>
    );
  }

  // --- MAIN PLAYER VIEW (Floating Bar) ---
  return (
    <div className="fixed bottom-0 left-0 w-full z-[999] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Progress indicator (Mock) */}
        <div className="h-1 w-full bg-white/5">
          <div className={`h-full bg-purple-500 transition-all duration-500 ${isPlaying ? 'w-1/2' : 'w-0'}`}></div>
        </div>

        <div className="flex items-center justify-between p-4 gap-4">
          <div className="hidden">
            <ReactPlayer url={url} playing={isPlaying} width="0" height="0" onEnded={playNext} />
          </div>

          {/* Left: Metadata */}
          <div className="flex items-center gap-3 w-1/3 min-w-0">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>
               <span className="text-xl">⛪</span>
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate leading-tight">{title}</p>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">SFBC Sermon</p>
            </div>
          </div>

          {/* Center: Main Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button onClick={playNext} className="text-zinc-400 hover:text-white transition">
                <span className="text-xl">⏭</span>
              </button>
              <button 
                onClick={() => $isPlaying.set(!isPlaying)}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg shadow-white/10"
              >
                {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl ml-1">▶</span>}
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-4 w-1/3">
             <button 
              onClick={() => $isCollapsed.set(true)}
              className="group p-2 text-zinc-400 hover:text-white transition"
              title="Minimize"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
