let trackName = document.querySelector(".current-track-name");
let trackArtist = document.querySelector(".current-track-artist");

const dropdownElement = document.querySelector(".select-playlist");
const crossElement = document.querySelector(".add-to-playlist img");
const randomTrackElement = document.querySelector(".random-track-off");
const repeatTrackElement = document.querySelector(".repeat-track-off");
const artworkImg = document.querySelector(".artwork-img");

let playPauseBtn = document.querySelector(".play-pause-track");
let nextBtn = document.querySelector("next-track");
let prevBtn = document.querySelector(".prev-track");

let seekSlider = document.querySelector(".seek-slider");
let volumeSlider = document.querySelector(".volume-slider");
let currentTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");

let currentTrack = document.createElement("audio");

let selectPlaylists = document.querySelectorAll(".playlist-delete-button");

let dropdown = document.getElementById("playlist-dropdown");

let trackIndex = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;
let musicList = [];
let playlists = [];
let activePlaylist = 0;
let isDropdown = false;
let isRepeat = false;

// PLAYLISTS VARIABLES
let isCreating = true;

const songsList = document.querySelector(".songs-list");
const playlistsInventory = document.querySelector(".playlist-inventory");

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
  dropdown.innerHTML = "";
  playlistsInventory.innerHTML =
    "<li id='0' class='load-tracks' >All Tracks</li>";
  playlist.forEach((e) => {
    // PLAYLISTS:
    const li = document.createElement("li");
    li.setAttribute("id", e.id);
    li.setAttribute("class", "load-tracks");
    const deleteButton = document.createElement("img");
    deleteButton.setAttribute("class", "playlist-delete-button");
    deleteButton.setAttribute("src", "./assets/img/plus.png");
    // POTREBUJU SPAN CLASS??? NEMUYU POUZIT LI CLASS???
    // deleteButton.setAttribute("id", e.id);
    // deleteButton.textContent = "X";
    li.textContent = e.title;
    if (e.system_rank.data[0] === 0) {
      li.appendChild(deleteButton);
    }
    playlistsInventory.appendChild(li);
    // DROPDOWN PLAYLISTS:
    const option = document.createElement("option");
    option.setAttribute("value", e.title);
    option.setAttribute("dropdown-id", e.id);
    option.textContent = e.title;
    dropdown.appendChild(option);
  });
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

function deleteTrack(tracks) {
  tracks.forEach((e) => {
    e.addEventListener("click", () => {
      const parentNode = e.parentNode;
      console.log("parent", parentNode);
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
            clearTrack(musicListId);
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

function clearTrack(id) {
  const indexNumber = document.querySelectorAll(".songs-id");
  const liIndex = document.querySelectorAll("[music-list-index]");
  musicList.splice(id, 1);
  console.log("musicList length:", musicList.length);
  if (musicList.length) {
    if (id === trackIndex) {
      console.log("mazu hrajici");
      trackIndex = 0;
      pauseTrack();
      loadTrack(trackIndex);
    }
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
      console.log("this is music list", data);
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
      console.log("active id:", id);
      activePlaylist = id;
      if (id === "0") {
        fetchAllTracks();
      } else {
        refreshPlaylist(id);
      }
      pauseTrack();
    });
  });
}

function refreshPlaylist(id) {
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
      loadTrack(trackIndex);
      addHighlight(trackIndex);
      playTrack();
    });
  });
}

const form = document.querySelector(".select-playlist");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const select = document.getElementById("playlist-dropdown");
  const selectedOption = select.options[select.selectedIndex];
  const selectedOptionId = Number(selectedOption.getAttribute("dropdown-id"));
  addToSelectedPlaylist(selectedOptionId);
});

function addToSelectedPlaylist(playlistId = 1) {
  const musicId = musicList[trackIndex].music_id;
  console.log("this is music id for add to playlist:", musicId);
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
  fetchCover();

  console.log("actul index:", trackIndex);
  console.log("load track", musicList);

  currentTrack.src = musicList[trackIndex].path;

  currentTrack.load();

  trackName.textContent = musicList[trackIndex].name;
  trackArtist.textContent = musicList[trackIndex].artist;

  updateTimer = setInterval(setUpdate, 1000);

  currentTrack.addEventListener("ended", nextTrack);
}

