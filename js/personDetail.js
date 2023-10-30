// 세션스토리지에서 인물의 id 받아오기
let actorId = sessionStorage.getItem("actorId")
console.log(actorId)
const options = {
  method: "GET",
  headers: {
    accept: "application/json"
  }
};
// `https://api.themoviedb.org/3/person/20738/movie_credits?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=en-US`,
// `https://api.themoviedb.org/3/person/20738/tv_credits??api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=en-US`
// `https://api.themoviedb.org/3/person/20738/combined_credits?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=en-US`,

// 인물의 출연영화/tv방송 정보
// api_key=d5555e1f74ed1afd14d3f203581c2ed3
// 20738
// 5a4db31fc3a3683b82003a00

let doc_title_wrap = document.querySelector(".person_info_wrap > .title_wrap > p");
let doc_info_img = document.querySelector(".person_info_wrap > .info_wrap > .img_box > img");
let doc_birthday = document.querySelector(".person_info_wrap > .info_wrap > .info_box > ul li > .birthday");
let doc_place_of_birth = document.querySelector(".person_info_wrap > .info_wrap > .info_box > ul li > .place_of_birth");
let doc_gender = document.querySelector(".person_info_wrap > .info_wrap > .info_box > ul li > .gender");
let doc_biography = document.querySelector(".person_info_wrap > .info_wrap > .info_box > ul li > .biography");
let doc_homepage = document.querySelector(".person_info_wrap > .info_wrap > .info_box > ul li > .homepage");

let appearance_title = document.querySelectorAll(".appearance_title_box > div");

// tmdb서버에 인물 data요청
const fetchActorData = async (actorId) => {
  const results = await fetch(
    `https://api.themoviedb.org/3/person/${actorId}?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=en-US`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};

// tmdb서버에 인물의 영화출연작품 data요청
const fetchMoiveData = async (actorId) => {
  const results = await fetch(
    `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};

// tmdb서버에 인물의 tv출연작품 data요청
const fetchTvData = async (actorId) => {
  const results = await fetch(
    `https://api.themoviedb.org/3/person/${actorId}/tv_credits?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};

let result = "";
const makePersonDetail = async () => {
  const actors = await fetchActorData(actorId); // 인물데이터 요청
  const movies = await fetchMoiveData(actorId); // 인물데이터 요청
  const tvSeries = await fetchTvData(actorId); // 인물데이터 요청
  const {
    name, // 이름
    birthday, // 출생년도
    place_of_birth, // 출생지역
    gender, // 성별
    biography, // 인물소개
    homepage, // 사이트
    profile_path // 인물 이미지
  } = actors;

  // 인물 상세정보
  doc_title_wrap.innerHTML = name; // 이름
  doc_info_img.src = `https://image.tmdb.org/t/p/w500/${profile_path}`; // 인물 이미지
  doc_birthday.innerHTML = birthday; // 출생년도
  doc_place_of_birth.innerHTML = place_of_birth; // 출생지역
  doc_gender.innerHTML = gender === 1 ? "여성" : gender === 2 ? "남성" : "알수없음" ; // 성별
  doc_biography.innerHTML = biography; // 인물소개
  doc_homepage.innerHTML = homepage; //사이트

  console.log(movies);
  // 출연작품
  let appBool1 = appearance_title[0].classList.contains("active");
  let appBool2 = appearance_title[1].classList.contains("active");
  let castFor = appBool1 === true ? movies.cast : tvSeries.cast;

  // 최신순으로 초기 정렬
  // 엉화
  movies.cast.sort((a, b) => {
    if (a.release_date > b.release_date) {
      return -1;
    } else if (a.release_date < b.release_date) {
      return 1;
    } else {
      return 0;
    }
  });
  // tv시리즈
  tvSeries.cast.sort((a, b) => {
    if (a.first_air_date > b.first_air_date) {
      return -1;
    } else if (a.first_air_date < b.first_air_date) {
      return 1;
    } else {
      return 0;
    }
  });
  // 출연작품 리스트
  
  for (let i = 0; i < castFor.length; i++) {
    let madiaId = appBool1 === true ? movies.cast[i].id : tvSeries.cast[i].id
    let madiaFind = appBool1 === true ? 'movie' : 'tv';
    let appList = `<li onclick="movieDetail(${madiaId},'${madiaFind}')">
        <div class="app_img_box">
          <img src="https://image.tmdb.org/t/p/w500/${
            appBool1 === true ? movies.cast[i].poster_path : tvSeries.cast[i].poster_path
          }" alt="">
        </div>
        <div class="app_infor_box">
          <div class="title"><p>제목</p><p> : </p><p>${
            appBool1 === true ? movies.cast[i].title : tvSeries.cast[i].name
          }</p><p>${appBool1 === true ? movies.cast[i].character : tvSeries.cast[i].character}</p></div>
          <div class="release_date"><p>${appBool1 === true ? "개봉날짜" : "방영일"}</p><p> : </p><p>${
      appBool1 === true ? movies.cast[i].release_date : tvSeries.cast[i].first_air_date
    }</p></div>
          <div class="vote_average"><p>${appBool1 === true ? "평점" : "방송횟수"}</p><p> : </p><p>${
      appBool1 === true ? movies.cast[i].vote_average : tvSeries.cast[i].episode_count + " 부작"
    }</p></div>
          <div class="overview"><p>줄거리</p><p> : </p><p onclick="appListFunc(${i})">"${
      appBool1 === true ? movies.cast[i].overview : tvSeries.cast[i].overview
    }</p></div>
        </div>
      </li>`;
    result += appList;
    appearance_list.innerHTML = result;
  }
};

makePersonDetail();

// 출여작품 탭매뉴 버튼
appearance_title[0].addEventListener("click", () => {
  appearance_title[0].classList.add("active");
  appearance_title[1].classList.remove("active");

  result = "";
  makePersonDetail();
});

appearance_title[1].addEventListener("click", () => {
  appearance_title[1].classList.add("active");
  appearance_title[0].classList.remove("active");
  result = "";
  makePersonDetail();
});

// 출연작품 리스트의 줄거리 자세히 보기
let appearance_list = document.querySelector(".appearance_list_box > ul");

function appListFunc(num) {
  let overview = appearance_list.children[num].children[1].children[3];
  overview.classList.toggle("active");
}

// 영화상세보기로 넘어가는 이벤트
let movieDetail = (id,media) => {
  const data = {
    id: id,
    media: media
  };
  
  sessionStorage.setItem('data',JSON.stringify(data));
  window.location.href = "/detail.html";
}
