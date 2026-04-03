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

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    $progress.set(newTime);
    playerRef.current.seekTo(newTime);
  };

  if (!isMounted || !url) return null;

  return (
    <>
      {/* THE ENGINE: Always rendered so music never stops 
      */}
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
        /* MINI PLAYER */
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-center gap-2">
          <button 
            onClick={() => $isCollapsed.set(false)}
            className="w-16 h-16 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 hover:scale-110 transition-all"
          >
            <span className="text-2xl">{isPlaying ? "🎵" : "▶"}</span>
            {isPlaying && <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></span>}
          </button>
        </div>
      ) : (
        /* FULL PLAYER */
        <div className="fixed bottom-0 left-0 w-full z-[999] p-4">
          <div className="max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4">
            
            {/* Seek Bar */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] text-zinc-400 w-10">{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration}
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-[10px] text-zinc-400 w-10">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Info */}
              <div className="flex items-center gap-3 w-1/3 min-w-0">
                <div className="w-10 h-10 rounded bg-purple-800 flex-shrink-0 flex items-center justify-center">⛪</div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{title}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Sibagat FBC</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => $isPlaying.set(!isPlaying)}
                  className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition"
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              </div>

              {/* Minimize */}
              <div className="w-1/3 flex justify-end">
                <button onClick={() => $isCollapsed.set(true)} className="text-zinc-500 hover:text-white p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
