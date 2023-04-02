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
let activePlaylist = 0;

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
      // activePlaylist = playlists[0].id;
      renderPlaylists(playlists);
      fetchAllTracks();
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function renderPlaylists(playlist) {
  playlistsInventory.innerHTML =
    "<li onclick='fetchAllTracks()'>All Tracks</li>";
  playlist.forEach((e) => {
    const li = document.createElement("li");
    li.setAttribute("id", e.id);
    li.setAttribute("class", "load-tracks");
    const deleteButton = document.createElement("span");
    deleteButton.setAttribute("class", "span-playlist");
    // POTREBUJU SPAN CLASS??? NEMUYU POUZIT LI CLASS???
    // deleteButton.setAttribute("id", e.id);
    deleteButton.textContent = "X";
    li.textContent = e.title;
    if (e.system_rank.data[0] === 0) {
      li.appendChild(deleteButton);
    }
    playlistsInventory.appendChild(li);
  });
  const toDelete = document.querySelectorAll(".span-playlist");
  const toLoad = document.querySelectorAll(".load-tracks");
  deletePlaylist(toDelete);
  fetchSelectedPlaylistTracks(toLoad);
}

function deletePlaylist(playlists) {
  playlists.forEach((e) => {
    e.addEventListener("click", () => {
      const parentNode = e.parentNode;
      const id = parentNode.getAttribute("id");
      // const id = e.getAttribute("id");
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
      trackIndex = 0;
      musicList = data;
      console.log("this is music list", data);
      activePlaylist = 0;
      renderTracks(data);
      loadTrack(trackIndex);
    })
    .catch((err) => {
      console.error("Error fetchig data: ", err);
    });
}

function fetchSelectedPlaylistTracks(playlist) {
  playlist.forEach((e) => {
    e.addEventListener("click", () => {
      const id = e.getAttribute("id");
      console.log(id);
      activePlaylist = id;
      fetch(`/playlist-tracks/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch tracks data!");
          }
          return response.json();
        })
        .then((data) => {
          musicList = data;
          console.log("this is music list from selected playlist:", data);
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
    });
  });
}

function renderTracks(song) {
  songsList.innerHTML = "";
  let index = 1;
  let track = 0;
  song.forEach((e) => {
    const li = document.createElement("li");
    const divId = document.createElement("div");
    const divName = document.createElement("div");
    const divDuration = document.createElement("div");
    divId.setAttribute("class", "songs-id");
    divName.setAttribute("class", "songs-name");
    divDuration.setAttribute("class", "songs-duration");
    divId.textContent = index;
    divName.textContent = e.name;
    divDuration.textContent = "03:30";
    li.setAttribute("class", "songs");
    li.setAttribute("music-list-id", track);
    li.setAttribute("track-id", e.music_id);
    li.appendChild(divId);
    li.appendChild(divName);
    li.appendChild(divDuration);
    songsList.appendChild(li);
    index++;
    track++;
  });
  const toPlay = document.querySelectorAll(".songs");
  // playSelectedTrack(toPlay);
  playSelectedTrack(toPlay);
}

function playSelectedTrack(tracks) {
  tracks.forEach((e) => {
    e.addEventListener("click", () => {
      // const track = e.getAttribute("track-id");
      trackIndex = e.getAttribute("music-list-id");
      loadTrack(trackIndex);
      playTrack();
    });
  });
}

function addToSelectedPlaylist() {}

function addToFavoritePlaylist() {
  const musicId = musicList[trackIndex].music_id;
  console.log("this is music id for add to playlist:", musicId);
  fetch("/playlist-tracks/1", {
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
    // .then((data) => {
    // 	console.log(`New track added to playlist ${activePlaylist}:`)
    // })
    .catch((err) => {
      console.error(err);
    });
}

function loadTrack(trackIndex) {
  clearInterval(updateTimer);
  reset();

  currentTrack.src = musicList[trackIndex].path;
  // currentTrack.setAttribute("current-id", )
  currentTrack.load();

  trackName.textContent = musicList[trackIndex].name;
  trackArtist.textContent = musicList[trackIndex].artist;

  updateTimer = setInterval(setUpdate, 1000);

  currentTrack.addEventListener("ended", nextTrack);
}

function clearCurrentTrackInfo() {
  trackName.textContent = "";
  trackArtist.textContent = "";
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
    }).catch((err) => {
      console.error(err);
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
