import {
  trackIndex,
  musicList,
  postNewPlaylist,
  currentTrack,
  addToSelectedPlaylist,
  trackIndexPlus,
  trackIndexMinus,
  trackIndexZero,
  trackIndexToRandom,
  trackIndexMusicListLength,
  loadTrack,
  addHighlight,
  removeHighlightTrack,
  interval,
  intervalClear,
} from "./index.js";

const dropdownForm = document.querySelector(".select-playlist");
const crossElement = document.querySelector(".add-to-playlist img");
const newPlaylist = document.querySelector(".insert-name");
const closePlaylist = document.querySelector(".cross");
const showHideDropdownElement = document.querySelector(".show-hide-dropdown");
const addCancelPlaylistElement = document.querySelector(".add-new-playlist");
const addToFavoriteElement = document.querySelector(".add-to-favorite");
const playPauseBtn = document.querySelector(".play-pause-track");
const nextBtn = document.querySelector(".next-track img");
const prevBtn = document.querySelector(".prev-track img");
const randomTrackElement = document.querySelector(".random-track-off");
const repeatTrackElement = document.querySelector(".repeat-track-off");
export const seekSlider = document.querySelector(".seek-slider");
const volumeSlider = document.querySelector(".volume-slider");

let isDropdown = false;
let isPlaying = false;
let isRepeat = false;
let isRandom = false;
let isCreatingPlaylist = true;

export function loadUserInterface() {
  showHideDropdownElement.addEventListener("click", () => {
    showHideDropdown();
  });
  addCancelPlaylistElement.addEventListener("click", () => {
    addCancelPlaylist();
  });
  addToFavoriteElement.addEventListener("click", () => {
    addToSelectedPlaylist();
  });
  playPauseBtn.addEventListener("click", () => {
    playPauseTrack();
  });
  prevBtn.addEventListener("click", () => {
    prevTrack();
  });
  nextBtn.addEventListener("click", () => {
    nextTrack();
  });
  randomTrackElement.addEventListener("click", () => {
    randomTrack();
  });
  repeatTrackElement.addEventListener("click", () => {
    repeatTrack();
  });
  seekSlider.addEventListener("change", () => {
    seekTo();
  });
  volumeSlider.addEventListener("change", () => {
    setVolume();
  });
  dropdownForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const select = document.getElementById("playlist-dropdown");
    const selectedOption = select.options[select.selectedIndex];
    const selectedOptionId = Number(selectedOption.getAttribute("dropdown-id"));
    addToSelectedPlaylist(selectedOptionId);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      event.preventDefault();
      playPauseTrack();
    } else if (event.key === "ArrowRight") {
      nextTrack();
    } else if (event.key === "ArrowLeft") {
      prevTrack();
    }
  });
}

function showHideDropdown() {
  if (isDropdown === true) {
    hideDropdown();
  } else if (isDropdown === false) {
    dropdownForm.setAttribute("id", "select-playlist-id");
    crossElement.setAttribute("class", "rotate-image-on");
    isDropdown = true;
  }
}

export function hideDropdown() {
  dropdownForm.setAttribute("id", "");
  crossElement.setAttribute("class", "cross");
  isDropdown = false;
}

function playPauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

export function playTrack() {
  interval();
  currentTrack.play();
  isPlaying = true;
  playPauseBtn.setAttribute("src", "./assets/img/pause.svg");
  playPauseBtn.setAttribute("id", "play-on");
}

export function pauseTrack() {
  intervalClear();
  currentTrack.pause();
  isPlaying = false;
  playPauseBtn.setAttribute("src", "./assets/img/play.svg");
  playPauseBtn.setAttribute("id", "");
}

function prevTrack() {
  removeHighlightTrack();
  if (trackIndex > 0) {
    trackIndexMinus();
  } else {
    trackIndexMusicListLength();
  }
  loadTrack(trackIndex);
  addHighlight(trackIndex);
  playTrack();
}

export function nextTrack() {
  removeHighlightTrack();
  if (isRepeat === false) {
    if (trackIndex < musicList.length - 1 && isRandom === false) {
      trackIndexPlus();
    } else if (trackIndex < musicList.length - 1 && isRandom === true) {
      trackIndexToRandom();
    } else {
      trackIndexZero();
    }
  }
  loadTrack(trackIndex);
  addHighlight(trackIndex);
  playTrack();
}

function randomTrack() {
  if (isRepeat === true) {
    isRepeat = false;
    repeatTrackElement.setAttribute("class", "repeat-track-off");
  }
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true;
  randomTrackElement.setAttribute("class", "random-track-on");
}

function pauseRandom() {
  isRandom = false;
  randomTrackElement.setAttribute("class", "random-track-off");
}

function repeatTrack() {
  if ((isRandom = true)) {
    pauseRandom();
  }
  if (isRepeat === false) {
    isRepeat = true;
    repeatTrackElement.setAttribute("class", "repeat-track-on");
  } else {
    isRepeat = false;
    repeatTrackElement.setAttribute("class", "repeat-track-off");
  }
}

function seekTo() {
  let seekto = currentTrack.duration * (seekSlider.value / 100);
  currentTrack.currentTime = seekto;
}

function setVolume() {
  currentTrack.volume = volumeSlider.value / 100;
}

function addCancelPlaylist() {
  isCreatingPlaylist ? addNewPlaylist() : cancelNewPlaylist();
}

function addNewPlaylist() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const confirmButton = document.createElement("button");
  newPlaylist.textContent = "";
  form.setAttribute("id", "playlist-form");
  input.setAttribute("placeholder", "Name");
  input.setAttribute("name", "title");
  input.setAttribute("type", "text");
  input.setAttribute("required", "");
  input.setAttribute("maxlength", "30");
  confirmButton.setAttribute("type", "submit");
  confirmButton.textContent = "Create";
  form.appendChild(input);
  form.appendChild(confirmButton);
  newPlaylist.appendChild(form);
  closePlaylist.setAttribute("class", "rotate-image-on");

  const formPlaylist = document.getElementById("playlist-form");
  postNewPlaylist(formPlaylist);
}

export function cancelNewPlaylist() {
  newPlaylist.innerHTML = "";
  newPlaylist.textContent = "Playlists";
  isCreatingPlaylist = true;
  closePlaylist.setAttribute("class", "cross");
}

export function isCreatingPlaylistFalse() {
  isCreatingPlaylist = false;
}
