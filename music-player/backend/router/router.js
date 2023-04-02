const express = require("express");
const query = require("../database/db");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/playlists", getAllPlaylists);
router.post("/playlists", addPlaylist);
router.delete("/playlists/:id", deletePlaylist);
router.get("/playlist-tracks", getAllTracks);
router.get("/playlist-tracks/:playlist_id", getPlaylistTracks);
router.post("/playlist-tracks/:playlist_id", addToPlaylist);

async function getAllPlaylists(req, res) {
  try {
    const sql = "SELECT * FROM playlists";

    const getPlaylists = await query(sql);
    res.send(getPlaylists);
  } catch (err) {
    console.error(err);
  }
}

async function getAllTracks(req, res) {
  try {
    const sql = "SELECT * FROM music";
    const getTracks = await query(sql);
    res.send(getTracks);
  } catch (err) {
    console.error(err);
  }
}

async function getPlaylistTracks(req, res) {
  try {
    const { playlist_id } = req.params;
    const sql = `SELECT music.music_id, music.name, music.artist, music.path 
		FROM music 
		JOIN playlist_tracks ON playlist_tracks.track_id = music.music_id 
		JOIN playlists ON playlist_tracks.playlist_id = playlists.id 
		WHERE playlists.id = ${playlist_id}`;
    const getTracks = await query(sql);
    res.send(getTracks);
  } catch (err) {
    console.error(err);
  }
}

async function addPlaylist(req, res) {
  try {
    const { title } = req.body;
    const sql = "INSERT INTO playlists (title) VALUES (?)";
    const playlist = await query(sql, title);
    res.send(playlist);
  } catch (err) {
    console.error(err);
  }
}

async function addToPlaylist(req, res) {
  try {
    const { playlist_id } = req.params;
    const { track_id } = req.body;
    const sqlCheck =
      "SELECT * FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?";
    const sql =
      "INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (?, ?)";
    const checkTrack = await query(sqlCheck, [playlist_id, track_id]);
    if (checkTrack.length > 0) {
      console.log("Track already exists in playlist.");
      return;
    }
    const insertTrack = await query(sql, [playlist_id, track_id]);
    console.log("Track added to playlist successfully.");
    res.status(201).send(insertTrack);
  } catch (err) {
    console.error(err);
  }
}

async function deletePlaylist(req, res) {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM playlists WHERE id = ?";
    const sqlTracks = "DELETE FROM playlist_tracks WHERE playlist_id = ?";
    const delPlaylistTracks = await query(sqlTracks, id);
    // res.status(204).send(delPlaylistTracks);
    const delPlaylist = await query(sql, id);
    res.status(204).send(delPlaylist);
  } catch (err) {
    console.error(err);
  }
}

module.exports = router;
