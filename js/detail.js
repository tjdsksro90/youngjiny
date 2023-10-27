const options = {
  method: "GET",
  headers: {
    accept: "application/json"
  }
};

let docTitle = document.querySelector(".title_wrap > p");
let docImage = document.querySelector(".info_wrap > .img_box > img");
let docReleaseDate = document.querySelector(".info_box > ul > li > .release_date");
let docCountries = document.querySelector(".info_box > ul > li > .production_countries");
let docVoteAverage = document.querySelector(".info_box > ul > li > .vote_average");
let docRuntime = document.querySelector(".info_box > ul > li > .runtime");
let docCompanies = document.querySelector(".info_box > ul > li > .production_companies");

let trailer = document.querySelector(".content_wrap > .video_box > iframe");
let overView = document.querySelector(".content_wrap > .content_box > .content_box");

let actor_list = document.querySelector(".actor_wrap > .actor_list > ul");

// tmdb서버에 data요청
const fetchMovieData = async (cardId) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/movie/${cardId}?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return result;
};

// tmdb서버에 비디오 data요청
const fetchvVideoData = async (cardId) => {
  const { results } = await fetch(
    `https://api.themoviedb.org/3/movie/${cardId}/videos?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};

// tmdb서버에 출연진 data요청
const fetchCreditData = async (cardId, credits) => {
  const { cast, crew } = await fetch(
    `https://api.themoviedb.org/3/movie/${cardId}/credits?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return credits === "배우" ? cast : crew;
};

//메인페이지 카드의 id
let session = sessionStorage.getItem("id");

// 요청받은 데이터를 화면에 뿌려주는 함수
const makeMoviedetail = async () => {
  const movies = await fetchMovieData(session); // detail 요청
  const videos = await fetchvVideoData(session); // video 요청
  const actors = await fetchCreditData(session, "배우"); // 출연배우 요청
  const staffs = await fetchCreditData(session, "스탭"); // 스탭 요청
  const {
    title,
    poster_path,
    release_date,
    production_countries,
    vote_average,
    runtime,
    production_companies,
    overview
  } = movies;

  const videoData = videos.filter((item) => {
    return item.type === "Trailer";
  });
  const { key, name } = videoData.length === 0 ? 0 : videoData.at(-1);

  // 영화상세정보
  docTitle.innerHTML = title; // 제목
  docImage.src = `https://image.tmdb.org/t/p/w500/${poster_path}`; // 이미지
  docReleaseDate.innerHTML = release_date; // 개봉년도
  docCountries.innerHTML = production_countries[0].name; // 국가
  docVoteAverage.innerHTML = vote_average; // 평점
  docRuntime.innerHTML = Math.floor(runtime / 60) + "시간 " + (runtime % 60) + "분"; // 런타임
  docCompanies.innerHTML = production_companies[0].name; // 제작지원

  // 트레일러와 줄거리
  trailer.src = key === 0 ? "" : `https://www.youtube.com/embed/${key}`; // 트레일러
  trailer.title = name === 0 ? "" : name; // 트레일러 타이틀
  overView.innerHTML = overview; // 트레일러 타이틀

  // 출연진
  let result = "";
  for (let i = 0; i < actors.length; i++) {
    let actorList = `<li>
      <img src="https://image.tmdb.org/t/p/w500/${actors[i].profile_path}" alt="">
      <p class="actor_name">${actors[i].name}</p>
    </li>`;
    result += actorList;
    actor_list.innerHTML = result;
  }
};

makeMoviedetail(session);
