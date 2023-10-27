const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU5N2QyZGE0NzI1NTcyODJmNjA4NGE4MDIzYTRiZSIsInN1YiI6IjY1MzRkN2I3NDJkODM3MDEyYzc2YjM5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nlgw0kibOhrWpDdAK7wDBxrSGBN1-oywRoHgcq-t5_c"
  }
};

//language : ko-KR (한국어) , region : KR (남한) : //URL을 바꿔가면서 수정해하나?
// const fetchNowPlayMovieData = async (page) => {
//   const { results } = await fetch(
//     `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&&page=${page}&region=KR`,
//     options
//   )
//     .then((response) => response.json())
//     .then((response) => {
//       totalPages = response.total_pages;
//       console.log("jhee2:", response);
//       return response;
//     })
//     .catch((err) => console.error(err));

//   return results;
// };

// TMDB에는 실제 상영 여부 판단 안되고 최근 개봉일 (약 2주전) 구간으로 판단함
// jhee TODO : 날짜 구간 전달 해야함... ㄷㄷ
const fetchNowPlayTEST = async (page, sort) => {
  const { results } = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&&region=KR&page=${page}&sort_by=${sort}&with_release_type=2|3&release_date.gte=2023-09-14&release_date.lte=2023-11-01
    `,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log("객체:", response);
      totalPages = response.total_pages;
      return response;
    })
    .catch((err) => console.error(err));

  // 마지막 페이지까지 로드되면 더보기 버튼 비활성화

  return results;
};

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수 : //재사용 가능여부 확인 필요
const makeNodwMovieCards = async (page, sort) => {
  //const movies = await fetchNowPlayMovieData(page);
  const movies = await fetchNowPlayTEST(page, sort);
  console.log("jhee :", movies);
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
              <p class="movie-rating">${vote_average} / <span>10</span>
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
};

const getTimeString = (today) => {
  //let date = today.toLocaleDateString();
  let date = today.toLocaleDateString().replaceAll(".", "").replaceAll(" ", "-");
  console.log("jhee", date);
  return date;
};

// 시작!
const moreBtn = document.querySelector(".button-more-item"); // 더보기 버튼
const serchBar = document.querySelector("#nav-search"); // 서치바 가림
const sortedBy = document.querySelector("#sorted-by"); //select
let today = new Date();
let page = 1; //page를 node 속성으로 넣는 것도 고려해보자.
let sortedByThis = "popularity.desc"; //얘도.
let totalPages = 0;

getTimeString(today);
makeNodwMovieCards(page, sortedByThis);

// 더 보기 버튼을 누르면 다음 페이지를 로드하고 마지막 페이지이면 더보기 버튼을 가린다
const onMoreBtnClicked = (e) => {
  console.log("page :", ++page, "sorted by : ", sortedByThis);
  makeNodwMovieCards(page, sortedByThis);
  if (page === totalPages) moreBtn.classList.add("invisible");
};
moreBtn.addEventListener("click", onMoreBtnClicked);

//서치바 가림
serchBar.style.display = "none";

//소트 리스너: 변경되면 value 가져오기
sortedBy.addEventListener("change", (e) => {
  console.log("jhee1:", e.target.value, "current:", e.currentTarget, "value? ", e.currentTarget.value);
  // 페이지 초기화 및 더보기 생성 되는걸까?
  page = 1;
  moreBtn.classList.remove("invisible");
  sortedByThis = e.target.value;
  makeNodwMovieCards(page, sortedByThis);
});

const selectQuery = (form) => {
  return form;
};

// 스크롤 바닥 확인하면 로드 하고 싶다
// window.scroll(function () {
//   if (window.scrollTop() + window.height() == document.height()) {
//     alert("bottom!");
//   }
// });
