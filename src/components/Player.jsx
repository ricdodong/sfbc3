import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '@nanostores/react';
import { $currentTrack, $isPlaying, $trackTitle, $isCollapsed, $progress, $duration } from '../store';

export default function HybridPlayer() {
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
      {/* ENGINE */}
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

      <div className="fixed inset-x-0 bottom-0 z-[1000] pointer-events-none">
        {isCollapsed ? (
          /* --- 1. COLLAPSED: FLOATING BUTTON --- */
          <div className="flex justify-end p-6 pointer-events-auto">
            <button 
              onClick={() => $isCollapsed.set(false)}
              className="group relative w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95"
            >
              {/* Spinning Vinyl Effect when playing */}
              <div className={`absolute inset-1 rounded-full border-2 border-dashed border-white/10 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
              
              <span className="text-2xl z-10">{isPlaying ? "⏸" : "▶"}</span>
              
              {/* Dynamic Ping Ring */}
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-40"></span>
              )}
            </button>
          </div>
        ) : (
          /* --- 2. EXPANDED: SLIM BOTTOM BAR --- */
          <div className="pointer-events-auto w-full bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300">
            
            {/* Interactive Progress Bar (Full Width) */}
            <div className="absolute -top-1 left-0 w-full group h-2 flex items-center">
               <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
              
              {/* Info Section */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-purple-600 rounded shadow-inner flex items-center justify-center flex-shrink-0">
                   <span className="animate-pulse">🎵</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-sm font-bold truncate leading-tight">{title || "Rickaraoke Track"}</h3>
                  <p className="text-slate-400 text-[10px] font-mono">{formatTime(progress)} / {formatTime(duration)}</p>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex items-center gap-2 md:gap-6">
                <button className="hidden sm:block text-slate-400 hover:text-white transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                </button>
                
                <button 
                  onClick={() => $isPlaying.set(!isPlaying)}
                  className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {isPlaying ? (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                </button>

                <button className="hidden sm:block text-slate-400 hover:text-white transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                </button>
              </div>

              {/* Action Section */}
              <div className="flex items-center justify-end flex-1">
                <button 
                  onClick={() => $isCollapsed.set(true)}
                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all"
                  title="Collapse to Floating"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m19 9-7 7-7-7"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
