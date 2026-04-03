import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '@nanostores/react';
import { $currentTrack, $isPlaying, $trackTitle, $isCollapsed, $progress, $duration } from '../store';

export default function Player() {
  const [isMounted, setIsMounted] = useState(false);
  const playerRef = useRef(null);
  
  const url = useStore($currentTrack);
  const isPlaying = useStore($isPlaying);
  const title = useStore($trackTitle);
  const isCollapsed = useStore($isCollapsed);
  const progress = useStore($progress);
  const duration = useStore($duration);

  useEffect(() => { setIsMounted(true); }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    $progress.set(newTime);
    playerRef.current.seekTo(newTime);
  };

  if (!isMounted || !url) return null;

  return (
    <>
      {/* THE ENGINE (Hidden) */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={isPlaying}
          onProgress={(state) => $progress.set(state.playedSeconds)}
          onDuration={(d) => $duration.set(d)}
          width="0"
          height="0"
        />
      </div>

      {/* WRAPPER: Fixed at the bottom */}
      <div className={`fixed bottom-0 left-0 w-full z-[1000] transition-all duration-500 ease-in-out transform ${isCollapsed ? 'translate-y-0' : 'translate-y-0'}`}>
        
        {isCollapsed ? (
          /* --- MINI BOTTOM BAR (Collapsed State) --- */
          <div className="bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-between shadow-2xl cursor-pointer hover:bg-slate-800/95 transition-colors"
               onClick={() => $isCollapsed.set(false)}>
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded bg-purple-600 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>
                <span className="text-lg">🎵</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium truncate">{title || "No Track Selected"}</h3>
                <p className="text-purple-400 text-[10px] uppercase font-bold tracking-tighter">Tap to expand</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                onClick={(e) => { e.stopPropagation(); $isPlaying.set(!isPlaying); }}
                className="w-10 h-10 flex items-center justify-center text-white"
              >
                {isPlaying ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>
            </div>
            
            {/* Slim progress line on top of the mini-bar */}
            <div className="absolute top-0 left-0 h-[2px] bg-purple-500 transition-all duration-300" style={{ width: `${(progress / duration) * 100}%` }}></div>
          </div>

        ) : (
          /* --- FULL PLAYER DASHBOARD (Expanded State) --- */
          <div className="h-[280px] md:h-[220px] bg-slate-950 border-t border-purple-500/30 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            {/* Close/Collapse Button */}
            <button 
              onClick={() => $isCollapsed.set(true)}
              className="absolute top-2 right-1/2 translate-x-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg>
            </button>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 mt-4">
              
              {/* Track Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-xl flex items-center justify-center text-2xl">
                   {isPlaying ? "💿" : "📻"}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold truncate text-lg">{title || "Select a Song"}</h3>
                  <p className="text-slate-400 text-xs italic">Rickaraoke System</p>
                </div>
              </div>

              {/* Controls & Progress */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-8">
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                  </button>
                  
                  <button 
                    onClick={() => $isPlaying.set(!isPlaying)}
                    className="w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all transform active:scale-95"
                  >
                    {isPlaying ? (
                      <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    ) : (
                      <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    )}
                  </button>

                  <button className="text-slate-400 hover:text-white transition-colors">
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                  </button>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Extra Controls (Volume/Playlist) */}
              <div className="hidden md:flex justify-end items-center gap-4 text-slate-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-slate-500"></div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
