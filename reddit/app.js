const express = require("express");
const app = express();
const router = require("./router/router");
const PORT = 3000;
const path = require("path");

app.set("view engine", "ejs");

app.use(express.json());
app.use("/", router);
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use("/public", express.static("public"));

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is listening at port ${PORT}`);
});
