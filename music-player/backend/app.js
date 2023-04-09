const error = require("./middleware/error");

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
app.use(error);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Application listening on port ${PORT}`);
});
