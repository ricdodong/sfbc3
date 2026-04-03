import { atom } from 'nanostores';

// The Playlist Array
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

// Initial State: Load the first item from the playlist by default
export const $currentTrack = atom("https://www.youtube.com/watch?v=CaTeyPHbY1k");
export const $trackTitle = atom("Sunday Service - Worship");
export const $isPlaying = atom(false); // Set to true if you want it to autoplay
