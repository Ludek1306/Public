const express = require("express");
const query = require("../database/db");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/playlists", getAllPlaylists);
router.post("/playlists", addPlaylist);
router.delete("/playlists/:id", deletePlaylist);
router.get("/playlist-tracks", getAllTracks);

// router.get("/playlist-tracks/:", getAllTracks);

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
    const sql = "SELECT * FROM favorites";
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
