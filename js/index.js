"use strict";
import { onSearchBtnClicked } from "./search";

const body = document.querySelector("body");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const submitBtn = document.querySelector(".button-search");
const darkmodeBtn = document.querySelector(".button-darkmode");
const resetBtn = document.querySelector(".button-reset");
const filterBtn = document.querySelector(".button-filter");
const moreBtn = document.querySelector(".button-more-item");
let page = 1;
let filter;
let genres = [];
let value;
let totalPages;
let prevFiltered;
let movieList;

// TMDB API에서 Top Rated Movies 데이터 받아오기
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s"
  }
};
const fetchMovieData = async (page = 1) => {
  const { results } = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};

const generateMovieCards = async () => {
  movieList = await fetchMovieData();
  makeMovieCards(movieList);
};

const getGenre = async () => {
  fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
    .then((response) => response.json())
    .then((data) => makeGenre(data.genres))
    .catch((err) => console.error(err));
};

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수
const makeMovieCards = async () => {
  const movies = await fetchMovieData();
  const cardList = document.querySelector(".card-list");
  cardList.innerHTML = movies
    .map((movie) => {
      // 영화 객체의 제목, 이미지경로, 내용, 평점 property를 구조 분해 및 할당을 이용해 저장한다
      const { title, poster_path, overview, vote_average, id, genre_ids } = movie;
      return `<article data-id=${id} data-genres="${genre_ids}" class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}"/>
        <div class="movie-card-content">
          <h3 class="movie-title">${title}</h3>
          <p class="movie-overview">${overview}</p>
          <p class="movie-rating">${vote_average} / <span>10</span>
          </p>
        </div>
      </article>`;
    })
    .join("");

  for (const child of cardList.children) {
    child.addEventListener("click", onCardClicked);
  }
  // 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
  function onCardClicked(e) {
    // event의 currentTarget 프로퍼티를 사용해 자식 요소가 아닌 부모의 "data-id"를 받아올 수 있게 했다
    const id = e.currentTarget.getAttribute("data-id");
    alert(`영화 ID: ${id}`);
  }
  // 마지막 페이지까지 로드되면 더보기 버튼 비활성화
  if (page === totalPages) moreBtn.classList.toggle("invisible");

  // filter가 적용중이라면 페이지를 그린 직후 필터링을 한다
  // filterMovies(filter, value, genres);
};

// 장르를 list element로 만들어 필터리스트에 넣는 함수
const makeGenre = (genres) => {
  const genreContainer = document.querySelector(".genre-container");
  genreContainer.innerHTML = genres
    .map((genre) => {
      return `
    <li class="genre-item">
      <input id="${genre.name}" class="checkbox" type="checkbox" data-genre="${genre.id}" value="${genre.name}"/>
      <label for="${genre.name}" class="label-checkbox">${genre.name}</label>
    </li>
    `;
    })
    .join("");

  genreContainer.addEventListener("click", onGenreItemClicked);

  function onGenreItemClicked(e) {
    const genre = e.target.getAttribute("data-genre");
    if (e.target === genreContainer) return;
    if (e.target.matches(".label-checkbox")) {
      e.target.classList.toggle("checked");
    }
    const genresSelected = document.querySelectorAll(".checked");
    genresSelected.length ? filterMovies(filter, "", genres) : showAllCards();
  }
};
// TODAY starts here
// TODO 리팩토링 끝내기

// Event Handler callback functions

// 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러

// 더 보기 버튼을 누르면 다음 top rated 영화 페이지를 로드한다
const onMoreBtnClicked = (e) => {
  getMovie(++page);
};

// 검색 버튼 이벤트 핸들러
const onSearchClicked = (e) => {
  e.preventDefault();
  const input = document.getElementById("input");
  value = input.value;
  filterMovies(filter, value);
  input.value = "";
};

const onResetBtnClicked = (e) => {
  // e.target.classList.add("invisible");
  filter = "";
  resetBtn.innerText = "검색 결과 초기화";
  removeGenres();
  closeGenreBox();
  // genres = [];
  showAllCards();
};

