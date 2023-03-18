const upvoteForms = document.querySelectorAll('form[action$="/upvote"]');

upvoteForms.forEach((e) => {
  e.addEventListener("submit", async (event) => {
    event.preventDefault();
    const response = await fetch(e.action, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
    }).catch((err) => {
      console.error(err);
    });
    const data = await response.json();
    const scoreElement = e.parentNode.querySelector(".score");
    scoreElement.textContent = `${data.score}`;
  });
});

const downvoteForms = document.querySelectorAll('form[action$="/downvote"]');

downvoteForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const response = await fetch(form.action, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
    }).catch((err) => {
      console.error(err);
    });
    const data = await response.json();
    const scoreElement = form.parentNode.querySelector(".score");
    scoreElement.textContent = `${data.score}`;
  });
});

const deletePost = document.querySelectorAll('form[action$="/delete"]');

deletePost.forEach((e) => {
  e.addEventListener("click", () => {
    console.log("delete");
    fetch(e.action, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(() => {
        e.closest("article").remove();
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
