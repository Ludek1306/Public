const ulList = document.getElementById("questions-list");

function loadQuestions() {
  fetch("/api/questions")
    .then((res) => res.json())
    .then((data) => {
      renderQuestions(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

loadQuestions();

let renderQuestions = (questions) => {
  ulList.innerHTML = "";
  questions.forEach((e) => {
    const li = document.createElement("li");
    const textContainer = document.createElement("span");
    const deleteButton = document.createElement("button");
    textContainer.textContent = e.question;
    deleteButton.textContent = "DELETE";
    deleteButton.setAttribute("id", e.id);
    li.appendChild(textContainer);
    li.appendChild(deleteButton);
    ulList.appendChild(li);
  });
};

ulList.addEventListener("click", (e) => {
  const deleteElement = e.target.id;
  deleteQuestion(deleteElement);
  loadQuestions();
});

let deleteQuestion = (index) => {
  fetch(`/api/questions/${index}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log("DELETE request successful");
      } else {
        console.log("DELETE request unsuccessful");
      }
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
};

const form = document.querySelector("form");

form.addEventListener("submit", () => {
  const questionText = form.elements["questionText"];
  const questionInput = questionText.value;

  fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      question: questionInput,
      answers: [
        {
          text: document.getElementById("answer-1").value,
          isCorrect: document.getElementById("is-correct1").checked,
        },
        {
          text: document.getElementById("answer-2").value,
          isCorrect: document.getElementById("is-correct2").checked,
        },
        {
          text: document.getElementById("answer-3").value,
          isCorrect: document.getElementById("is-correct3").checked,
        },
        {
          text: document.getElementById("answer-4").value,
          isCorrect: document.getElementById("is-correct4").checked,
        },
      ],
    }),
  });
  loadQuestions();
});
