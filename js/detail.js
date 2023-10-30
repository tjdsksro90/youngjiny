//메인페이지 id/ media
const session = sessionStorage.getItem("data");
const data = JSON.parse(session);
console.log(data);
// api 요청 키
const options = {
  method: "GET",
  headers: {
    accept: "application/json"
  }
};

let docTitle = document.querySelector(".title_wrap > p");
let docImage = document.querySelector(".info_wrap > .img_box > img");
let releaseDateName = document.querySelector(".info_box > ul > li > .list_title1 ");
let docReleaseDate = document.querySelector(".info_box > ul > li > .release_date");

let CountriesName = document.querySelector(".info_box > ul > li > .list_title2 ");
let docCountries = document.querySelector(".info_box > ul > li > .production_countries");

let VoteAverageName = document.querySelector(".info_box > ul > li > .list_title3 ");
let docVoteAverage = document.querySelector(".info_box > ul > li > .vote_average");

let runtimeName = document.querySelector(".info_box > ul > li > .list_title4 ");
let docRuntime = document.querySelector(".info_box > ul > li > .runtime");

let companiesName = document.querySelector(".info_box > ul > li > .list_title5 ");
let docCompanies = document.querySelector(".info_box > ul > li > .production_companies");

let trailer = document.querySelector(".content_wrap > .video_box > iframe");
let overView = document.querySelector(".content_wrap > .content_box > .content_box");

let actor_title = document.querySelector(".actor_wrap > .actor_title");
let actor_list = document.querySelector(".actor_wrap > .actor_list > ul");

// tmdb서버에 data요청
const fetchMovieData = async (id, media) => {
  const result = await fetch(
    `https://api.themoviedb.org/3/${media}/${id}?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return result;
};

// tmdb서버에 비디오 data요청
const fetchvVideoData = async (id, media) => {
  const { results } = await fetch(
    `https://api.themoviedb.org/3/${media}/${id}/videos?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};

// tmdb서버에 출연진 data요청
const fetchCreditData = async (id, media, credits) => {
  const { cast, crew } = await fetch(
    `https://api.themoviedb.org/3/${media}/${id}/credits?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return credits === "배우" ? cast : crew;
};

// 요청받은 데이터를 화면에 뿌려주는 함수
const makeMoviedetail = async () => {
  const movies = await fetchMovieData(data.id, data.media); // detail 요청
  const videos = await fetchvVideoData(data.id, data.media); // video 요청
  const actors = await fetchCreditData(data.id, data.media, "배우"); // 출연배우 요청
  const staffs = await fetchCreditData(data.id, data.media, "스탭"); // 스탭 요청
  const {
    title,
    poster_path,
    release_date,
    production_countries,
    vote_average,
    runtime,
    production_companies,
    overview,
    name,
    first_air_date,
    last_air_date,
    number_of_episodes,
    number_of_seasons,
    networks
  } = movies;

  const videoData = videos.filter((item) => {
    return item.type === "Trailer";
  });
  const { key } = videoData.length === 0 ? 0 : videoData.at(-1);

  // 미디어상세정보
  docTitle.innerHTML = data.media === "movie" ? title : name; // 제목
  docImage.src = `https://image.tmdb.org/t/p/w500/${poster_path}`; // 이미지
  releaseDateName.innerHTML = data.media === "movie" ? "개봉년도" : "방영기간";
  docReleaseDate.innerHTML = data.media === "movie" ? release_date : first_air_date + " ~ " + last_air_date; // 개봉년도
  docCountries.innerHTML = production_countries[0].name; // 국가
  docVoteAverage.innerHTML = vote_average; // 평점
  runtimeName.innerHTML = data.media === "movie" ? "런타임" : "방송횟수";
  docRuntime.innerHTML =
    data.media === "movie"
      ? Math.floor(runtime / 60) + "시간 " + (runtime % 60) + "분"
      : number_of_seasons + " 시즌 " + number_of_episodes + "부작"; // 런타임
  companiesName.innerHTML = data.media === "movie" ? "제작지원" : "방영체널";
  docCompanies.innerHTML = data.media === "movie" ? production_companies[0].name : networks[0].name; // 제작지원/방영체널

  // 트레일러와 줄거리
  trailer.src = key === 0 ? "" : `https://www.youtube.com/embed/${key}`; // 트레일러
  trailer.title = name === 0 ? "" : name; // 트레일러 타이틀
  overView.innerHTML = overview; // 트레일러 타이틀

  // 출연진
  actor_title.innerHTML = data.media === "movie" ? "출연 배우" : "등장인물";
  let result = "";
  for (let i = 0; i < actors.length; i++) {
    let actorList = `<li onclick="actorDetail(${actors[i].id})">
      <div class="img_box">
        <img src="https://image.tmdb.org/t/p/w500/${actors[i].profile_path}" alt="">
      </div>
      <div class="actor_name">${actors[i].name}</div>
    </li>`;
    let actorLi = document.querySelectorAll(".actor_wrap > .actor_list > ul > li");

    result += actorList;
    actor_list.innerHTML = result;
  }
  let actorLi = document.querySelectorAll(".actor_wrap > .actor_list > ul > li");
  for (let i = 0; i < actorLi.length; i++) {
    actorLi[i].style.left = `${i * 20}%`;
  }

  // 배우 리스트 슬라이드 이벤트
  // let actor_box = document.querySelector(".actor_wrap > .actor_list");

  // actor arrow button 이벤트

  console.log(actors);
};

makeMoviedetail();
// 인물페이지로 이동하는 이벤트
let actorDetail = (id) => {
  sessionStorage.setItem("actorId", id);
  // window.location.href = "/personDetail.html";
};

// 인물 리스트 슬라이드 이벤트
let actorListUl = document.querySelector(".actor_wrap > .actor_list > ul");
let actorListLi = actorListUl.children;

let num = 0;
function leftBtnEvn() {
  num++;
  for (let i = 0; i < actorListLi.length; i++) {
    if (getComputedStyle(actorListUl.firstChild).left === "0px") {
      num = 0;
    } else {
      actorListUl.children[i].style.left = `${(i + num) * 20}%`;
    }
  }
}
function rightBtnEvn() {
  if (getComputedStyle(actorListUl.lastChild).right >= "0px") {
    return;
  } else {
    num--;
    for (let i = 0; i < actorListLi.length; i++) {
      actorListUl.children[i].style.left = `${(i + num) * 20}%`;
    }
  }
}
//드레그 슬라이드

actorListUl.addEventListener("mousedown", (e) => {
  let dragStart = e.clientX;

  actorListUl.addEventListener("drag", (e) => {
    let dragMove = e.clientX;
    let drag = 0;
    drag = dragMove;
    // let dragResult = 0;
    dragResult = dragMove - dragStart;
    dragResult;

    if (
      getComputedStyle(actorListUl.firstChild).left < "0px" ||
      getComputedStyle(actorListUl.lastChild).right > "0px"
    ) {
      for (let i = 0; i < actorListLi.length; i++) {
        actorListUl.children[i].style.left = `${(i * 20)}%`;
      }
    } else {
      for (let i = 0; i < actorListLi.length; i++) {
        actorListUl.children[i].style.left = `${dragResult + (i * 20)}%`;
      }
    }
    console.log("드레그시작", dragStart);
    console.log("드레그끝", dragMove);
    console.log("드레그fldkdk", dragResult);
    console.log("드레그", getComputedStyle(actorListUl.firstChild).left);
  });
});
