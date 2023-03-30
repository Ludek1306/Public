const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
// const fs = require("fs")
const router = require("./router/router");

app.use(express.json());
app.use("/", router);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "player.html");
  res.sendFile(filePath);
});

// app.get("/playlist", (req, res) => {
//   let jsonDataList = require("./data/playlists.json");
//   res.json(jsonDataList);
// });

// app.post("/playlist");

// app.get("/playlist-tracks", (req, res) => {
//   let jsonDataTracks = require("./data/music.json");
//   res.json(jsonDataTracks);
// });

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Application listening on port ${PORT}`);
});
