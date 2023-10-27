"use strict";
import { handleSearch } from "./search.js";
import { handleFilter } from "./filter.js";

const body = document.querySelector("body");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const submitBtn = document.querySelector(".button-search");
const darkmodeBtn = document.querySelector(".button-darkmode");
// const resetBtn = document.querySelector(".button-reset");
// const filterBtn = document.querySelector(".button-filter");
// const moreBtn = document.querySelector(".button-more-item");
const nowPlayBtn = document.querySelector(".button-now-play");

let totalPages;

// TMDB API에서 Top Rated Movies 데이터 받아오기
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s"
  }
};

const fetchMovieData = async (page, media, group) => {
  const data = await fetch(
    `https://api.themoviedb.org/3/${media}/${group}?language=ko-US&page=${page}&region=KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return data;
};

const fetchGenreData = async (media = "movie") => {
  const data = await fetch(`https://api.themoviedb.org/3/genre/${media}/list?language=ko`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return data.genres;
};

const fetchDetailData = async (id, media) => {
  const data = await fetch(`https://api.themoviedb.org/3/${media}/${id}?language=ko-US`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return data.genres;
};

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수
const makeCards = async (pageNum = 1, media = "movie", group = "top_rated") => {
  const data = await fetchMovieData(pageNum, media, group);
  let genres = await fetchGenreData(media);
  const { results, page } = data; // results === 영화 리스트, page === 페이지
  const cardList =
    media === "movie" ? document.querySelector(".card-list-movie") : document.querySelector(".card-list-tv");
  cardList.setAttribute("data-page", page);
  cardList.innerHTML += results
    .map((item, idx) => {
      // 영화 객체의 제목, 이미지경로, 내용, 평점 property를 구조 분해 및 할당을 이용해 저장한다
      const { title, name, poster_path, overview, vote_average, id, genre_ids, release_date, first_air_date } = item;
      genres = genres.filter((genre) => {
        return genre_ids.includes(genre.id);
      });
      const genreNames = genres.map((genre, idx) => genre.name);
      return media === "movie"
        ? `<li data-id=${id} data-genres="${genre_ids}" class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}"/>
        <h3 class="movie-title">${title}</h3>
        <div class="movie-card-content">
          <dl>
            <div>
              <dt>개봉</dt>
              <dd>${release_date}</dd>
            </div>
            <div>
              <dt>장르</dt>
              <dd>${genreNames.join(", ")}</dd>
            </div>
            <div>
              <dt>평점</dt>
              <dd class="movie-rating">${Number(vote_average).toFixed(1)}</dd>
            </div>
          </dl>
          <p class="overview">${overview}</p>
        </div>
      </li>`
        : `<li data-id=${id} data-genres="${genre_ids}" class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${name}"/>
      <h3 class="movie-title">${name}</h3>
      <div class="movie-card-content">
        <dl>
            <div>
              <dt>최초방영</dt>
              <dd>${first_air_date}</dd>
            </div>
            <div>
              <dt>장르</dt>
              <dd>${genreNames.join(", ")}</dd>
            </div>
            <div>
              <dt>평점</dt>
              <dd class="movie-rating">${Number(vote_average).toFixed(1)}</dd>
            </div>
          </dl>
          <p class="overview">${overview}</p>

      </div>
    </li>`;
    })
    .join("");
  for (const child of cardList.children) {
    child.addEventListener("click", onCardClicked);
  }
  // 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
  function onCardClicked(e) {
    const id = e.currentTarget.getAttribute("data-id");
    const data = {
      id: id,
      media: media
    };
    location.href = "detail.html";
    sessionStorage.setItem("data", JSON.stringify(data));
  }
  // 마지막 페이지까지 로드되면 더보기 버튼 비활성화
  if (page === totalPages) moreBtn.classList.toggle("invisible");

  // filter가 적용중이라면 페이지를 그린 직후 필터링을 한다
  // filterMovies(filter, value, genres);
};

// 장르를 list element로 만들어 필터리스트에 넣는 함수
// const makeGenre = (genres) => {
//   const genreContainer = document.querySelector(".genre-container");
//   genreContainer.innerHTML = genres
//     .map((genre) => {
//       return `
//     <li class="genre-item">
//       <input id="${genre.name}" class="checkbox" type="checkbox" data-genre="${genre.id}" value="${genre.name}"/>
//       <label for="${genre.name}" class="label-checkbox">${genre.name}</label>
//     </li>
//     `;
//     })
//     .join("");

//   genreContainer.addEventListener("click", onGenreItemClicked);

//   function onGenreItemClicked(e) {
//     if (e.target === genreContainer) return;
//     if (e.target.matches(".checkbox")) {
//       e.target.classList.toggle("checked");
//     }
//     const itemsChecked = document.querySelectorAll(".checked");
//     let genresToFilter = [];

//     console.log(itemsChecked);
//     itemsChecked.forEach((item) => genresToFilter.push(item.getAttribute("data-genre")));
//     for (const genre of genres) {
//     }
//     // console.log(genres);
//     genres.length ? handleFilter(genres) : showAllCards();
//   }
// };

// 더 보기 버튼을 누르면 다음 top rated 영화 페이지를 로드한다

function showAllCards() {
  let cards = document.querySelectorAll(".movie-card");
  cards.forEach((card) => card.classList.remove("hidden"));
}

function onDarkmodeBtnClicked(e) {
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
}

// function onResetBtnClicked(e) {
//   const resetBtn = document.querySelector(".button-reset");
//   const genreChecked = document.querySelectorAll(".checked");
//   const filterBtn = document.querySelector(".button-filter");
//   console.log(e.target);
//   genreChecked.forEach((genreItem) => genreItem.click());
//   document.querySelector("fieldset").classList.add("hidden");
//   resetBtn.innerHTML = "검색 결과 초기화";
//   showAllCards();
// }

// resetBtn.addEventListener("click", onResetBtnClicked);
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);
// moreBtn.addEventListener("click", (e) => {
//   let curPage = document.querySelector(".card-list").getAttribute("data-page");
//   makeCards(++curPage);
// });
// filterBtn.addEventListener("click", (e) => {
// document.querySelector("fieldset").classList.toggle("hidden");
// });

nowPlayBtn.addEventListener("click", function () {
  location.href = "nowplay.html";
});

window.addEventListener("load", function () {
  // submitBtn.addEventListener("click", onSearchClicked);
  makeCards(1, "movie", "popular");
  makeCards(1, "tv", "popular");
  fetchGenreData();

  const searchInput = document.querySelector("#search-input");
  const form = document.querySelector("#nav-search");
  form.addEventListener("submit", handleSearch);
});