function fetchCover() {
  if (!musicList.length || musicList[trackIndex].album_cover === "") {
    artworkImg.setAttribute(
      "src",
      "./assets/img/album-covers/music-placeholder.png"
    );
  } else {
    artworkImg.setAttribute("src", `${musicList[trackIndex].album_cover}`);
  }
}

function noTrack() {
  clearInterval(updateTimer);
  reset();
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

function reset() {
  currentTime.textContent = "00:00";
  totalDuration.textContent = "00:00";
  seekSlider.value = 0;
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

function playPauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

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

function playTrack() {
  currentTrack.play();
  isPlaying = true;
  playPauseBtn.innerHTML =
    '<img id="play-on" src="./assets/img/pause.svg" alt="" />';
}

function pauseTrack() {
  currentTrack.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<img src="./assets/img/play.svg" alt="" />';
}

function nextTrack() {
  removeHighlightTrack();
  if (isRepeat === false) {
    if (trackIndex < musicList.length - 1 && isRandom === false) {
      trackIndex += 1;
    } else if (trackIndex < musicList.length - 1 && isRandom === true) {
      let randomIndex = Number.parseInt(Math.random() * musicList.length);
      trackIndex = randomIndex;
    } else {
      trackIndex = 0;
    }
  }

  console.log("next trackIndex:", trackIndex);
  loadTrack(trackIndex);
  addHighlight(trackIndex);
  playTrack();
}

function prevTrack() {
  removeHighlightTrack();
  if (trackIndex > 0) {
    trackIndex -= 1;
  } else {
    trackIndex = musicList.length - 1;
  }
  loadTrack(trackIndex);
  addHighlight(trackIndex);
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

function setDuration(e) {
  let currentMinutes = Math.floor(e.duration / 60);
  let currentSeconds = Math.floor(e.duration - currentMinutes * 60);
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }

  return currentMinutes + ":" + currentSeconds;
}

// PLAYLISTS

const newPlaylist = document.querySelector(".insert-name");
const closePlaylist = document.querySelector(".cross");

function addCancelPlaylist() {
  isCreating ? addPlaylist() : cancelPlaylist();
}

function addPlaylist() {
  newPlaylist.textContent = "";
  const form = document.createElement("form");
  const input = document.createElement("input");
  const confirmButton = document.createElement("button");
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

  // ADD NEW PLAYLIST WITH FORM
  const formPlaylist = document.getElementById("playlist-form");
  console.log(formPlaylist);

  formPlaylist.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.elements.title.value;
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

function cancelPlaylist() {
  newPlaylist.innerHTML = "";
  newPlaylist.textContent = "Playlists";
  isCreating = true;
  closePlaylist.setAttribute("class", "cross");
}

// SHOW HIDE DROPDOWN

function showHideDropdown() {
  if (isDropdown === true) {
    dropdownElement.setAttribute("id", "");
    crossElement.setAttribute("class", "cross");
    isDropdown = false;
  } else if (isDropdown === false) {
    dropdownElement.setAttribute("id", "select-playlist-id");
    crossElement.setAttribute("class", "rotate-image-on");
    isDropdown = true;
  }
}

// ACTIVE PLAYLIST HIGHLIGHT

function removeHighlightPlaylist(activePlaylist) {
  const clickedPlaylist = document.getElementById(`${activePlaylist}`);
  clickedPlaylist.setAttribute("class", "load-tracks");
}

function removeHighlightTrack() {
  const clickedTrack = document.getElementById("songs-highlight");
  clickedTrack.setAttribute("id", "");
}

function addHighlight(trackIndex) {
  const highlightedTrack = document.querySelector(
    `[music-list-index='${trackIndex}']`
  );
  highlightedTrack.setAttribute("id", "songs-highlight");
}
