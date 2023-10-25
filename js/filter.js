export function handleFilter(genresToFilter) {
  const cards = Array.from(document.querySelectorAll(".movie-card"));
  let cardsToDel = [];
  let cardsToShow = cards.filter((card) => {
    let genreData = card.getAttribute("data-genres").split(",");
    if (genreData.filter((genre) => genresToFilter.includes(genre)).length) {
      card.classList.remove("hidden");
      return card;
    } else card.classList.add("hidden");
    // action, drama => action,
  });
  let stringifiedFilterResult = cardsToShow.map((card) => {
    return card.getAttribute("data-id");
  });
  console.log(stringifiedFilterResult);

  // if (String(prevFiltered) === String(stringifiedFilterResult)) {
  //   getMovie(++page);
  // } else {
  //   prevFiltered = stringifiedFilterResult;
  //   cardsToDel.forEach((card) => {
  //     card.classList.toggle("hidden");
  //   });
  //   resetBtn.innerText = `${genresToFilter.length}가지 장르에 대한 ${cardsToShow.length}개의 검색 결과 초기화`;
  // }
}
