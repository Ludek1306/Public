const asyncErrorMiddleware = require("../middleware/async");
const express = require("express");
const query = require("../database/db");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.get("/playlists", asyncErrorMiddleware(getAllPlaylists));
router.post("/playlists", asyncErrorMiddleware(addPlaylist));
router.delete("/playlists/:id", asyncErrorMiddleware(deletePlaylist));
router.get("/playlist-tracks", asyncErrorMiddleware(getAllTracks));
router.get(
  "/playlist-tracks/:playlist_id",
  asyncErrorMiddleware(getPlaylistTracks)
);
router.post(
  "/playlist-tracks/:playlist_id",
  asyncErrorMiddleware(addToPlaylist)
);
router.delete(
  "/playlist-tracks/:playlist_id/:track_id",
  asyncErrorMiddleware(deleteTrack)
);

async function getAllPlaylists(req, res) {
  const sql = "SELECT * FROM playlists";
  const getPlaylists = await query(sql);
  res.send(getPlaylists);
}

async function getAllTracks(req, res) {
  const sql = "SELECT * FROM music";
  const getTracks = await query(sql);
  res.send(getTracks);
}

async function getPlaylistTracks(req, res) {
  const { playlist_id } = req.params;
  const sql = `SELECT music.music_id, music.name, music.artist, music.duration, music.path, music.album_cover 
		FROM music 
		JOIN playlist_tracks ON playlist_tracks.track_id = music.music_id 
		JOIN playlists ON playlist_tracks.playlist_id = playlists.id 
		WHERE playlists.id = ?`;
  const getTracks = await query(sql, [playlist_id]);
  res.send(getTracks);
}

async function addPlaylist(req, res) {
  const { title } = req.body;
  const sql = "INSERT INTO playlists (title) VALUES (?)";
  const playlist = await query(sql, [title]);
  res.status(201).send(playlist);
}

async function addToPlaylist(req, res) {
  const { playlist_id } = req.params;
  const { track_id } = req.body;
  const sqlCheck =
    "SELECT * FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?";
  const sql =
    "INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (?, ?)";
  const checkTrack = await query(sqlCheck, [playlist_id, track_id]);
  if (checkTrack.length > 0) {
    console.log("Track already exists in playlist.");
    return res.status(409).send({ error: "Track already exists in playlist." });
  }
  const insertTrack = await query(sql, [playlist_id, track_id]);
  console.log("Track added to playlist successfully.");
  res.status(201).send(insertTrack);
}

async function deletePlaylist(req, res) {
  const { id } = req.params;
  const sql = "DELETE FROM playlists WHERE id = ?";
  const sqlTracks = "DELETE FROM playlist_tracks WHERE playlist_id = ?";
  const delPlaylistTracks = await query(sqlTracks, [id]);
  const delPlaylist = await query(sql, [id]);
  res.status(204).send(delPlaylist);
}

async function deleteTrack(req, res) {
  const { playlist_id, track_id } = req.params;
  const sql =
    "DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?";
  const delTrack = await query(sql, [playlist_id, track_id]);
  res.status(204).send(delTrack);
}

module.exports = router;
