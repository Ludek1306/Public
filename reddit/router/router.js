const express = require("express");
const query = require("../database/db");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/", getAllPosts);
router.get("/posts/new", newPost);
router.post("/posts", addPost);
router.put("/posts/:id/upvote", upvote);
router.put("/posts/:id/downvote", downvote);
router.delete("/posts/:id/delete", deletePost);

async function getAllPosts(req, res) {
  try {
    // const sql = "SELECT * FROM posts;";
    const sql =
      "SELECT *, DATE_FORMAT(timestamp, '%Y-%m-%d') AS formatted_timestamp FROM posts;";
    const getPosts = await query(sql);
    res.render("index", { posts: getPosts });
  } catch (err) {
    console.error(err);
  }
}

async function newPost(req, res) {
  try {
    res.render("post");
  } catch (err) {
    console.error(err);
  }
}

async function addPost(req, res) {
  try {
    const { title, url } = req.body;
    const sql = "INSERT INTO posts (title, url) VALUES (?, ?);";
    const addPost = await query(sql, [title, url]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
}

async function upvote(req, res) {
  try {
    const postId = req.params.id;
    const sql = "UPDATE posts SET score = score +1 WHERE id = ?;";
    const score = "SELECT score FROM posts WHERE id = ?;";
    await query(sql, postId);
    const [result] = await query(score, postId);
    res.send(result);
  } catch (err) {
    console.error(err);
  }
}

async function downvote(req, res) {
  try {
    const postId = req.params.id;
    const sql = "UPDATE posts SET score = score -1 WHERE id = ?;";
    const score = "SELECT score FROM posts WHERE id = ?;";
    await query(sql, postId);
    const [result] = await query(score, postId);
    res.send(result);
  } catch (err) {
    console.error(err);
  }
}

async function deletePost(req, res) {
  try {
    const deleteId = req.params.id;
    const sql = "DELETE FROM posts WHERE id = ?;";
    const deletePost = await query(sql, deleteId);
    res.send(deletePost);
  } catch (err) {
    console.error(err);
  }
}

module.exports = router;
