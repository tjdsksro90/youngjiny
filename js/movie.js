import { makeCards } from "./makeCards.js";
import { onDarkmodeBtnClicked } from "./utils.js";
const darkmodeBtn = document.querySelector(".button-darkmode");
const moreBtn = document.querySelector(".button-more-item");

makeCards(1, "movie", "top_rated");

// 다크모드 버튼
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);
// 더보기 버튼
moreBtn.addEventListener("click", (e) => {
  let curPage = document.querySelector(".card-list-movie").getAttribute("data-page");
  makeCards(++curPage, "movie", "popular");
});
