import { atom } from 'nanostores';

export const $playlist = atom([
  {
    title: "Nganong Dili Makaluwas Ang Atong Maayong Buhat by Pastor Reynaldo Subrabas",
    url: "https://www.youtube.com/watch?v=CaTeyPHbY1k",
    type: "video"
  },
  {
    title: "Sermon 1 - The Word of God",
    url: "/sermon1.mp3",
    type: "audio"
  }
]);

export const $currentTrack = atom("https://www.youtube.com/watch?v=CaTeyPHbY1k");
export const $trackTitle = atom("Nganong Dili Makaluwas Ang Atong Maayong Buhat by Pastor Reynaldo Subrabas");
export const $isPlaying = atom(true); 
// New state for the collapsible feature
export const $isCollapsed = atom(false);
