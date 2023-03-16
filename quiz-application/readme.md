# Quiz Application

## Description

A web application that allows users to take a quiz and see their score. The application displays a series of questions with a selection of possible answers. Users select an answer, and the application checks if it's correct or not. The application keeps track of the user's score and displays it at the end of the quiz.

## Tools

- `frontend`: the frontend code using JavaScript
- `backend`: the backend code using Express.js
- `database`: MySQL Workbench
- `others`: dotenv

## Features

- The application has a REST API that serves quiz data to the front-end.
- The quiz data includes a list of questions, each with a list of possible answers and the correct answer.
- The front-end fetches the quiz data from the REST API and renders the quiz questions, answer options, and check the correct answer.
- The front-end keeps track of the user's score.
- The application includes a separate questions management feature that allows users to delete existing questions or add new ones.

## Project Structure

    server.js - main file that initializes the Express server and defines the REST API endpoints.
    database.js - JavaScript file that provides a connection to the MySQL database.
    schema.sql - schema used for MySQL Workbench.
    public/ - folder that contains the front-end code.
    game.js - JavaScript file that fetches the quiz data from the REST API, renders the quiz UI, and handles user input.
    questions.js - JavaScript file that fetches the quiz data from the REST API, renders the questions UI, and handles the questions management.
    game.html - HTML file that contains the quiz UI.
    questions.html - HTML file that contains the questions management UI.