const onDarkmodeBtnClicked = (e) => {
  document.querySelector("body").classList.toggle("dark-mode");
  header.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode");
  document.querySelector("#sidebar-right").classList.toggle("dark-mode");
  document.querySelector("#sidebar-left").classList.toggle("dark-mode");
  // filterBtn.classList.toggle("dark-mode");
  document.querySelectorAll("main .button").forEach((btn) => {
    btn.classList.toggle("dark-mode-buttons");
  });
  document.querySelector("fieldset").classList.toggle("dark-mode-buttons");
  document.querySelectorAll("ul label").forEach((btn) => {
    btn.classList.toggle("dark-mode-buttons");
  });
  document.Array.from(querySelectorAll(".movie-card")).forEach((card) => card.classList.toggle("dark-mode"));
  document.Array.from(querySelectorAll("p")).forEach((p) => p.classList.toggle("dark-mode"));
  // e.target.closest("div").classList.toggle("dark-mode-buttons");
};

const onFilterBtnClicked = (e) => {
  document.querySelector("fieldset").classList.toggle("hidden");
};

function showAllCards() {
  let cards = document.querySelectorAll(".movie-card");
  cards.forEach((card) => card.classList.remove("hidden"));
}

const removeGenres = () => {
  const genreItems = document.querySelectorAll("ul input:checked");
  // console.log(genreItems);
  genreItems.forEach((genreItem) => genreItem.click());
};

const closeGenreBox = () => {
  document.querySelector("fieldset").classList.add("hidden");
};

// 미구현 사항 : 청불 영화/연도별 영화 필터를 넣을 계획
const filterMovies = (filter, value = "", genres = []) => {
  showAllCards(); // 카드리스트 표시 초기화
  resetBtn.innerText = "검색 결과 초기화"; // 검색결과 텍스트 초기화
  if (filter === "title") {
    let cards = Array.from(document.querySelectorAll(".movie-title"));
    filterByTitle(cards, value);
  } else if (filter === "genre") {
    let cards = Array.from(document.querySelectorAll("article"));
    filterByGenre(cards, genres);
  }
};

const filterByTitle = (cards, value) => {
  let cardsToDel = [];
  let cardsToShow = cards.filter((card) => {
    let title = card.innerHTML;
    let valueToLowerCase = value.toLowerCase();
    if (title.toLowerCase().includes(valueToLowerCase)) {
      // card.closest(".movie-card").classList.add("hidden");
      return card;
    } else cardsToDel.push(card);
  });
  let stringifiedFilterResult = cardsToShow.map((card) => {
    return card.closest("article").getAttribute("data-id");
  });

  if (value === "") {
    alert("검색어를 입력해 주십시오.");
    return;
  } else if (String(prevFiltered) === String(stringifiedFilterResult)) {
    getMovie(++page);
    console.log("hey");
  } else {
    prevFiltered = stringifiedFilterResult;
    cardsToDel.forEach((card) => card.closest(".movie-card").classList.toggle("hidden"));
    resetBtn.innerText = `'${value}' 에 대한 ${cardsToShow.length}개의 검색 결과 초기화`;
  }
};

const filterByGenre = (cards, genres) => {
  let cardsToDel = [];
  let cardsToShow = cards.filter((card) => {
    let genresFromMovieCard = card.getAttribute("data-genres").split(",");
    if (genresFromMovieCard.filter((genre) => genres.includes(genre)).length) {
      return card;
    } else cardsToDel.push(card);
    // action, drama => action,
  });
  let stringifiedFilterResult = cardsToShow.map((card) => {
    return card.getAttribute("data-id");
  });

  if (String(prevFiltered) === String(stringifiedFilterResult)) {
    getMovie(++page);
  } else {
    prevFiltered = stringifiedFilterResult;
    cardsToDel.forEach((card) => {
      card.classList.toggle("hidden");
    });
    resetBtn.innerText = `${genres.length}가지 장르에 대한 ${cardsToShow.length}개의 검색 결과 초기화`;
  }
};

submitBtn.addEventListener("click", onSearchClicked);
resetBtn.addEventListener("click", onResetBtnClicked);
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);
moreBtn.addEventListener("click", onMoreBtnClicked);
filterBtn.addEventListener("click", onFilterBtnClicked);

makeMovieCards();
getGenre();
