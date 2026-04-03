import { atom } from 'nanostores';

export const $currentTrack = atom(null); // e.g., "https://www.youtube.com/watch?v..."
export const $isPlaying = atom(false);
