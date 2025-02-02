document
  .getElementById("feedbackForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById("name").value;
    const stars = document.getElementById("stars").value;
    const reviewText = document.getElementById("review").value;

    // Create a new review entry
    const newReview = document.createElement("div");
    newReview.classList.add("review-container");

    newReview.innerHTML = `
        <span class="customer-name">${name}</span>
        <span class="stars">${stars}</span>
        <p class="review-text">"${reviewText}"</p>
        <button class="like-button" onclick="likeReview(this)">Like</button>
        <span class="like-count">0 Likes</span>
    `;

    // Append the new review to the container
    document.querySelector(".container").appendChild(newReview);

    // Reset the form
    document.getElementById("feedbackForm").reset();
  });

// Like button functionality
function likeReview(button) {
  const likeCount = button.nextElementSibling;
  let count = parseInt(likeCount.textContent);
  count++;
  likeCount.textContent = count + " Likes";
  button.setAttribute("disabled", "true");
  button.style.backgroundColor = "#ccc";
}
