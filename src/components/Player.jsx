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

      {isCollapsed ? (
        /* MINI PLAYER (Floating Orb) */
        <div className="fixed bottom-6 right-6 z-[1000]">
          <button 
            onClick={() => $isCollapsed.set(false)}
            className="group relative w-16 h-16 bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center border border-white/20 hover:scale-110 transition-all duration-300"
          >
            <span className="text-2xl z-10">{isPlaying ? "⏸" : "▶"}</span>
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-50"></span>
            )}
            <div className="absolute -top-12 right-0 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Expand Player
            </div>
          </button>
        </div>
      ) : (
        /* FULL PROFESSIONAL PLAYER (Floating Glass Dashboard) */
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-1">Now Playing</p>
                <h3 className="text-white font-semibold truncate text-sm">{title || "Unknown Track"}</h3>
              </div>
              <button 
                onClick={() => $isCollapsed.set(true)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
            </div>

            {/* Progress Section */}
            <div className="space-y-1 mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="text-slate-400 hover:text-purple-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
              </button>
              
              <button 
                onClick={() => $isPlaying.set(!isPlaying)}
                className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>

              <button className="text-slate-400 hover:text-purple-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
