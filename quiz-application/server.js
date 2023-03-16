const express = require("express");
const app = express();
const port = 8080;
const connection = require("./database/database.js");

app.use(express.json());
app.use(express.static("public"));

app.listen(port, (error) => {
  if (error) {
    console.log("Port error", error);
    return;
  }
  console.log(`Application listening on port ${port}`);
});

app.get("/game", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
});

app.get("/questions", (req, res) => {
  res.sendFile(__dirname + "/public/questions.html");
});

app.get("/api/game", (req, res) => {
  const sql =
    "SELECT * FROM questions JOIN answers ON questions.id = answers.question_id;";
  connection.query(sql, (error, rows) => {
    if (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Internal server error",
      });
      return;
    }
    const randomQuestion = Math.floor(Math.random() * (rows.length / 4));
    res.json(rows.slice(randomQuestion * 4, randomQuestion * 4 + 4));
  });
});

app.get("/api/questions", (req, res) => {
  const sql = "SELECT * FROM questions;";
  connection.query(sql, (error, rows) => {
    if (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Internal server error",
      });
      return;
    }
    res.json(rows);
  });
});

app.delete("/api/questions/:id", (req, res) => {
  const sql = "DELETE FROM questions WHERE id = ?;";
  const id = req.params.id;
  connection.query(sql, id, (error, result) => {
    if (error) {
      res.status(500).json(error);
      return;
    }
    res.send("Question deleted!");
  });
});

app.post("/api/questions", (req, res) => {
  const sql = "INSERT INTO questions (question) VALUES (?);";
  const sqlAnswers =
    "INSERT INTO answers (question_id, answer, is_correct) VALUES (?, ?, ?);";
  const value = req.body.question;

  connection.query(sql, value, (error, result) => {
    if (error) {
      res.status(500).json(error);
      return;
    }

    let answers = [
      [
        result.insertId,
        req.body.answers[0].text,
        req.body.answers[0].isCorrect,
      ],
      [
        result.insertId,
        req.body.answers[1].text,
        req.body.answers[1].isCorrect,
      ],
      [
        result.insertId,
        req.body.answers[2].text,
        req.body.answers[2].isCorrect,
      ],
      [
        result.insertId,
        req.body.answers[3].text,
        req.body.answers[3].isCorrect,
      ],
    ];

    function query(sql, params) {
      const promise = new Promise(function (resolve, reject) {
        connection.query(sql, params, (err, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        });
      });
      return promise;
    }

    query(sqlAnswers, answers[0])
      .then(() => query(sqlAnswers, answers[1]))
      .then(() => query(sqlAnswers, answers[2]))
      .then(() => query(sqlAnswers, answers[3]))
      .then(() => {
        res.send("Everything is okay!");
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  });
});
