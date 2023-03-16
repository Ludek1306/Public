const question = document.getElementById("question");
const answer1 = document.getElementById("answer1");
const answer2 = document.getElementById("answer2");
const answer3 = document.getElementById("answer3");
const answer4 = document.getElementById("answer4");
const answer = document.querySelectorAll(".answer");
const buttonsContainer = document.getElementById("buttons-container");
const scoreNumber = document.getElementById("score-number");
let correct = document.getElementById("correct-color");
let wrong = document.getElementById("wrong-color");
const nextQuestionButtons = document.getElementById("answer-value");
let score = 0;

correct.style.display = "none";
wrong.style.display = "none";

const newQuestionFetch = () => {
  fetch("/api/game")
    .then((data) => data.json())
    .then((data) => {
      correct.style.display = "none";
      wrong.style.display = "none";
      question.textContent = data[0].question;
      answer1.textContent = data[0].answer;
      answer2.textContent = data[1].answer;
      answer3.textContent = data[2].answer;
      answer4.textContent = data[3].answer;
      correctAnswer = data.find((answer) => answer.is_correct).answer;
    })
    .catch((error) => console.error(error));
};

newQuestionFetch();

buttonsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("answer")) {
    if (e.target.textContent === correctAnswer) {
      score += 1;
      correct.style.display = "";
    } else {
      score -= 1;
      wrong.style.display = "";
    }
  }
  scoreNumber.textContent = `Score: ${score}`;
});

nextQuestionButtons.addEventListener("click", () => {
  newQuestionFetch();
});
