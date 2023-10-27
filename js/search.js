export const handleSearch = (e) => {
  const movieCards = document.querySelectorAll(".movie-card");
  const searchKeyword = document.querySelector("#search-input").value;
  let count = 0;

  e.preventDefault();
  movieCards.forEach((card) => {
    const title = card.querySelector(".movie-title").textContent.toLowerCase();
    const compareKeyword = searchKeyword.toLowerCase();
    if (title.includes(compareKeyword)) {
      card.classList.remove("hidden");
      ++count;
    } else {
      card.classList.add("hidden");
    }
  });

  if (count) {
    document.querySelector(".button-reset").innerHTML = `'${searchKeyword}'에 대한 ${count}건의 검색 결과 초기화`;
  } else {
    alert(`입력하신 검색어 '${searchKeyword}'와 일치하는 결과가 없습니다.`);
  }
};
