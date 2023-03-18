const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.log("Connection with database failed", err);
    return;
  } else {
    console.log("Connected to the MySql database.");
  }
});

function query(sql, value) {
  return new Promise((resolve, reject) => {
    connection.query(sql, value, (err, result) => {
      if (err) {
        console.error(err);
        reject("Error happened during the database handling!");
        return;
      } else {
        return resolve(result);
      }
    });
  });
}

module.exports = query;
