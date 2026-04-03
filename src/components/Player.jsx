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

  // --- SVG ICON COMPONENTS ---
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  );

  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
  );

  const SkipBackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
  );

  const SkipForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
  );

  const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );

  return (
    <>
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
          /* --- FLOATING FAB --- */
          <div className="flex justify-end p-6 pointer-events-auto">
            <button 
              onClick={() => $isCollapsed.set(false)}
              className="group relative w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 text-white"
            >
              <div className={`absolute inset-1 rounded-full border-2 border-dashed border-white/10 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}></div>
              <div className="z-10 transition-transform duration-200 group-hover:scale-110">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </div>
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-30"></span>
              )}
            </button>
          </div>
        ) : (
          /* --- SLIM BOTTOM BAR --- */
          <div className="pointer-events-auto w-full bg-slate-950/95 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
            
            {/* Range Seeker positioned precisely on the top border line */}
            <div className="absolute -top-[3px] left-0 w-full group h-2 flex items-center z-20">
               <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-purple-500 hover:h-1.5 transition-all"
              />
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
              
              {/* Info Area */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0 border border-white/10">
                   <svg className={`text-purple-500 ${isPlaying ? 'animate-bounce' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-sm font-semibold truncate leading-none mb-1">{title || "Select a Track"}</h3>
                  <p className="text-slate-500 text-[10px] font-mono tracking-wider">{formatTime(progress)} / {formatTime(duration)}</p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4 md:gap-8">
                <button className="hidden sm:block text-slate-400 hover:text-white transition-all transform active:scale-90">
                  <SkipBackIcon />
                </button>
                
                <button 
                  onClick={() => $isPlaying.set(!isPlaying)}
                  className="w-11 h-11 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button className="hidden sm:block text-slate-400 hover:text-white transition-all transform active:scale-90">
                  <SkipForwardIcon />
                </button>
              </div>

              {/* Expand/Collapse Toggle */}
              <div className="flex items-center justify-end flex-1">
                <button 
                  onClick={() => $isCollapsed.set(true)}
                  className="group p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <div className="group-hover:translate-y-0.5 transition-transform">
                    <ChevronDownIcon />
                  </div>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
