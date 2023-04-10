import {
  loadUserInterface,
  pauseTrack,
  playTrack,
  hideDropdown,
  nextTrack,
  isCreatingPlaylistFalse,
  cancelNewPlaylist,
  seekSlider,
} from "./ui.js";

const trackName = document.querySelector(".current-track-name");
const trackArtist = document.querySelector(".current-track-artist");
const artworkImg = document.querySelector(".artwork-img");
const dropdown = document.getElementById("playlist-dropdown");
const songsList = document.querySelector(".songs-list");
const playlistsInventory = document.querySelector(".playlist-inventory");
const currentTime = document.querySelector(".current-time");
export const totalDuration = document.querySelector(".total-duration");
export const currentTrack = document.createElement("audio");
export let trackIndex = 0;
export let musicList = [];
export let updateTimer;
let activePlaylist = 0;
let playlists = [];

fetchPlayLists();

// Playlists:

function fetchPlayLists() {
  fetch("/playlists")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch playlist data!");
      }
      return response.json();
    })
    .then((data) => {
      playlists = data;
      renderPlaylists(playlists);
      fetchAllTracks();
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function renderPlaylists(playlist) {
  dropdown.innerHTML = "";
  playlistsInventory.innerHTML =
    "<li id='0' class='load-tracks' >All Tracks</li>";
  playlist.forEach((e) => {
    const li = document.createElement("li");
    li.setAttribute("id", e.id);
    li.setAttribute("class", "load-tracks");
    const deleteButton = document.createElement("img");
    deleteButton.setAttribute("class", "playlist-delete-button");
    deleteButton.setAttribute("src", "./assets/img/plus.png");
    li.textContent = e.title;
    if (e.system_rank.data[0] === 0) {
      li.appendChild(deleteButton);
    }
    playlistsInventory.appendChild(li);
    renderDropdownPlaylist(e);
  });
  renderPlaylistClickable();
}

function renderDropdownPlaylist(playlist) {
  const option = document.createElement("option");
  option.setAttribute("value", playlist.title);
  option.setAttribute("dropdown-id", playlist.id);
  option.textContent = playlist.title;
  dropdown.appendChild(option);
}

function renderPlaylistClickable() {
  const toDelete = document.querySelectorAll(".playlist-delete-button");
  const toLoad = document.querySelectorAll(".load-tracks");
  deletePlaylist(toDelete);
  fetchSelectedPlaylistTracks(toLoad);
}

function deletePlaylist(playlists) {
  playlists.forEach((e) => {
    e.addEventListener("click", () => {
      const parentNode = e.parentNode;
      const id = parentNode.getAttribute("id");
      fetch(`/playlists/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            console.log("DELETE playlist request successful");
            fetchPlayLists();
          } else {
            console.log("DELETE playlist request unsuccessful");
          }
          return res;
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
}

export function postNewPlaylist(formPlaylist) {
  formPlaylist.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = formPlaylist.elements.title.value;
    fetch("/playlists", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add new playlist.");
        }
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });
    cancelNewPlaylist();
    fetchPlayLists();
  });
  isCreatingPlaylistFalse();
}

// Tracks and playlist/tracks:

function deleteTrack(tracks) {
  tracks.forEach((e) => {
    e.addEventListener("click", () => {
      const parentNode = e.parentNode;
      const trackId = parentNode.getAttribute("track-id");
      const musicListId = Number(parentNode.getAttribute("music-list-index"));
      fetch(`/playlist-tracks/${activePlaylist}/${trackId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            console.log("DELETE track request successful");
            parentNode.remove();
            clearTrackData(musicListId);
          } else {
            console.log("DELETE track request unsuccessful");
          }
          return res;
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
}

function clearTrackData(id) {
  const indexNumber = document.querySelectorAll(".songs-id");
  const liIndex = document.querySelectorAll("[music-list-index]");
  musicList.splice(id, 1);
  if (musicList.length) {
    refreshIndexOfTracks(indexNumber);
    refreshMusicListIndex(liIndex);
  } else {
    pauseTrack();
    noTrack();
  }
}

function refreshIndexOfTracks(element) {
  let index = 1;
  element.forEach((e) => {
    e.textContent = index;
    index += 1;
  });
}

function refreshMusicListIndex(element) {
  let index = 0;
  element.forEach((e) => {
    e.setAttribute("music-list-index", index);
    index++;
  });
}

function fetchAllTracks() {
  fetch("/playlist-tracks")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tracks data!");
      }
      return response.json();
    })
    .then((data) => {
      trackIndex = 0;
      musicList = data;
      activePlaylist = 0;
      const isAllTracks = true;
      renderTracks(data, isAllTracks);
      loadTrack(trackIndex);
      pauseTrack();
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function fetchSelectedPlaylistTracks(playlist) {
  playlist.forEach((e) => {
    e.addEventListener("click", () => {
      removeHighlightPlaylist(activePlaylist);
      const id = e.getAttribute("id");
      e.setAttribute("class", "playlist-clicked");
      activePlaylist = id;
      if (id === "0") {
        fetchAllTracks();
      } else {
        loadPlaylistTracks(id);
      }
      pauseTrack();
      hideDropdown();
    });
  });
}

function loadPlaylistTracks(id) {
  fetch(`/playlist-tracks/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tracks data!");
      }
      return response.json();
    })
    .then((data) => {
      musicList = data;
      renderTracks(data);
      if (data.length) {
        trackIndex = 0;
        loadTrack(trackIndex);
      } else {
        clearCurrentTrackInfo();
      }
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function renderTracks(song, isAllTracks = false) {
  songsList.innerHTML = "";
  let index = 1;
  let musicListIndex = 0;
  song.forEach((e) => {
    const duration = setDuration(e);
    const li = document.createElement("li");
    const divPlay = document.createElement("div");
    const divId = document.createElement("div");
    const divName = document.createElement("div");
    const divDuration = document.createElement("div");
    const imgDelete = document.createElement("img");
    divPlay.setAttribute("class", "songs-play");
    divId.setAttribute("class", "songs-id");
    divName.setAttribute("class", "songs-name");
    divDuration.setAttribute("class", "songs-duration");
    imgDelete.setAttribute("class", "songs-delete");
    imgDelete.setAttribute("src", "./assets/img/plus.png");
    divId.textContent = index;
    divName.textContent = e.name;
    divDuration.textContent = duration;
    li.setAttribute("class", "songs");
    li.setAttribute("music-list-index", musicListIndex);
    li.setAttribute("track-id", e.music_id);
    divPlay.appendChild(divId);
    divPlay.appendChild(divName);
    divPlay.appendChild(divDuration);
    li.appendChild(divPlay);
    if (!isAllTracks) {
      li.appendChild(imgDelete);
    }
    songsList.appendChild(li);
    index++;
    musicListIndex++;
  });
  renderTrackClickable();
}

function renderTrackClickable() {
  const highligth = document.querySelector(".songs");
  const toPlay = document.querySelectorAll(".songs-play");
  const trackToDelete = document.querySelectorAll(".songs-delete");
  if (musicList.length) {
    highligth.setAttribute("id", "songs-highlight");
  }
  deleteTrack(trackToDelete);
  playSelectedTrack(toPlay);
}

function playSelectedTrack(tracks) {
  tracks.forEach((e) => {
    e.addEventListener("click", () => {
      removeHighlightTrack();
      trackIndex = Number(e.parentNode.getAttribute("music-list-index"));
      if (musicList.length) {
      }
      loadTrack(trackIndex);
      addHighlight(trackIndex);
      playTrack();
    });
  });
}

export function loadTrack(trackIndex) {
  const duration = musicList[trackIndex];
  clearInterval(updateTimer);
  resetTrackTimers();
  fetchAlbumCover();
  currentTrack.src = musicList[trackIndex].path;
  currentTrack.load();
  totalDuration.textContent = setDuration(duration);
  trackName.textContent = musicList[trackIndex].name;
  trackArtist.textContent = musicList[trackIndex].artist;
  currentTrack.addEventListener("ended", nextTrack);
}

export function addToSelectedPlaylist(playlistId = 1) {
  if (musicList.length) {
    const musicId = musicList[trackIndex].music_id;
    fetch(`/playlist-tracks/${playlistId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        track_id: musicId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add track to playlist.");
        }
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });
    hideDropdown();
  } else {
    noTrackMessage();
  }
}

function fetchAlbumCover() {
  if (!musicList.length || musicList[trackIndex].album_cover === "") {
    artworkImg.setAttribute(
      "src",
      "./assets/img/album-covers/music-placeholder.png"
    );
  } else {
    artworkImg.setAttribute("src", `${musicList[trackIndex].album_cover}`);
  }
}

function noTrackMessage() {
  songsList.innerHTML = "";
  const li = document.createElement("li");
  li.setAttribute("class", "no-track-message");
  li.textContent = "No selected track!";
  songsList.appendChild(li);
}

function noTrack() {
  clearInterval(updateTimer);
  resetTrackTimers();
  currentTrack.src = "";
  trackName.textContent = "";
  trackArtist.textContent = "";
}

function clearCurrentTrackInfo() {
  trackName.textContent = "";
  trackArtist.textContent = "";
  artworkImg.setAttribute(
    "src",
    "./assets/img/album-covers/music-placeholder.png"
  );
}

// Timers:

export function setUpdate() {
  let seekPosition = 0;
  const trackDuration = musicList[trackIndex];
  if (!isNaN(trackDuration.duration)) {
    seekPosition = currentTrack.currentTime * (100 / trackDuration.duration);
    seekSlider.value = seekPosition;
    let currentMinutes = Math.floor(currentTrack.currentTime / 60);
    let currentSeconds = Math.floor(
      currentTrack.currentTime - currentMinutes * 60
    );
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    currentTime.textContent = currentMinutes + ":" + currentSeconds;
  }
}

function setDuration(e) {
  let durationMinutes = Math.floor(e.duration / 60);
  let durationSeconds = Math.floor(e.duration - durationMinutes * 60);
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }
  if (durationMinutes < 10) {
    durationMinutes = "0" + durationMinutes;
  }
  return durationMinutes + ":" + durationSeconds;
}

export function interval() {
  updateTimer = setInterval(setUpdate, 1000);
}

export function intervalClear() {
  clearInterval(updateTimer);
}

function resetTrackTimers() {
  currentTime.textContent = "00:00";
  totalDuration.textContent = "00:00";
  seekSlider.value = 0;
}

// Track highlight:

function removeHighlightPlaylist(activePlaylist) {
  const clickedPlaylist = document.getElementById(`${activePlaylist}`);
  clickedPlaylist.setAttribute("class", "load-tracks");
}

export function removeHighlightTrack() {
  const clickedTrack = document.getElementById("songs-highlight");
  clickedTrack.setAttribute("id", "");
}

export function addHighlight(trackIndex) {
  const highlightedTrack = document.querySelector(
    `[music-list-index='${trackIndex}']`
  );
  highlightedTrack.setAttribute("id", "songs-highlight");
}

// Track index manipulation for modules:

export function trackIndexPlus() {
  trackIndex += 1;
}

export function trackIndexMinus() {
  trackIndex -= 1;
}

export function trackIndexZero() {
  trackIndex = 0;
}

export function trackIndexMusicListLength() {
  trackIndex = musicList.length - 1;
}

export function trackIndexToRandom() {
  let randomIndex = Number.parseInt(Math.random() * musicList.length);
  trackIndex = randomIndex;
}

loadUserInterface();
