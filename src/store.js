import { atom } from 'nanostores';

export const $playlist = atom([
  { title: "Nganong Dili Makaluwas Ang Atong Maayong Buhat", url: "https://www.youtube.com/watch?v=CaTeyPHbY1k" },
  { title: "Sermon 1 - The Word of God", url: "/sermon1.mp3" }
]);

export const $currentTrack = atom("https://www.youtube.com/watch?v=CaTeyPHbY1k");
export const $trackTitle = atom("Nganong Dili Makaluwas Ang Atong Maayong Buhat");
export const $isPlaying = atom(true);
export const $isCollapsed = atom(false);

// New: Progress tracking
export const $progress = atom(0); // Current time in seconds
export const $duration = atom(0); // Total length in seconds
