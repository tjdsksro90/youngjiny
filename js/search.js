export const onSearchBtnClicked = (searchKeyword) => {
  const movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    const title = card.querySelector(".movie-title").textContent.toLowerCase();
    const compareKeyword = searchKeyword.toLowerCase();
    if (compareKeyword.includes(searchKeyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};
