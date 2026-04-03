import React from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '@nanostores/react';
import { $currentTrack, $isPlaying } from '../store';

export default function Player() {
  const url = useStore($currentTrack);
  const playing = useStore($isPlaying);

  if (!url) return null; // Only show if a track is selected

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 text-white border-t border-zinc-800 z-50 overflow-hidden" 
         style={{ height: '80px', minHeight: '60px', maxHeight: '400px', resize: 'vertical' }}>
      
      <div className="flex items-center h-full px-4 gap-4">
        {/* Hidden Player Engine */}
        <div className="hidden">
          <ReactPlayer 
            url={url} 
            playing={playing} 
            controls={false}
            width="0"
            height="0"
          />
        </div>

        {/* UI Controls */}
        <button onClick={() => $isPlaying.set(!playing)} className="p-3 bg-white text-black rounded-full">
          {playing ? '⏸' : '▶'}
        </button>

        <div className="flex-1">
          <p className="text-sm font-medium truncate">{url}</p>
          <div className="w-full bg-zinc-700 h-1 rounded-full mt-2">
            {/* You can add a progress bar here linked to ReactPlayer's onProgress */}
            <div className="bg-green-500 h-full w-1/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
