import { onDarkmodeBtnClicked } from "./utils.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU5N2QyZGE0NzI1NTcyODJmNjA4NGE4MDIzYTRiZSIsInN1YiI6IjY1MzRkN2I3NDJkODM3MDEyYzc2YjM5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nlgw0kibOhrWpDdAK7wDBxrSGBN1-oywRoHgcq-t5_c"
  }
};

// yyyy-mm-dd 로 만들어주기
const getTodayDateString = (day) => {
  let year = day.getFullYear(); // 2003
  let month = day.getMonth() + 1; // 0 ~ 11
  let date = day.getDate(); //1 ~ 31

  if (month < 10) {
    month = "0" + String(month);
  }
  if (date < 10) {
    date = "0" + String(date);
  }

  let dateString = year + "-" + month + "-" + date;
  return dateString;
};

// nowPlay api 와 유사하게 이전 날짜랑 오늘 날짜 가져와 배열에 저장
const get2WeeksAgo = () => {
  let today = new Date();
  let weeksAgo = new Date(new Date().setDate(today.getDate() - 39));
  let tomorrow = new Date(new Date().setDate(today.getDate() + 3));

  return [getTodayDateString(weeksAgo), getTodayDateString(tomorrow)];
};

// nowplay api를 풀어헤친 discover api를 사용함
// TMDB에는 실제 상영 여부는 판단 안되고 최근 개봉일 (약 한달전) 구간으로 판단함
// 국내 상영만 보여주기 language : ko-KR (한국어) , region : KR (남한)
const fetchNowPlaying = async (page, sort) => {
  let arrayDays = get2WeeksAgo();
  let dates = `&release_date.gte=${arrayDays[0]}&release_date.lte=${arrayDays[1]}`;
  console.log(dates);
  const { results } = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&&region=KR&page=${page}&sort_by=${sort}&with_release_type=2|3${dates}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      totalPages = response.total_pages;
      return response;
    })
    .catch((err) => console.error(err));

  return results;
};

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수
const makeNowMovieCards = async (page, sort) => {
  const movies = await fetchNowPlaying(page, sort);
  const cardList = document.querySelector(".card-list");
  let tempHTML = movies
    .map((movie) => {
      // 영화 객체의 제목, 이미지경로, 내용, 평점 property를 구조 분해 및 할당을 이용해 저장한다
      const { title, poster_path, overview, vote_average, id, genre_ids, release_date, popularity } = movie;
      return `<article data-id=${id} data-genres="${genre_ids}" class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}"/>
            <div class="movie-card-content">
              <h3 class="movie-title">${title}</h3>
              <!-- <p class="movie-overview">${overview}</p> -->
              <p class="movie-overview">인기점수 : ${popularity} </p>
              <p class="movie-release">개봉일 : ${release_date} </p>
              <p class="movie-rating"> <span>${vote_average.toFixed(1)}</span> / 10
              </p>
            </div>
          </article>`;
    })
    .join("");
  //page 가 1이면 초기화 후 붙혀줌
  if (page === 1) {
    cardList.innerHTML = ``;
  }
  cardList.innerHTML = cardList.innerHTML.concat(tempHTML);

  // 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
  for (const child of cardList.children) {
    child.addEventListener("click", onCardClicked);
  }
  function onCardClicked(e) {
    console.log("jhee", e.currentTarget, " target: ", e.target);
    const id = e.currentTarget.getAttribute("data-id");
    const data = {
      id: id,
      media: "movie"
    };
    location.href = "detail.html";
    sessionStorage.setItem("data", JSON.stringify(data));
  }
};

// 시작!
const moreBtn = document.querySelector(".button-more-item"); // 더보기 버튼
const sortedBy = document.querySelector("#sorted-by"); //select
const darkmodeBtn = document.querySelector(".button-darkmode");
let page = 1; // page를 전역 변수로 가져가야겠니? node 에 넣기?
let totalPages = 0; // 얘는.. fetch 할때 넣어준다.

makeNowMovieCards(page, sortedBy.value);

// 더 보기 버튼을 누르면 다음 페이지를 로드하고 마지막 페이지이면 더보기 버튼을 가린다
const onMoreBtnClicked = () => {
  makeNowMovieCards(++page, sortedBy.value);
  if (page === totalPages) moreBtn.classList.add("invisible");
};
moreBtn.addEventListener("click", onMoreBtnClicked);

//소트 리스너: 변경되면 value 가져오기 /  페이지 초기화 및 더보기 생성
sortedBy.addEventListener("change", (e) => {
  page = 1;
  moreBtn.classList.remove("invisible");
  makeNowMovieCards(page, e.target.value);
});

darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);

const selectQuery = (form) => {
  return form;
};
