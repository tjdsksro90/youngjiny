export const handleSearch = (searchKeyword) => {
  const movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    const title = card.querySelector(".movie-title").textContent.toLowerCase();
    const compareKeyword = searchKeyword.toLowerCase();
    if (title.includes(compareKeyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};
