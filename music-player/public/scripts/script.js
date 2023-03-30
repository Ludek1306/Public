// let nowPlaying = document.querySelector(".now-playing");
// let trackArt = document.querySelector(".track-art");
let trackName = document.querySelector(".current-track-name");
let trackArtist = document.querySelector(".current-track-artist");

let playPauseBtn = document.querySelector(".play-pause-track");
let nextBtn = document.querySelector("next-track");
let prevBtn = document.querySelector(".prev-track");

let seekSlider = document.querySelector(".seek-slider");
let volumeSlider = document.querySelector(".volume-slider");
let currentTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");

let currentTrack = document.createElement("audio");

let selectPlaylists = document.querySelectorAll(".span-playlist");

let trackIndex = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;
let musicList = [];
let playlists = [];

// PLAYLISTS VARIABLES
let isCreating = true;

// const songs = document.getElementById("fill-list");
const songsList = document.querySelector(".songs-list");
const playlistsInventory = document.querySelector(".playlist-inventory");

// function fetchPlaylists() {
//   fetch("/playlists")
//     .then((data) => data.json())
//     .then((data) => console.log(data))
//     .catch((err) => console.error(err));
// }

// fetchPlaylists();

// function fetchAllTracks() {
//   fetch("/playlists-tracks")
//     .then((data) => data.json())
//     .then((data) => console.log(data))
//     .catch((err) => console.error(err));
// }

// fetchAllTracks();

fetchPlayLists();

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
      console.log("checking playlists", playlists);
      renderPlaylists(playlists);
      fetchAllTracks();
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function renderPlaylists(playlist) {
  playlistsInventory.innerHTML = "<li>All Tracks</li>";
  playlist.forEach((e) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("span");
    deleteButton.setAttribute("class", "span-playlist");
    deleteButton.setAttribute("id", e.id);
    deleteButton.textContent = "X";
    li.textContent = e.title;
    if (e.system_rank.data[0] === 0) {
      li.appendChild(deleteButton);
    }
    playlistsInventory.appendChild(li);
  });
  selectPlaylists = document.querySelectorAll(".span-playlist");
  console.log(selectPlaylists);

  deletePlaylist(selectPlaylists);
}

function deletePlaylist(playlists) {
  playlists.forEach((e) => {
    e.addEventListener("click", () => {
      const id = e.getAttribute("id");
      fetch(`/playlists/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            console.log("DELETE request successful");
            fetchPlayLists();
          } else {
            console.log("DELETE request unsuccessful");
          }
          return res;
        })
        .catch((err) => {
          console.error(err);
        });
    });
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
      musicList = data;
      console.log("this is music list", data);
      renderTracks(data);
      loadTrack(trackIndex);
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function renderTracks(song) {
  songsList.innerHTML = "";
  song.forEach((e) => {
    const li = document.createElement("li");
    const divId = document.createElement("div");
    const divName = document.createElement("div");
    const divDuration = document.createElement("div");
    divId.setAttribute("class", "songs-id");
    divName.setAttribute("class", "songs-name");
    divDuration.setAttribute("class", "songs-duration");
    divId.textContent = e.id;
    divName.textContent = e.name;
    divDuration.textContent = "03:30";
    li.setAttribute("class", "songs");
    li.appendChild(divId);
    li.appendChild(divName);
    li.appendChild(divDuration);
    songsList.appendChild(li);
  });
}

function loadTrack(trackIndex) {
  clearInterval(updateTimer);
  reset();

  currentTrack.src = musicList[trackIndex].path;
  currentTrack.load();

  trackName.textContent = musicList[trackIndex].name;
  trackArtist.textContent = musicList[trackIndex].artist;

  updateTimer = setInterval(setUpdate, 1000);

  currentTrack.addEventListener("ended", nextTrack);
}

function reset() {
  currentTime.textContent = "00:00";
  totalDuration.textContent = "00:00";
  seekSlider.value = 0;
}

function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true;
}

function pauseRandom() {
  isRandom = false;
}

function repeatTrack() {
  let currentIndex = trackIndex;
  loadTrack(currentIndex);
  playTrack();
}

function playPauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  currentTrack.play();
  isPlaying = true;
  playPauseBtn.innerHTML =
    '<img src="./assets/img/pause.svg" style="height: 20px" alt="" />';
}

function pauseTrack() {
  currentTrack.pause();
  isPlaying = false;
  playPauseBtn.innerHTML =
    '<img src="./assets/img/play.svg" style="height: 20px" alt="" />';
}

function nextTrack() {
  if (trackIndex < musicList.length - 1 && isRandom === false) {
    trackIndex += 1;
  } else if (trackIndex < musicList.length - 1 && isRandom === true) {
    let randomIndex = Number.parseInt(Math.random() * musicList.length);
    trackIndex = randomIndex;
  } else {
    trackIndex = 0;
  }
  loadTrack(trackIndex);
  playTrack();
}

function prevTrack() {
  if (trackIndex > 0) {
    trackIndex -= 1;
  } else {
    trackIndex = musicList.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}

function seekTo() {
  let seekto = currentTrack.duration * (seekSlider.value / 100);
  currentTrack.currentTime = seekto;
}

function setVolume() {
  currentTrack.volume = volumeSlider.value / 100;
}

function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(currentTrack.duration)) {
    seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
    seekSlider.value = seekPosition;

    let currentMinutes = Math.floor(currentTrack.currentTime / 60);
    let currentSeconds = Math.floor(
      currentTrack.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(currentTrack.duration / 60);
    let durationSeconds = Math.floor(
      currentTrack.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    currentTime.textContent = currentMinutes + ":" + currentSeconds;
    totalDuration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// PLAYLISTS

const newPlaylist = document.querySelector(".insert-name");
const closePlaylist = document.querySelector(".cross");

function addCancelPlaylist() {
  isCreating ? addPlaylist() : cancelPlaylist();
}

function addPlaylist() {
  newPlaylist.textContent = "";
  const formInput = document.createElement("form");
  const inputName = document.createElement("input");
  const confirmButton = document.createElement("button");
  // inputName.setAttribute("type", "text");
  formInput.setAttribute("id", "playlist-form");
  inputName.setAttribute("placeholder", "Name");
  inputName.setAttribute("name", "title");
  inputName.setAttribute("type", "text");
  confirmButton.setAttribute("type", "submit");
  // confirmButton.setAttribute("onclick", "sendPlaylist()");
  confirmButton.textContent = "Create";
  formInput.appendChild(inputName);
  formInput.appendChild(confirmButton);
  newPlaylist.appendChild(formInput);

  closePlaylist.setAttribute("id", "rotate-image-on");

  // ADD NEW PLAYLIST WITH FORM
  const formPlaylist = document.getElementById("playlist-form");
  console.log(formPlaylist);

  formPlaylist.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = formInput.elements.title.value;
    console.log(title);

    fetch("/playlists", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    }).catch((error) => {
      console.error(error);
    });
    cancelPlaylist();
    fetchPlayLists();
  });
  isCreating = false;
}

// function sendPlaylist() {
//   // newPlaylist.innerHTML = "";
//   // newPlaylist.textContent = "Playlists";
//   // isCreating = true;
//   cancelPlaylist();
// }

function cancelPlaylist() {
  newPlaylist.innerHTML = "";
  newPlaylist.textContent = "Playlists";
  isCreating = true;
  closePlaylist.setAttribute("id", "");
}
