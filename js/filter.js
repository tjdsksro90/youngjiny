export function handleFilter(genres) {
  const cards = Array.from(document.querySelectorAll(".movie-card"));
  let count = 0;
  let filteredGenre = [];
  cards.forEach((card) => {
    const genreData = card.getAttribute("data-genres").split(",");
    genreData.forEach((genre) => {
      if (genres.includes(genre)) {
        filteredGenre.push(genre);
        card.classList.remove("hidden");
        count++;
      } else card.classList.add("hidden");
    });
  });
  console.log(count, filteredGenre);
  if (count) {
    document.querySelector(".button-reset").innerHTML = `'${searchKeyword}'에 대한 ${count}건의 검색 결과 초기화`;
  } else {
    alert(`입력하신 장르 '${searchKeyword}'와 일치하는 결과가 없습니다.`);
  }
}
